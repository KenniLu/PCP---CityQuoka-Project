terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      configuration_aliases = [aws.us-east-1]
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.7.0" # Use appropriate version
    }
  }
}

locals {
  merged_environment_variables = merge(
    try(var.environment_variables,{}), 
    try(var.secret_environment_variables,{})
  )  
}

# ECR Repository
resource "aws_ecr_repository" "app" {
  name                 = "${var.app_name}-${var.environment}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_lifecycle_policy" "app" {
  repository = aws_ecr_repository.app.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last ${var.environment == "production" ? 5 : 5} images"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = var.environment == "production" ? 5 : 5
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# IAM Role for App Runner
resource "aws_iam_role" "apprunner_service_role" {
  name = "${var.app_name}-${var.environment}-apprunner-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "build.apprunner.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "apprunner_service_role_policy" {
  role       = aws_iam_role.apprunner_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

resource "aws_apprunner_service" "cq_cms_app" {
  service_name = "${var.app_name}-${var.environment}"

  source_configuration {
    # authentication_configuration {
    #   connection_arn = var.github_connection_arn
    # }
    
    # code_repository {
    #   code_configuration {
    #     configuration_source = "API"
    #     code_configuration_values {
    #       # build_command = "npm install -g pnpm && pnpm install && pnpm run build"
    #       # build_command = "NEXT_TELEMETRY_DISABLED=1 npm install -g pnpm && pnpm install && pnpm run payload migrate && pnpm run build"
    #       # build_command = "NEXT_TELEMETRY_DISABLED=1 npm install -g pnpm && export PATH=/usr/local/bin:$PATH && echo $PATH && which pnpm && pnpm install && pnpm run build"
    #       build_command = "NEXT_TELEMETRY_DISABLED=1 npm install -g pnpm && NPM_PREFIX=$(npm config get prefix) && export PATH=$NPM_PREFIX/bin:$PATH && echo $PATH && which pnpm && pnpm install && pnpm run build"
    #       port          = "3000"
    #       runtime       = "NODEJS_18"
    #       start_command = "pnpm run start"
    #       runtime_environment_variables = local.merged_environment_variables
    #     }
    #   }
    #   repository_url = var.github_repository
    #   source_code_version {
    #     type  = "BRANCH"
    #     value = var.github_branch
    #   }
    # }
    # auto_deployments_enabled = true

    authentication_configuration {
      access_role_arn = aws_iam_role.apprunner_service_role.arn
    }

    image_repository {
      image_configuration {
        port = "3000"
        runtime_environment_variables = local.merged_environment_variables
      }
      image_identifier      = "${aws_ecr_repository.app.repository_url}:latest"
      image_repository_type = "ECR"
    }

    auto_deployments_enabled = var.environment != "production"
  }

  health_check_configuration {
    path = "/api/healthcheck"
  }

  instance_configuration {
    cpu    = var.instance_size.cpu
    memory = var.instance_size.memory
  }

  # dynamic "tags" {
  #   for_each = {
  #     Environment = var.environment
  #     ManagedBy  = "terraform"
  #   }
  #   content {
  #     key   = tags.key
  #     value = tags.value
  #   }
  # }
}

# CodeBuild Role and Policy
resource "aws_iam_role" "codebuild" {
  name = "${var.app_name}-${var.environment}-codebuild-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "codebuild.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "codebuild" {
  role = aws_iam_role.codebuild.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:GetObjectVersion",
          "s3:GetBucketVersioning",
          "s3:PutObject"
        ]
        Resource = [
          aws_s3_bucket.pipeline_artifacts.arn,
          "${aws_s3_bucket.pipeline_artifacts.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Resource = ["*"]
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:PutImage"
        ]
        Resource = "*"
      }
    ]
  })
}

# CodeBuild Project
resource "aws_codebuild_project" "app" {
  name          = "${var.app_name}-${var.environment}-build"
  description   = "Build project for ${var.app_name} ${var.environment}"
  build_timeout = "15"
  service_role  = aws_iam_role.codebuild.arn

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                      = "aws/codebuild/amazonlinux2-x86_64-standard:4.0"
    type                       = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
    privileged_mode            = true

    environment_variable {
      name  = "ECR_REPOSITORY_URI"
      value = aws_ecr_repository.app.repository_url
    }

    # Dynamic block to add variables from local.merged_environment_variables
    dynamic "environment_variable" {
      for_each = local.merged_environment_variables
      content {
        name  = environment_variable.key
        value = environment_variable.value
      }
    }

  }

  source {
    type = "CODEPIPELINE"
    buildspec = <<-EOF
      version: 0.2
      phases:
        pre_build:
          commands:
            - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $ECR_REPOSITORY_URI
            - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
            # Create .env file dynamically from environment variables
            - |
              echo "Creating .env file..."
              %{for key, value in local.merged_environment_variables}
              echo "${key}=${value}" >> .env
              %{endfor}
        build:
          commands:
            - DOCKER_BUILDKIT=1 docker build --secret id=env,src=.env -t $ECR_REPOSITORY_URI:$COMMIT_HASH .
            - docker tag $ECR_REPOSITORY_URI:$COMMIT_HASH $ECR_REPOSITORY_URI:latest
        post_build:
          commands:
            - docker push $ECR_REPOSITORY_URI:$COMMIT_HASH
            - docker push $ECR_REPOSITORY_URI:latest
      artifacts:
        files: []
    EOF
  }
}

# CodePipeline Role and Policy
resource "aws_iam_role" "codepipeline" {
  name = "${var.app_name}-${var.environment}-pipeline-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "codepipeline.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "codepipeline" {
  name = "${var.app_name}-${var.environment}-pipeline-policy"
  role = aws_iam_role.codepipeline.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:GetObjectVersion",
          "s3:GetBucketVersioning",
          "s3:PutObject"
        ]
        Resource = [
          aws_s3_bucket.pipeline_artifacts.arn,
          "${aws_s3_bucket.pipeline_artifacts.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "codestar-connections:UseConnection"
        ]
        Resource = aws_codestarconnections_connection.github.arn
      },
      {
        Effect = "Allow"
        Action = [
          "codebuild:BatchGetBuilds",
          "codebuild:StartBuild"
        ]
        Resource = "*"
      }
    ]
  })
}

# GitHub Connection
resource "aws_codestarconnections_connection" "github" {
  name          = "${var.app_name}-${var.environment}-github"
  provider_type = "GitHub"
}

# S3 Bucket for CodePipeline artifacts
resource "aws_s3_bucket" "pipeline_artifacts" {
  bucket = "${var.app_name}-${var.environment}-pipeline-artifacts"
}

# # Enable versioning
# resource "aws_s3_bucket_versioning" "pipeline_artifacts" {
#   bucket = aws_s3_bucket.pipeline_artifacts.id
#   versioning_configuration {
#     status = "Enabled"
#   }
# }

# Block public access
resource "aws_s3_bucket_public_access_block" "pipeline_artifacts" {
  bucket = aws_s3_bucket.pipeline_artifacts.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}


# CodePipeline
resource "aws_codepipeline" "app" {
  name     = "${var.app_name}-${var.environment}-pipeline"
  role_arn = aws_iam_role.codepipeline.arn

  artifact_store {
    location = aws_s3_bucket.pipeline_artifacts.bucket
    type     = "S3"
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["source_output"]

      configuration = {
        ConnectionArn    = aws_codestarconnections_connection.github.arn
        FullRepositoryId = var.github_repository_id
        BranchName      = var.github_branch
      }
    }
  }

  stage {
    name = "Build"

    action {
      name            = "Build"
      category        = "Build"
      owner           = "AWS"
      provider        = "CodeBuild"
      input_artifacts = ["source_output"]
      version         = "1"

      configuration = {
        ProjectName = aws_codebuild_project.app.name
      }
    }
  }

  dynamic "stage" {
    for_each = var.environment == "production" ? [1] : []
    content {
      name = "Approve"

      action {
        name     = "Approval"
        category = "Approval"
        owner    = "AWS"
        provider = "Manual"
        version  = "1"
      }
    }
  }
}

resource "aws_acm_certificate" "cert" {
  provider          = aws.us-east-1  # CloudFront requires certificates in us-east-1
  domain_name       = var.domain_name
  validation_method = "DNS"
}

resource "aws_s3_bucket" "cloudfront_logs" {
  bucket = "staging-cdn-logging-bucket"
}

resource "aws_s3_bucket_ownership_controls" "cloudfront_logs" {
  bucket = aws_s3_bucket.cloudfront_logs.id
  rule {
    object_ownership = "ObjectWriter"
  }
}

resource "aws_s3_bucket_acl" "cloudfront_logs" {
  depends_on = [aws_s3_bucket_ownership_controls.cloudfront_logs]
  bucket = aws_s3_bucket.cloudfront_logs.id
  acl    = "private"
}

resource "aws_s3_bucket_policy" "cloudfront_logs" {
  bucket = aws_s3_bucket.cloudfront_logs.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontLogDelivery"
        Effect = "Allow"
        Principal = {
          Service = "delivery.logs.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.cloudfront_logs.arn}/*"
      }
    ]
  })
}

resource "aws_s3_bucket_lifecycle_configuration" "bucket_lifecycle_policy" {
  bucket = aws_s3_bucket.cloudfront_logs.id

  rule {
    id     = "delete-after-1-day"
    status = "Enabled"

    expiration {
      days = 1
    }
  }
}

# resource "aws_cloudfront_origin_request_policy" "allow_all_origin_request_policy" {
#   name    = "AllowAllOriginRequestPolicy"
#   comment = "Policy to forward all headers, cookies and query strings to AppRunner"

#   cookies_config {
#     cookie_behavior = "all"
#   }

#   headers_config {
#     header_behavior = "allViewerAndWhitelistCloudFront"  # Forward all viewer headers
#     headers {
#       items = [
#         "user-agent",
#         "referer"
#       ]
#     }
#   }

#   query_strings_config {
#     query_string_behavior = "all"
#   }
# }

# Create a custom response headers policy that includes cookies
resource "aws_cloudfront_response_headers_policy" "cookies_cors_policy" {
  name    = "${var.app_name}-${var.environment}-CookiesCORSPolicy"
  comment = "Policy for CORS with cookies passthrough"

  cors_config {
    access_control_allow_credentials = false
    access_control_allow_headers {
      items = ["*"]
    }
    access_control_allow_methods {
      items = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    }
    access_control_allow_origins {
      items = ["*"]  # Or specify your domains for better security
    }
    origin_override = true
  }

  # This ensures cookies are passed through
  security_headers_config {
    # Optional security headers
    content_type_options {
      override = true
    }
    frame_options {
      frame_option = "SAMEORIGIN"
      override     = true
    }
    referrer_policy {
      referrer_policy = "same-origin"
      override        = true
    }
    xss_protection {
      mode_block = true
      protection = true
      override   = true
    }
  }
}

resource "aws_iam_role" "lambda_edge_role" {
  # name = "lambda-edge-header-role"
  name = "${var.app_name}-${var.environment}-lambda-edge-header-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = [
            "lambda.amazonaws.com",
            "edgelambda.amazonaws.com"
          ]
        }
      }
    ]
  })
}

# Make sure we have these permissions attached
resource "aws_iam_role_policy_attachment" "lambda_edge_basic" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_edge_role.name
}

# Add CloudFront-specific permissions
resource "aws_iam_role_policy" "lambda_edge_cloudfront" {
  name = "lambda-edge-cloudfront-policy"
  role = aws_iam_role.lambda_edge_role.name
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Effect = "Allow",
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# Lambda@Edge function
# resource "aws_lambda_function" "header_modifier" {
#   filename         = "header-modifier-lambda/lambda.zip"  # You'll need to create this
#   function_name    = "${var.app_name}-${var.environment}-cloudfront-header-modifier"
#   role            = aws_iam_role.lambda_edge_role.arn
#   handler         = "index.handler"
#   runtime         = "nodejs18.x"
#   memory_size      = 128  # Minimum allocation (already quite low)
#   timeout          = 5
#   publish         = true  # Required for Lambda@Edge
#   provider = aws.us-east-1  # Lambda@Edge must be in us-east-1
#   source_code_hash = data.archive_file.lambda_zip.output_base64sha256
# }

data "archive_file" "lambda_archive_zip" {
  type        = "zip"
  source_file = "header_modifier_lambda/index.js"
  output_file_mode = "0444"
  output_path = "header_modifier_lambda.zip"
}

resource "aws_lambda_function" "header_modifier" {
  # filename         = "header-modifier-lambda/lambda.zip"  # You'll need to create this
  filename = data.archive_file.lambda_archive_zip.output_path
  function_name    = "${var.app_name}-${var.environment}-cloudfront-header-modifier"
  role            = aws_iam_role.lambda_edge_role.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  memory_size      = 128  # Minimum allocation (already quite low)
  timeout          = 5
  publish         = true  # Required for Lambda@Edge
  provider = aws.us-east-1  # Lambda@Edge must be in us-east-1
  source_code_hash = data.archive_file.lambda_archive_zip.output_base64sha256
}

resource "aws_cloudfront_distribution" "app" {
  enabled             = true
  is_ipv6_enabled    = true
  default_root_object = ""
  aliases            = [var.domain_name]

  origin {
    domain_name = aws_apprunner_service.cq_cms_app.service_url
    origin_id   = "apprunner"
    
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # Disable caching for admin paths.
  # ordered_cache_behavior {
  #   path_pattern           = "/admin/*"
  #   allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
  #   cached_methods         = ["GET", "HEAD", "OPTIONS"]
  #   target_origin_id       = "apprunner"
  #   viewer_protocol_policy = "redirect-to-https"

  #   lambda_function_association {
  #     event_type   = "origin-request"
  #     lambda_arn   = aws_lambda_function.header_modifier.qualified_arn
  #     include_body = false
  #   }

  #   # Also add for viewer-request if needed
  #   # lambda_function_association {
  #   #   event_type   = "viewer-request"
  #   #   lambda_arn   = aws_lambda_function.header_modifier.qualified_arn
  #   #   include_body = false
  #   # }

  #   # Use CachingDisabled policy for admin routes
  #   cache_policy_id = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"  # Managed-CachingDisabled

  #   # Use AllViewer policy to forward all headers, cookies, and query strings
  #   origin_request_policy_id = "216adef6-5c7f-47e4-b989-5492eafa07d3"  # Managed-AllViewer
  #   # origin_request_policy_id = aws_cloudfront_origin_request_policy.allow_all_origin_request_policy.id

  #   # Use Managed-CORS-With-Preflight Response Policy
  #   # response_headers_policy_id = "5cc3b908-e619-4b99-88e5-2cf7f45965bd"  # Managed-CORS-With-Preflight
  #   # response_headers_policy_id = aws_cloudfront_response_headers_policy.cookies_cors_policy.id

  #   # response_headers_policy_id =  aws_cloudfront_origin_request_policy.allow_all_origin_request_policy.id
  # }

  # default_cache_behavior {
  #   allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
  #   cached_methods         = ["GET", "HEAD", "OPTIONS"]
  #   target_origin_id       = "apprunner"
  #   viewer_protocol_policy = "redirect-to-https"
    
  #   # Managed-UserAgentRefererHeaders
  #   origin_request_policy_id = "acba4595-bd28-49b8-b9fe-13317c0390fa"

  #   # Managed-CachingOptimized
  #   cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  #   # forwarded_values {
  #   #   query_string = true
  #   #   headers      = ["*"]
  #   #   cookies {
  #   #     forward = "all"
  #   #   }
  #   # }

  #   min_ttl     = 0
  #   default_ttl = 3600
  #   max_ttl     = 86400
  # }


  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id       = "apprunner"
    
    forwarded_values {
      query_string = true
      cookies {
        forward = "all"  # Forward all cookies to origin
      }
      headers = ["*"]
    }

    lambda_function_association {
      event_type   = "origin-request"
      lambda_arn   = aws_lambda_function.header_modifier.qualified_arn
      include_body = false
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0  # Don't cache by default
    max_ttl                = 0
  }

  # Specific cache behavior for static assets
  ordered_cache_behavior {
    path_pattern     = "/static/*"  # Cache static assets
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "apprunner"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"  # Don't forward cookies for static assets
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400  # 24 hours
    max_ttl                = 31536000  # 1 year
    compress               = true
  }
  
    # Special behavior for Next.js image optimization routes
  ordered_cache_behavior {
    path_pattern     = "/_next/image*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "apprunner"

    forwarded_values {
      query_string = true # Important! The image URL, width, and quality are in query params
      headers      = ["Origin"] # If you need CORS support
      cookies {
        forward = "none" # Image optimization doesn't need cookies
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 604800    # 7 days
    max_ttl                = 31536000 # 1 year
    compress               = true
  }


  # Cache behavior for images
  ordered_cache_behavior {
    path_pattern     = "/images/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "apprunner"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
  }

  # custom_error_response {
  #   error_code = 404
  #   response_code = 200
  #   response_page_path = "/"
  # }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.cert.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # logging_config {
  #   include_cookies = false
  #   bucket          = "${aws_s3_bucket.cloudfront_logs.bucket}.s3.amazonaws.com"
  #   prefix          = "cloudfront/"
  # }

  tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}


# Add permission for CloudFront to invoke Lambda
resource "aws_lambda_permission" "allow_cloudfront" {
  statement_id  = "AllowCloudFrontToInvokeLambda"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.header_modifier.function_name
  principal     = "edgelambda.amazonaws.com"
  source_arn    = aws_cloudfront_distribution.app.arn
  
  provider = aws.us-east-1  # Must match the Lambda region
}

# Additionally, allow lambda.amazonaws.com to invoke
resource "aws_lambda_permission" "allow_lambda" {
  statement_id  = "AllowLambdaToInvokeLambda"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.header_modifier.function_name
  principal     = "lambda.amazonaws.com"
  
  provider = aws.us-east-1
}
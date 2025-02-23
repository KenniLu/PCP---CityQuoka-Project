terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      configuration_aliases = [aws.us-east-1]
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

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    target_origin_id       = "apprunner"
    viewer_protocol_policy = "redirect-to-https"
    
    # Managed-UserAgentRefererHeaders
    origin_request_policy_id = "acba4595-bd28-49b8-b9fe-13317c0390fa"

    # Managed-CachingOptimized
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    # forwarded_values {
    #   query_string = true
    #   headers      = ["*"]
    #   cookies {
    #     forward = "all"
    #   }
    # }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  custom_error_response {
    error_code = 404
    response_code = 200
    response_page_path = "/"
  }

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

  logging_config {
    include_cookies = false
    bucket          = "${aws_s3_bucket.cloudfront_logs.bucket}.s3.amazonaws.com"
    prefix          = "cloudfront/"
  }

  tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
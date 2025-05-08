resource "aws_acm_certificate" "cert" {
  provider          = aws.us-east-1  # CloudFront requires certificates in us-east-1
  domain_name       = var.domain_name
  subject_alternative_names = var.environment == "production" ? ["www.${var.domain_name}"] : []
  validation_method = "DNS"
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_s3_bucket" "cloudfront_logs" {
  bucket = "${var.environment}-cdn-logging-bucket"
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
    filter {}
    expiration {
      days = 1
    }
  }
}

resource "aws_cloudfront_response_headers_policy" "image_optimization_headers" {
  name    = "${var.app_name}-${var.environment}-ImageOptimizationHeaders"
  comment = "Headers for optimized image delivery"

  cors_config {
    access_control_allow_credentials = false
    access_control_allow_headers {
      items = ["*"]
    }
    access_control_allow_methods {
      items = ["GET", "HEAD", "OPTIONS"]
    }
    access_control_allow_origins {
      items = ["*"]  # Or specify your domains for better security
    }
    origin_override = true
  }

  # Performance headers
  custom_headers_config {
    items {
      header   = "Cache-Control"
      override = true
      value    = "public, max-age=31536000, immutable"
    }
    items {
      header   = "Content-Disposition"
      override = true
      value    = "inline"
    }
    items {
      header   = "Vary"
      override = true
      value    = "Accept"
    }
  }

  # Optional security headers
  security_headers_config {
    content_type_options {
      override = true
    }
  }
}

# Create a custom response headers policy that includes cookies
# resource "aws_cloudfront_response_headers_policy" "cookies_cors_policy" {
#   name    = "${var.app_name}-${var.environment}-CookiesCORSPolicy"
#   comment = "Policy for CORS with cookies passthrough"

#   cors_config {
#     access_control_allow_credentials = false
#     access_control_allow_headers {
#       items = ["*"]
#     }
#     access_control_allow_methods {
#       items = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
#     }
#     access_control_allow_origins {
#       items = ["*"]  # Or specify your domains for better security
#     }
#     origin_override = true
#   }

#   # This ensures cookies are passed through
#   security_headers_config {
#     # Optional security headers
#     content_type_options {
#       override = true
#     }
#     frame_options {
#       frame_option = "SAMEORIGIN"
#       override     = true
#     }
#     referrer_policy {
#       referrer_policy = "same-origin"
#       override        = true
#     }
#     xss_protection {
#       mode_block = true
#       protection = true
#       override   = true
#     }
#   }
# }

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

data "archive_file" "lambda_archive_zip" {
  type        = "zip"
  source_file = "header_modifier_lambda/index.js"
  output_file_mode = "0444"
  output_path = "artefacts/header_modifier_lambda.zip"
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
  aliases            = var.environment == "production" ? [var.domain_name, "www.${var.domain_name}"] : [var.domain_name]

  origin {
    domain_name = var.app_service_url
    origin_id   = "apprunner"
    
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  origin {
    domain_name = var.images_cache_bucket_regional_domain_name
    origin_id   = "S3ImageBucketOrigin"
    
    s3_origin_config {
      origin_access_identity = var.images_cache_bucket_oai_id_path
    }
    
    origin_shield {
      enabled              = true
      origin_shield_region = var.cloudfront_origin_shield_region
    }
  }
  
  # Fallback origin - Lambda Function URL
  origin {
    domain_name = replace(replace(var.image_optimizer_lambda_function_url, "https://", ""), "/","") # Remove https:// and trailing slash.
    origin_id   = "ImageProcessingLambdaOrigin"
    origin_access_control_id = var.image_optimizer_lambda_origin_access_control_id

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
    
    # Origin shield if needed
    origin_shield {
      enabled              = true
      origin_shield_region = var.cloudfront_origin_shield_region
    }
  }
  
  # Origin group that combines the S3 and Lambda origins
  origin_group {
    origin_id = "ImageOriginGroup"
    
    failover_criteria {
      status_codes = [403, 500, 503, 504]
    }
    
    member {
      origin_id = "S3ImageBucketOrigin"
    }
    
    member {
      origin_id = "ImageProcessingLambdaOrigin"
    }
  }

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
    path_pattern     = "/_next/static/*"  # Cache static assets
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
    default_ttl            = 86400    # 7 days
    max_ttl                = 31536000 # 1 year
    compress               = true
  }

  ordered_cache_behavior {
    path_pattern     = "/icons/*"
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

  ordered_cache_behavior {
    path_pattern = "/media/*"
    compress = true
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "ImageOriginGroup"
    viewer_protocol_policy = "redirect-to-https"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.image_optimization_headers.id

    forwarded_values {
      query_string = true
      cookies {
        forward = "none" # Image optimization doesn't need cookies
      }
      headers = ["Accept"]
    }
    min_ttl = 0
    default_ttl = 86400 # 1 day
    max_ttl = 31536000 # 1 year
    lambda_function_association {
      event_type   = "viewer-request"
      lambda_arn   = var.image_url_rewrite_lambda_qualified_arn
      include_body = false
    }
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
data "aws_s3_bucket" "source_bucket" {
  bucket = var.images_source_bucket_name
}

resource "aws_s3_bucket" "cache_bucket" {
  bucket = var.images_cache_bucket_name
}

resource "aws_s3_bucket_public_access_block" "cache_bucket_block" {
  bucket                  = aws_s3_bucket.cache_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "cache_bucket_lifecycle" {
  bucket = aws_s3_bucket.cache_bucket.id

  rule {
    id     = "expire-old-images"
    status = "Enabled"

    expiration {
      days = 90
    }
  }
}

locals {
  source_code_hash = filesha256("${path.module}/src/index.mjs")
}

# Setup build script to prepare the Lambda deployment package
resource "null_resource" "lambda_build" {
  triggers = {
    # Re-run on source code changes - adjust the file pattern as needed
    source_code_hash = local.source_code_hash
  }

  provisioner "local-exec" {
    command = <<EOF
      # Create a temporary build directory
      mkdir -p ./builds/image_optimization_lambda/build
      
      # Copy source files
      cp -r ${path.module}/src/* ./builds/image_optimization_lambda/build
      
      # Install Sharp with specific platform flags for ARM64
      cd ./builds/image_optimization_lambda/build && npm install sharp --cpu=arm64 --os=linux --libc=glibc --omit=dev
EOF
  }
}



# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "${var.app_name}-${var.environment}-image-optimizer-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

# IAM Policy for Lambda
resource "aws_iam_policy" "lambda_policy" {
  name        = "${var.app_name}-${var.environment}-image-optimizer-lambda-policy"
  description = "Policy for Image Optimization Lambda"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = "${data.aws_s3_bucket.source_bucket.arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject"
        ]
        Resource = "${aws_s3_bucket.cache_bucket.arn}/*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

data "archive_file" "lambda_archive_zip" {
  type        = "zip"
  source_dir = "./builds/image_optimization_lambda/build"
  output_file_mode = "0444"
  output_path = "./artefacts/image_optimization_lambda.zip"
  depends_on = [null_resource.lambda_build]
}

# Create Lambda function using the deployment package
resource "aws_lambda_function" "image_optimizer" {
  function_name    = "${var.app_name}-${var.environment}-image-optimizer"
  # filename         = "./image-optimization-lambda/lambda_function.zip"
  filename         = data.archive_file.lambda_archive_zip.output_path
  source_code_hash = local.source_code_hash
  handler          = "index.handler"
  runtime          = "nodejs22.x" # Or whichever runtime you're using
  architectures    = ["arm64"]
  
  role = aws_iam_role.lambda_role.arn

  # Ensure the deployment package is created before the Lambda
  depends_on = [null_resource.lambda_build]
  
  # Set appropriate memory and timeout for image processing
  memory_size = 3008
  timeout     = 60
  environment {
    variables = {
      originalImageBucketName = data.aws_s3_bucket.source_bucket.id
      transformedImageBucketName = aws_s3_bucket.cache_bucket.id
      transformedImageCacheTTL = "public, max-age=31536000, immutable"
      maxImageSize = "1048576" # Max image size is 1 MB
    }
  }
}

resource "aws_lambda_function_url" "image_optimizer_url" {
  function_name = aws_lambda_function.image_optimizer.function_name
  authorization_type = "AWS_IAM"
}

resource "aws_lambda_permission" "allow_cloudfront" {
  statement_id = "AllowCloudFront-${var.app_name}-${var.environment}"
  action = "lambda:InvokeFunctionUrl"
  function_name = aws_lambda_function.image_optimizer.function_name
  principal = "cloudfront.amazonaws.com"
  source_arn = var.cloudfront_distribution_app_arn
}

resource "aws_cloudfront_origin_access_control" "lambda_oac" {
  name = "${var.app_name}-${var.environment}-image-optimizer-lambda-oac"
  description                       = "OAC for Lambda Function URL"
  origin_access_control_origin_type = "lambda"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Origin access identity for S3
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for ${var.app_name}-${var.environment} Cached Image Bucket"
}

# S3 bucket policy allowing CloudFront access
resource "aws_s3_bucket_policy" "allow_cloudfront_access" {
  bucket = aws_s3_bucket.cache_bucket.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = {
          AWS = "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${aws_cloudfront_origin_access_identity.oai.id}"
        }
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.cache_bucket.arn}/*"
      }
    ]
  })
}
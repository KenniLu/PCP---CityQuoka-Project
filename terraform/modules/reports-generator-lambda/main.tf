

# Reports SQS Deadletter Queue
resource "aws_sqs_queue" "report_dl_queue" {
  name                      = "${var.app_name}-${var.environment}-reports-dl-queue"
  message_retention_seconds = 86400
  visibility_timeout_seconds = 60
}

# Reports SQS Queue
resource "aws_sqs_queue" "report_queue" {
  name                      = "${var.app_name}-${var.environment}-reports-queue"
  # delay_seconds             = 0
  max_message_size          = 51200 # 50kb
  message_retention_seconds = 86400 # 1 Day
  visibility_timeout_seconds = 60 # 1 min visibility timeout

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.report_dl_queue.arn
    maxReceiveCount     = 3
  })
}

resource "aws_sqs_queue_redrive_allow_policy" "report_queue_redrive_allow_policy" {
  queue_url = aws_sqs_queue.report_dl_queue.id

  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue",
    sourceQueueArns   = [aws_sqs_queue.report_queue.arn]
  })
}

# Lambda function setup
locals {
  source_code_hash = filesha256("${path.module}/src/index.js")
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
      mkdir -p ./builds/reports-generator-lambda/build
      
      # Copy source files
      cp -r ${path.module}/src/* ./builds/reports-generator-lambda/build
      
      # Install dependencies
      cd ./builds/reports-generator-lambda/build && npm install
EOF
  }
}

data "archive_file" "lambda_archive_zip" {
  type        = "zip"
  source_dir = "./builds/reports-generator-lambda/build"
  output_file_mode = "0444"
  output_path = "./artefacts/reports-generator-lambda.zip"
  depends_on = [null_resource.lambda_build]
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "${var.app_name}-${var.environment}-reports-generator-lambda-role"

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

resource "aws_iam_policy" "lambda_policy" {
  name        = "${var.app_name}-${var.environment}-reports-generator-policy"
  description = "Policy for Lambda to access SQS, S3, and execute other required actions"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # CloudWatch Logs
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      # SQS
      {
        Effect = "Allow"
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ]
        Resource = aws_sqs_queue.report_queue.arn
      },
      # S3
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${var.reports_bucket_name}",
          "arn:aws:s3:::${var.reports_bucket_name}/*"
        ]
      }
    ]
  })
}

# Attach policy to role
resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

# CloudWatch Log Group for Lambda
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${var.app_name}-${var.environment}-reports-generator"
  retention_in_days = var.log_retention_days
}

# Lambda Function
resource "aws_lambda_function" "reports_generator" {
  function_name    = "${var.app_name}-${var.environment}-reports-generator"
  filename         = data.archive_file.lambda_archive_zip.output_path
  source_code_hash = local.source_code_hash
  handler          = "index.handler"
  runtime          = "nodejs22.x" # Or whichever runtime you're using
  architectures    = ["arm64"]
  
  role = aws_iam_role.lambda_role.arn

  # Ensure the deployment package is created before the Lambda
  depends_on = [null_resource.lambda_build]
  
  # Set appropriate memory and timeout for image processing
  memory_size = 1500
  timeout     = 60
  environment {
    variables = {
      DATABASE_URI = var.db_uri
      APP_DOMAIN  = var.app_domain
      S3_BUCKET    = var.reports_bucket_name
    }
  }
}

# EventSource Mapping (SQS -> Lambda)
resource "aws_lambda_event_source_mapping" "sqs_lambda_trigger" {
  event_source_arn = aws_sqs_queue.report_queue.arn
  function_name    = aws_lambda_function.reports_generator.function_name
  batch_size       = 1
  enabled          = true
}

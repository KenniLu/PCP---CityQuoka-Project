
data "aws_region" "current" {}

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

data "aws_s3_bucket" "images_bucket" {
  bucket = var.images_source_bucket_name
}

resource "aws_s3_bucket" "reports_bucket" {
  bucket = var.reports_bucket_name
}

resource "aws_iam_role" "application_access_role" {
  name = "${var.app_name}-${var.environment}-access-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "tasks.apprunner.amazonaws.com"
        }
      }
    ]
  })
  
  tags = {
    Description = "Role for App Runner to access resources"
    Terraform   = "True"
    Service     = "AppRunner"
  }
}

# IAM Policy for Application runtime 
resource "aws_iam_policy" "application_iam_policy" {
  name = "${var.app_name}-${var.environment}-apprunner-policy"
  description = "Policy for run time permissions for ${var.app_name}-${var.environment}"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          # Existing bucket ARN
          data.aws_s3_bucket.images_bucket.arn,
          "${data.aws_s3_bucket.images_bucket.arn}/*",
          
          # New bucket ARN
          aws_s3_bucket.reports_bucket.arn,
          "${aws_s3_bucket.reports_bucket.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "sqs:SendMessage",
          "sqs:GetQueueUrl"
        ],
        Resource = [ var.reports_sqs_queue_arn ]
      }
    ]
  })
}
resource "aws_iam_role_policy_attachment" "application_access_attachment" {
  role       = aws_iam_role.application_access_role.name
  policy_arn = aws_iam_policy.application_iam_policy.arn
}

# Create IAM user for programmatic access
resource "aws_iam_user" "application_user" {
  name = "${var.app_name}-${var.environment}-application-user"
  
  tags = {
    Description = "User for AWS access to ${var.app_name}-${var.environment}"
    Terraform   = "True"
  }
}

# Create access key for the IAM user
resource "aws_iam_access_key" "application_user_key" {
  user = aws_iam_user.application_user.name
}

# Attach the same policy to the user
resource "aws_iam_user_policy_attachment" "application_user_attachment" {
  user       = aws_iam_user.application_user.name
  policy_arn = aws_iam_policy.application_iam_policy.arn
}

locals {
  environment_variables = merge(
    try(var.environment_variables,{}), 
    {
      _AWS_ACCESS_KEY_ID     = aws_iam_access_key.application_user_key.id
      _AWS_SECRET_ACCESS_KEY = aws_iam_access_key.application_user_key.secret
      _AWS_REGION            = data.aws_region.current.name
      REPORTS_S3_BUCKET = var.reports_bucket_name
      REPORTS_SQS_QUEUE_URL = var.reports_sqs_queue_url
    }
  )  
}

resource "aws_iam_role_policy_attachment" "apprunner_service_role_policy" {
  role       = aws_iam_role.apprunner_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

resource "aws_apprunner_service" "cq_cms_app" {
  service_name = "${var.app_name}-${var.environment}"

  source_configuration {

    authentication_configuration {
      access_role_arn = aws_iam_role.apprunner_service_role.arn
    }

    image_repository {
      image_configuration {
        port = "3000"
        runtime_environment_variables = local.environment_variables
      }
      image_identifier      = "${var.ecr_repository_url}:latest"
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
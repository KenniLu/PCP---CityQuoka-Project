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

    authentication_configuration {
      access_role_arn = aws_iam_role.apprunner_service_role.arn
    }

    image_repository {
      image_configuration {
        port = "3000"
        runtime_environment_variables = var.environment_variables
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
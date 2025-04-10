# modules/ecr/variables.tf
variable "app_name" {
  description = "Name of the application"
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g., production, staging)"
  type        = string
}

variable "cloudfront_distribution_app_arn" {
  description = "ARN of cloudfront distribution"
  type = string
}

variable "aws_iam_lambda_edge_role_arn" {
  description = "Role ARN for the Lambda Edge Role"
  type = string
}
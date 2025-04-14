variable "app_name" {
  description = "Name of the application"
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g., production, staging)"
  type        = string
}

variable "environment_variables" {
  description = "Environment variables for the application"
  type        = map(string)
  default     = {}
}

variable "instance_size" {
  type = object({
    cpu    = string
    memory = string
  })
  description = "App Runner instance size"
}

variable "ecr_repository_url" {
  description = "URL of the ECR repository"
  type        = string
}

variable "images_source_bucket_name" {
  description = "Name of the S3 bucket containing source images"
  type        = string
}

variable "reports_bucket_name" {
  description = "Name of the S3 bucket for saving reports"
  type        = string
}

variable "reports_sqs_queue_arn" {
  description = "ARN of the SQS queue for Reports"
  type = string
}

variable "reports_sqs_queue_url" {
  description = "SQS QUEUE URL for receiving report requests"
  type = string
}
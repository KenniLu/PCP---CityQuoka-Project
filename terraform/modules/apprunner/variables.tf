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
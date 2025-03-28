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

variable "github_repository_id" {
  description = "GitHub repository ID (e.g., username/repo-name)"
  type        = string
}

variable "github_branch" {
  description = "GitHub branch to track for deployments"
  type        = string
}

variable "ecr_repository_url" {
  description = "URL of the ECR repository"
  type        = string
}
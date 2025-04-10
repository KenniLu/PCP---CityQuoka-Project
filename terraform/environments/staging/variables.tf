variable "environment" {
  type        = string
  description = "Environment name (staging/production)"
}

variable "app_name" {
  type        = string
  description = "Application name"
}

variable "github_repository" {
  type        = string
  description = "GitHub repository URL"
}

variable "github_repository_id" {
  type        = string
  description = "GitHub repository Id ( case sensitive ). Example: some-user/my-repo"
}

variable "github_branch" {
  type        = string
  description = "GitHub branch to deploy"
}

variable "instance_size" {
  type = object({
    cpu    = string
    memory = string
  })
  description = "App Runner instance size"
}

variable "domain_name" {
  type        = string
  description = "Custom domain name"
}

variable "environment_variables" {
  type        = map(string)
  description = "Environment variables for the application that are not secrets"
  default     = {}
}

variable "secret_environment_variables" {
  type        = map(string)
  description = "Environment variables for the application that are secrets"
  default     = {}
}

variable "github_connection_arn" {
  type = string
  description = "GitHub Connection ARN for Apprunner to use to connect to Github"
}

variable "images_source_bucket_name" {
  description = "Name of the S3 bucket containing source images"
  type        = string
}

variable "images_cache_bucket_name" {
  description = "Name of the S3 bucket for caching optimized images"
  type        = string
}
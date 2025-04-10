# modules/ecr/variables.tf
variable "app_name" {
  description = "Name of the application"
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g., production, staging)"
  type        = string
}

variable "images_source_bucket_name" {
  description = "Name of the S3 bucket containing source images"
  type        = string
}

variable "images_cache_bucket_name" {
  description = "Name of the S3 bucket for caching optimized images"
  type        = string
}


variable "cloudfront_distribution_app_arn" {
  description = "ARN of cloudfront distribution"
  type = string
}

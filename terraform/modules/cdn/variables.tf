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

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
}

variable "app_service_url" {
  description = "App service URL"
  type        = string
}

variable "cloudfront_origin_shield_region" {
  description = "Region for the Cloudfront Origin Shield"
  type = string
}

variable "image_optimizer_lambda_function_url" {
  description = "URL if the Image optimizer function"
  type = string
}

variable "image_optimizer_lambda_origin_access_control_id" {
  description = "Image Optimizer Lambda Origin access control ID"
  type = string
}

variable "images_cache_bucket_oai_id_path" {
  description = "Path for the S3 cached images bucket Origin Access ID"
  type = string
}

variable "image_url_rewrite_lambda_qualified_arn" {
  description = "Qualified ARN of Image URL Wewrite Lambda Function"
  type = string
}

variable "image_url_rewrite_lambda_function_name" {
  description = "Function Name of Image URL Wewrite Lambda Function"
  type = string
}

variable "images_cache_bucket_regional_domain_name" {
  description = "Regional Domain Name for S3 bucket caching optimized images"
  type = string
}
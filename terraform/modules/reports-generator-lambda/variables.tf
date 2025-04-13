variable "app_name" {
  description = "Name of the application"
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g., production, staging)"
  type        = string
}

variable "db_uri" {
  description = "DB URI"
  type        = string
}

variable "reports_bucket_name" {
  description = "S3 bucket to hold the reports"
  type        = string
}

variable "log_retention_days" {
  description = "Number of days to retain the Lambda logs"
  type = number
  default = 1
}

variable "app_domain" {
  description = "App domain to make the API call"
  type = string
}
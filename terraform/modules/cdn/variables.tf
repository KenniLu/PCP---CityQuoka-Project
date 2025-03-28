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
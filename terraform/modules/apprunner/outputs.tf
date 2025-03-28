output "app_service_url" {
  description = "URL of the App Service"
  value       = aws_apprunner_service.cq_cms_app.service_url
}

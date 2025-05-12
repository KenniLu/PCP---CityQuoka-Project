output "cloudfront_domain_name" {
  value = module.cq-cms-app.cloudfront_domain_name
}

output "cloudfront_hosted_zone_id" {
  value = module.cq-cms-app.cloudfront_hosted_zone_id
}

output "certificate_domain_validation_options" {
  value = module.cq-cms-app.certificate_domain_validation_options
}

output "certificate_arn" {
  value = module.cq-cms-app.certificate_arn
}
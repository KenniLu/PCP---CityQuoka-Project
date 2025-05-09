output "cloudfront_domain_name" {
  description = "The domain name of the CloudFront distribution"
  value = module.cdn.cloudfront_domain_name
}

output "cloudfront_hosted_zone_id" {
  description = "The CloudFront distribution's hosted zone ID"
  value       = module.cdn.cloudfront_hosted_zone_id
}

output "cloudfront_distribution_id" {
  description = "The ID of the CloudFront distribution"
  value       = module.cdn.cloudfront_distribution_id
}

output "certificate_arn" {
  description = "The ARN of the ACM certificate"
  value       = module.cdn.certificate_arn
}

output "certificate_domain_validation_options" {
  description = "Domain validation options for the certificate"
  value       = module.cdn.certificate_domain_validation_options
}
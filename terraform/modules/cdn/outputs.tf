output "cloudfront_distribution_app_arn" {
  description = "ARN of cloudfront distribution"
  value       = aws_cloudfront_distribution.app.arn
}

output "aws_iam_lambda_edge_role_arn" {
  description = "Role ARN for the Lambda Edge Role"
  value = aws_iam_role.lambda_edge_role.arn
}

output "cloudfront_domain_name" {
  description = "The domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.app.domain_name
}

output "cloudfront_hosted_zone_id" {
  description = "The CloudFront distribution's hosted zone ID"
  value       = aws_cloudfront_distribution.app.hosted_zone_id
}

output "cloudfront_distribution_id" {
  description = "The ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.app.id
}

output "certificate_arn" {
  description = "The ARN of the ACM certificate"
  value       = aws_acm_certificate.cert.arn
}

output "certificate_domain_validation_options" {
  description = "Domain validation options for the certificate"
  value       = aws_acm_certificate.cert.domain_validation_options
}
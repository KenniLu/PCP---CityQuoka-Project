output "cloudfront_distribution_app_arn" {
  description = "ARN of cloudfront distribution"
  value       = aws_cloudfront_distribution.app.arn
}

output "aws_iam_lambda_edge_role_arn" {
  description = "Role ARN for the Lambda Edge Role"
  value = aws_iam_role.lambda_edge_role.arn
}

output "image_url_rewrite_lambda_function_name" {
  description = "Image URL Wewrite Lambda function name"
  value       = aws_lambda_function.image_url_rewriter.function_name
}

output "image_url_rewrite_lambda_qualified_arn" {
  description = "Qualified ARN of Image URL Wewrite Lambda Function"
  value       = aws_lambda_function.image_url_rewriter.qualified_arn
}
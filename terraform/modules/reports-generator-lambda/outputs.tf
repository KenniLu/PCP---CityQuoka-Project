output "reports_sqs_queue_arn" {
  description = "ARN of the SQS queue for Reports"
  value       = aws_sqs_queue.report_queue.arn
}

output "reports_sqs_queue_url" {
  description = "URL of the SQS queue for Reports"
  value       = aws_sqs_queue.report_queue.url
}

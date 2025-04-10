output "image_optimizer_lambda_function_url" {
  description = "URL if the Image optimizer function"
  value       = aws_lambda_function_url.image_optimizer_url.function_url
}

output "image_optimizer_lambda_origin_access_control_id" {
  description = "Image Optimizer Lambda Origin access control ID"
  value       = aws_cloudfront_origin_access_control.lambda_oac.id
}

output "images_cache_bucket_oai_id_path" {
  description = "Path for the S3 cached images bucket Origin Access ID"
  value       = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
}

output "images_cache_bucket_regional_domain_name" {
  description = "Regional Domain Name for S3 bucket caching optimized images"
  value = aws_s3_bucket.cache_bucket.bucket_regional_domain_name
}
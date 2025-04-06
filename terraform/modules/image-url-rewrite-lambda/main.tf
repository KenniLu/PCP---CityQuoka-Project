data "archive_file" "lambda_archive_zip" {
  type        = "zip"
  source_file = "${path.module}/src/index.js"
  output_file_mode = "0444"
  output_path = "./artefacts/image_url_rewrite_lambda.zip"
}

resource "aws_lambda_function" "image_url_rewriter" {
  filename         = data.archive_file.lambda_archive_zip.output_path
  function_name    = "${var.app_name}-${var.environment}-image-url-rewriter"
  role            = var.aws_iam_lambda_edge_role_arn
  handler         = "index.handler"
  runtime          = "nodejs22.x"
  memory_size      = 128  # Minimum allocation (already quite low)
  timeout          = 5
  publish         = true  # Required for Lambda@Edge
  provider = aws.us-east-1  # Lambda@Edge must be in us-east-1
  source_code_hash = filesha256("${path.module}/src/index.js")
}

resource "aws_lambda_permission" "allow_cloudfront" {
  statement_id  = "AllowCloudFrontToInvokeLambda"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.image_url_rewriter.function_name
  principal     = "edgelambda.amazonaws.com"
  source_arn    = var.cloudfront_distribution_app_arn
  
  provider = aws.us-east-1  # Must match the Lambda region
}

# Additionally, allow lambda.amazonaws.com to invoke
resource "aws_lambda_permission" "allow_lambda" {
  statement_id  = "AllowLambdaToInvokeLambda"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.image_url_rewriter.function_name
  principal     = "lambda.amazonaws.com"
  
  provider = aws.us-east-1
}
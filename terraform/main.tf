terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      configuration_aliases = [aws.us-east-1]
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.7.0" # Use appropriate version
    }
  }
}

locals {
  merged_environment_variables = merge(
    try(var.environment_variables,{}), 
    try(var.secret_environment_variables,{})
  )  
}

module "ecr" {
  source      = "./modules/ecr"
  app_name    = var.app_name
  environment = var.environment
}

module "apprunner" {
  source                    = "./modules/apprunner"
  app_name                  = var.app_name
  environment               = var.environment
  instance_size             = var.instance_size
  environment_variables = local.merged_environment_variables
  ecr_repository_url = module.ecr.repository_url
  images_source_bucket_name = var.images_source_bucket_name
  reports_bucket_name = var.reports_bucket_name
  reports_sqs_queue_arn = module.reports-generator-lambda.reports_sqs_queue_arn
  reports_sqs_queue_url = module.reports-generator-lambda.reports_sqs_queue_url
}

module "cicd" {
  source                 = "./modules/cicd"
  app_name               = var.app_name
  environment            = var.environment
  github_repository_id   = var.github_repository_id
  github_branch          = var.github_branch
  ecr_repository_url = module.ecr.repository_url
  environment_variables = local.merged_environment_variables
}

module "cdn" {
  source                = "./modules/cdn"
  app_name              = var.app_name
  environment           = var.environment
  domain_name           = var.domain_name
  app_service_url = module.apprunner.app_service_url
  cloudfront_origin_shield_region = "ap-southeast-2"
  image_optimizer_lambda_function_url = module.image-optimization-lambda.image_optimizer_lambda_function_url
  image_optimizer_lambda_origin_access_control_id = module.image-optimization-lambda.image_optimizer_lambda_origin_access_control_id
  images_cache_bucket_oai_id_path = module.image-optimization-lambda.images_cache_bucket_oai_id_path
  image_url_rewrite_lambda_qualified_arn = module.image-url-rewrite-lambda.image_url_rewrite_lambda_qualified_arn
  image_url_rewrite_lambda_function_name = module.image-url-rewrite-lambda.image_url_rewrite_lambda_function_name
  images_cache_bucket_regional_domain_name = module.image-optimization-lambda.images_cache_bucket_regional_domain_name
  providers = {
    aws.us-east-1 = aws.us-east-1
  }
}

module "image-url-rewrite-lambda" {
  source = "./modules/image-url-rewrite-lambda"
  app_name = var.app_name
  environment = var.environment
  cloudfront_distribution_app_arn = module.cdn.cloudfront_distribution_app_arn
  aws_iam_lambda_edge_role_arn = module.cdn.aws_iam_lambda_edge_role_arn

  providers = {
    aws.us-east-1 = aws.us-east-1
  }
}

module "image-optimization-lambda" {
  source = "./modules/image-optimization-lambda"
  app_name = var.app_name
  environment = var.environment
  images_source_bucket_name = var.images_source_bucket_name
  images_cache_bucket_name = var.images_cache_bucket_name
  cloudfront_distribution_app_arn = module.cdn.cloudfront_distribution_app_arn
}

module "reports-generator-lambda" {
  source = "./modules/reports-generator-lambda"
  app_name = var.app_name
  environment = var.environment
  db_uri = var.secret_environment_variables.DATABASE_URI
  reports_bucket_name = var.reports_bucket_name
  app_domain = var.secret_environment_variables.NEXT_PUBLIC_SERVER_URL
  application_api_key = var.application_api_key
  app_env = var.environment
}
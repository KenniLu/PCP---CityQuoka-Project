terraform {
  backend "s3" {
    bucket = "cq-cms-production-terraform-state"
    key = "terraform/production/state"
    region = "ap-southeast-2"
    use_lockfile = true
  }
}

provider "aws" {
  region = "ap-southeast-2"
}

# Default region for all services is going to be ap-southeast-2 from above.
# Any service that refers to provider aws.us-east-1 will point to us-east-1. In this case, It's just going to be ACM
provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"  # Required for ACM certificates used with CloudFront
}

module "cq-cms-app" {
  source = "../.."

  # Provider configurations
  providers = {
    aws           = aws
    aws.us-east-1 = aws.us-east-1
  }
  
  environment           = var.environment
  app_name              = var.app_name
  github_repository     = var.github_repository
  github_branch         = var.github_branch
  domain_name           = var.domain_name
  instance_size         = var.instance_size
  github_connection_arn = var.github_connection_arn
  github_repository_id = var.github_repository_id
  images_source_bucket_name = var.images_source_bucket_name
  images_cache_bucket_name = var.images_cache_bucket_name
  environment_variables = var.environment_variables
  secret_environment_variables = var.secret_environment_variables

}
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
  providers = {
    aws.us-east-1 = aws.us-east-1
  }
}
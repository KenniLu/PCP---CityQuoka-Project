environment         = "production"
app_name           = "cq-cms-app"
github_repository  = "https://github.com/cityquokka/cityquokka-cms"
github_repository_id = "cityquokka/cityquokka-cms"
github_branch      = "production"
domain_name        = "cityquokka.com"
images_source_bucket_name = "cq-cms-production"
images_cache_bucket_name = "cq-cms-production-cached-images"
reports_bucket_name = "cq-cms-production-reports"
instance_size = {
  cpu    = "1 vCPU"
  memory = "2 GB"
}
environment_variables = {
  NODE_ENV = "production"
  APP_ENV = "production"
  # Add other environment-specific variables
}
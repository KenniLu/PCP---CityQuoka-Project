environment         = "staging"
app_name           = "cq-cms-app"
github_repository  = "https://github.com/cityquokka/cityquokka-cms"
github_repository_id = "cityquokka/cityquokka-cms"
github_branch      = "staging"
domain_name        = "staging.cityquokka.com"
instance_size = {
  cpu    = "1 vCPU"
  memory = "2 GB"
}
environment_variables = {
  NODE_ENV = "production"
  APP_ENV = "staging"
  # Add other environment-specific variables
}
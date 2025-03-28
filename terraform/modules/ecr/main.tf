resource "aws_ecr_repository" "app" {
  name                 = "${var.app_name}-${var.environment}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_lifecycle_policy" "app" {
  repository = aws_ecr_repository.app.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last ${var.environment == "production" ? 5 : 5} images"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = var.environment == "production" ? 5 : 5
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}
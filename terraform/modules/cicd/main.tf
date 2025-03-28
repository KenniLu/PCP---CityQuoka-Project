resource "aws_iam_role" "codebuild" {
  name = "${var.app_name}-${var.environment}-codebuild-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "codebuild.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "codebuild" {
  role = aws_iam_role.codebuild.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:GetObjectVersion",
          "s3:GetBucketVersioning",
          "s3:PutObject"
        ]
        Resource = [
          aws_s3_bucket.pipeline_artifacts.arn,
          "${aws_s3_bucket.pipeline_artifacts.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Resource = ["*"]
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:PutImage"
        ]
        Resource = "*"
      }
    ]
  })
}

# CodeBuild Project
resource "aws_codebuild_project" "app" {
  name          = "${var.app_name}-${var.environment}-build"
  description   = "Build project for ${var.app_name} ${var.environment}"
  build_timeout = "15"
  service_role  = aws_iam_role.codebuild.arn

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_MEDIUM"
    image                      = "aws/codebuild/amazonlinux2-x86_64-standard:4.0"
    type                       = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
    privileged_mode            = true

    environment_variable {
      name  = "ECR_REPOSITORY_URI"
      value = var.ecr_repository_url
    }

    # Dynamic block to add variables from local.merged_environment_variables
    dynamic "environment_variable" {
      for_each = var.environment_variables
      content {
        name  = environment_variable.key
        value = environment_variable.value
      }
    }

  }

  source {
    type = "CODEPIPELINE"
    buildspec = <<-EOF
      version: 0.2
      phases:
        pre_build:
          commands:
            - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $ECR_REPOSITORY_URI
            - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
            # Create .env file dynamically from environment variables
            - |
              echo "Creating .env file..."
              %{for key, value in var.environment_variables}
              echo "${key}=${value}" >> .env
              %{endfor}
            # Add Docker build arg for memory allocation
            - echo "NEXT_TELEMETRY_DISABLED=1" >> .env
        build:
          commands:
            - DOCKER_BUILDKIT=1 docker build --secret id=env,src=.env -t $ECR_REPOSITORY_URI:$COMMIT_HASH .
            - docker tag $ECR_REPOSITORY_URI:$COMMIT_HASH $ECR_REPOSITORY_URI:latest
        post_build:
          commands:
            - docker push $ECR_REPOSITORY_URI:$COMMIT_HASH
            - docker push $ECR_REPOSITORY_URI:latest
      artifacts:
        files: []
    EOF
  }
}

# CodePipeline Role and Policy
resource "aws_iam_role" "codepipeline" {
  name = "${var.app_name}-${var.environment}-pipeline-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "codepipeline.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "codepipeline" {
  name = "${var.app_name}-${var.environment}-pipeline-policy"
  role = aws_iam_role.codepipeline.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:GetObjectVersion",
          "s3:GetBucketVersioning",
          "s3:PutObject"
        ]
        Resource = [
          aws_s3_bucket.pipeline_artifacts.arn,
          "${aws_s3_bucket.pipeline_artifacts.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "codestar-connections:UseConnection"
        ]
        Resource = aws_codestarconnections_connection.github.arn
      },
      {
        Effect = "Allow"
        Action = [
          "codebuild:BatchGetBuilds",
          "codebuild:StartBuild"
        ]
        Resource = "*"
      }
    ]
  })
}

# GitHub Connection
resource "aws_codestarconnections_connection" "github" {
  name          = "${var.app_name}-${var.environment}-github"
  provider_type = "GitHub"
}

# S3 Bucket for CodePipeline artifacts
resource "aws_s3_bucket" "pipeline_artifacts" {
  bucket = "${var.app_name}-${var.environment}-pipeline-artifacts"
}

# # Enable versioning
# resource "aws_s3_bucket_versioning" "pipeline_artifacts" {
#   bucket = aws_s3_bucket.pipeline_artifacts.id
#   versioning_configuration {
#     status = "Enabled"
#   }
# }

# Block public access
resource "aws_s3_bucket_public_access_block" "pipeline_artifacts" {
  bucket = aws_s3_bucket.pipeline_artifacts.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}


# CodePipeline
resource "aws_codepipeline" "app" {
  name     = "${var.app_name}-${var.environment}-pipeline"
  role_arn = aws_iam_role.codepipeline.arn

  artifact_store {
    location = aws_s3_bucket.pipeline_artifacts.bucket
    type     = "S3"
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["source_output"]

      configuration = {
        ConnectionArn    = aws_codestarconnections_connection.github.arn
        FullRepositoryId = var.github_repository_id
        BranchName      = var.github_branch
      }
    }
  }

  stage {
    name = "Build"

    action {
      name            = "Build"
      category        = "Build"
      owner           = "AWS"
      provider        = "CodeBuild"
      input_artifacts = ["source_output"]
      version         = "1"

      configuration = {
        ProjectName = aws_codebuild_project.app.name
      }
    }
  }

  dynamic "stage" {
    for_each = var.environment == "production" ? [1] : []
    content {
      name = "Approve"

      action {
        name     = "Approval"
        category = "Approval"
        owner    = "AWS"
        provider = "Manual"
        version  = "1"
      }
    }
  }
}
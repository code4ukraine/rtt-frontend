terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 3.0"
    }
  }

  backend "s3" {
    bucket = "rtt-tf-state"
    key    = "tfstate"
    region = "us-east-2"
  }
}

provider "aws" {
  region = "us-east-2"
}

provider "cloudflare" {
  account_id = var.cloudflare_account_id
}

module "upload" {
  source = "./upload"

  cloudflare_zone_id     = module.web.cloudflare_zone_id
  env                    = var.env
  lambda_secrets_arn     = var.lambda_secrets_arn
  s3_uploads_bucket_name = var.s3_uploads_bucket_name
  zone_name              = var.zone_name
}

module "web" {
  source = "./web"

  env                = var.env
  s3_web_bucket_name = var.s3_web_bucket_name
  zone_name          = var.zone_name
}

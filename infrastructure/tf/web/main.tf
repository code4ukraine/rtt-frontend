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
}

# create s3 buckets dedicated to serving static content
# s3 buckets must match the domain name for CloudFlare->s3
resource "aws_s3_bucket" "web" {
  bucket = var.s3_web_bucket_name
}

resource "aws_s3_bucket_versioning" "web" {
  bucket = aws_s3_bucket.web.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_policy" "web" {
  bucket = aws_s3_bucket.web.id
  policy = data.aws_iam_policy_document.web.json
}

resource "aws_s3_bucket_cors_configuration" "web" {
  bucket = aws_s3_bucket.web.id

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = [
      "https://${var.zone_name}",
      "https://www.${var.zone_name}",
    ]
  }
}

data "cloudflare_ip_ranges" "cloudflare" {}

data "aws_iam_policy_document" "web" {
  statement {
    sid = "CloudflareRead"

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "${aws_s3_bucket.web.arn}/*",
    ]

    condition {
      test     = "IpAddress"
      variable = "aws:SourceIp"

      # Cloudflare IP ranges (see https://www.cloudflare.com/ips/)
      values = data.cloudflare_ip_ranges.cloudflare.cidr_blocks
    }
  }

  statement {
    sid = "GithubDeployerWrite"

    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::036844775862:user/github-deployer"]
    }

    actions = [
      "s3:DeleteObject",
      "s3:ListBucket",
      "s3:PutObject"
    ]

    resources = [
      aws_s3_bucket.web.arn,
      "${aws_s3_bucket.web.arn}/*",
    ]
  }

  statement {
    sid    = "SecureTransport"
    effect = "Deny"

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = ["s3:*"]

    resources = [
      aws_s3_bucket.web.arn,
      "${aws_s3_bucket.web.arn}/*",
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }
}

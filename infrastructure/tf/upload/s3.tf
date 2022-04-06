# create s3 buckets dedicated to serving static content
# s3 buckets must match the domain name for CloudFlare->s3
resource "aws_s3_bucket" "user-uploads" {
  bucket = var.s3_uploads_bucket_name
}

resource "aws_s3_bucket_policy" "user-uploads" {
  bucket = aws_s3_bucket.user-uploads.id
  policy = data.aws_iam_policy_document.user-uploads.json
}

resource "aws_s3_bucket_cors_configuration" "user-uploads" {
  bucket = aws_s3_bucket.user-uploads.id

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = ["https://upload-img.${var.zone_name}"]
  }
}

data "cloudflare_ip_ranges" "cloudflare" {}

data "aws_iam_policy_document" "user-uploads" {
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
      "${aws_s3_bucket.user-uploads.arn}/*",
    ]

    condition {
      test     = "IpAddress"
      variable = "aws:SourceIp"

      # Cloudflare IP ranges (see https://www.cloudflare.com/ips/)
      values = data.cloudflare_ip_ranges.cloudflare.cidr_blocks
    }
  }

  statement {
    sid = "LambdaPutOnly"

    principals {
      type        = "AWS"
      identifiers = [module.lambda-user-upload.lambda_role_arn]
    }

    actions = ["s3:PutObject"]

    resources = [
      "${aws_s3_bucket.user-uploads.arn}/*",
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
      aws_s3_bucket.user-uploads.arn,
      "${aws_s3_bucket.user-uploads.arn}/*",
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }
}

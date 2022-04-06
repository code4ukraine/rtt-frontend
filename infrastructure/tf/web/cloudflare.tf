resource "cloudflare_zone" "zone" {
  zone = var.zone_name
}

resource "cloudflare_zone_settings_override" "zone" {
  zone_id = cloudflare_zone.zone.id

  settings {
    automatic_https_rewrites = "on"
    http3                    = "on"
    min_tls_version          = "1.3"
    security_header {
      enabled            = true
      include_subdomains = true
      max_age            = 31536000
      nosniff            = true
      preload            = true
    }
    ssl      = "strict"
    tls_1_3  = "zrt"
    zero_rtt = "on"
  }
}

resource "cloudflare_record" "root" {
  zone_id = cloudflare_zone.zone.id
  name    = "@"
  value   = aws_s3_bucket.web.bucket_domain_name
  type    = "CNAME"
  ttl     = 1
  proxied = true
}

resource "cloudflare_record" "www" {
  zone_id = cloudflare_zone.zone.id
  name    = "www"
  value   = var.zone_name
  type    = "CNAME"
  ttl     = 1
  proxied = true
}

# worker to rewrite s3 bucket name so we can have private bucket names
# also, we want bucket names without a '.' in them to enable TLS
resource "cloudflare_worker_script" "bucketrewrite" {
  name    = "${replace(var.zone_name, ".", "_")}-bucketrewrite"
  content = file("${path.module}/bucketrewrite.js")
}

# don't install a route for *.zone because we have some routes that are not
# s3 buckets (upload, for example)
resource "cloudflare_worker_route" "bucketrewrite" {
  zone_id     = cloudflare_zone.zone.id
  pattern     = "www.${var.zone_name}/*"
  script_name = cloudflare_worker_script.bucketrewrite.name
}

resource "cloudflare_worker_route" "bucketrewrite_root" {
  zone_id     = cloudflare_zone.zone.id
  pattern     = "${var.zone_name}/*"
  script_name = cloudflare_worker_script.bucketrewrite.name
}

resource "cloudflare_worker_route" "bucketrewrite_upload_img" {
  zone_id     = cloudflare_zone.zone.id
  pattern     = "upload-img.${var.zone_name}/*"
  script_name = cloudflare_worker_script.bucketrewrite.name
}

# worker to rewrite Host: headers. we need this when fronting API gateway
# execution URLs
resource "cloudflare_worker_script" "hostrewrite" {
  name    = "${replace(var.zone_name, ".", "_")}-hostrewrite"
  content = file("${path.module}/hostrewrite.js")
}

resource "cloudflare_worker_route" "bucketrewrite_upload" {
  zone_id     = cloudflare_zone.zone.id
  pattern     = "upload.${var.zone_name}/*"
  script_name = cloudflare_worker_script.hostrewrite.name
}

resource "cloudflare_access_group" "email_group" {
  zone_id = cloudflare_zone.zone.id
  name    = "email group"

  include {
    email = [
      "alissa@cloudflare.com",
      "asuffield@gmail.com",
      "jocelyn@cloudflare.com",
      "kofman@gmail.com",
      "petef@databits.net",
      "zack@pantheon.io",
    ]
  }
}

resource "cloudflare_access_group" "analyst_email_group" {
  zone_id = cloudflare_zone.zone.id
  name    = "analyst email group"

  include {
    email = [
      "asuffield@gmail.com",
      "kofman@gmail.com",
      "petef@databits.net",
      "zack@pantheon.io",
    ]
  }
}

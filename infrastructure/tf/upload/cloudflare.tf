resource "cloudflare_record" "upload" {
  zone_id = var.cloudflare_zone_id
  name    = "upload"
  value   = regex("https://(.*)/", module.api_gateway.default_apigatewayv2_stage_invoke_url)[0]
  type    = "CNAME"
  ttl     = 1
  proxied = true
}

resource "cloudflare_record" "upload-img" {
  zone_id = var.cloudflare_zone_id
  name    = "upload-img"
  value   = aws_s3_bucket.user-uploads.bucket_domain_name
  type    = "CNAME"
  ttl     = 1
  proxied = true
}

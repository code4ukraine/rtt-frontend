module "api_gateway" {
  source  = "terraform-aws-modules/apigateway-v2/aws"
  version = "1.5.1"

  name          = var.env
  protocol_type = "HTTP"

  cors_configuration = {
    allow_credentials = "true"
    allow_headers     = ["content-type", "cookie"]
    allow_methods     = ["POST"]
    allow_origins = [
      "https://${var.zone_name}",
      "https://www.${var.zone_name}",
    ]
  }

  create_api_domain_name = false

  integrations = {
    "GET /user-login" = {
      lambda_arn             = module.lambda-upload-login.lambda_function_arn
      payload_format_version = "2.0"
      timeout_milliseconds   = 5000
    }

    "POST /user-upload" = {
      lambda_arn             = module.lambda-user-upload.lambda_function_arn
      payload_format_version = "2.0"
      timeout_milliseconds   = 30000
    }
  }
}

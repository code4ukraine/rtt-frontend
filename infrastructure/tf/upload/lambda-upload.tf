module "lambda-user-upload" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "2.34.1"

  function_name = "${var.env}-user-upload"
  description   = "Handle user uploads, write to dynamo/s3"
  handler       = "upload.lambda_handler"
  runtime       = "python3.8"
  publish       = true
  timeout       = 30

  source_path = "../lambda/upload"

  attach_policy = true
  policy        = aws_iam_policy.lambda-user-upload.arn

  allowed_triggers = {
    APIGateway = {
      service    = "apigateway"
      source_arn = "${module.api_gateway.apigatewayv2_api_execution_arn}/*/*"
    }
  }

  environment_variables = {
    DYNAMO_COOKIES_TABLE   = local.dynamodb_upload_cookies_name
    DYNAMO_PASSWORDS_TABLE = local.dynamodb_upload_passwords_name
    DYNAMO_UPLOADS_TABLE   = local.dynamodb_user_uploads_name
    IMG_HOSTNAME           = "upload-img.${var.zone_name}"
    S3_BUCKET              = var.s3_uploads_bucket_name
    SECRETS_ARN            = var.lambda_secrets_arn
  }
}

resource "aws_iam_policy" "lambda-user-upload" {
  name   = "${var.env}-lambda-user-upload-policy"
  policy = data.aws_iam_policy_document.lambda-user-upload.json
}

data "aws_iam_policy_document" "lambda-user-upload" {
  statement {
    sid    = "LambdaDynamoCheckCookie"
    effect = "Allow"
    actions = [
      "dynamodb:GetItem"
    ]
    resources = [module.upload-cookies-table.dynamodb_table_arn]
  }
  statement {
    sid    = "LambdaDynamoCheckPassword"
    effect = "Allow"
    actions = [
      "dynamodb:Query"
    ]
    resources = ["${module.upload-passwords-table.dynamodb_table_arn}/index/IdIndex"]
  }

  statement {
    sid       = "LambdaDynamoPutUploads"
    effect    = "Allow"
    actions   = ["dynamodb:PutItem"]
    resources = [module.user-uploads-table.dynamodb_table_arn]
  }

  statement {
    sid       = "LambdaS3Put"
    effect    = "Allow"
    actions   = ["s3:PutObject"]
    resources = ["${aws_s3_bucket.user-uploads.arn}/*"]
  }

  statement {
    sid       = "LambdaSecrets"
    effect    = "Allow"
    actions   = ["secretsmanager:GetSecretValue"]
    resources = [var.lambda_secrets_arn]
  }
}

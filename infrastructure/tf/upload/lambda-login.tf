module "lambda-upload-login" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "2.34.1"

  function_name = "${var.env}-upload-login"
  description   = "Log in and set a cookie for the user-upload lambda"
  handler       = "login.lambda_handler"
  runtime       = "python3.8"
  publish       = true

  source_path = "../lambda/upload-login"

  attach_policy = true
  policy        = aws_iam_policy.lambda-upload-login.arn

  allowed_triggers = {
    APIGateway = {
      service    = "apigateway"
      source_arn = "${module.api_gateway.apigatewayv2_api_execution_arn}/*/*"
    }
  }

  environment_variables = {
    DYNAMO_COOKIES_TABLE   = local.dynamodb_upload_cookies_name
    DYNAMO_PASSWORDS_TABLE = local.dynamodb_upload_passwords_name
    SECRETS_ARN            = var.lambda_secrets_arn
  }
}

resource "aws_iam_policy" "lambda-upload-login" {
  name   = "${var.env}-lambda-upload-login-policy"
  policy = data.aws_iam_policy_document.lambda-upload-login.json
}

data "aws_iam_policy_document" "lambda-upload-login" {
  statement {
    sid    = "LambdaDynamoCheckCookies"
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:Scan"
    ]
    resources = [module.upload-cookies-table.dynamodb_table_arn]
  }

  statement {
    sid    = "LambdaDynamoCheckPasswords"
    effect = "Allow"
    actions = [
      "dynamodb:GetItem"
    ]
    resources = [module.upload-passwords-table.dynamodb_table_arn]
  }

  statement {
    sid       = "LambdaSecrets"
    effect    = "Allow"
    actions   = ["secretsmanager:GetSecretValue"]
    resources = [var.lambda_secrets_arn]
  }
}

module "lambda-upload-passwords" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "2.34.1"

  function_name = "${var.env}-upload-passwords"
  description   = "Manage user upload passwords"
  handler       = "passwords.lambda_handler"
  runtime       = "python3.9"
  publish       = true
  timeout       = 10

  source_path = "../lambda/upload-passwords"

  attach_policy = true
  policy        = aws_iam_policy.lambda-upload-passwords.arn

  environment_variables = {
    DYNAMO_COOKIES_TABLE   = local.dynamodb_upload_cookies_name
    DYNAMO_PASSWORDS_TABLE = local.dynamodb_upload_passwords_name
    SECRETS_ARN            = var.lambda_secrets_arn
  }
}

resource "aws_iam_policy" "lambda-upload-passwords" {
  name   = "${var.env}-lambda-upload-passwords-policy"
  policy = data.aws_iam_policy_document.lambda-upload-passwords.json
}

data "aws_iam_policy_document" "lambda-upload-passwords" {
  statement {
    sid    = "LambdaDynamoManageCookies"
    effect = "Allow"
    actions = [
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:Scan",
      "dynamodb:UpdateItem"
    ]
    resources = [module.upload-cookies-table.dynamodb_table_arn]
  }

  statement {
    sid    = "LambdaDynamoManagePasswords"
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem"
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

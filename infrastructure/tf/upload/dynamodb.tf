locals {
  dynamodb_user_uploads_name     = "${var.env}-user-uploads"
  dynamodb_reviewed_uploads_name = "${var.env}-reviewed-uploads"
  dynamodb_upload_cookies_name   = "${var.env}-upload-cookies"
  dynamodb_upload_passwords_name = "${var.env}-upload-passwords"
}

module "user-uploads-table" {
  source  = "terraform-aws-modules/dynamodb-table/aws"
  version = "1.2.2"

  name                           = local.dynamodb_user_uploads_name
  billing_mode                   = "PAY_PER_REQUEST"
  point_in_time_recovery_enabled = true

  hash_key  = "id"
  range_key = "created_at"

  attributes = [
    {
      name = "id"
      type = "S"
    },
    {
      name = "created_at"
      type = "N"
    }
  ]

  replica_regions = [
    {
      region_name = "us-west-2"
    },
  ]
}

module "reviewed-uploads-table" {
  source  = "terraform-aws-modules/dynamodb-table/aws"
  version = "1.2.2"

  name                           = local.dynamodb_reviewed_uploads_name
  billing_mode                   = "PAY_PER_REQUEST"
  point_in_time_recovery_enabled = true

  hash_key  = "id"
  range_key = "created_at"

  attributes = [
    {
      name = "id"
      type = "S"
    },
    {
      name = "created_at"
      type = "N"
    }
  ]

  replica_regions = [
    {
      region_name = "us-west-2"
    },
  ]
}

module "upload-cookies-table" {
  source  = "terraform-aws-modules/dynamodb-table/aws"
  version = "1.2.2"

  name                           = local.dynamodb_upload_cookies_name
  billing_mode                   = "PAY_PER_REQUEST"
  point_in_time_recovery_enabled = true

  hash_key = "cookie"

  attributes = [
    {
      name = "cookie"
      type = "S"
    }
  ]

  replica_regions = [
    {
      region_name = "us-west-2"
    },
  ]
}

module "upload-passwords-table" {
  source  = "terraform-aws-modules/dynamodb-table/aws"
  version = "1.2.2"

  name                           = local.dynamodb_upload_passwords_name
  billing_mode                   = "PAY_PER_REQUEST"
  point_in_time_recovery_enabled = true

  hash_key = "password"

  attributes = [
    {
      name = "password"
      type = "S"
    },
    {
      name = "id"
      type = "S"
    }
  ]

  global_secondary_indexes = [
    {
      name            = "IdIndex"
      hash_key        = "id"
      projection_type = "ALL"
    }
  ]

  replica_regions = [
    {
      region_name = "us-west-2"
    },
  ]
}

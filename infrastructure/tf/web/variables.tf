variable "aliases" {
  type = list(string)

  default = []
}

variable "env" {
  type = string
}

variable "s3_web_bucket_name" {
  type = string
}

variable "zone_name" {
  type = string
}

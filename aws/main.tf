module "app" {
  source = "../modules"

  str_aws_account_id = var.str_aws_account_id
  str_app_name = var.str_app_name

  str_region = var.str_region

  int_dynamo_write_capacity = var.int_dynamo_write_capacity
  int_dynamo_read_capacity = var.int_dynamo_read_capacity

  str_domain = var.str_domain
  str_support_email = var.str_support_email
}
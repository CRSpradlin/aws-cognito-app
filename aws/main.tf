module "app" {
  source = "../modules"

  str_aws_account_id = var.str_aws_account_id
  str_app_name = var.str_app_name

  int_dynamo_write_capacity = var.int_dynamo_write_capacity
  int_dynamo_read_capacity = var.int_dynamo_read_capacity

  str_domain = var.str_domain
}
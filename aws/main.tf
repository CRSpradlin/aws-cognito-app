module "app" {
  source = "../modules"

  str_aws_account_id = var.str_aws_account_id
  str_app_name = var.str_app_name

  str_domain = var.str_domain
}
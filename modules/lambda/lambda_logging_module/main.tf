resource "aws_cloudwatch_log_group" "logging_module_log_group" {
  name = var.str_lambda_log_group_name
}
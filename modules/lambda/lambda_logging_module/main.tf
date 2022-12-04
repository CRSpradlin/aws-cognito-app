resource "aws_cloudwatch_log_group" "logging_module_log_group" {
  name = var.str_lambda_log_group_name
}

resource "aws_cloudwatch_log_subscription_filter" "logging_module_subscription_filter" {
  count = var.str_support_eamil == "" ? 0 : 1

  name            = "logging_module_${var.str_lambda_arn}_support_subscription_filter"
  log_group_name  = var.str_lambda_log_group_name
  filter_pattern  = "Unknown 1000"
  destination_arn = var.str_emailToSupport_lambda_arn
}

resource "aws_lambda_permission" "logging_module_subscription_filter_permission" {
  count = var.str_support_email == "" ? 0 : 1

  statement_id  = "${aws_cloudwatch_log_subscription_filter.logging_module_subscription_filter.name}_permission"
  action        = "lambda:InvokeFunction"
  function_name = var.str_emailToSupport_lambda_name
  principal     = "lambda.amazonaws.com"

  source_arn = aws_cloudwatch_log_subscription_filter.logging_module_subscription_filter
}
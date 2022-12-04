resource "aws_cloudwatch_log_group" "logging_module_log_group" {
  name = "/aws/lambda/${var.str_lambda_name}"
}

resource "aws_cloudwatch_log_subscription_filter" "logging_module_subscription_filter" {
  count = var.str_support_email == "" ? 0 : 1

  depends_on = [
    aws_lambda_permission.logging_module_subscription_filter_permission[0]
  ]

  name            = "logging_module_${var.str_lambda_name}_support_subscription_filter"
  log_group_name  = aws_cloudwatch_log_group.logging_module_log_group.name
  filter_pattern  = "Unknown 1000"
  destination_arn = var.str_emailToSupport_lambda_arn
}

resource "aws_lambda_permission" "logging_module_subscription_filter_permission" {
  count = var.str_support_email == "" ? 0 : 1

  statement_id  = "${var.str_emailToSupport}_logging_for_${var.str_lambda_name}_permission"
  action        = "lambda:InvokeFunction"
  function_name = var.str_emailToSupport_lambda_name
  principal     = "logs.${var.str_region}.amazonaws.com"
  source_arn    = "${aws_cloudwatch_log_group.logging_module_log_group.arn}:*"

  # TODO: Add Specific ARNS
  # source_arn = aws_cloudwatch_log_subscription_filter.logging_module_subscription_filter[0].arn
}
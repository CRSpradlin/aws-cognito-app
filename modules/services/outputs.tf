output "str_services_lambda_layer_arn" {
  value = aws_lambda_layer_version.services.arn
}
output "str_modules_lambda_layer_arn" {
  value = aws_lambda_layer_version.modules.arn
}
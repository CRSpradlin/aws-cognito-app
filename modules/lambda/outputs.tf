output "str_registerUser_lambda_invoke_arn" {
  value = aws_lambda_function.registerUser.invoke_arn
}
output "str_registerUser_lambda_function_name" {
  value = aws_lambda_function.registerUser.function_name
}
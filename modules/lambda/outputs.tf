output "str_registerUser_lambda_invoke_arn" {
  value = aws_lambda_function.registerUser.invoke_arn
}
output "str_registerUser_lambda_function_name" {
  value = aws_lambda_function.registerUser.function_name
}

output "str_confirmUser_lambda_invoke_arn" {
  value = aws_lambda_function.confirmUser.invoke_arn
}
output "str_confirmUser_lambda_function_name" {
  value = aws_lambda_function.confirmUser.function_name
}

output "str_signInUser_lambda_invoke_arn" {
  value = aws_lambda_function.signInUser.invoke_arn
}
output "str_signInUser_lambda_function_name" {
  value = aws_lambda_function.signInUser.function_name
}
//SOCKET API Lambda Integration Outputs
output "str_socketAuthroizer_lambda_invoke_arn" {
  value = aws_lambda_function.socketAuthorizer.invoke_arn
}

// REST API Labmda Integration Ouputs
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

output "str_createConversation_lambda_invoke_arn" {
  value = aws_lambda_function.createConversation.invoke_arn
}
output "str_createConversation_lambda_function_name" {
  value = aws_lambda_function.createConversation.function_name
}
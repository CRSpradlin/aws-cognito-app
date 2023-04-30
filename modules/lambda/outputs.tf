//SOCKET API Lambda Integration Outputs
output "str_socketAuthroizer_lambda_invoke_arn" {
  value = aws_lambda_function.socketAuthorizer.invoke_arn
}
output "str_socketAuthroizer_lambda_function_name" {
  value = aws_lambda_function.socketAuthorizer.function_name
}

output "str_socketDisconnect_lambda_invoke_arn" {
  value = aws_lambda_function.socketDisconnect.invoke_arn
}
output "str_socketDisconnect_lambda_function_name" {
  value = aws_lambda_function.socketDisconnect.function_name
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

output "str_sendMessage_lambda_invoke_arn" {
  value = aws_lambda_function.sendMessage.invoke_arn
}
output "str_sendMessage_lambda_function_name" {
  value = aws_lambda_function.sendMessage.function_name
}

output "str_getMessages_lambda_invoke_arn" {
  value = aws_lambda_function.getMessages.invoke_arn
}
output "str_getMessages_lambda_function_name" {
  value = aws_lambda_function.getMessages.function_name
}

output "str_getConversations_lambda_invoke_arn" {
  value = aws_lambda_function.getConversations.invoke_arn
}
output "str_getConversations_lambda_function_name" {
  value = aws_lambda_function.getConversations.function_name
}
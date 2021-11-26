output "str_cognito_app_client_id" {
  value = aws_cognito_user_pool_client.app_client.id
}

output "str_cognito_user_pool_arn" {
  value = aws_cognito_user_pool.app_user_pool.arn
}

// TODO: Might need to remove
output "str_cognito_user_pool_endpoint" {
  value = aws_cognito_user_pool.app_user_pool.endpoint
}
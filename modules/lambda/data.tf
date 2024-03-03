locals {
  map_lambda_env_variables = {
      APP_NAME = var.str_app_name
      APP_CLIENT_ID = var.str_cognito_app_client_id
      APP_SOCKET_API_ENDPOINT = var.str_gateway_socket_invoke_url
      APP_SUPPORT_EMAIL = var.str_support_email
      APP_USER_POOL_ID = var.str_cognito_user_pool_id
      APP_USER_CONFRIM_STATE_ARN = var.str_user_confirmation_state_arn
  }
}
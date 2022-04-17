locals {
  map_lambda_env_variables = {
      APP_CLIENT_ID = var.str_cognito_app_client_id
      APP_SOCKET_API_ENDPOINT = var.str_gateway_socket_invoke_url
  }
}
locals {
  map_lambda_env_variables = {
      APP_CLIENT_ID = var.str_cognito_app_client_id
  }
}
resource "aws_cognito_user_pool" "app_user_pool" {
  name = "${var.str_app_name}_cognito_user_pool"
}

resource "aws_cognito_user_pool_client" "app_client" {
  name = "${var.str_app_name}_cognito_client"

  user_pool_id = aws_cognito_user_pool.app_user_pool.id
  explicit_auth_flows = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
}
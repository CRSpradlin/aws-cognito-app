resource "aws_cognito_user_pool" "app_user_pool" {
  name = "${var.str_app_name}_cognito_user_pool"

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
    recovery_mechanism {
      name     = "verified_phone_number"
      priority = 2
    }
  }

  auto_verified_attributes = ["email"]
}

resource "aws_cognito_user_pool_client" "app_client" {
  name = "${var.str_app_name}_cognito_client"

  user_pool_id = aws_cognito_user_pool.app_user_pool.id
  explicit_auth_flows = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
}
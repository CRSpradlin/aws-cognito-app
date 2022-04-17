resource "aws_api_gateway_authorizer" "rest_authorizer" {
  name          = "RestCognitoUserPoolAuthorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.rest.id
  provider_arns = [var.str_cognito_user_pool_arn]
}

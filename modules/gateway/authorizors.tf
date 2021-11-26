resource "aws_api_gateway_authorizer" "rest_authorizer" {
  name          = "RestCognitoUserPoolAuthorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.rest.id
  provider_arns = [var.str_cognito_user_pool_arn]
}

resource "aws_apigatewayv2_authorizer" "socket_authorizer" {
  api_id           = aws_apigatewayv2_api.socket.id
  authorizer_type  = "REQUEST"
  authorizer_uri   = var.str_socketAuthroizer_lambda_invoke_arn
  identity_sources = ["route.request.header.Auth"]
  name             = "SocketRequestAuthorizer"
}
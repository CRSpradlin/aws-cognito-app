resource "aws_api_gateway_resource" "resource_conversation" {
  path_part   = "conversation"
  parent_id   = aws_api_gateway_rest_api.rest.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.rest.id
}

module "resource_conversation_cors" {
  source = "./cors_rest_module"

  depends_on = [
    aws_api_gateway_resource.resource_conversation
  ]

  aws_api_gateway_rest_api_id = aws_api_gateway_rest_api.rest.id
  resource_id                 = aws_api_gateway_resource.resource_conversation.id
}

resource "aws_api_gateway_method" "method_post_conversation" {
  rest_api_id   = aws_api_gateway_rest_api.rest.id
  resource_id   = aws_api_gateway_resource.resource_conversation.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.rest_authorizer.id
}

resource "aws_api_gateway_integration" "lambda_getConversations_method_post_conversation_integration" {
  rest_api_id             = aws_api_gateway_rest_api.rest.id
  resource_id             = aws_api_gateway_resource.resource_conversation.id
  http_method             = aws_api_gateway_method.method_post_conversation.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.str_getConversations_lambda_invoke_arn
}

resource "aws_lambda_permission" "lambda_getConversations_method_post_conversation_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.str_getConversations_lambda_function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:us-east-1:${var.str_aws_account_id}:${aws_api_gateway_rest_api.rest.id}/*/${aws_api_gateway_method.method_post_conversation.http_method}${aws_api_gateway_resource.resource_conversation.path}"
}
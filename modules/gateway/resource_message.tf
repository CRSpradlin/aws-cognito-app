resource "aws_api_gateway_resource" "resource_message" {
  path_part   = "message"
  parent_id   = aws_api_gateway_resource.resource_conversationId.id
  rest_api_id = aws_api_gateway_rest_api.rest.id
}

resource "aws_api_gateway_method" "method_post_message" {
  rest_api_id   = aws_api_gateway_rest_api.rest.id
  resource_id   = aws_api_gateway_resource.resource_message.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.rest_authorizer.id
}

resource "aws_api_gateway_integration" "lambda_getMessages_method_post_message_integration" {
  rest_api_id             = aws_api_gateway_rest_api.rest.id
  resource_id             = aws_api_gateway_resource.resource_message.id
  http_method             = aws_api_gateway_method.method_post_message.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.str_getMessages_lambda_invoke_arn
}

resource "aws_lambda_permission" "lambda_getMessages_method_post_message_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.str_getMessages_lambda_function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:us-east-1:${var.str_aws_account_id}:${aws_api_gateway_rest_api.rest.id}/*/${aws_api_gateway_method.method_post_message.http_method}${aws_api_gateway_resource.resource_message.path}"
}
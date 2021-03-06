resource "aws_api_gateway_resource" "resource_user_register" {
  path_part   = "register"
  parent_id   = aws_api_gateway_resource.resource_user.id
  rest_api_id = aws_api_gateway_rest_api.api.id
}

resource "aws_api_gateway_method" "method_post_user_register" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.resource_user_register.id
  http_method   = "POST"
  authorization = "NONE"
  request_models = {
    "application/json" = aws_api_gateway_model.method_post_user_register_model.name
  }
}

resource "aws_api_gateway_model" "method_post_user_register_model" {
  rest_api_id  = aws_api_gateway_rest_api.api.id
  name         = "MethodPostRegisterModel"
  content_type = "application/json"

  schema = <<EOF
{
  "type": "object",
  "properties": {
    "username": { "type": "string" },
    "email": { "type": "string" },
    "password": { "type": "string" }
  }
}
EOF
}

resource "aws_api_gateway_integration" "lambda_registerUser_method_post_user_register_integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.resource_user_register.id
  http_method             = aws_api_gateway_method.method_post_user_register.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.str_registerUser_lambda_invoke_arn
}

resource "aws_lambda_permission" "lambda_registerUser_method_post_user_register_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.str_registerUser_lambda_function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:us-east-1:${var.str_aws_account_id}:${aws_api_gateway_rest_api.api.id}/*/${aws_api_gateway_method.method_post_user_register.http_method}${aws_api_gateway_resource.resource_user_register.path}"
}
resource "aws_api_gateway_resource" "resource_user_confirm" {
  path_part   = "confirm"
  parent_id   = aws_api_gateway_resource.resource_user.id
  rest_api_id = aws_api_gateway_rest_api.rest.id
}

module "resource_user_confirm_cors" {
  source = "./cors_rest_module"

  depends_on = [
    aws_api_gateway_resource.resource_user_confirm
  ]

  aws_api_gateway_rest_api_id = aws_api_gateway_rest_api.rest.id
  resource_id                 = aws_api_gateway_resource.resource_user_confirm.id
}

resource "aws_api_gateway_method" "method_post_user_confirm" {
  rest_api_id   = aws_api_gateway_rest_api.rest.id
  resource_id   = aws_api_gateway_resource.resource_user_confirm.id
  http_method   = "POST"
  authorization = "NONE"
  request_models = {
    "application/json" = aws_api_gateway_model.method_post_user_confirm_model.name
  }
}

resource "aws_api_gateway_model" "method_post_user_confirm_model" {
  rest_api_id  = aws_api_gateway_rest_api.rest.id
  name         = "MethodPostconfirmModel"
  content_type = "application/json"

  schema = <<EOF
{
  "type": "object",
  "properties": {
    "profile": { "type": "string" },
    "confirmation": { "type": "string" }
  }
}
EOF
}

resource "aws_api_gateway_integration" "lambda_confirmUser_method_post_user_confirm_integration" {
  rest_api_id             = aws_api_gateway_rest_api.rest.id
  resource_id             = aws_api_gateway_resource.resource_user_confirm.id
  http_method             = aws_api_gateway_method.method_post_user_confirm.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.str_confirmUser_lambda_invoke_arn
}

resource "aws_lambda_permission" "lambda_confirmUser_method_post_user_confirm_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.str_confirmUser_lambda_function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:us-east-1:${var.str_aws_account_id}:${aws_api_gateway_rest_api.rest.id}/*/${aws_api_gateway_method.method_post_user_confirm.http_method}${aws_api_gateway_resource.resource_user_confirm.path}"
}
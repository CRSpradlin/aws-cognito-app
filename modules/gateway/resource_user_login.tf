resource "aws_api_gateway_resource" "resource_user_login" {
  path_part   = "login"
  parent_id   = aws_api_gateway_resource.resource_user.id
  rest_api_id = aws_api_gateway_rest_api.rest.id
}

module "resource_user_login_cors" {
  source = "./cors_rest_module"

  depends_on = [
    aws_api_gateway_resource.resource_user_login
  ]

  aws_api_gateway_rest_api_id = aws_api_gateway_rest_api.rest.id
  resource_id                 = aws_api_gateway_resource.resource_user_login.id
}

resource "aws_api_gateway_method" "method_post_user_login" {
  rest_api_id   = aws_api_gateway_rest_api.rest.id
  resource_id   = aws_api_gateway_resource.resource_user_login.id
  http_method   = "POST"
  authorization = "NONE"
  request_models = {
    "application/json" = aws_api_gateway_model.method_post_user_login_model.name
  }
  request_parameters = {
    "method.request.header.Content-Type" = true
  }

  request_validator_id = aws_api_gateway_request_validator.rest_request_validator.id
}

resource "aws_api_gateway_model" "method_post_user_login_model" {
  rest_api_id  = aws_api_gateway_rest_api.rest.id
  name         = "MethodPostLoginModel"
  content_type = "application/json"

  schema = <<EOF
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [ "username", "password" ],
  "additionalProperties": false,
  "properties": {
    "username": { "type": "string" },
    "password": { "type": "string" }
  }
}
EOF
}

resource "aws_api_gateway_integration" "lambda_signInUser_method_post_user_login_integration" {
  rest_api_id             = aws_api_gateway_rest_api.rest.id
  resource_id             = aws_api_gateway_resource.resource_user_login.id
  http_method             = aws_api_gateway_method.method_post_user_login.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.str_signInUser_lambda_invoke_arn
}

resource "aws_lambda_permission" "lambda_signInUser_method_post_user_login_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.str_signInUser_lambda_function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:us-east-1:${var.str_aws_account_id}:${aws_api_gateway_rest_api.rest.id}/*/${aws_api_gateway_method.method_post_user_login.http_method}${aws_api_gateway_resource.resource_user_login.path}"
}
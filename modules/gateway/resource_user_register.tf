resource "aws_api_gateway_resource" "resource_user_register" {
  path_part   = "register"
  parent_id   = aws_api_gateway_resource.resource_user.id
  rest_api_id = aws_api_gateway_rest_api.rest.id
}

resource "aws_api_gateway_method" "method_post_user_register" {
  rest_api_id   = aws_api_gateway_rest_api.rest.id
  resource_id   = aws_api_gateway_resource.resource_user_register.id
  http_method   = "POST"
  authorization = "NONE"
  request_models = {
    "application/json" = aws_api_gateway_model.method_post_user_register_model.name
  }
}

resource "aws_api_gateway_method_response" "method_post_user_register_response" {
    rest_api_id   = aws_api_gateway_rest_api.rest.id
    resource_id   = aws_api_gateway_resource.resource_user_register.id
    http_method   = aws_api_gateway_method.method_post_user_register.http_method
    status_code   = "200"
    response_parameters = {
        "method.response.header.Access-Control-Allow-Origin" = true
    }
    depends_on = [aws_api_gateway_method.method_post_user_register]
}

resource "aws_api_gateway_model" "method_post_user_register_model" {
  rest_api_id  = aws_api_gateway_rest_api.rest.id
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
  rest_api_id             = aws_api_gateway_rest_api.rest.id
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
  source_arn = "arn:aws:execute-api:us-east-1:${var.str_aws_account_id}:${aws_api_gateway_rest_api.rest.id}/*/${aws_api_gateway_method.method_post_user_register.http_method}${aws_api_gateway_resource.resource_user_register.path}"
}

resource "aws_api_gateway_method" "method_options_user_register" {
    rest_api_id   = aws_api_gateway_rest_api.rest.id
    resource_id   = aws_api_gateway_resource.resource_user_register.id
    http_method   = "OPTIONS"
    authorization = "NONE"
}

resource "aws_api_gateway_method_response" "method_options_user_register_response" {
    rest_api_id   = aws_api_gateway_rest_api.rest.id
    resource_id   = aws_api_gateway_resource.resource_user_register.id
    http_method   = aws_api_gateway_method.method_options_user_register.http_method
    status_code   = "200"

    response_models = {
        "application/json" = "Empty"
    }
    response_parameters = {
        "method.response.header.Access-Control-Allow-Headers" = true,
        "method.response.header.Access-Control-Allow-Methods" = true,
        "method.response.header.Access-Control-Allow-Origin" = true
    }

    depends_on = [
      aws_api_gateway_method.method_options_user_register
    ]
}

resource "aws_api_gateway_integration" "method_options_user_register_integration" {
    rest_api_id   = aws_api_gateway_rest_api.rest.id
    resource_id   = aws_api_gateway_resource.resource_user_register.id
    http_method   = aws_api_gateway_method.method_options_user_register.http_method
    type          = "MOCK"
    passthrough_behavior = "WHEN_NO_MATCH"
    request_templates = {
      "application/json" : "{\"statusCode\": 200}"
    }
    
    depends_on = [
      aws_api_gateway_method.method_options_user_register
    ]
}

resource "aws_api_gateway_integration_response" "method_options_user_register_integration_response" {
    rest_api_id   = aws_api_gateway_rest_api.rest.id
    resource_id   = aws_api_gateway_resource.resource_user_register.id
    http_method   = aws_api_gateway_method.method_options_user_register.http_method
    status_code   = aws_api_gateway_method_response.method_options_user_register_response.status_code
    response_parameters = {
        "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Accept,Authorization,X-Api-Key,X-Amz-Security-Token'",
        "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS,POST'"
        "method.response.header.Access-Control-Allow-Origin" = "'*'"
    }
    depends_on = [
      aws_api_gateway_method_response.method_options_user_register_response
    ]
}
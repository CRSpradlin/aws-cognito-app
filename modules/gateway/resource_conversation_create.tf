resource "aws_api_gateway_resource" "resource_conversation_create" {
  path_part   = "create"
  parent_id   = aws_api_gateway_resource.resource_conversation.id
  rest_api_id = aws_api_gateway_rest_api.rest.id
}

module "resource_conversation_create_cors" {
  source = "./cors_rest_module"

  depends_on = [
    aws_api_gateway_resource.resource_conversation_create
  ]

  aws_api_gateway_rest_api_id = aws_api_gateway_rest_api.rest.id
  resource_id                 = aws_api_gateway_resource.resource_conversation_create.id
}

resource "aws_api_gateway_method" "method_post_conversation_create" {
  rest_api_id   = aws_api_gateway_rest_api.rest.id
  resource_id   = aws_api_gateway_resource.resource_conversation_create.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.rest_authorizer.id
  request_models = {
    "application/json" = aws_api_gateway_model.method_post_conversation_create_model.name
  }
  request_parameters = {
    "method.request.header.Content-Type" = true
  }

  request_validator_id = aws_api_gateway_request_validator.rest_request_validator.id
}

resource "aws_api_gateway_model" "method_post_conversation_create_model" {
  rest_api_id  = aws_api_gateway_rest_api.rest.id
  name         = "MethodPostConversationCreateModel"
  content_type = "application/json"

  schema = <<EOF
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [ "members" ],
  "additionalProperties": false,
  "properties": {
    "name": { "type": "string" },
    "members": { 
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}
EOF
}

resource "aws_api_gateway_integration" "lambda_createConversation_method_post_conversation_create_integration" {
  rest_api_id             = aws_api_gateway_rest_api.rest.id
  resource_id             = aws_api_gateway_resource.resource_conversation_create.id
  http_method             = aws_api_gateway_method.method_post_conversation_create.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.str_createConversation_lambda_invoke_arn
}

resource "aws_lambda_permission" "lambda_createConversation_method_post_conversation_create_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.str_createConversation_lambda_function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:us-east-1:${var.str_aws_account_id}:${aws_api_gateway_rest_api.rest.id}/*/${aws_api_gateway_method.method_post_conversation_create.http_method}${aws_api_gateway_resource.resource_conversation_create.path}"
}
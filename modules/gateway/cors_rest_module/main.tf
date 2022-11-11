resource "aws_api_gateway_method" "cors_method_options" {
    rest_api_id   = var.aws_api_gateway_rest_api_id
    resource_id   = var.resource_id
    http_method   = "OPTIONS"
    authorization = "NONE"
}

resource "aws_api_gateway_method_response" "cors_method_options_response" {
    rest_api_id   = var.aws_api_gateway_rest_api_id
    resource_id   = var.resource_id
    http_method   = aws_api_gateway_method.cors_method_options.http_method
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
      aws_api_gateway_method.cors_method_options
    ]
}

resource "aws_api_gateway_integration" "cors_method_options_integration" {
    rest_api_id   = var.aws_api_gateway_rest_api_id
    resource_id   = var.resource_id
    http_method   = aws_api_gateway_method.cors_method_options.http_method
    type          = "MOCK"
    passthrough_behavior = "WHEN_NO_MATCH"
    request_templates = {
      "application/json" : "{\"statusCode\": 200}"
    }
    
    depends_on = [
      aws_api_gateway_method.cors_method_options
    ]
}

resource "aws_api_gateway_integration_response" "cors_method_options_integration_response" {
    rest_api_id   = var.aws_api_gateway_rest_api_id
    resource_id   = var.resource_id
    http_method   = aws_api_gateway_method.cors_method_options.http_method
    status_code   = aws_api_gateway_method_response.cors_method_options_response.status_code
    response_parameters = {
        "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Accept,Authorization,X-Api-Key,X-Amz-Security-Token'",
        "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS,POST'"
        "method.response.header.Access-Control-Allow-Origin" = "'*'"
    }
    depends_on = [
      aws_api_gateway_method_response.cors_method_options_response
    ]
}
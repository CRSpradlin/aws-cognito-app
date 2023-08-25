resource "aws_api_gateway_rest_api" "rest" {
  name = "${var.str_app_name}_rest_api"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_request_validator" "rest_request_validator" {
  name                        = "${var.str_app_name}_rest_api_validator"
  rest_api_id                 = aws_api_gateway_rest_api.rest.id
  validate_request_body       = true
  validate_request_parameters = true
}

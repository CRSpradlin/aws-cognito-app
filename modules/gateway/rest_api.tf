resource "aws_api_gateway_rest_api" "rest" {
  name = "${var.str_app_name}_rest_api"
}

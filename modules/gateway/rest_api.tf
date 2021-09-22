resource "aws_api_gateway_rest_api" "api" {
  name = "${var.str_app_name}_api"
}

resource "aws_apigatewayv2_api" "socket" {
  name                       = "${var.str_app_name}_socket_api"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}
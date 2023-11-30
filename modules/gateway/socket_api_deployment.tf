resource "aws_apigatewayv2_stage" "socket" {
  api_id = aws_apigatewayv2_api.socket.id
  deployment_id = aws_apigatewayv2_deployment.socket.id
  name   = var.str_socket_stage_name
}

resource "aws_apigatewayv2_deployment" "socket" {
  api_id      = aws_apigatewayv2_api.socket.id
  description = "Application WebSocket Depolyment"

  triggers = {
    redeployment = sha1(jsonencode(aws_apigatewayv2_api.socket.body))
  }

  lifecycle {
    create_before_destroy = true
  }

  # TODO: Causes Cycle issue in terraform plan
  depends_on = [
      aws_apigatewayv2_route.socket_api_connect_route,
      aws_apigatewayv2_route.socket_api_disconnect_route
  ]
}

resource "aws_apigatewayv2_api_mapping" "socket_domain_mapping" {
  count = var.str_domain == "" ? 0 : 1
  api_id      = aws_apigatewayv2_api.socket.id
  domain_name = aws_apigatewayv2_domain_name.socket_domain[0].domain_name
  stage       = aws_apigatewayv2_stage.socket.id
}
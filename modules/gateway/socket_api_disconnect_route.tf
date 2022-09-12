resource "aws_apigatewayv2_route" "socket_api_disconnect_route" {
  api_id    = aws_apigatewayv2_api.socket.id
  route_key = "$disconnect"

  target = "integrations/${aws_apigatewayv2_integration.socket_api_disconnect_route_integration.id}"
}

resource "aws_apigatewayv2_integration" "socket_api_disconnect_route_integration" {
  api_id = aws_apigatewayv2_api.socket.id
  integration_type = "AWS_PROXY"

  integration_method = "POST"
  integration_uri = var.str_socketDisconnect_lambda_invoke_arn
}

resource "aws_lambda_permission" "lambda_socketDisconnect_socket_disconnect_route_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.str_socketDisconnect_lambda_function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${var.str_aws_account_id}:${aws_apigatewayv2_api.socket.id}/*/${aws_apigatewayv2_route.socket_api_disconnect_route.route_key}"
}

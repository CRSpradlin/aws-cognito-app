output "str_gateway_rest_invoke_url" {
  value = aws_api_gateway_stage.rest.invoke_url
}

# TODO: May need to be built manually because of terraform Cyle error
output "str_gateway_socket_invoke_url" {
  value = "${aws_apigatewayv2_api.socket.api_endpoint}/${var.str_socket_stage_name}"
  # value = aws_apigatewayv2_stage.socket.invoke_url
}

output "str_api_cloudfront_hosted_domain_name" {
  value = var.str_domain == "" ? "No domain specified." : aws_api_gateway_domain_name.api_domain[0].cloudfront_domain_name
}
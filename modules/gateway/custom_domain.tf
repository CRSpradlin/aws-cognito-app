resource "aws_api_gateway_domain_name" "api_domain" {
  count = var.str_domain == "" ? 0 : 1
  regional_certificate_arn = var.str_app_domain_certificate_validation_arn
  domain_name     = "rest.${var.str_domain}"

  endpoint_configuration {
    types = ["REGIONAL"]
  }  
}

resource "aws_apigatewayv2_domain_name" "socket_domain" {
  count = var.str_domain == "" ? 0 : 1
  domain_name = "socket.${var.str_domain}"

  domain_name_configuration {
    certificate_arn = var.str_app_domain_certificate_validation_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}
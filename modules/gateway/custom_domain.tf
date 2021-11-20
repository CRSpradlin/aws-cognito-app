resource "aws_api_gateway_domain_name" "api_domain" {
  count = var.str_domain == "" ? 0 : 1
  certificate_arn = var.str_app_domain_certificate_validation_arn
  domain_name     = var.str_domain  
}
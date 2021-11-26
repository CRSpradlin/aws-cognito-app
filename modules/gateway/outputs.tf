output "str_gateway_rest_invoke_url" {
  value = aws_api_gateway_stage.rest.invoke_url
}
output "str_api_cloudfront_hosted_domain_name" {
  value = var.str_domain == "" ? "No domain specified." : aws_api_gateway_domain_name.api_domain[0].cloudfront_domain_name
}
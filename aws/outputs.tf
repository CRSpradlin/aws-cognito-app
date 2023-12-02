output "AWS_REST_API_INVOKE_URL" {
  value = module.app.str_gateway_rest_invoke_url
  description = "Default API URL used to invoke the API Resources, should be used unless you have configured your own custom domain."
}

output "AWS_SOCKET_API_INVOKE_URL" {
  value = module.app.str_gateway_socket_invoke_url
  description = "Default API URL used to invoke the Socket API Resources."
}
output "CLOUDFRONT_API_DOMAIN_VALUE" {
  value = module.app.str_api_cloudfront_hosted_domain_name
  description = "This should be the domain your custom specified domain should route to."
}

output "CLOUDFRONT_SOCKET_DOMAIN_VALUE" {
  value = module.app.str_socket_cloudfront_hosted_domain_name
  description = "This should be the domain your custom specified domain should route to."
}
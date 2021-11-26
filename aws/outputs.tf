output "AWS_API_INVOKE_URL" {
  value = module.app.str_gateway_rest_invoke_url
  description = "Default API URL used to invoke the API Resources, should be used unless you have configured your own custom domain."
}
output "CLOUDFRONT_DOMAIN" {
  value = module.app.str_api_cloudfront_hosted_domain_name
  description = "This should be the domain your custom specified domain should route to."
}
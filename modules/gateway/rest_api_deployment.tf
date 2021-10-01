resource "aws_api_gateway_deployment" "api" {
  rest_api_id = aws_api_gateway_rest_api.api.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.api.body))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_api_gateway_method.method_post_user_register,
    aws_api_gateway_integration.lambda_registerUser_method_post_user_register_integration,
    aws_api_gateway_method.method_post_user_login,
    aws_api_gateway_integration.lambda_signInUser_method_post_user_login_integration,
    aws_api_gateway_method.method_post_user_confirm,
    aws_api_gateway_integration.lambda_confirmUser_method_post_user_confirm_integration,
  ]
}

resource "aws_api_gateway_stage" "api" {
  deployment_id = aws_api_gateway_deployment.api.id
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = "api"
}

resource "aws_api_gateway_base_path_mapping" "api_domain_mapping" {
  count = var.str_domain == "" ? 0 : 1
  api_id      = aws_api_gateway_rest_api.api.id
  stage_name  = aws_api_gateway_stage.api.stage_name
  domain_name = aws_api_gateway_domain_name.api_domain[0].domain_name
}
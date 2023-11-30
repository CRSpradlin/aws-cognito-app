resource "aws_api_gateway_deployment" "rest" {
  rest_api_id = aws_api_gateway_rest_api.rest.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.rest.body))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_api_gateway_rest_api.rest,
    aws_api_gateway_request_validator.rest_request_validator,
    aws_api_gateway_method.method_post_user_register,
    aws_api_gateway_integration.lambda_registerUser_method_post_user_register_integration,
    module.resource_user_register_cors,
    aws_api_gateway_method.method_post_user_login,
    aws_api_gateway_integration.lambda_signInUser_method_post_user_login_integration,
    module.resource_user_login_cors,
    aws_api_gateway_method.method_post_user_confirm,
    aws_api_gateway_integration.lambda_confirmUser_method_post_user_confirm_integration,
    module.resource_user_confirm_cors,
    aws_api_gateway_method.method_post_conversation_create,
    aws_api_gateway_integration.lambda_createConversation_method_post_conversation_create_integration,
    module.resource_conversation_create_cors,
    aws_api_gateway_method.method_post_message,
    module.resource_message_cors,
    aws_api_gateway_integration.lambda_sendMessage_method_post_message_create_integration,
    aws_api_gateway_integration.lambda_getMessages_method_post_message_integration,
    module.resource_message_create_cors
  ]
}

resource "aws_api_gateway_stage" "rest" {
  deployment_id = aws_api_gateway_deployment.rest.id
  rest_api_id   = aws_api_gateway_rest_api.rest.id
  stage_name    = "rest"
}

resource "aws_api_gateway_base_path_mapping" "rest_domain_mapping" {
  count = var.str_domain == "" ? 0 : 1
  api_id      = aws_api_gateway_rest_api.rest.id
  stage_name  = aws_api_gateway_stage.rest.stage_name
  domain_name = aws_api_gateway_domain_name.api_domain[0].domain_name
}
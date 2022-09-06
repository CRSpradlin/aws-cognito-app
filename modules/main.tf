module "certificates" {
  source = "./certificates"

  str_domain = var.str_domain
}

module "cognito" {
    source = "./cognito"
    depends_on = [
      module.certificates
    ]

    str_app_name = var.str_app_name
}

module "dynamo" {
    source = "./dynamo"

    int_dynamo_write_capacity = var.int_dynamo_write_capacity
    int_dynamo_read_capacity = var.int_dynamo_read_capacity
}

module "gateway" {
    source = "./gateway"

    str_aws_account_id = var.str_aws_account_id
    str_app_name = var.str_app_name

    str_domain = var.str_domain

    str_app_domain_certificate_validation_arn = module.certificates.str_app_domain_certificate_validation_arn

    str_cognito_user_pool_arn = module.cognito.str_cognito_user_pool_arn
    // TODO: Might need to remove
    str_cognito_user_pool_endpoint = module.cognito.str_cognito_user_pool_endpoint

    str_socketAuthroizer_lambda_invoke_arn = module.lambda.str_socketAuthroizer_lambda_invoke_arn
    str_socketAuthroizer_lambda_function_name = module.lambda.str_socketAuthroizer_lambda_function_name

    str_registerUser_lambda_invoke_arn = module.lambda.str_registerUser_lambda_invoke_arn
    str_registerUser_lambda_function_name = module.lambda.str_registerUser_lambda_function_name

    str_confirmUser_lambda_invoke_arn = module.lambda.str_confirmUser_lambda_invoke_arn
    str_confirmUser_lambda_function_name = module.lambda.str_confirmUser_lambda_function_name

    str_signInUser_lambda_invoke_arn = module.lambda.str_signInUser_lambda_invoke_arn
    str_signInUser_lambda_function_name = module.lambda.str_signInUser_lambda_function_name

    str_createConversation_lambda_invoke_arn = module.lambda.str_createConversation_lambda_invoke_arn
    str_createConversation_lambda_function_name = module.lambda.str_createConversation_lambda_function_name

    str_sendMessage_lambda_invoke_arn = module.lambda.str_sendMessage_lambda_invoke_arn
    str_sendMessage_lambda_function_name = module.lambda.str_sendMessage_lambda_function_name

    str_getMessages_lambda_invoke_arn = module.lambda.str_getMessages_lambda_invoke_arn
    str_getMessages_lambda_function_name = module.lambda.str_getMessages_lambda_function_name
}

module "iam" {
    source = "./iam"

    str_app_name = var.str_app_name
}

module "lambda" { 
    source = "./lambda"

    str_app_name = var.str_app_name
    str_cognito_app_client_id = module.cognito.str_cognito_app_client_id
    str_gateway_socket_invoke_url = module.gateway.str_gateway_socket_invoke_url

    str_services_lambda_layer_arn = module.services.str_services_lambda_layer_arn
    str_modules_lambda_layer_arn = module.services.str_modules_lambda_layer_arn

    str_iam_basic_lambda_role_arn = module.iam.str_iam_basic_lambda_role_arn
}

module "services" { 
    source = "./services"

    str_app_name = var.str_app_name
}

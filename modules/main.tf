module "cognito" {
    source = "./cognito"

    str_app_name = var.str_app_name
}

module "gateway" {
    source = "./gateway"

    str_aws_account_id = var.str_aws_account_id
    str_app_name = var.str_app_name

    str_registerUser_lambda_invoke_arn = module.lambda.str_registerUser_lambda_invoke_arn
    str_registerUser_lambda_function_name = module.lambda.str_registerUser_lambda_function_name
}

module "iam" {
    source = "./iam"

    str_app_name = var.str_app_name
}

module "lambda" { 
    source = "./lambda"

    str_app_name = var.str_app_name
    str_cognito_app_client_id = module.cognito.str_cognito_app_client_id

    str_services_lambda_layer_arn = module.services.str_services_lambda_layer_arn

    str_iam_basic_lambda_role_arn = module.iam.str_iam_basic_lambda_role_arn
}

module "services" { 
    source = "./services"

    str_app_name = var.str_app_name
}

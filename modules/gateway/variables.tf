variable "str_aws_account_id" {}
variable "str_app_name" {}

variable "str_domain" {}

variable "str_app_domain_certificate_validation_arn" {}

variable "str_cognito_user_pool_arn" {}
// TODO: Might need to remove
variable "str_cognito_user_pool_endpoint" {}

variable "str_socketAuthroizer_lambda_invoke_arn" {}
variable "str_socketAuthroizer_lambda_function_name" {}

variable "str_registerUser_lambda_invoke_arn" {}
variable "str_registerUser_lambda_function_name" {}

variable "str_confirmUser_lambda_invoke_arn" {}
variable "str_confirmUser_lambda_function_name" {}

variable "str_signInUser_lambda_invoke_arn" {}
variable "str_signInUser_lambda_function_name" {}

variable "str_createConversation_lambda_invoke_arn" {}
variable "str_createConversation_lambda_function_name" {}

variable "str_sendMessage_lambda_invoke_arn" {}
variable "str_sendMessage_lambda_function_name" {}

variable "str_getMessages_lambda_invoke_arn" {}
variable "str_getMessages_lambda_function_name" {}

// Module Independent Variables
variable "str_socket_stage_name" {
    default = "socket"
}
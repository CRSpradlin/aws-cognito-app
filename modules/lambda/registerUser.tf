resource "aws_lambda_function" "registerUser" {
  filename = "../release/registerUser.zip"
  function_name = "registerUser"
  role = var.str_iam_basic_lambda_role_arn
  handler = "registerUser.handler"

  layers = [ var.str_services_lambda_layer_arn ]

  runtime = "nodejs14.x"
  timeout = 300

  environment {
    variables = local.map_lambda_env_variables
  }
}
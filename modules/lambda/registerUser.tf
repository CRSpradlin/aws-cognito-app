resource "aws_lambda_function" "registerUser" {
  filename = "${path.module}/archive/registerUser.zip"
  source_code_hash = data.archive_file.registerUser.output_base64sha256

  function_name = "registerUser"
  role = var.str_iam_basic_lambda_role_arn
  handler = "registerUser.handler"

  layers = [ 
    var.str_services_lambda_layer_arn,
    var.str_modules_lambda_layer_arn 
  ]

  runtime = "nodejs14.x"
  timeout = 300

  environment {
    variables = local.map_lambda_env_variables
  }

  depends_on = [
    data.archive_file.registerUser
  ]
}

data "archive_file" "registerUser" {
  type        = "zip"
  source_file = "${path.module}/../../temp/registerUser.js"
  output_path = "${path.module}/archive/registerUser.zip"
}

module "registerUser_logging_module" {
  source = "./lambda_logging_module"

  depends_on = [
    aws_lambda_function.registerUser
  ]

  str_region = var.str_region
  str_emailToSupport_lambda_name = aws_lambda_function.emailToSupport.function_name
  str_emailToSupport_lambda_arn = aws_lambda_function.emailToSupport.arn
  str_lambda_name = "registerUser"
  str_support_email = var.str_support_email
}
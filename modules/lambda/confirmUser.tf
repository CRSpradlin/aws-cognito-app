resource "aws_lambda_function" "confirmUser" {
  filename = "${path.module}/archive/confirmUser.zip"
  source_code_hash = data.archive_file.confirmUser.output_base64sha256

  function_name = "confirmUser"
  role = var.str_iam_basic_lambda_role_arn
  handler = "confirmUser.handler"

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
    data.archive_file.confirmUser
  ]
}

data "archive_file" "confirmUser" {
  type        = "zip"
  source_file = "${path.module}/../../temp/confirmUser.js"
  output_path = "${path.module}/archive/confirmUser.zip"
}

module "confirmUser_logging_module" {
  source = "./lambda_logging_module"

  depends_on = [
    aws_lambda_function.confirmUser
  ]

  str_region = var.str_region
  str_emailToSupport_lambda_name = aws_lambda_function.emailToSupport.function_name
  str_emailToSupport_lambda_arn = aws_lambda_function.emailToSupport.arn
  str_lambda_name = "confirmUser"
  str_support_email = var.str_support_email
}
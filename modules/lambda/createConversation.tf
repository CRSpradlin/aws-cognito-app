resource "aws_lambda_function" "createConversation" {
  filename = "${path.module}/archive/createConversation.zip"
  source_code_hash = data.archive_file.createConversation.output_base64sha256

  function_name = "createConversation"
  role = var.str_iam_basic_lambda_role_arn
  handler = "createConversation.handler"

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
    data.archive_file.createConversation
  ]
}

data "archive_file" "createConversation" {
  type        = "zip"
  source_file = "${path.module}/../../temp/createConversation.js"
  output_path = "${path.module}/archive/createConversation.zip"
}

module "createConversation_logging_module" {
  source = "./lambda_logging_module"

  depends_on = [
    aws_lambda_function.createConversation
  ]

  str_region = var.str_region
  str_emailToSupport_lambda_name = aws_lambda_function.emailToSupport.function_name
  str_emailToSupport_lambda_arn = aws_lambda_function.emailToSupport.arn
  str_lambda_name = "createConversation"
  str_support_email = var.str_support_email
}
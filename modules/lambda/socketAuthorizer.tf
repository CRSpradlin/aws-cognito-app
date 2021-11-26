resource "aws_lambda_function" "socketAuthorizer" {
  filename = "${path.module}/archive/socketAuthorizer.zip"
  source_code_hash = data.archive_file.socketAuthorizer.output_base64sha256

  function_name = "socketAuthorizer"
  role = var.str_iam_basic_lambda_role_arn
  handler = "socketAuthorizer.handler"

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
    data.archive_file.socketAuthorizer
  ]
}

data "archive_file" "socketAuthorizer" {
  type        = "zip"
  source_file = "${path.module}/../../temp/socketAuthorizer.js"
  output_path = "${path.module}/archive/socketAuthorizer.zip"
}
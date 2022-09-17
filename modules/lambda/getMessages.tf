resource "aws_lambda_function" "getMessages" {
  filename = "${path.module}/archive/getMessages.zip"
  source_code_hash = data.archive_file.getMessages.output_base64sha256

  function_name = "getMessages"
  role = var.str_iam_basic_lambda_role_arn
  handler = "getMessages.handler"

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
    data.archive_file.getMessages
  ]
}

data "archive_file" "getMessages" {
  type        = "zip"
  source_file = "${path.module}/../../temp/getMessages.js"
  output_path = "${path.module}/archive/getMessages.zip"
}

resource "aws_cloudwatch_log_group" "getMessages" {
  name = "/aws/lambda/getMessages"
}
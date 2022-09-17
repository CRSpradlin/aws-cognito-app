resource "aws_lambda_function" "socketDisconnect" {
  filename = "${path.module}/archive/socketDisconnect.zip"
  source_code_hash = data.archive_file.socketDisconnect.output_base64sha256

  function_name = "socketDisconnect"
  role = var.str_iam_basic_lambda_role_arn
  handler = "socketDisconnect.handler"

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
    data.archive_file.socketDisconnect
  ]
}

data "archive_file" "socketDisconnect" {
  type        = "zip"
  source_file = "${path.module}/../../temp/socketDisconnect.js"
  output_path = "${path.module}/archive/socketDisconnect.zip"
}

resource "aws_cloudwatch_log_group" "socketDisconnect" {
  name = "/aws/lambda/socketDisconnect"
}
resource "aws_lambda_function" "signInUser" {
  filename = "${path.module}/archive/signInUser.zip"
  source_code_hash = data.archive_file.signInUser.output_base64sha256

  function_name = "signInUser"
  role = var.str_iam_basic_lambda_role_arn
  handler = "signInUser.handler"

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
    data.archive_file.signInUser
  ]
}

data "archive_file" "signInUser" {
  type        = "zip"
  source_file = "${path.module}/../../temp/signInUser.js"
  output_path = "${path.module}/archive/signInUser.zip"
}

resource "aws_cloudwatch_log_group" "singInUser" {
  name = "/aws/lambda/signInUser"
}
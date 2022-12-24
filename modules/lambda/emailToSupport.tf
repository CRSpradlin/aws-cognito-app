resource "aws_lambda_function" "emailToSupport" {
  filename = "${path.module}/archive/emailToSupport.zip"
  source_code_hash = data.archive_file.emailToSupport.output_base64sha256

  function_name = "emailToSupport"
  role = var.str_iam_basic_lambda_role_arn
  handler = "emailToSupport.handler"

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
    data.archive_file.emailToSupport
  ]
}

data "archive_file" "emailToSupport" {
  type        = "zip"
  source_file = "${path.module}/../../temp/emailToSupport.js"
  output_path = "${path.module}/archive/emailToSupport.zip"
}

# Only has cloudwatch group and not logging module due to recursive calling potential
resource "aws_cloudwatch_log_group" "emailToSupport" {
  name = "/aws/lambda/emailToSupport"
}
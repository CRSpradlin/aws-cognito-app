resource "aws_lambda_layer_version" "services" {
  filename   = "../release/opt.zip"
  layer_name = "${var.str_app_name}_services_layer"

  compatible_runtimes = ["nodejs14.x"]
}
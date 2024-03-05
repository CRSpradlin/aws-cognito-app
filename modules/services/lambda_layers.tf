resource "aws_lambda_layer_version" "modules" {
  filename   = "${path.module}/archive/modules.zip"
  layer_name = "${var.str_app_name}_modules_layer"

  source_code_hash = data.archive_file.modules.output_base64sha256

  compatible_runtimes = ["nodejs14.x"]
}

data "archive_file" "modules" {
  type        = "zip"
  source_dir = "${path.module}/modules"
  output_path = "${path.module}/archive/modules.zip"
}

resource "aws_lambda_layer_version" "services" {
  filename   = "${path.module}/archive/opt.zip"
  layer_name = "${var.str_app_name}_services_layer"

  source_code_hash = data.archive_file.services.output_base64sha256

  compatible_runtimes = ["nodejs14.x"]
}

# data "archive_file" "services" {
#   type        = "zip"
#   source_file = "${path.module}/../../temp/opt/*.js"
#   output_path = "${path.module}/archive/opt.zip"
# }

locals {
  service_files = [
    "${path.module}/code/cognitoService.js", 
    "${path.module}/code/dynamoService.js",
    "${path.module}/code/userUtils.js",
    "${path.module}/code/convoUtils.js",
    "${path.module}/code/createAPIResponse.js",
    "${path.module}/code/errorRepository.js",
    "${path.module}/code/socketUtils.js",
    "${path.module}/code/sesUtils.js",
    "${path.module}/code/statesUtils.js"
  ]
}

data "template_file" "service_files" {
  count = "${length(local.service_files)}"
  template = "${file(element(local.service_files, count.index))}"
}


data "archive_file" "services" {
  type        = "zip"
  output_path = "${path.module}/archive/opt.zip"

  source {
    filename = "${basename(local.service_files[0])}"
    content  = "${data.template_file.service_files.0.rendered}"
  }

  source {
    filename = "${basename(local.service_files[1])}"
    content  = "${data.template_file.service_files.1.rendered}"
  }

  source {
    filename = "${basename(local.service_files[2])}"
    content  = "${data.template_file.service_files.2.rendered}"
  }

  source {
    filename = "${basename(local.service_files[3])}"
    content  = "${data.template_file.service_files.3.rendered}"
  }

  source {
    filename = "${basename(local.service_files[4])}"
    content  = "${data.template_file.service_files.4.rendered}"
  }

  source {
    filename = "${basename(local.service_files[5])}"
    content  = "${data.template_file.service_files.5.rendered}"
  }

  source {
    filename = "${basename(local.service_files[6])}"
    content = "${data.template_file.service_files.6.rendered}"
  }

  source {
    filename = "${basename(local.service_files[7])}"
    content = "${data.template_file.service_files.7.rendered}"
  }

  source {
    filename = "${basename(local.service_files[8])}"
    content = "${data.template_file.service_files.8.rendered}"
  }
}
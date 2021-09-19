data "template_file" "basic_lambda_role" {
  template = file("${path.module}/policies/basic_lambda_role.json")
}
resource "aws_iam_policy" "iam_basic_lambda_policy" {
  name = "${var.str_app_name}_basic_lambda_policy"
  policy = "${data.template_file.basic_lambda_role.rendered}"
}
resource "aws_iam_role" "iam_basic_lambda_role" {
  name = "${var.str_app_name}_basic_lambda_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      },
    ]
  })
  managed_policy_arns = [aws_iam_policy.iam_basic_lambda_policy.arn]
}
output "str_iam_basic_lambda_role_arn" {
  value = aws_iam_role.iam_basic_lambda_role.arn
}
data "template_file" "basic_states_role" {
  template = file("${path.module}/policies/basic_states_role.json")
}
resource "aws_iam_policy" "iam_basic_states_policy" {
  name = "${var.str_app_name}_basic_states_policy"
  policy = "${data.template_file.basic_states_role.rendered}"
}
resource "aws_iam_role" "iam_basic_states_role" {
  name = "${var.str_app_name}_basic_states_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "states.amazonaws.com"
        }
      },
    ]
  })
  managed_policy_arns = [aws_iam_policy.iam_basic_states_policy.arn]
}
output "str_iam_basic_states_role_arn" {
  value = aws_iam_role.iam_basic_states_role.arn
}
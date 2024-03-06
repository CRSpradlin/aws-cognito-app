resource "aws_sfn_state_machine" "user_confirmation" {
    name = "UserConfirmation"

    definition = templatefile("${path.module}/definitions/userConfirmation.json", { str_confirmUser_lambda_arn = var.str_confirmUser_lambda_arn })
    role_arn = var.str_iam_basic_states_role_arn
}
data "template_file" "user_confirmation" {
    template = "${file("${path.module}/definitions/userConfirmation.json")}"
}

resource "aws_sfn_state_machine" "user_confirmation" {
    name = "UserConfirmation"

    definition = data.template_file.user_confirmation.rendered
    role_arn = var.str_iam_basic_states_role_arn
}
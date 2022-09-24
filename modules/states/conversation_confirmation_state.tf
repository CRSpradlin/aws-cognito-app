data "template_file" "conversation_confirmation" {
    template = "${file("${path.module}/definitions/conversationConfirmation.json")}"
}

resource "aws_sfn_state_machine" "conversation_confirmation" {
    name = "ConversationConfirmation"

    definition = data.template_file.conversation_confirmation.rendered
    role_arn = var.str_iam_basic_states_role_arn
}
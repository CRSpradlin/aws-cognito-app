resource "aws_ses_email_identity" "app_support" {
    count = var.str_support_email == "" ? 0 : 1

    email = var.str_support_email
}
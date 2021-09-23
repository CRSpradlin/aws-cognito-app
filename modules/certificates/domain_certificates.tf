resource "aws_acm_certificate" "app_domain_certificate" {
    count = var.str_domain == "" ? 0 : 1

    domain_name       = var.str_domain
    validation_method = "DNS"
}

resource "aws_acm_certificate_validation" "app_domain_certificate_validation" {
    count = var.str_domain == "" ? 0 : 1
    certificate_arn = aws_acm_certificate.app_domain_certificate[0].arn
}
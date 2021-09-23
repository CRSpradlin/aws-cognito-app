output "str_app_domain_certificate_validation_arn" {
    value = var.str_domain == "" ? "" : aws_acm_certificate_validation.app_domain_certificate_validation[0].certificate_arn
    depends_on = [
      aws_acm_certificate.app_domain_certificate[0]
    ]
}
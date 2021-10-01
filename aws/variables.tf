# Required Variables
variable "str_app_name" {
    description = "Name of the Application"
    type = string
}

variable "str_aws_account_id" {
    description = "AWS Account ID"
    type = string
}

# Optional Variables
variable "str_domain" {
    description = "Optional Domain to hook into API Gateway, Provide an Empty String if you do not have a Domain"
    type = string
}
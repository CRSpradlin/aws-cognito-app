# Required Variables
variable "str_app_name" {
    description = "Name of the Application"
    default = "CongitoWebApplication"
    type = string
}

variable "str_aws_account_id" {
    description = "AWS Account ID"
    type = string
}

variable "str_region" {
  description = "Region for AWS resources to be built in"
  default = "us-east-1"
  type = string
}

variable "int_dynamo_write_capacity" {
    description = "Write Capacity for DynamoDB Table"
    default = 5
    type = number
}
variable "int_dynamo_read_capacity" {
    description = "Read Capacity for DynamoDB Table"
    default = 5
    type = number
}

# Optional Variables
variable "str_domain" {
    description = "Optional Domain to hook into API Gateway, Provide an Empty String if you do not have a Domain"
    default = ""
    type = string
}

variable "str_support_email" {
    description = "Optional Email string variable to send error reports for support purposes"
    default = ""
    type = string
}

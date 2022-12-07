# Required Variables
variable "str_app_name" {
    description = "Name of the Application"
    type = string
}

variable "str_aws_account_id" {
    description = "AWS Account ID"
    type = string
}

variable "str_region" {
  description = "Region for AWS resources to be built in"
  type = string
}

variable "int_dynamo_write_capacity" {
    description = "Write Capacity for DynamoDB Table"
    type = number
}
variable "int_dynamo_read_capacity" {
    description = "Read Capacity for DynamoDB Table"
    type = number
}

# Optional Variables
variable "str_domain" {
    description = "Optional Domain to hook into API Gateway, Provide an Empty String if you do not have a Domain"
    type = string
}

variable "str_support_email" {
    description = "Optional Email string variable to send error reports for support purposes"
    type = string
}

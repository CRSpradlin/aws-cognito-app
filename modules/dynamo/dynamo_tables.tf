resource "aws_dynamodb_table" "api_user_table" {
  name           = "UserData"
  billing_mode   = "PROVISIONED"
  read_capacity  = var.int_dynamo_read_capacity
  write_capacity = var.int_dynamo_write_capacity
  hash_key       = "profile"

  attribute {
    name = "profile"
    type = "S"
  }
}

resource "aws_dynamodb_table" "api_conversations_table" {
  name           = "ConversationsData"
  billing_mode   = "PROVISIONED"
  read_capacity  = var.int_dynamo_read_capacity
  write_capacity = var.int_dynamo_write_capacity
  hash_key       = "profile"

  attribute {
    name = "id"
    type = "S"
  }
}
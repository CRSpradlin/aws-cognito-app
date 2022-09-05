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

resource "aws_dynamodb_table" "api_conversation_table" {
  name           = "ConversationData"
  billing_mode   = "PROVISIONED"
  read_capacity  = var.int_dynamo_read_capacity
  write_capacity = var.int_dynamo_write_capacity
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "api_message_table" {
  name           = "MessageData"
  billing_mode   = "PROVISIONED"
  read_capacity  = var.int_dynamo_read_capacity
  write_capacity = var.int_dynamo_write_capacity
  hash_key       = "conversationId"
  range_key       = "sentDate"

  attribute {
    name = "conversationId"
    type = "S"
  }

  attribute {
    name = "sentDate"
    type = "N"
  }
}
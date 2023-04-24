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

  attribute {
    name = "name"
    type = "S"
  }

  global_secondary_index {
    name               = "UserNameIndex"
    hash_key           = "name"
    read_capacity      = var.int_dynamo_read_capacity
    write_capacity     = var.int_dynamo_write_capacity
    projection_type    = "ALL"
  }
}

resource "aws_dynamodb_table" "api_conversation_table" {
  name           = "ConversationData"
  billing_mode   = "PROVISIONED"
  read_capacity  = var.int_dynamo_read_capacity
  write_capacity = var.int_dynamo_write_capacity
  hash_key       = "id"
  range_key      = "createdDate"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "createdDate"
    type = "N"
  }

  global_secondary_index {
    name               = "CreatedDateIndex"
    hash_key           = "createdDate"
    read_capacity      = var.int_dynamo_read_capacity
    write_capacity     = var.int_dynamo_write_capacity
    projection_type    = "ALL"
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

resource "aws_dynamodb_table" "api_socket_table" {
  name           = "SocketData"
  billing_mode   = "PROVISIONED"
  read_capacity  = var.int_dynamo_read_capacity
  write_capacity = var.int_dynamo_write_capacity
  hash_key       = "connectionId"
  # non_key_attributes = ["userProfile"]

  attribute {
    name = "connectionId"
    type = "S"
  }

  attribute {
    name = "userProfile"
    type = "S"
  }

  global_secondary_index {
    name               = "ProfileIndex"
    hash_key           = "userProfile"
    read_capacity      = var.int_dynamo_read_capacity
    write_capacity     = var.int_dynamo_write_capacity
    projection_type    = "ALL"
  }
}
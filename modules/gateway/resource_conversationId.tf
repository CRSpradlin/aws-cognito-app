resource "aws_api_gateway_resource" "resource_conversationId" {
  path_part   = "{conversationId}"
  parent_id   = aws_api_gateway_resource.resource_conversation.id
  rest_api_id = aws_api_gateway_rest_api.rest.id
}
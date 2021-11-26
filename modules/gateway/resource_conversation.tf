resource "aws_api_gateway_resource" "resource_conversation" {
  path_part   = "conversation"
  parent_id   = aws_api_gateway_rest_api.rest.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.rest.id
}
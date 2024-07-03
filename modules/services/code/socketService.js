const { ApiGatewayManagementApi } = require('@aws-sdk/client-apigatewaymanagementapi');
const api = new ApiGatewayManagementApi({
    endpoint: process.env.APP_SOCKET_API_ENDPOINT.substring(6)
});

const self = module.exports;

self.sendMessage = async (message, connectionId) => {
    const params = {
        ConnectionId: connectionId,
        Data: JSON.stringify({newMessage: message})
    };

    const response = await api.postToConnection(params);

    return response;
}
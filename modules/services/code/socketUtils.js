const AWS = require('aws-sdk');
const api = new AWS.ApiGatewayManagementApi({
    endpoint: process.env.APP_SOCKET_API_ENDPOINT.substring(6)
});

const self = module.exports;

self.sendMessage = async (message, connectionId) => {
    const params = {
        ConnectionId: connectionId,
        Data: JSON.stringify(message)
    };

    const response = await api.postToConnection(params).promise();

    return response;
}

const socketService = require('./socketService');

const mockResponse = 'mockResponse'

const mockAPIPostToConnectionResponse = jest.fn().mockResolvedValue(mockResponse);

jest.mock('@aws-sdk/client-apigatewaymanagementapi', () => {

    class MockApiGatewayManagementApi {
        constructor() {}

        postToConnection = async (params) => {return mockAPIPostToConnectionResponse(params)}
    }

    process.env.APP_SOCKET_API_ENDPOINT = '1234567endpoint';
    return {
        ApiGatewayManagementApi: MockApiGatewayManagementApi
    };
});

describe('Test dynamoService', () => {
    beforeEach(() => {
    })

    test('Test sendMessage call', async () => {
        const message = 'mockMessage';
        const connectionId = 'mockConnectionId';

        const response = await socketService.sendMessage(message, connectionId);

        expect(response).toEqual('mockResponse');
    });
});


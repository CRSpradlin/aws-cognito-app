
const AWS = require('aws-sdk');
const socketUtils = require('./socketUtils');

const mockResponse = 'mockResponse'

const mockAPIPostToConnectionResponse = jest.fn().mockResolvedValue(mockResponse);

jest.mock('aws-sdk', () => {
    process.env.APP_SOCKET_API_ENDPOINT = '1234567endpoint';
    return {
        ApiGatewayManagementApi: jest.fn(() => {
            return {
                postToConnection: jest.fn((params) => {
                    return {
                        promise: async () => {return mockAPIPostToConnectionResponse(params)}
                    };
                }),
            };
        }),
    };
});

describe('Test dynamoService', () => {
    beforeEach(() => {
        AWS // Needed for eslint usage
    })

    test('Test sendMessage call', async () => {
        const message = 'mockMessage';
        const connectionId = 'mockConnectionId';

        const response = await socketUtils.sendMessage(message, connectionId);

        expect(response).toEqual('mockResponse');
    });
});


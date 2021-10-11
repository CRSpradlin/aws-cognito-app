
const AWS = require('aws-sdk');
const dynamoService = require('./dynamoService');

const mockResponse = 'mockResponse'

const mockDynamoDBResponse = jest.fn().mockResolvedValue(mockResponse);
const mockDynamoGetResponse = {Item: 'item'}

jest.mock('aws-sdk', () => {
    return {
        DynamoDB: {
            DocumentClient: jest.fn(() => {
                return {
                    put: jest.fn((params) => {
                        return {
                            promise: async () => {return mockDynamoDBResponse(params)}
                        };
                    }),
                    get: jest.fn((params) => {
                        return {
                            promise: async () => {return mockDynamoGetResponse || params}
                        };
                    }),
                };
            }),
        }
    };
});

describe('Test dynamoService', () => {
    beforeEach(() => {
        AWS // Needed for eslint usage
    })

    test('Test get call', async () => {
        const mockTableName = 'tableName';
        const mockKey = {key: 'value'};

        const response = await dynamoService.get(mockTableName, mockKey);

        expect(response).toEqual('item');
    });

    test('Test put call', async () => {
        const mockTableName = 'tableName';
        const mockItem = {key: 'value'};

        const response = await dynamoService.put(mockTableName, mockItem);

        expect(response).toEqual(mockResponse);
    });
});


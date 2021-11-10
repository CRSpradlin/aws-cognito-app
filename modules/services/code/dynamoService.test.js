
const AWS = require('aws-sdk');
const dynamoService = require('./dynamoService');

const mockResponse = 'mockResponse'

const mockDynamoDBResponse = jest.fn().mockResolvedValue(mockResponse);
const mockDynamoGetResponse = {Item: 'item'}
const mockDynamoUpdateResponse = (params) => { return params; };

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
                    update: jest.fn((params) => {
                        return {
                            promise: async () => {return mockDynamoUpdateResponse(params)}
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

    test('Test update call without additionalConfig', async () => {
        const mockTableName = 'tableName';
        const mockItem = {key: 'value'};
        const updateExpression = 'mockUpdateExpression';

        const response = await dynamoService.update(mockTableName, mockItem, updateExpression);

        const expectedResponse = {
            TableName: 'tableName',
            Key: {key: 'value'},
            UpdateExpression: 'mockUpdateExpression',
            ReturnValues: 'UPDATED_NEW'
        }
        expect(response).toEqual(expectedResponse);
    });
    
    test('Test update call with additionalConfig', async () => {
        const mockTableName = 'tableName';
        const mockItem = {key: 'value'};
        const updateExpression = 'mockUpdateExpression';
        const additionalConfig = {
            key1: 'value1'
        };

        const response = await dynamoService.update(mockTableName, mockItem, updateExpression, additionalConfig);

        const expectedResponse = {
            TableName: 'tableName',
            Key: {key: 'value'},
            UpdateExpression: 'mockUpdateExpression',
            ReturnValues: 'UPDATED_NEW',
            key1: 'value1'
        }
        expect(response).toEqual(expectedResponse);
    });
});


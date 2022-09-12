
const AWS = require('aws-sdk');
const dynamoService = require('./dynamoService');

const mockResponse = 'mockResponse'

const mockDynamoPutResponse = jest.fn().mockResolvedValue(mockResponse);
const mockDynamoGetResponse = jest.fn().mockResolvedValue({Item: 'item'});
const mockDynamoUpdateResponse = jest.fn().mockResolvedValue(mockResponse);
const mockDynamoQueryResponse = jest.fn().mockResolvedValue({Items: ['item1', 'item2']});
const mockDynamoDeleteResponse = jest.fn().mockResolvedValue(mockResponse);

jest.mock('aws-sdk', () => {
    return {
        DynamoDB: {
            DocumentClient: jest.fn(() => {
                return {
                    put: jest.fn((params) => {
                        return {
                            promise: async () => {return mockDynamoPutResponse(params)}
                        };
                    }),
                    get: jest.fn((params) => {
                        return {
                            promise: async () => {return mockDynamoGetResponse(params)}
                        };
                    }),
                    update: jest.fn((params) => {
                        return {
                            promise: async () => {return mockDynamoUpdateResponse(params)}
                        };
                    }),
                    query: jest.fn((params) => {
                        return {
                            promise: async () => {return mockDynamoQueryResponse(params)}
                        };
                    }),
                    delete: jest.fn((params) => {
                        return {
                            promise: async () => {return mockDynamoDeleteResponse(params)}
                        };
                    })
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

        expect(mockDynamoGetResponse).toHaveBeenCalledWith({
            TableName: mockTableName,
            Key: mockKey
        })
        expect(response).toEqual('item');
    });

    test('Test put call', async () => {
        const mockTableName = 'tableName';
        const mockItem = {key: 'value'};

        const response = await dynamoService.put(mockTableName, mockItem);

        expect(mockDynamoPutResponse).toHaveBeenCalledWith({
            TableName: mockTableName,
            Item: mockItem
        })
        expect(response).toEqual(mockResponse);
    });

    test('Test update call without additionalConfig', async () => {
        const mockTableName = 'tableName';
        const mockItem = {key: 'value'};
        const updateExpression = 'mockUpdateExpression';

        const response = await dynamoService.update(mockTableName, mockItem, updateExpression);

        expect(mockDynamoUpdateResponse).toHaveBeenCalledWith({
            TableName: 'tableName',
            Key: {key: 'value'},
            UpdateExpression: 'mockUpdateExpression',
            ReturnValues: 'UPDATED_NEW'
        });
        expect(response).toEqual(mockResponse);
    });
    
    test('Test update call with additionalConfig', async () => {
        const mockTableName = 'tableName';
        const mockItem = {key: 'value'};
        const updateExpression = 'mockUpdateExpression';
        const additionalConfig = {
            key1: 'value1'
        };

        const response = await dynamoService.update(mockTableName, mockItem, updateExpression, additionalConfig);

        expect(mockDynamoUpdateResponse).toHaveBeenCalledWith({
            TableName: 'tableName',
            Key: {key: 'value'},
            UpdateExpression: 'mockUpdateExpression',
            ReturnValues: 'UPDATED_NEW',
            key1: 'value1'
        });
        expect(response).toEqual(mockResponse);
    });

    test('Test query call', async () => {
        const mockTableName = 'tableName';
        const keyConditionExpression = 'mockKeyConditionExpression';
        const expressionAttributeValues = 'mockExpressionAttributeValues';

        const response = await dynamoService.query(mockTableName, keyConditionExpression, expressionAttributeValues);

        expect(mockDynamoQueryResponse).toHaveBeenCalledWith({
            TableName: mockTableName,
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeValues: expressionAttributeValues
        });
        expect(response).toEqual(['item1', 'item2']);
    });

    test('Test delete call', async () => {
        const mockTableName = 'tableName';
        const mockKey = 'key';

        const response = await dynamoService.delete(mockTableName, mockKey);

        expect(response).toEqual(mockResponse);
        expect(mockDynamoDeleteResponse).toHaveBeenCalledWith({
            TableName: mockTableName,
            Key: mockKey
        });
    })

    test('Test query call with additionalConfig', async () => {
        const mockTableName = 'tableName';
        const keyConditionExpression = 'mockKeyConditionExpression';
        const expressionAttributeValues = 'mockExpressionAttributeValues';
        const additionalConfig = {
            Limit: 10
        };

        const response = await dynamoService.query(mockTableName, keyConditionExpression, expressionAttributeValues, additionalConfig);

        expect(mockDynamoQueryResponse).toHaveBeenCalledWith({
            TableName: mockTableName,
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            Limit: 10
        });
        expect(response).toEqual(['item1', 'item2']);   
    })
});


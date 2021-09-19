
const AWS = require('aws-sdk');
const cognitoService = require('./cognitoService');

const mockResponse = 'mockResponse'

const mockCognitoIdentityServiceProviderResponse = jest.fn().mockImplementation(() => {
    return mockResponse;
});

jest.mock('aws-sdk', () => {
    return {
        CognitoIdentityServiceProvider: jest.fn(() => {
            return {
                signUp: jest.fn((params) => {
                    return {
                        promise: async () => mockCognitoIdentityServiceProviderResponse()
                    };
                }),
            };
        }),
    };
});

describe('Test cognitoService', () => {
    test("Test createUser call", async () => {
        const response = await cognitoService.createUser('app-client-id', 'username', 'password', [{Name: 'attrib1', Value: 'value1'}]);
        expect(response).toEqual(mockResponse);
    });
})
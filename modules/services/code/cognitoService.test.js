
const { expect } = require('@jest/globals');
const AWS = require('aws-sdk');
const cognitoService = require('./cognitoService');

const mockResponse = 'mockResponse'

const mockCognitoIdentityServiceProviderResponse = jest.fn().mockResolvedValue(mockResponse);

jest.mock('aws-sdk', () => {
    return {
        CognitoIdentityServiceProvider: jest.fn(() => {
            return {
                signUp: jest.fn((params) => {
                    return {
                        promise: async () => mockCognitoIdentityServiceProviderResponse(params)
                    };
                }),
            };
        }),
    };
});

describe('Test cognitoService', () => {
    test("Test createUser call", async () => {
        const expectedParams = {
            ClientId: "app-client-id",
            Password: "password",
            UserAttributes: [
                { 
                    Name: "attrib1",
                    Value: "value1",
                }
            ],
            Username: "username"
        };
        const response = await cognitoService.createUser('app-client-id', 'username', 'password', [{Name: 'attrib1', Value: 'value1'}]);
        expect(response).toEqual(mockResponse);
        expect(mockCognitoIdentityServiceProviderResponse).toHaveBeenCalledWith(expectedParams);
    });
})
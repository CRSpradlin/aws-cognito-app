
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
                        promise: async () => {return mockCognitoIdentityServiceProviderResponse(params)}
                    };
                }),
            };
        }),
    };
});

describe('Test cognitoService', () => {
    beforeEach(() => {
        AWS // Needed for eslint usage
    })

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
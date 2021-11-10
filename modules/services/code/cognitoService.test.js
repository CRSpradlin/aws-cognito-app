
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
                confirmSignUp: jest.fn((params) => {
                    return {
                        promise: async () => {return mockCognitoIdentityServiceProviderResponse(params)}
                    };
                }),
                getUser: jest.fn((params) => {
                    return {
                        promise: async () => {return mockCognitoIdentityServiceProviderResponse(params)}
                    }
                }),
                initiateAuth: jest.fn((params) => {
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
        jest.clearAllMocks();
        jest.resetModules();

        process.env.APP_CLIENT_ID = 'app-client-id';
    })

    test("Test createUser call", async () => {
        const expectedParams = {
            ClientId: 'app-client-id',
            Password: 'password',
            UserAttributes: [
                { 
                    Name: 'attrib1',
                    Value: 'value1',
                }
            ],
            Username: 'username'
        };
        const response = await cognitoService.createUser('username', 'password', [{Name: 'attrib1', Value: 'value1'}]);
        expect(response).toEqual(mockResponse);
        expect(mockCognitoIdentityServiceProviderResponse).toHaveBeenCalledWith(expectedParams);
    });

    test("Test createUser call with no userAttributes", async () => {
        const expectedParams = {
            ClientId: "app-client-id",
            Password: "password",
            Username: "username"
        };
        const response = await cognitoService.createUser('username', 'password');
        expect(response).toEqual(mockResponse);
        expect(mockCognitoIdentityServiceProviderResponse).toHaveBeenCalledWith(expectedParams);
    });

    test("Test confirmUser call", async () => {
        const expectedParams = {
            ClientId: 'app-client-id',
            Username: 'username',
            ConfirmationCode: 'confirmationCode'
        };
        const response = await cognitoService.confirmUser('username', 'confirmationCode');
        expect(response).toEqual(mockResponse);
        expect(mockCognitoIdentityServiceProviderResponse).toHaveBeenCalledWith(expectedParams);
    });

    test("Test getUser call", async () => {
        const expectedParams = {
            AccessToken: 'mockToken'
        };

        const response = await cognitoService.getUser('mockToken');

        expect(response).toEqual(mockResponse);
        expect(mockCognitoIdentityServiceProviderResponse).toHaveBeenCalledWith(expectedParams);
    });

    test("Test signInUser call", async () => {
        const expectedParams = {
            ClientId: 'app-client-id',
            AuthFlow: 'USER_PASSWORD_AUTH',
            AuthParameters: {
                'USERNAME': 'username',
                'PASSWORD': 'password'
              }
        };
        const response = await cognitoService.getAuthToken('username', 'password');
        expect(response).toEqual(mockResponse);
        expect(mockCognitoIdentityServiceProviderResponse).toHaveBeenCalledWith(expectedParams);
    });

    test("Test getClaims call", async () => {
        const mockReq = {
            requestContext: {
                authorizer: {
                    claims: 'mockClaims'
                }
            }
        }

        const response = cognitoService.getClaims(mockReq);

        expect(response).toEqual('mockClaims');
    })
})
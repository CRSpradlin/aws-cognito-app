
const cognitoService = require('./cognitoService');

const mockResponse = 'mockResponse';

const mockCognitoIdentityServiceProviderResponse = jest.fn().mockResolvedValue(mockResponse);

jest.mock('@aws-sdk/client-cognito-identity-provider', () => {

    class MockCognitoIdentityProvider {
        constructor() {}
    
        signUp = async (params) => {return mockCognitoIdentityServiceProviderResponse(params)}
        confirmSignUp = async (params) => {return mockCognitoIdentityServiceProviderResponse(params)}
        getUser = async (params) => {return mockCognitoIdentityServiceProviderResponse(params)}
        initiateAuth = async (params) => {return mockCognitoIdentityServiceProviderResponse(params)}
        adminDeleteUser = async (params) => {return mockCognitoIdentityServiceProviderResponse(params)}
    }
    
    return {
        CognitoIdentityProvider: MockCognitoIdentityProvider
    };
});

describe('Test cognitoService', () => {
    beforeEach(() => {
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
    });

    test("Test removeUser call", async () => {
        process.env.APP_USER_POOL_ID = 'mockAppUserPoolId'
        const response = await cognitoService.removeUser('mockUsername');

        expect(response).toEqual('mockResponse');
        const expectedParams = {
            UserPoolId: 'mockAppUserPoolId',
            Username: 'mockUsername' 
        };
        expect(mockCognitoIdentityServiceProviderResponse).toHaveBeenCalledWith(expectedParams);
    });
})
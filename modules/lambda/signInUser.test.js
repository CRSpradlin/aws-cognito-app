
const errorRepository = require('./opt/errorRepository');
const signInUser = require('./signInUser');

const mockCognitoService = { };
const mockCreateAPIResponse = { };
const mockUserUtils = { };

let instance;
let event

describe('Test signInUser', () => {
    beforeEach(() => {
        const deps = {
            cognitoService: mockCognitoService,
            userUtils: mockUserUtils,
            createAPIResponse: mockCreateAPIResponse,
            event: event
        }

        instance = signInUser.signInUserService(deps);
    })

    test('Test handler call', async () => {
        const mockTokenResponse = {
            AuthenticationResult: {
                AccessToken: 'mockToken'
            }
        }
        instance.event = {
            body: JSON.stringify({
                username: 'mockUsername',
                password: 'mockPassword'
            })
        };
        mockCognitoService.getAuthToken = jest.fn().mockResolvedValue(mockTokenResponse);
        mockCognitoService.getUser = jest.fn().mockResolvedValue({UserAttributes: [{Name: 'sub', Value: 'mockProfile'}]});
        mockUserUtils.getUser = jest.fn().mockResolvedValue('mockUserObj');
        mockCreateAPIResponse.Ok = jest.fn().mockReturnValue('mockAPIResponse');

        const response = await instance.handler();

        expect(response).toEqual('mockAPIResponse');
        expect(mockCognitoService.getAuthToken).toHaveBeenCalledWith('mockUsername', 'mockPassword');
        expect(mockCognitoService.getUser).toHaveBeenCalledWith('mockToken');
        expect(mockCreateAPIResponse.Ok).toHaveBeenCalledWith({ 
            AuthenticationResult: {
                AccessToken: 'mockToken'
            },
            User: 'mockUserObj' 
        });
    });

    test('Test handler call with caught 1403 errorRepository error', async () => {
        process.env.APP_CLIENT_ID = 'mockAppClientId';
        instance.event = {body: JSON.stringify({})};
        const mockError = errorRepository.createError(1403, new Error());
        mockCognitoService.getAuthToken = jest.fn().mockImplementation(() => {
            throw mockError;
        });
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue('mockAPIResponseError');

        const response = await instance.handler();

        expect(response).toEqual('mockAPIResponseError');
        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(mockError);
    });

    test('Test handler call with caught 5404 errorRepository error', async () => {
        process.env.APP_CLIENT_ID = 'mockAppClientId';
        instance.event = {body: JSON.stringify({})};
        const mockError = new Error();
        mockError.code = 'UserNotFoundException';
        mockCognitoService.getAuthToken = jest.fn().mockImplementation(async () => {
            throw mockError;
        });
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue('mockAPIResponseError');

        const expectedError = errorRepository.createError(5404, mockError);

        const response = await instance.handler();

        expect(response).toEqual('mockAPIResponseError');
        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(expectedError);
    });

    test('Test handler call with caught 5504 errorRepository error', async () => {
        process.env.APP_CLIENT_ID = 'mockAppClientId';
        instance.event = {body: JSON.stringify({})};
        const mockError = new Error();
        mockError.code = 'UserNotConfirmedException';
        mockCognitoService.getAuthToken = jest.fn().mockImplementation(async () => {
            throw mockError;
        });
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue('mockAPIResponseError');

        const expectedError = errorRepository.createError(5504, mockError);

        const response = await instance.handler();

        expect(response).toEqual('mockAPIResponseError');
        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(expectedError);
    });

    test('Test handler call with caught unexpected error', async () => {
        process.env.APP_CLIENT_ID = 'mockAppClientId';
        instance.event = {body: JSON.stringify({})};
        const mockError = new Error('mockError');
        mockCognitoService.getAuthToken = jest.fn().mockImplementation(() => {
            throw mockError;
        });
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue('mockAPIResponseError');
        const expectedError = errorRepository.createError(1000, mockError);

        const response = await instance.handler();

        expect(response).toEqual('mockAPIResponseError');
        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(expectedError);
    });

    test('Test lambda handler export', async () => {
        jest.mock('/opt/cognitoService', () => { return { } }, {virtual: true});
        jest.mock('/opt/userUtils', () => { return {default: () => { return { }}} }, {virtual: true});
        jest.mock('/opt/createAPIResponse', () => { return { } }, {virtual: true});
        const mockEvent = 'mockEvent';

        const mockSignInUser = require('./signInUser');
        mockSignInUser.signInUserService = jest.fn().mockImplementation(() => {
            return {
                handler: jest.fn().mockResolvedValue('mockHandlerResponse')
            }
        });

        const response = await mockSignInUser.handler(mockEvent);

        expect(response).toEqual('mockHandlerResponse');
        expect(mockSignInUser.signInUserService).toHaveBeenCalledWith({
            cognitoService: { },
            userUtils: { },
            createAPIResponse: { },
            event: mockEvent
        })
    });
})
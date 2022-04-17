
const errorRepository = require('./opt/errorRepository');
const socketAuthorizer = require('./socketAuthorizer');

const mockUserUtils = { };
const mockCognitoService = { };
const mockCreateAPIResponse = { };

let instance;
let event

describe('Test socketAuthorizer', () => {
    beforeEach(() => {
        event = {
            headers: {},
            requestContext: {}
        }

        const deps = {
            userUtils: mockUserUtils,
            cognitoService: mockCognitoService,
            createAPIResponse: mockCreateAPIResponse,
            event: event
        }

        instance = socketAuthorizer.socketAuthorizerService(deps);
    })

    test('Test handler call without token', async () => {
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue('Error');
        mockCognitoService.getUser = jest.fn();

        const expectedError = errorRepository.createError(404);

        const response = await instance.handler();

        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(expectedError, 404);
        expect(mockCognitoService.getUser).not.toHaveBeenCalled();
        expect(response).toEqual('Error');
    });

    test('Test handler call with token', async () => {
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue('Error');
        mockCreateAPIResponse.Ok = jest.fn().mockReturnValue('Ok');
        mockCognitoService.getUser = jest.fn().mockResolvedValue('Authorized User');

        instance.token = 'mockToken';

        const response = await instance.handler();

        expect(mockCreateAPIResponse.Error).not.toHaveBeenCalled();
        expect(response).toEqual('Ok');
    });

    test('Test handler call with invalid token', async () => {
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue('Error');
        mockCreateAPIResponse.Ok = jest.fn().mockReturnValue('Ok');
        const mockError = 'UnAuthorized User';
        mockCognitoService.getUser = jest.fn().mockImplementation(() => {
            throw mockError;
        });

        const expectedError = errorRepository.createError(403, mockError);
        instance.token = 'mockInvalidToken';

        const response = await instance.handler();

        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(expectedError, 403);
        expect(response).toEqual('Error');
    });

    test('Test lambda handler export', async () => {
        jest.mock('/opt/userUtils', () => { return { } }, {virtual: true});
        jest.mock('/opt/cognitoService', () => { return { } }, {virtual: true});
        jest.mock('/opt/createAPIResponse', () => { return { } }, {virtual: true});
        const mockEvent = 'mockEvent';

        const mockSocketAuthorizer = require('./socketAuthorizer');
        mockSocketAuthorizer.socketAuthorizerService = jest.fn().mockImplementation(() => {
            return {
                handler: jest.fn().mockResolvedValue('mockHandlerResponse')
            }
        });

        const response = await mockSocketAuthorizer.handler(mockEvent);

        expect(response).toEqual('mockHandlerResponse');
        expect(mockSocketAuthorizer.socketAuthorizerService).toHaveBeenCalledWith({
            userUtils: { },
            cognitoService: { },
            createAPIResponse: { },
            event: mockEvent
        })
    });
})
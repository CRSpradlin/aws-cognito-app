
const errorRepository = require('./opt/errorRepository');
const confirmUser = require('./confirmUser');

const mockCognitoService = { };
const mockUserUtils = { };
const mockDynamoService = { };
const mockStatesUtils = { };
const mockCreateAPIResponse = { };

let instance;
let event

describe('Test confirmUser', () => {
    beforeEach(() => {
        const deps = {
            cognitoService: mockCognitoService,
            userUtils: mockUserUtils,
            dynamoService: mockDynamoService,
            statesUtils: mockStatesUtils,
            createAPIResponse: mockCreateAPIResponse,
            event: event
        }

        instance = confirmUser.confirmUserService(deps);
    })

    test('Test handler call for API Gateway request', async () => {
        instance.event = {
            body: JSON.stringify({
                profile: 'mockProfile',
                confirmation: 'mockConfirmation'
            })
        };
        mockCognitoService.confirmUser = jest.fn().mockResolvedValue('mockCognitoResponse');
        mockUserUtils.getUser = jest.fn().mockResolvedValue({name: 'mockUserName', confirmationToken: 'mockConfirmationToken'});
        mockDynamoService.update = jest.fn().mockResolvedValue(true);
        mockStatesUtils.sendTaskSuccess = jest.fn().mockResolvedValue(true);
        mockCreateAPIResponse.Ok = jest.fn().mockReturnValue('mockAPIResponse');

        const response = await instance.handler();

        expect(response).toEqual('mockAPIResponse');
        expect(mockCognitoService.confirmUser).toHaveBeenCalledWith('mockUserName', 'mockConfirmation');
        expect(mockDynamoService.update).toHaveBeenCalledWith('UserData', {profile: 'mockProfile'}, 'set #key = :value', {
            ExpressionAttributeNames: {
                '#key': 'confirmed'
            },
            ExpressionAttributeValues: {
                ':value': true
            }
        });
        expect(mockStatesUtils.sendTaskSuccess).toHaveBeenCalledWith('mockConfirmationToken');
    });

    test('Test handler call for Step Function request without task token', async () => {
        instance.event = {
            userProfile: 'mockUserProfile'
        };
        const mockRemoveUserResponse = {name: 'mockUserName', confirmationToken: 'mockConfirmationToken'};
        mockUserUtils.removeUser = jest.fn().mockResolvedValue(mockRemoveUserResponse);

        const response = await instance.handler();

        expect(response).toEqual(mockRemoveUserResponse);
        expect(mockUserUtils.removeUser).toHaveBeenCalledWith('mockUserProfile');
    });

    test('Test handler call for Step Function request with task token', async () => {
        instance.event = {
            userProfile: 'mockUserProfile',
            taskToken: 'mockTaskToken'
        };
        const expectedAdditionalConfig = {
            ExpressionAttributeNames: {
                '#key': 'confirmationToken'
            },
            ExpressionAttributeValues: {
                ':value': 'mockTaskToken'
            }
        };

        const mockDynamoServiceResponse = 'mockedResponse';
        mockDynamoService.update = jest.fn().mockResolvedValue(mockDynamoServiceResponse);

        const response = await instance.handler();

        expect(response).toEqual(mockDynamoServiceResponse);
        expect(mockDynamoService.update).toHaveBeenCalledWith('UserData', {profile: 'mockUserProfile'}, 'set #key = :value', expectedAdditionalConfig);
    });

    test('Test handler call for Step Function request with known exception thrown', async () => {
        instance.event = {
            userProfile: 'mockUserProfile',
            taskToken: 'mockTaskToken'
        };

        const mockError = errorRepository.createError(1403, new Error('repo error'));
        mockDynamoService.update = jest.fn().mockImplementation(() => {
            throw mockError;
        });

        try {
            await instance.handler();
        } catch(error) {
            expect(error).toEqual(mockError);
        }

        expect.assertions(1);
    });

    test('Test handler call for Step Function request with unknown exception thrown', async () => {
        instance.event = {
            userProfile: 'mockUserProfile',
            taskToken: 'mockTaskToken'
        };

        const mockError = new Error('repo error');
        mockDynamoService.update = jest.fn().mockImplementation(() => {
            throw mockError;
        });

        const expectedError = errorRepository.createError(1000, mockError);
        try {
            await instance.handler();
        } catch(error) {
            expect(error).toEqual(expectedError);
        }

        expect.assertions(1);
    });

    test('Test handler call with unknown caught error', async () => {
        process.env.APP_CLIENT_ID = 'mockAppClientId';
        instance.event = {body: JSON.stringify({})};
        const mockError = new Error('mockError');
        mockCognitoService.confirmUser = jest.fn().mockImplementation(() => {
            throw mockError;
        });
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue('mockAPIResponseError');
        const expectedError = errorRepository.createError(1000, mockError);

        const response = await instance.handler();

        expect(response).toEqual('mockAPIResponseError');
        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(expectedError);
    });

    test('Test handler call with caught errorRepository error', async () => {
        process.env.APP_CLIENT_ID = 'mockAppClientId';
        instance.event = {body: JSON.stringify({})};
        const mockError = errorRepository.createError(1403, new Error('repo error'));
        mockCognitoService.confirmUser = jest.fn().mockImplementation(() => {
            throw mockError;
        });
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue('mockAPIResponseError');

        const response = await instance.handler();

        expect(response).toEqual('mockAPIResponseError');
        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(mockError);
    });

    test('Test handler call with caught CodeMismatchException', async () => {
        process.env.APP_CLIENT_ID = 'mockAppClientId';
        instance.event = {body: JSON.stringify({})};
        const mockError = new Error('mockError');
        mockError.code = 'CodeMismatchException';
        mockCognitoService.confirmUser = jest.fn().mockImplementation(() => {
            throw mockError;
        });
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue('mockAPIResponseError');
        const expectedError = errorRepository.createError(1402, mockError);

        const response = await instance.handler();

        expect(response).toEqual('mockAPIResponseError');
        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(expectedError);
    });

    test('Test handler call with caught InvalidParameterException', async () => {
        process.env.APP_CLIENT_ID = 'mockAppClientId';
        instance.event = {body: JSON.stringify({})};
        const mockError = new Error('mockError');
        mockError.code = 'InvalidParameterException';
        mockCognitoService.confirmUser = jest.fn().mockImplementation(() => {
            throw mockError;
        });
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue('mockAPIResponseError');
        const expectedError = errorRepository.createError(1402, mockError);

        const response = await instance.handler();

        expect(response).toEqual('mockAPIResponseError');
        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(expectedError);
    });

    test('Test lambda handler export', async () => {
        jest.mock('/opt/cognitoService', () => { return { } }, {virtual: true});
        jest.mock('/opt/userUtils', () => { return {default: () => {return { }}}}, {virtual: true});
        jest.mock('/opt/dynamoService', () => { return { } }, {virtual: true});
        jest.mock('/opt/statesUtils', () => { return { } }, {virtual: true});
        jest.mock('/opt/createAPIResponse', () => { return { } }, {virtual: true});
        const mockEvent = 'mockEvent';

        const mockconfirmUser = require('./confirmUser');
        mockconfirmUser.confirmUserService = jest.fn().mockImplementation(() => {
            return {
                handler: jest.fn().mockResolvedValue('mockHandlerResponse')
            }
        });

        const response = await mockconfirmUser.handler(mockEvent);

        expect(response).toEqual('mockHandlerResponse');
        expect(mockconfirmUser.confirmUserService).toHaveBeenCalledWith({
            cognitoService: { },
            userUtils: { },
            dynamoService: { },
            statesUtils: { },
            createAPIResponse: { },
            event: mockEvent
        })
    });
})
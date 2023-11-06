
const errorRepository = require('./opt/errorRepository');
const confirmUser = require('./confirmUser');

const mockCognitoService = { };
const mockUserUtils = { };
const mockDynamoService = { };
const mockCreateAPIResponse = { };

let instance;
let event

describe('Test confirmUser', () => {
    beforeEach(() => {
        const deps = {
            cognitoService: mockCognitoService,
            userUtils: mockUserUtils,
            dynamoService: mockDynamoService,
            createAPIResponse: mockCreateAPIResponse,
            event: event
        }

        instance = confirmUser.confirmUserService(deps);
    })

    test('Test handler call', async () => {
        instance.event = {
            body: JSON.stringify({
                profile: 'mockProfile',
                confirmation: 'mockConfirmation'
            })
        };
        mockCognitoService.confirmUser = jest.fn().mockResolvedValue('mockCognitoResponse');
        mockUserUtils.getUser = jest.fn().mockResolvedValue({name: 'mockUserName'});
        mockDynamoService.update = jest.fn().mockResolvedValue(true);
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
            createAPIResponse: { },
            event: mockEvent
        })
    });
})

const errorRepository = require('./opt/errorRepository');
const sendMessage = require('./sendMessage');

const mockUserUtils = { };
const mockCreateAPIResponse = { };
const mockCognitoService = { };
const mockConvoUtils = { };

let instance;
let event = {};

describe('Test sendMessage', () => {
    beforeEach(() => {
        const deps = {
            userUtils: mockUserUtils,
            createAPIResponse: mockCreateAPIResponse,
            cognitoService: mockCognitoService,
            convoUtils: mockConvoUtils,
            event: event
        }

        instance = sendMessage.sendMessageService(deps);
    });

    test('Test handler call', async () => {
        const mockReqBody = {
            conversationId: 'conversationId',
            messageBody: 'messageBody'
        };
        const mockUserClaims = {
            profile: 'profile'
        };
        event.pathParameters = {
            conversationId: 'conversationId'
        };
        event.body = JSON.stringify(mockReqBody);
        
        mockCognitoService.getClaims = jest.fn().mockReturnValue(mockUserClaims);
        mockUserUtils.getUser = jest.fn().mockResolvedValue('user');
        mockConvoUtils.appendMessage = jest.fn();
        mockCreateAPIResponse.Ok = jest.fn().mockReturnValue('Ok');

        const response = await instance.handler();

        expect(mockConvoUtils.appendMessage).toHaveBeenCalledWith('profile', 'conversationId', 'messageBody');
        expect(response).toEqual('Ok');
    });

    test('Test handler call with caught error', async () => {
        const mockResponse = {
            error: 'error'
        };
        const mockError = new Error('Unexpected Error');
        mockCognitoService.getClaims = jest.fn().mockImplementation(() => {
            throw mockError;
        });
        mockUserUtils.getUser = jest.fn();
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue(mockResponse);

        const response = await instance.handler();
        
        const expectedError = errorRepository.createError(1000, mockError);

        expect(response).toEqual(mockResponse);
        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(expectedError);
        expect(mockUserUtils.getUser).not.toHaveBeenCalled();
    });

    test('Test lambda handler export', async () => {
        jest.mock('/opt/userUtils', () => { return {default: jest.fn().mockReturnValue({ })} }, {virtual: true});
        jest.mock('/opt/createAPIResponse', () => { return { } }, {virtual: true});
        jest.mock('/opt/cognitoService', () => { return { } }, {virtual: true});
        jest.mock('/opt/convoUtils', () => { return {default: jest.fn().mockReturnValue({ })} }, {virtual: true});
        const mockEvent = 'mockEvent';

        const mockRegisterUser = require('./sendMessage');
        mockRegisterUser.sendMessageService = jest.fn().mockImplementation(() => {
            return {
                handler: jest.fn().mockResolvedValue('mockHandlerResponse')
            }
        });

        const response = await mockRegisterUser.handler(mockEvent);

        expect(response).toEqual('mockHandlerResponse');
        expect(mockRegisterUser.sendMessageService).toHaveBeenCalledWith({
            userUtils: { },
            createAPIResponse: { },
            cognitoService: { },
            convoUtils: { },
            event: mockEvent
        });
    });
});
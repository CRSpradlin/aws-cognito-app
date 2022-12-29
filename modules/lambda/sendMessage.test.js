
const sendMessage = require('./sendMessage');
const errorRepository = require('./opt/errorRepository');

const mockUserUtils = { };
const mockCreateAPIResponse = { };
const mockCognitoService = { };
const mockConvoUtils = { };

let instance;
let event = {};

describe('Test sendMessage', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    })

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
            profile: 'userProfile'
        };
        const mockUser = {
            profile: 'userProfile'
        };
        event.pathParameters = {
            conversationId: 'conversationId'
        };
        event.body = JSON.stringify(mockReqBody);
        
        mockCognitoService.getClaims = jest.fn().mockReturnValue(mockUserClaims);
        mockUserUtils.getUser = jest.fn().mockResolvedValue(mockUser);
        mockConvoUtils.userHasAccessToConvo = jest.fn().mockResolvedValue(true);
        const mockMessage = {messageBody: 'text'};
        mockConvoUtils.sendMessage = jest.fn().mockResolvedValue(mockMessage);
        mockCreateAPIResponse.Ok = jest.fn().mockReturnValue('Ok');

        const response = await instance.handler();

        expect(mockConvoUtils.sendMessage).toHaveBeenCalledWith(mockUser, 'conversationId', 'messageBody');
        expect(mockCreateAPIResponse.Ok).toHaveBeenCalledWith({message: mockMessage});
        expect(response).toEqual('Ok');
    });

    test('Test handler call with unauthorized user error', async () => {
        const mockUserClaims = {
            profile: 'userProfile'
        };
        const mockUser = {
            profile: 'userProfile'
        }
        const mockAPIResponse = {
            error: 'error'
        };
        const expectedError = errorRepository.createError(4403, new Error('User is not a member of this conversation'));

        mockCognitoService.getClaims = jest.fn().mockReturnValue(mockUserClaims);
        mockUserUtils.getUser = jest.fn().mockResolvedValue(mockUser);
        mockConvoUtils.userHasAccessToConvo = jest.fn().mockResolvedValue(false);
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue(mockAPIResponse);

        const response = await instance.handler();

        expect(response).toEqual(mockAPIResponse);
        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(expectedError);
    });

    test('Test handler call with caught errorRepository error', async () => {
        const mockResponse = {
            error: 'error'
        };
        const mockError = errorRepository.createError(1403, new Error());
        mockCognitoService.getClaims = jest.fn().mockImplementation(() => {
            throw mockError;
        });
        mockUserUtils.getUser = jest.fn();
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue(mockResponse);

        const response = await instance.handler();

        expect(response).toEqual(mockResponse);
        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(mockError);
        expect(mockUserUtils.getUser).not.toHaveBeenCalled();
    });

    test('Test handler call with unexpected error', async () => {
        const mockResponse = {
            error: 'error'
        };
        const mockError = new Error('Unexpected Error');
        mockCognitoService.getClaims = jest.fn().mockImplementation(() => {
            throw mockError;
        });
        mockUserUtils.getUser = jest.fn();
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue(mockResponse);

        const expectedError = errorRepository.createError(1000, mockError);

        const response = await instance.handler();

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
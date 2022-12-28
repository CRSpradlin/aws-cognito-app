
const getMessages = require('./getMessages');
const errorRepository = require('./opt/errorRepository');

const mockUserUtils = { };
const mockCreateAPIResponse = { };
const mockCognitoService = { };
const mockConvoUtils = { };

let instance;
let event = {
    pathParameters: {
        conversationId: 'conversationId'
    },
    queryStringParameters: { }
};

describe('Test getMessages', () => {
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

        instance = getMessages.getMessagesService(deps);
    });

    test('Test handler call', async () => {
        event.pathParameters = {
            conversationId: 'conversationId'
        };
        event.queryStringParameters = { };
        const mockUserClaims = {
            profile: 'userProfile'
        };
        const mockUser = {
            profile: 'userProfile'
        };
        
        mockCognitoService.getClaims = jest.fn().mockReturnValue(mockUserClaims);
        mockUserUtils.getUser = jest.fn().mockResolvedValue(mockUser);
        mockConvoUtils.userHasAccessToConvo = jest.fn().mockResolvedValue(true);
        instance.processGetMessages = jest.fn().mockResolvedValue(['message1', 'message2']);
        mockCreateAPIResponse.Ok = jest.fn().mockReturnValue('Ok');

        const response = await instance.handler();

        expect(instance.processGetMessages).toHaveBeenCalled();
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
        const mockError = errorRepository.createError(1000, new Error());
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

        const response = await instance.handler();

        const expectedError = errorRepository.createError(1000, mockError);

        expect(response).toEqual(mockResponse);
        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(expectedError);
        expect(mockUserUtils.getUser).not.toHaveBeenCalled();
    });

    test('Test processGetMessages call', async () => {
        mockConvoUtils.getMessages = jest.fn().mockResolvedValue(['message1', 'message2']);

        const response = await instance.processGetMessages();

        expect(response).toEqual(['message1', 'message2']);
        expect(mockConvoUtils.getMessages).toHaveBeenCalledWith('conversationId');
    });

    test('Test processGetMessages call with latest information', async () => {
        mockConvoUtils.getMessages = jest.fn().mockResolvedValue(['message2']);
        instance.latest = '123456789';

        const response = await instance.processGetMessages();

        expect(response).toEqual(['message2']);
        expect(mockConvoUtils.getMessages).toHaveBeenCalledWith('conversationId', 123456789);
    });

    test('Test processGetMessages call with latest information giberish', async () => {
        mockConvoUtils.getMessages = jest.fn().mockResolvedValue(['message2']);
        instance.latest = 'hiphop';

        const response = await instance.processGetMessages();

        expect(response).toEqual(['message2']);
        expect(mockConvoUtils.getMessages).toHaveBeenCalledWith('conversationId');
    });

    test('Test lambda handler export', async () => {
        jest.mock('/opt/userUtils', () => { return {default: jest.fn().mockReturnValue({ })} }, {virtual: true});
        jest.mock('/opt/createAPIResponse', () => { return { } }, {virtual: true});
        jest.mock('/opt/cognitoService', () => { return { } }, {virtual: true});
        jest.mock('/opt/convoUtils', () => { return {default: jest.fn().mockReturnValue({ })} }, {virtual: true});
        const mockEvent = 'mockEvent';

        const mockRegisterUser = require('./getMessages');
        mockRegisterUser.getMessagesService = jest.fn().mockImplementation(() => {
            return {
                handler: jest.fn().mockResolvedValue('mockHandlerResponse')
            }
        });

        const response = await mockRegisterUser.handler(mockEvent);

        expect(response).toEqual('mockHandlerResponse');
        expect(mockRegisterUser.getMessagesService).toHaveBeenCalledWith({
            userUtils: { },
            createAPIResponse: { },
            cognitoService: { },
            convoUtils: { },
            event: mockEvent
        });
    });
});
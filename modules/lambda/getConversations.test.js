
const getConversations = require('./getConversations');
const errorRepository = require('./opt/errorRepository');

const mockUserUtils = { };
const mockCreateAPIResponse = { };
const mockCognitoService = { };
const mockConvoUtils = { };

let instance;
let event = { };

describe('Test getConversations', () => {
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

        instance = getConversations.getConversationsService(deps);
    });

    test('Test handler call', async () => {
        instance.event = 'mockEvent';
        instance.conversationId = 'mockConvoId';
        mockCognitoService.getClaims = jest.fn().mockResolvedValue({sub: 'mockProfile'});
        mockUserUtils.getUser = jest.fn().mockResolvedValue({profile: 'mockUserObjProfile'});
        mockConvoUtils.getConversations = jest.fn().mockResolvedValue(['conversationDetails1', 'conversationDetails2']);
        mockCreateAPIResponse.Ok = jest.fn().mockReturnValue('mockResponse');
        mockCreateAPIResponse.Error = jest.fn();

        const response = await instance.handler();

        expect(mockCognitoService.getClaims).toHaveBeenCalledWith('mockEvent');
        expect(mockConvoUtils.getConversations).toHaveBeenCalledWith('mockUserObjProfile');
        expect(mockCreateAPIResponse.Ok).toHaveBeenCalled();
        expect(mockCreateAPIResponse.Ok).toHaveBeenCalledWith({conversations: ['conversationDetails1', 'conversationDetails2']});
        expect(response).toEqual('mockResponse');
        expect(mockCreateAPIResponse.Error).not.toHaveBeenCalled();
    });

    test('Test handler call with unexpected error', async () => {
        const unexpectedError = new Error('unexpected error');

        instance.event = 'mockEvent';
        instance.conversationId = 'mockConvoId';
        mockCognitoService.getClaims = jest.fn().mockImplementation(() => {
            throw unexpectedError;
        });
        mockUserUtils.getUser = jest.fn();
        mockConvoUtils.getConversations = jest.fn();
        mockCreateAPIResponse.Ok = jest.fn();
        mockCreateAPIResponse.Error = jest.fn();

        const expectedError = errorRepository.createError(1000, unexpectedError);

        try {
            await instance.handler();
        } catch (error) { 
            expect(error).toEqual(expectedError);
        }
        

        expect(mockCognitoService.getClaims).toHaveBeenCalledWith('mockEvent');
        expect(mockConvoUtils.getConversations).not.toHaveBeenCalled();
        expect(mockCreateAPIResponse.Ok).not.toHaveBeenCalled();
        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(expectedError);
    });

    test('Test handler call with expected error', async () => {
        const expectedError = errorRepository.createError(4403);

        instance.event = 'mockEvent';
        instance.conversationId = 'mockConvoId';
        mockCognitoService.getClaims = jest.fn().mockImplementation(() => {
            throw expectedError;
        });
        mockUserUtils.getUser = jest.fn();
        mockConvoUtils.getConversations = jest.fn();
        mockCreateAPIResponse.Ok = jest.fn();
        mockCreateAPIResponse.Error = jest.fn();

        try {
            await instance.handler();
        } catch (error) { 
            expect(error).toEqual(expectedError);
        }
        

        expect(mockCognitoService.getClaims).toHaveBeenCalledWith('mockEvent');
        expect(mockConvoUtils.getConversations).not.toHaveBeenCalled();
        expect(mockCreateAPIResponse.Ok).not.toHaveBeenCalled();
        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(expectedError);
    });

    test('Test lambda handler export', async () => {
        jest.mock('/opt/userUtils', () => { return {default: jest.fn().mockReturnValue({ })} }, {virtual: true});
        jest.mock('/opt/createAPIResponse', () => { return { } }, {virtual: true});
        jest.mock('/opt/cognitoService', () => { return { } }, {virtual: true});
        jest.mock('/opt/convoUtils', () => { return {default: jest.fn().mockReturnValue({ })} }, {virtual: true});
        const mockEvent = 'mockEvent';

        const mockGetConversations = require('./getConversations');
        mockGetConversations.getConversationsService = jest.fn().mockImplementation(() => {
            return {
                handler: jest.fn().mockResolvedValue('mockHandlerResponse')
            }
        });

        const response = await mockGetConversations.handler(mockEvent);

        expect(response).toEqual('mockHandlerResponse');
        expect(mockGetConversations.getConversationsService).toHaveBeenCalledWith({
            userUtils: { },
            createAPIResponse: { },
            cognitoService: { },
            convoUtils: { },
            event: mockEvent
        });
    });
});
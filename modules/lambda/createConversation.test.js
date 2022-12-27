
const errorRepository = require('./opt/errorRepository');
const createConversation = require('./createConversation');

const mockConvoUtils = { };
const mockCognitoService = { };
const mockCreateAPIResponse = { };

let instance;
let event

describe('Test createConversation', () => {
    beforeEach(() => {
        const deps = {
            convoUtils: mockConvoUtils,
            cognitoService: mockCognitoService,
            createAPIResponse: mockCreateAPIResponse,
            event: event
        }

        instance = createConversation.createConversationService(deps);
    })

    test('Test handler call', async () => {
        instance.event = {
            body: JSON.stringify({
                members: 'members'
            })
        };
        const mockClaimsResponse = {
            profile: 'profile'
        }

        instance.cognitoService.getClaims = jest.fn().mockReturnValue(mockClaimsResponse);
        instance.convoUtils.createConvo = jest.fn();
        instance.createAPIResponse.Ok = jest.fn().mockReturnValue('Ok');
        instance.createAPIResponse.Error = jest.fn();

        const response = await instance.handler();

        expect(response).toEqual('Ok');
        expect(instance.cognitoService.getClaims).toHaveBeenCalledWith(instance.event);
        expect(instance.convoUtils.createConvo).toHaveBeenCalledWith('profile', 'members');
        expect(instance.createAPIResponse.Error).not.toHaveBeenCalled();
    });

    test('Test handler call with caught errorRepository error', async () => {
        instance.event = {
            body: JSON.stringify({
                members: 'members'
            })
        };

        const mockError = errorRepository.createError(1403, new Error());

        instance.cognitoService.getClaims = jest.fn().mockImplementation(() => {
            throw mockError;
        });
        instance.convoUtils.createConvo = jest.fn();
        instance.createAPIResponse.Ok = jest.fn();
        instance.createAPIResponse.Error = jest.fn().mockReturnValue('mockErrorResponse');

        const response = await instance.handler();

        expect(response).toEqual('mockErrorResponse');
        expect(instance.cognitoService.getClaims).toHaveBeenCalledWith(instance.event);
        expect(instance.convoUtils.createConvo).not.toHaveBeenCalled();
        expect(instance.createAPIResponse.Ok).not.toHaveBeenCalled();
        expect(instance.createAPIResponse.Error).toHaveBeenCalledWith(mockError);    
    });

    test('Test handler call with unexpected error', async () => {
        instance.event = {
            body: JSON.stringify({
                members: 'members'
            })
        };
        const mockError = 'mockError';
        const expectedError = errorRepository.createError(1000, mockError);

        instance.cognitoService.getClaims = jest.fn().mockImplementation(() => {
            throw mockError;
        });
        instance.convoUtils.createConvo = jest.fn();
        instance.createAPIResponse.Ok = jest.fn();
        instance.createAPIResponse.Error = jest.fn().mockReturnValue('mockErrorResponse');

        const response = await instance.handler();

        expect(response).toEqual('mockErrorResponse');
        expect(instance.cognitoService.getClaims).toHaveBeenCalledWith(instance.event);
        expect(instance.convoUtils.createConvo).not.toHaveBeenCalled();
        expect(instance.createAPIResponse.Ok).not.toHaveBeenCalled();
        expect(instance.createAPIResponse.Error).toHaveBeenCalledWith(expectedError);
    });

    test('Test lambda handler export', async () => {
        jest.mock('/opt/convoUtils', () => { return {default: jest.fn().mockReturnValue({ })} }, {virtual: true});
        jest.mock('/opt/cognitoService', () => { return { } }, {virtual: true});
        jest.mock('/opt/createAPIResponse', () => { return { } }, {virtual: true});
        const mockEvent = 'mockEvent';

        const mockCreateConversation = require('./createConversation');
        mockCreateConversation.createConversationService = jest.fn().mockImplementation(() => {
            return {
                handler: jest.fn().mockResolvedValue('mockHandlerResponse')
            }
        });

        const response = await mockCreateConversation.handler(mockEvent);

        expect(response).toEqual('mockHandlerResponse');
        expect(mockCreateConversation.createConversationService).toHaveBeenCalledWith({
            convoUtils: { },
            cognitoService: { },
            createAPIResponse: { },
            event: mockEvent
        })
    });
})
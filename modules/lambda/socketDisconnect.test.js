
const socketDisconnect = require('./socketDisconnect');

const mockUserUtils = { };
const mockCreateAPIResponse = { };

let instance;
let event

describe('Test socketDisconnect', () => {
    beforeEach(() => {
        event = {
            headers: {},
            requestContext: {}
        }

        const deps = {
            userUtils: mockUserUtils,
            createAPIResponse: mockCreateAPIResponse,
            event: event
        }

        instance = socketDisconnect.socketDisconnectService(deps);
    });

    test('Test handler call', async () => {
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue('Error');
        mockCreateAPIResponse.Ok = jest.fn().mockReturnValue('Ok');
        instance.connectionId = 'mockConnectionId';
        mockUserUtils.removeUserSession = jest.fn();

        const response = await instance.handler();

        expect(response).toEqual('Ok');
        expect(mockUserUtils.removeUserSession).toHaveBeenCalledWith(instance.connectionId);
        expect(mockCreateAPIResponse.Error).not.toHaveBeenCalled();
    });

    test('Test handler call with error', async () => {
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue('Error');
        mockCreateAPIResponse.Ok = jest.fn().mockReturnValue('Ok');
        instance.connectionId = 'mockConnectionId';
        const mockError = new Error('mock error');
        mockUserUtils.removeUserSession = jest.fn().mockImplementation(() => {
            throw mockError;
        });

        const response = await instance.handler();

        expect(response).toEqual('Error');
        expect(mockCreateAPIResponse.Ok).not.toHaveBeenCalled();
    })

    test('Test lambda handler export', async () => {
        jest.mock('/opt/userUtils', () => { return {default: () => { return { } }} }, {virtual: true});
        jest.mock('/opt/createAPIResponse', () => { return { } }, {virtual: true});
        const mockEvent = 'mockEvent';

        const mockSocketAuthorizer = require('./socketDisconnect');
        mockSocketAuthorizer.socketDisconnectService = jest.fn().mockImplementation(() => {
            return {
                handler: jest.fn().mockResolvedValue('mockHandlerResponse')
            }
        });

        const response = await mockSocketAuthorizer.handler(mockEvent);

        expect(response).toEqual('mockHandlerResponse');
        expect(mockSocketAuthorizer.socketDisconnectService).toHaveBeenCalledWith({
            userUtils: { },
            createAPIResponse: { },
            event: mockEvent
        })
    });
})

const errorRepository = require('./opt/errorRepository');
const confirmUser = require('./confirmUser');

const mockCognitoService = { };
const mockCreateAPIResponse = { };

let instance;
let event

describe('Test confirmUser', () => {
    beforeEach(() => {
        const deps = {
            cognitoService: mockCognitoService,
            createAPIResponse: mockCreateAPIResponse,
            event: event
        }

        instance = confirmUser.confirmUserService(deps);
    })

    test('Test handler call', async () => {
        instance.event = {
            body: JSON.stringify({
                username: 'mockUsername',
                confirmation: 'mockConfirmation'
            })
        };
        mockCognitoService.confirmUser = jest.fn().mockResolvedValue('mockCognitoResponse');
        mockCreateAPIResponse.Ok = jest.fn().mockReturnValue('mockAPIResponse');

        const response = await instance.handler();

        expect(response).toEqual('mockAPIResponse');
        expect(mockCognitoService.confirmUser).toHaveBeenCalledWith('mockUsername', 'mockConfirmation');
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

    test('Test lambda handler export', async () => {
        jest.mock('/opt/cognitoService', () => { return { } }, {virtual: true});
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
            createAPIResponse: { },
            event: mockEvent
        })
    });
})
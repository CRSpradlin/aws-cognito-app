
const errorRepository = require('./opt/errorRepository');
const registerUser = require('./registerUser');

const mockCognitoService = { };
const mockCreateAPIResponse = { };

let instance;
let event

describe('Test registerUser', () => {
    beforeEach(() => {
        const deps = {
            cognitoService: mockCognitoService,
            createAPIResponse: mockCreateAPIResponse,
            event: event
        }

        instance = registerUser.registerUserService(deps);
    })

    test('Test handler call', async () => {
        process.env.APP_CLIENT_ID = 'mockAppClientId'
        instance.event = {
            body: JSON.stringify({
                email: 'mockEmail',
                username: 'mockUsername',
                password: 'mockPassword'
            })
        };
        mockCognitoService.createUser = jest.fn().mockResolvedValue('mockCognitoResponse');
        mockCreateAPIResponse.Ok = jest.fn().mockReturnValue('mockAPIResponse');

        const response = await instance.handler();

        expect(response).toEqual('mockAPIResponse');
        expect(mockCognitoService.createUser).toHaveBeenCalledWith('mockAppClientId', 'mockUsername', 'mockPassword', [{Name: 'email', Value: 'mockEmail'}]);
    });

    test('Test handler call with caught error', async () => {
        process.env.APP_CLIENT_ID = 'mockAppClientId';
        instance.event = {body: JSON.stringify({})};
        const mockError = new Error('mockError');
        mockCognitoService.createUser = jest.fn().mockImplementation(() => {
            throw mockError;
        });
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue('mockAPIResponseError');
        const expectedError = errorRepository.createError(1000, mockError);

        const response = await instance.handler();

        expect(response).toEqual('mockAPIResponseError');
        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(expectedError);
    });

    test('Test lambda handler export', async () => {
        jest.mock('/opt/cognitoService', () => { return { } }, {virtual: true});
        jest.mock('/opt/createAPIResponse', () => { return { } }, {virtual: true});
        const mockEvent = 'mockEvent';

        const mockRegisterUser = require('./registerUser');
        mockRegisterUser.registerUserService = jest.fn().mockImplementation(() => {
            return {
                handler: jest.fn().mockResolvedValue('mockHandlerResponse')
            }
        });

        const response = await mockRegisterUser.handler(mockEvent);

        expect(response).toEqual('mockHandlerResponse');
        expect(mockRegisterUser.registerUserService).toHaveBeenCalledWith({
            cognitoService: { },
            createAPIResponse: { },
            event: mockEvent
        })
    });
})
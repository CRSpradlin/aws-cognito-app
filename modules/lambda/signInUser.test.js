
const errorRepository = require('./opt/errorRepository');
const signInUser = require('./signInUser');

const mockCognitoService = { };
const mockCreateAPIResponse = { };

let instance;
let event

describe('Test signInUser', () => {
    beforeEach(() => {
        const deps = {
            cognitoService: mockCognitoService,
            createAPIResponse: mockCreateAPIResponse,
            event: event
        }

        instance = signInUser.signInUserService(deps);
    })

    test('Test handler call', async () => {
        instance.event = {
            body: JSON.stringify({
                username: 'mockUsername',
                password: 'mockPassword'
            })
        };
        mockCognitoService.getAuthToken = jest.fn().mockResolvedValue('mockCognitoResponse');
        mockCreateAPIResponse.Ok = jest.fn().mockReturnValue('mockAPIResponse');

        const response = await instance.handler();

        expect(response).toEqual('mockAPIResponse');
        expect(mockCognitoService.getAuthToken).toHaveBeenCalledWith('mockUsername', 'mockPassword');
    });

    test('Test handler call with caught error', async () => {
        process.env.APP_CLIENT_ID = 'mockAppClientId';
        instance.event = {body: JSON.stringify({})};
        const mockError = new Error('mockError');
        mockCognitoService.getAuthToken = jest.fn().mockImplementation(() => {
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

        const mockSignInUser = require('./signInUser');
        mockSignInUser.signInUserService = jest.fn().mockImplementation(() => {
            return {
                handler: jest.fn().mockResolvedValue('mockHandlerResponse')
            }
        });

        const response = await mockSignInUser.handler(mockEvent);

        expect(response).toEqual('mockHandlerResponse');
        expect(mockSignInUser.signInUserService).toHaveBeenCalledWith({
            cognitoService: { },
            createAPIResponse: { },
            event: mockEvent
        })
    });
})
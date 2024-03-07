
const errorRepository = require('./opt/errorRepository');
const registerUser = require('./registerUser');

const mockUserUtils = { };
const mockStatesUtils = { };
const mockCreateAPIResponse = { };

let instance;
let event

describe('Test registerUser', () => {
    beforeEach(() => {
        const deps = {
            userUtils: mockUserUtils,
            statesUtils: mockStatesUtils,
            createAPIResponse: mockCreateAPIResponse,
            event: event
        }

        instance = registerUser.registerUserService(deps);
    })

    test('Test handler call', async () => {
        process.env.APP_USER_CONFRIM_STATE_ARN = 'userConfirmStateArn';
        instance.event = {
            body: JSON.stringify({
                email: 'mockEmail',
                username: 'mockUsername',
                password: 'mockPassword'
            })
        };
        const mockCreateResponse = {
            UserSub: 'mockUserProfile'
        }
        mockUserUtils.createUser = jest.fn().mockResolvedValue(mockCreateResponse);
        mockStatesUtils.startExecution = jest.fn().mockResolvedValue('mockStatesExecutionResponse');
        mockCreateAPIResponse.Ok = jest.fn().mockReturnValue('mockAPIResponse');

        const response = await instance.handler();

        expect(response).toEqual('mockAPIResponse');
        expect(mockUserUtils.createUser).toHaveBeenCalledWith('mockUsername', 'mockPassword', 'mockEmail');
        expect(mockStatesUtils.startExecution).toHaveBeenCalledWith('userConfirmStateArn', {userProfile: 'mockUserProfile'});
    });

    test('Test handler call with UsernameExistsException caught error', async () => {
        process.env.APP_CLIENT_ID = 'mockAppClientId';
        instance.event = {body: JSON.stringify({})};
        const mockError = new Error('mockUsernameExistsException');
        mockError.code = 'UsernameExistsException';
        mockUserUtils.createUser = jest.fn().mockImplementation(() => {
            throw mockError;
        });
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue('mockAPIResponseError');
        const expectedError = errorRepository.createError(1400, mockError);

        const response = await instance.handler();

        expect(response).toEqual('mockAPIResponseError');
        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(expectedError);
    });

    test('Test handler call with InvalidPasswordException caught error', async () => {
        process.env.APP_CLIENT_ID = 'mockAppClientId';
        instance.event = {body: JSON.stringify({})};
        const mockError = new Error('mockInvalidPasswordException');
        mockError.code = 'InvalidPasswordException';
        mockUserUtils.createUser = jest.fn().mockImplementation(() => {
            throw mockError;
        });
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue('mockAPIResponseError');
        const expectedError = errorRepository.createError(1401, mockError);

        const response = await instance.handler();

        expect(response).toEqual('mockAPIResponseError');
        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(expectedError);
    });

    test('Test handler call with caught errorRepository error', async () => {
        process.env.APP_CLIENT_ID = 'mockAppClientId';
        instance.event = {body: JSON.stringify({})};
        const mockError = errorRepository.createError(1403, new Error());
        mockUserUtils.createUser = jest.fn().mockImplementation(() => {
            throw mockError;
        });
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue('mockAPIResponseError');

        const response = await instance.handler();

        expect(response).toEqual('mockAPIResponseError');
        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(mockError); 
    });

    test('Test handler call with unknown caught error', async () => {
        process.env.APP_CLIENT_ID = 'mockAppClientId';
        instance.event = {body: JSON.stringify({})};
        const mockError = new Error('mockError');
        mockUserUtils.createUser = jest.fn().mockImplementation(() => {
            throw mockError;
        });
        mockCreateAPIResponse.Error = jest.fn().mockReturnValue('mockAPIResponseError');
        const expectedError = errorRepository.createError(1000, mockError);

        const response = await instance.handler();

        expect(response).toEqual('mockAPIResponseError');
        expect(mockCreateAPIResponse.Error).toHaveBeenCalledWith(expectedError);
    });

    test('Test lambda handler export', async () => {
        jest.mock('/opt/userUtils', () => { return {default: jest.fn().mockReturnValue({ })} }, {virtual: true});
        jest.mock('/opt/statesUtils', () => { return { } }, {virtual: true});
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
            userUtils: { },
            statesUtils: { },
            createAPIResponse: { },
            event: mockEvent
        })
    });
})
const userUtils = require('./userUtils')._userUtilsService;

const mockUUID = { };
const mockDynamoDB = { };
const mockCognitoService = { };

let instance;

describe('Test userUtils', () => {
    beforeEach(() => {
        const deps = {
            uuid: mockUUID,
            dynamoDB: mockDynamoDB,
            cognitoService: mockCognitoService
        };

        instance = userUtils(deps);
    });

    test('Test createUser', async () => {
        instance.uuid = jest.fn().mockReturnValue('uuid');
        mockDynamoDB.put = jest.fn();
        mockCognitoService.createUser = jest.fn().mockResolvedValue('user created');

        const mockPutParams = {
            profile: 'uuid',
            email: 'email'
        };
        const expectedUserAttribs = [
            {Name: 'email', Value: 'email'},
            {Name: 'profile', Value: 'uuid'}
        ];

        const response = await instance.createUser('username', 'password', 'email');

        expect(mockDynamoDB.put).toHaveBeenCalledWith('UserData', mockPutParams);
        expect(mockCognitoService.createUser).toHaveBeenCalledWith('username', 'password', expectedUserAttribs);
        expect(response).toEqual('user created')
    });

    test('Test default export', async () => {
        jest.mock('uuid', () => { return {v4: { }} }, {virtual: true});
        jest.mock('./dynamoService', () => { return { } }, {virtual: true});
        jest.mock('./cognitoService', () => { return { } }, {virtual: true});

        const mockUserUtils = require('./userUtils');
        mockUserUtils._userUtilsService = jest.fn();

        const expectedDeps = { 
            uuid: { },
            dynamoDB: { },
            cognitoService: { }
        };

        mockUserUtils.default();

        expect(mockUserUtils._userUtilsService).toHaveBeenCalledWith(expectedDeps);
    });
})
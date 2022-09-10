const userUtils = require('./userUtils')._userUtilsService;

const mockUUID = {v4: { }};
const mockDynamoDB = { };
const mockCognitoService = { };

let instance;

describe('Test userUtils', () => {
    beforeEach(() => {
        mockUUID.v4 = jest.fn().mockReturnValue('uuid');
        
        const deps = {
            uuid: mockUUID,
            dynamoDB: mockDynamoDB,
            cognitoService: mockCognitoService
        };

        instance = userUtils(deps);
    });

    test('Test createUser', async () => {
        mockDynamoDB.put = jest.fn();
        mockCognitoService.createUser = jest.fn().mockResolvedValue('user created');

        const mockPutParams = {
            profile: 'uuid',
            email: 'email',
            conversations: [],
            sessions: []
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

    test('Test getUser', async () => {
        const mockProfile = 'profile';
        instance.dynamoDB.get = jest.fn().mockResolvedValue('mockUser')

        const response = await instance.getUser(mockProfile);

        expect(response).toEqual('mockUser');
    })

    test('Test default export', async () => {
        jest.mock('uuid', () => { return { } }, {virtual: true});
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
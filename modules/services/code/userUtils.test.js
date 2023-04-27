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
        mockCognitoService.createUser = jest.fn().mockResolvedValue({UserSub: 'mockUserSub'});

        const mockPutParams = {
            profile: 'mockUserSub',
            name: 'username',
            email: 'email',
            confirmed: false,
            conversations: []
        };
        const expectedUserAttribs = [
            {Name: 'email', Value: 'email'}
        ];

        const response = await instance.createUser('username', 'password', 'email');

        expect(mockDynamoDB.put).toHaveBeenCalledWith('UserData', mockPutParams);
        expect(mockCognitoService.createUser).toHaveBeenCalledWith('username', 'password', expectedUserAttribs);
        expect(response).toEqual({UserSub: 'mockUserSub'});
    });

    test('Test getUser', async () => {
        const mockProfile = 'profile';
        instance.dynamoDB.query = jest.fn().mockResolvedValue(['mockUser']);
        const mockKeyConditionExpression = '#userKeyName = :userIdentifier';
        const mockExpressionAttributeValues = {
            ':userIdentifier': mockProfile
        };
        const mockAdditionalConfig = {
            ExpressionAttributeNames: {
                '#userKeyName': 'profile'
            },
            Limit: 1
        };

        const response = await instance.getUser(mockProfile);

        expect(response).toEqual('mockUser');
        expect(instance.dynamoDB.query).toHaveBeenCalledWith('UserData', mockKeyConditionExpression, mockExpressionAttributeValues, mockAdditionalConfig);
    });

    test('Test getUser with user name used', async () => {
        const mockUserNameUsedValue = true;
        const mockUserName = 'name';
        instance.dynamoDB.query = jest.fn().mockResolvedValue(['mockUser']);
        const mockKeyConditionExpression = '#userKeyName = :userIdentifier';
        const mockExpressionAttributeValues = {
            ':userIdentifier': mockUserName
        };
        const mockAdditionalConfig = {
            ExpressionAttributeNames: {
                '#userKeyName': 'name'
            },
            Limit: 1,
            IndexName: 'UserNameIndex'
        };

        const response = await instance.getUser(mockUserName, mockUserNameUsedValue);

        expect(response).toEqual('mockUser');
        expect(instance.dynamoDB.query).toHaveBeenCalledWith('UserData', mockKeyConditionExpression, mockExpressionAttributeValues, mockAdditionalConfig);
    });

    test('Test addUserSession', async () => {
        const mockProfile = 'profile';
        const mockConnectionId = 'connectionId';
        instance.dynamoDB.put = jest.fn().mockResolvedValue('put response');

        const response  = await instance.addUserSession(mockProfile, mockConnectionId);

        expect(response).toEqual('put response');
        expect(instance.dynamoDB.put).toHaveBeenCalledWith('SocketData', {
            connectionId: mockConnectionId,
            userProfile: mockProfile
        });
    });

    test('Test getUserSessions call', async () => {
        instance.dynamoDB.query = jest.fn().mockResolvedValue('query response');

        const response = await instance.getUserSessions('mockUserProfile');

        expect(instance.dynamoDB.query).toHaveBeenCalledWith(
            'SocketData',
            'userProfile = :userProfile',
            {
                ':userProfile': 'mockUserProfile'
            },
            {
                Limit: 10,
                IndexName: 'ProfileIndex'
            }
        );

        expect(response).toEqual('query response');
    });

    test('Test removeUserSession', async () => {
        const mockConnectionId = 'connectionId';
        instance.dynamoDB.delete = jest.fn().mockResolvedValue('delete response');

        const response  = await instance.removeUserSession(mockConnectionId);

        expect(response).toEqual('delete response');
        expect(instance.dynamoDB.delete).toHaveBeenCalledWith('SocketData', {
            connectionId: mockConnectionId
        });
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
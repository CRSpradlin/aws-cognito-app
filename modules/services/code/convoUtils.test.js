const convoUtils = require('./convoUtils')._convoUtilsService;
const errorRepository = require('./errorRepository');

const mockUUID = { };
const mockDynamoDB = { };
const mockUserUtils = { };

let instance;

describe('Test convoUtils', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    beforeEach(() => {
        const deps = {
            uuid: mockUUID,
            dynamoDB: mockDynamoDB,
            userUtils: mockUserUtils
        };

        instance = convoUtils(deps);
    });

    test('Test createConvo call', async () => {
        instance.uuid = jest.fn().mockReturnValue('uuid');
        instance.dynamoDB.put = jest.fn();
        instance.dynamoDB.update = jest.fn();
        const mockMembers = ['member1', 'member2'];
        const mockOwnerId = 'owner';
        const expectedNewConvo = {
            id: 'uuid',
            name: 'Group Chat',
            owner: 'owner',
            members: ['member1', 'member2', 'owner'],
            messages: [],
            subscriptions: []
        };
        const expectedAdditionalConfig = {
            ExpressionAttributeNames: {
                '#conversations': 'conversations'
            },
            ExpressionAttributeValues: {
                ':array': ['uuid'],
                ':empty_list': []
            }           
        };

        const response = await instance.createConvo(mockOwnerId, mockMembers);

        expect(response).toEqual(expectedNewConvo);
        expect(instance.dynamoDB.put).toHaveBeenCalledWith('ConversationsData', expectedNewConvo);
        expect(instance.dynamoDB.update).toHaveBeenCalledWith('UserData', {profile: 'owner'}, 'set #conversations = list_append(if_not_exists(#conversations, :empty_list), :array)', expectedAdditionalConfig);
    })

    test('Test createConvo call with defined conversation name', async () => {
        instance.uuid = jest.fn().mockReturnValue('uuid');
        instance.dynamoDB.put = jest.fn();
        instance.dynamoDB.update = jest.fn();
        const mockMembers = ['member1', 'member2'];
        const mockOwnerId = 'owner';
        const expectedNewConvo = {
            id: 'uuid',
            name: 'Chat Room',
            owner: 'owner',
            members: ['member1', 'member2', 'owner'],
            messages: [],
            subscriptions: []
        };
        const expectedAdditionalConfig = {
            ExpressionAttributeNames: {
                '#conversations': 'conversations'
            },
            ExpressionAttributeValues: {
                ':array': ['uuid'],
                ':empty_list': []
            }           
        };

        const response = await instance.createConvo(mockOwnerId, mockMembers, 'Chat Room');

        expect(response).toEqual(expectedNewConvo);
        expect(instance.dynamoDB.put).toHaveBeenCalledWith('ConversationsData', expectedNewConvo);
        expect(instance.dynamoDB.update).toHaveBeenCalledWith('UserData', {profile: 'owner'}, 'set #conversations = list_append(if_not_exists(#conversations, :empty_list), :array)', expectedAdditionalConfig);
    })

    test('Test appendMessage call with conversation item', async () => {
        const mockDate = new Date(1466424490000);
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
        const dynamoDBMockGetValue = {
            messages: [{user: '123', body: 'currMsg', timestamp: 1466424490000}]
        };
        instance.dynamoDB.get = jest.fn().mockResolvedValue(dynamoDBMockGetValue);
        instance.dynamoDB.put = jest.fn();

        const mockUserProfile = '456';
        const mockConversationId = 'convoid';
        const mockMessageBody = 'newMsg';

        await instance.appendMessage(mockUserProfile, mockConversationId, mockMessageBody);

        const expectedConversation = {
            messages: [
                {user: '123', body: 'currMsg', timestamp: 1466424490000},
                {user: '456', body: 'newMsg', timestamp: 1466424490000} 
            ]
        }
        expect(instance.dynamoDB.get).toHaveBeenCalledWith('ConversationsData', {id: 'convoid'});
        expect(instance.dynamoDB.put).toHaveBeenCalledWith('ConversationsData', expectedConversation);
    });

    test('Test appendMessage call without conversation item', async () => {
        const mockDate = new Date(1466424490000);
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
        const dynamoDBMockGetValue = undefined;
        instance.dynamoDB.get = jest.fn().mockResolvedValue(dynamoDBMockGetValue);
        instance.dynamoDB.put = jest.fn();

        const mockUserProfile = '456';
        const mockConversationId = 'convoid';
        const mockMessageBody = 'newMsg';

        const expectedError = errorRepository.createError(404, new Error('Conversation Not Found'));

        try {
            await instance.appendMessage(mockUserProfile, mockConversationId, mockMessageBody);    
        } catch (error) {
            expect(error).toEqual(expectedError);
        }

        expect(instance.dynamoDB.get).toHaveBeenCalledWith('ConversationsData', {id: 'convoid'});
        expect(instance.dynamoDB.put).not.toHaveBeenCalled();
        expect.assertions(3);
    });

    test('Test default export', async () => {
        jest.mock('uuid', () => { return { } }, {virtual: true});
        jest.mock('./dynamoService', () => { return { } }, {virtual: true});
        jest.mock('./userUtils', () => { return { } }, {virtual: true});

        const mockConvoUtils = require('./convoUtils');
        mockConvoUtils._convoUtilsService = jest.fn();

        const expectedDeps = { 
            uuid: { },
            dynamoDB: { },
            userUtils: { }
        };

        mockConvoUtils.default();

        expect(mockConvoUtils._convoUtilsService).toHaveBeenCalledWith(expectedDeps);
    });
})
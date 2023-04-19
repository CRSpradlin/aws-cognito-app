const convoUtils = require('./convoUtils')._convoUtilsService;
const errorRepository = require('./errorRepository');

const mockUUID = { };
const mockDynamoDB = { };
const mockUserUtils = { };
const mockSocketUtils = { };

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
            userUtils: mockUserUtils,
            socketUtils: mockSocketUtils
        };

        instance = convoUtils(deps);
    });

    test('Test createConvo call', async () => {
        const mockDate = new Date(1466424490000);
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
        instance.uuid = jest.fn().mockReturnValue('uuid');
        instance.dynamoDB.put = jest.fn();
        instance.dynamoDB.update = jest.fn();
        const mockMembers = ['member1', 'member2'];
        const mockOwnerId = 'owner';
        const expectedNewConvo = {
            id: 'uuid',
            name: 'Group Chat',
            ownerProfile: 'owner',
            members: ['member1', 'member2', 'owner'],
            messages: [],
            subscriptions: [],
            createdDate: 1466424490000
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
        expect(instance.dynamoDB.put).toHaveBeenCalledWith('ConversationData', expectedNewConvo);
        expect(instance.dynamoDB.update).toHaveBeenCalledWith('UserData', {profile: 'owner'}, 'set #conversations = list_append(if_not_exists(#conversations, :empty_list), :array)', expectedAdditionalConfig);
    })

    test('Test createConvo call with defined conversation name', async () => {
        const mockDate = new Date(1466424490000);
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
        instance.uuid = jest.fn().mockReturnValue('uuid');
        instance.dynamoDB.put = jest.fn();
        instance.dynamoDB.update = jest.fn();
        const mockMembers = ['member1', 'member2'];
        const mockOwnerId = 'owner';
        const expectedNewConvo = {
            id: 'uuid',
            name: 'Chat Room',
            ownerProfile: 'owner',
            members: ['member1', 'member2', 'owner'],
            messages: [],
            subscriptions: [],
            createdDate: 1466424490000
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
        expect(instance.dynamoDB.put).toHaveBeenCalledWith('ConversationData', expectedNewConvo);
        expect(instance.dynamoDB.update).toHaveBeenCalledWith('UserData', {profile: 'owner'}, 'set #conversations = list_append(if_not_exists(#conversations, :empty_list), :array)', expectedAdditionalConfig);
    })

    test('Test createMessage call with conversation item', async () => {
        const mockDate = new Date(1466424490000);
        const mockConversationId = 'convoid';
        const mockMessageBody = 'newMsg';
        const mockUserProfile = '456';

        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
        instance.dynamoDB.put = jest.fn();

        const response = await instance.createMessage(mockUserProfile, mockConversationId, mockMessageBody);

        const expectedMessage = {
            conversationId: mockConversationId,
            userProfile: mockUserProfile,
            body: mockMessageBody,
            sentDate: 1466424490000
        }
        expect(instance.dynamoDB.put).toHaveBeenCalledWith('MessageData', expectedMessage);
        expect(response).toEqual(expectedMessage);
    });

    test('Test sendMessage call with conversation item', async () => {
        const mockConversationId = 'convoid';
        const mockMessageBody = 'newMsg';
        const mockUserProfile = '456';
        const mockConversation = {
            members: ['member1', 'member2', 'member3']
        }

        instance.dynamoDB.get = jest.fn().mockResolvedValue(mockConversation);
        instance.userUtils.getUserSessions = jest.fn().mockResolvedValue([
            {connectionId: 'mockConnectionId1'},
            {connectionId: 'mockConnectionId2'}
        ]);
        instance.socketUtils.sendMessage = jest.fn();



        const response = await instance.sendMessage(mockUserProfile, mockConversationId, mockMessageBody);

        const expectedMessage = {
            conversationId: mockConversationId,
            userProfile: mockUserProfile,
            body: mockMessageBody,
            sentDate: 1466424490000
        }
        expect(instance.dynamoDB.put).toHaveBeenCalledWith('MessageData', expectedMessage);
        expect(response).toEqual(expectedMessage);

        expect(instance.socketUtils.sendMessage).toHaveBeenCalledTimes(6);
    });

    test('Test getMessages call', async () => {
        const mockDate = new Date(1466424490000);
        const conversationId = '123';

        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
        instance.dynamoDB.query = jest.fn().mockResolvedValue(['message1', 'message2']);
        
        const response = await instance.getMessages(conversationId);

        const expectedExpression = 'conversationId = :convoId and sentDate < :sentDate';
        const expectedAttributeValues = {
            ':convoId': conversationId,
            ':sentDate': 1466424490000
        };
        const expectedAdditionalConfig = {
            Limit: 10,
            ScanIndexForward: false
        };

        expect(response).toEqual(['message1', 'message2']);
        expect(instance.dynamoDB.query).toHaveBeenCalledWith(
            'MessageData',
            expectedExpression,
            expectedAttributeValues,
            expectedAdditionalConfig
        );
    });

    test('Test getMessages call with optional parameters', async () => {
        const conversationId = '123';
        const mockMessageDate = 1466424490001

        instance.dynamoDB.query = jest.fn().mockResolvedValue(['message1', 'message2']);
        
        const response = await instance.getMessages(conversationId, 1466424490001, 20);

        const expectedExpression = 'conversationId = :convoId and sentDate < :sentDate';
        const expectedAttributeValues = {
            ':convoId': conversationId,
            ':sentDate': mockMessageDate
        };
        const expectedAdditionalConfig = {
            Limit: 20,
            ScanIndexForward: false
        };

        expect(response).toEqual(['message1', 'message2']);
        expect(instance.dynamoDB.query).toHaveBeenCalledWith(
            'MessageData',
            expectedExpression,
            expectedAttributeValues,
            expectedAdditionalConfig
        );
    });

    test('Test userHasAccessToConvo call with unauthorized conversation item', async () => {
        const mockConversationId = 'convoid';
        const mockUser = {
            profile: '456',
            conversations: ['convoid2']
        };

        instance.dynamoDB.get = jest.fn().mockResolvedValue({
            members: ['123']
        });

        const response = await instance.userHasAccessToConvo(mockUser, mockConversationId);

        expect(response).toEqual(false);
    });

    test('Test userHasAccessToConvo call with unauthorized conversation item', async () => {
        const mockConversationId = 'convoid2';
        const mockUser = {
            profile: '456',
            conversations: ['convoid2']
        };
        
        instance.dynamoDB.get = jest.fn().mockResolvedValue({
            members: ['123']
        });

        const response = await instance.userHasAccessToConvo(mockUser, mockConversationId);

        expect(response).toEqual(true);
    });

    test('Test userHasAccessToConvo call with unknown conversation item', async () => {
        const mockConversationId = 'convoid2';
        const mockUser = {
            profile: '456',
            conversations: ['convoid2']
        };
        
        instance.dynamoDB.get = jest.fn().mockResolvedValue(undefined);

        try {
            await instance.userHasAccessToConvo(mockUser, mockConversationId);
        } catch (error) {
            expect(error).toEqual(errorRepository.createError(4404, new Error('Conversation not found')));
        }

        expect.assertions(1);
    });

    test('Test getMembersOfConvo call', async () => {
        const mockMembers = ['member1', 'member2']
        instance.dynamoDB.get = jest.fn().mockResolvedValue({
            members: mockMembers
        });

        const response = await instance.getMembersOfConvo('mockConversationId');

        expect(response).toEqual(mockMembers);
        expect(instance.dynamoDB.get).toHaveBeenCalledWith('ConversationData', {conversationId: 'mockConversationId'});
    });

    test('Test getMembersOfConvo call with unknown convo', async () => {
        instance.dynamoDB.get = jest.fn().mockResolvedValue(undefined);
        const expectedError = errorRepository.createError(4404, new Error('Conversation Not Found'));

        try {
            await instance.getMembersOfConvo('mockConversationId');
        } catch (error) {
            expect(error).toEqual(expectedError);
        }

        expect(instance.dynamoDB.get).toHaveBeenCalledWith('ConversationData', {conversationId: 'mockConversationId'});
        expect.assertions(2);
    });

    test('Test default export', async () => {
        jest.mock('uuid', () => { return { } }, {virtual: true});
        jest.mock('./dynamoService', () => { return { } }, {virtual: true});
        jest.mock('./userUtils', () => { return { default: () => { return { } }} }, {virtual: true});
        jest.mock('./socketUtils', () => { return { } }, {virtual: true});

        const mockConvoUtils = require('./convoUtils');
        mockConvoUtils._convoUtilsService = jest.fn();

        const expectedDeps = { 
            uuid: { },
            dynamoDB: { },
            userUtils: { },
            socketUtils: { }
        };

        mockConvoUtils.default();

        expect(mockConvoUtils._convoUtilsService).toHaveBeenCalledWith(expectedDeps);
    });
})
const convoUtils = require('./convoUtils')._convoUtilsService;

const mockUUID = { };
const mockDynamoDB = { };
const mockUserUtils = { };

let instance;

describe('Test convoUtils', () => {
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
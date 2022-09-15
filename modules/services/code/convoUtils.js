const errorRepository = require('./errorRepository');

class convoUtils {

    constructor(uuid, dynamoDB, userUtils, socketUtils) {
        this.uuid = uuid.v4;
        this.dynamoDB = dynamoDB;
        this.userUtils = userUtils;
        this.socketUtils = socketUtils;
    }

    // TODO: Implement within convo creation to prevent duplicate conversations
    // convoExist = (ownerId, members) => {
    //     members.push(ownerId);
    //     // loop through owner conversations 
    //     //  - if convo exists with members -> true
    //     //  - else -> false
    // }

    createMessage = async (userProfile, conversationId, messageBody) => {
        const message = {
            conversationId,
            userProfile,
            body: messageBody,
            sentDate: new Date().getTime() // TODO: add on uuid -> this seems dumb
        }

        await this.dynamoDB.put('MessageData', message);

        return message;
    }

    sendMessage = async (userProfile, conversationId, messageBody) => {
        const message = await this.createMessage(userProfile, conversationId, messageBody);
        const conversation = await this.dynamoDB.get('ConversationData', {id: conversationId});

        for (const member of conversation.members) {
            const memberSessions = await this.userUtils.getUserSessions(member);

            for (const session of memberSessions) {
                await this.socketUtils.sendMessage(message, session.connectionId);
            }
        }

        return message;
    }

    getMessages = async (conversationId, sentDate = new Date().getTime(), maxCount = 10) => {
        const keyConditionExpression = 'conversationId = :convoId and sentDate < :sentDate';
        const expressionAttributeValues = {
            ':convoId': conversationId,
            ':sentDate': sentDate
        }
        const additionalConfig = {
            Limit: maxCount,
            ScanIndexForward: false
        };

        return await this.dynamoDB.query('MessageData', keyConditionExpression, expressionAttributeValues, additionalConfig);
    }

    createConvo = async (ownerProfile, members, name = 'Group Chat') => {
        // TODO: Check to see if owner and members are friends
        
        members.push(ownerProfile);

        // TODO: Check if convo exists
        
        const newConvo = {
            id: this.uuid(),
            name,
            ownerProfile,
            members: members,
            messages: [],
            subscriptions: []
        };

        await this.dynamoDB.put('ConversationData', newConvo);

        const additionalConfig = {
            ExpressionAttributeNames: {
                '#conversations': 'conversations'
            },
            ExpressionAttributeValues: {
                ':array': [newConvo.id],
                ':empty_list': []
            }
        };

        // TODO: would need to upsentDate every member in the conversation
        // TODO: OR send requests to people to confirm to be in the conversation
        await this.dynamoDB.update('UserData', {profile: ownerProfile}, 'set #conversations = list_append(if_not_exists(#conversations, :empty_list), :array)', additionalConfig);

        return newConvo;
    };

    userHasAccessToConvo = async (user, conversationId) => {
        // TODO: Update all this.dynamoDB.get operations to use environment variables
        let conversation = await this.dynamoDB.get('ConversationData', {id: conversationId});

        if (conversation) {
            // TODO: This doesnt seem right but I dont want to query for user again
            if (user.conversations.includes(conversationId)){
                return true;
            }
            return false;
        } else {
            throw errorRepository.createError(4404, new Error('Conversation Not Found'));
        }
    };

    getMembersOfConvo = async (conversationId) => {
        const conversation = await this.dynamoDB.get('ConversationData', {conversationId});

        if (conversation) {
            return conversation.members;
        } else {
            throw errorRepository.createError(4404, new Error('Conversation Not Found'));
        }
    }
}

exports._convoUtilsService = (deps) => {
    return new convoUtils(deps.uuid, deps.dynamoDB, deps.userUtils, deps.socketUtils);
}

exports.default = () => {
    const uuid = require('uuid');
    const dynamoDB = require('./dynamoService');
    const userUtils = require('./userUtils').default();
    const socketUtils = require('./socketUtils');

    const deps = {
        uuid: uuid,
        dynamoDB: dynamoDB,
        userUtils: userUtils,
        socketUtils: socketUtils    
    };

    return exports._convoUtilsService(deps);
}

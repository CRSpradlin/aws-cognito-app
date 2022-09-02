const errorRepository = require('./errorRepository');

class convoUtils {

    constructor(uuid, dynamoDB, userUtils) {
        this.uuid = uuid.v4;
        this.dynamoDB = dynamoDB;
        this.userUtils = userUtils;
    }

    // convoExist = (ownerId, members) => {
    //     members.push(ownerId);
    //     // loop through owner conversations 
    //     //  - if convo exists with members -> true
    //     //  - else -> false
    // }

    appendMessage = async (user, conversationId, messageBody) => {
        const message = {
            conversationId,
            userProfile: user.profile,
            body: messageBody,
            timestamp: new Date().getTime() // TODO: add on uuid
        }

        // TODO: Check for user access to conversation through use of user object
        // TODO: Update all this.dynamoDB.get operations to use environment variables
        let conversation = await this.dynamoDB.get('ConversationData', {id: conversationId});

        if (conversation) {
            return await this.dynamoDB.put('MessageData', message);
        } else {
            throw errorRepository.createError(404, new Error('Conversation Not Found'));
        }
    }

    createConvo = async (owner, members, name = 'Group Chat') => {
        // TODO: Check to see if owner and members are friends
        
        members.push(owner);

        // TODO: Check if convo exists
        
        const newConvo = {
            id: this.uuid(),
            name,
            owner,
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

        // TODO: would need to update every member in the conversation
        // TODO: OR send requests to people to confirm to be in the conversation
        await this.dynamoDB.update('UserData', {profile: owner}, 'set #conversations = list_append(if_not_exists(#conversations, :empty_list), :array)', additionalConfig);

        return newConvo;
    };


}

exports._convoUtilsService = (deps) => {
    return new convoUtils(deps.uuid, deps.dynamoDB, deps.userUtils);
}

exports.default = () => {
    const uuid = require('uuid');
    const dynamoDB = require('./dynamoService');
    const userUtils = require('./userUtils');

    const deps = {
        uuid: uuid,
        dynamoDB: dynamoDB,
        userUtils: userUtils    
    };

    return exports._convoUtilsService(deps);
}

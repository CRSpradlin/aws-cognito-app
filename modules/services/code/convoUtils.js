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

    createConvo = async (ownerId, members) => {
        members.push(ownerId);

        // TODO: Check if convo exists
        
        const newConvo = {
            id: this.uuid(),
            owner: ownerId,
            members: members,
            messages: [],
            subscriptions: []
        };

        await this.dynamoDB.put('ConversationsData', newConvo);

        const additionalConfig = {
            ExpressionAttributeNames: {
                '#conversations': 'conversations'
            },
            ExpressionAttributeValues: {
                ':array': [newConvo.id],
                ':empty_list': []
            }
        };
        await this.dynamoDB.update('UserData', {profile: ownerId}, 'set #conversations = list_append(if_not_exists(#conversations, :empty_list), :array)', additionalConfig);

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

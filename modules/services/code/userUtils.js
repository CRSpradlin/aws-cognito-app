class userUtils {

    constructor(uuid, dynamoDB, cognitoService) {
        this.uuid = uuid.v4;
        this.dynamoDB = dynamoDB;
        this.cognitoService = cognitoService;
    }

    createUser = async (username, password, email) => {
        const userAttributes = [
            {Name: 'email', Value: email}
        ];
        const response = await this.cognitoService.createUser(username, password, userAttributes);

        const profile = response.UserSub;

        await this.dynamoDB.put('UserData', {
            profile: profile,
            name: username,
            email: email,
            confirmed: false,
            conversations: []
        });
        
        return response;
    }

    getUser = async (userIdentifier, usernameUsed = false) => {
        let userKeyName;
        let indexName;

        if (usernameUsed) {
            userKeyName = 'name';
            indexName = 'UserNameIndex'
        } else {
            userKeyName = 'profile';
        }

        const keyConditionExpression = '#userKeyName = :userIdentifier';
        const expressionAttributeValues = {
            ':userIdentifier': userIdentifier
        };
        const additionalConfig = {
            ExpressionAttributeNames: {
                '#userKeyName': userKeyName
            },
            Limit: 1,
            IndexName: indexName
        };

        const users = await this.dynamoDB.query('UserData', keyConditionExpression, expressionAttributeValues, additionalConfig);

        return users[0];
    }

    addUserSession = async (userProfile, connectionId) => {
        const item = {
            connectionId,
            userProfile
        }

        return await this.dynamoDB.put('SocketData', item);
    }

    getUserSessions = async (userProfile) => {
        // Max 10 sessions at once

        const keyConditionExpression = 'userProfile = :userProfile';
        const expressionAttributeValues = {
            ':userProfile': userProfile
        };
        const additionalConfig = {
            Limit: 10,
            IndexName: 'ProfileIndex'
        };

        return await this.dynamoDB.query('SocketData', keyConditionExpression, expressionAttributeValues, additionalConfig);
    }

    removeUserSession = async (connectionId) => {
        const key = {
            connectionId
        };

        return await this.dynamoDB.delete('SocketData', key);
    }
}

exports._userUtilsService = (deps) => {
    return new userUtils(deps.uuid, deps.dynamoDB, deps.cognitoService);
}

exports.default = () => {
    const uuid = require('uuid');
    const dynamoDB = require('./dynamoService');
    const cognitoService = require('./cognitoService');

    const deps = {
        uuid: uuid,
        dynamoDB: dynamoDB,
        cognitoService: cognitoService    
    };

    return exports._userUtilsService(deps);
}

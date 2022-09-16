class userUtils {

    constructor(uuid, dynamoDB, cognitoService) {
        this.uuid = uuid.v4;
        this.dynamoDB = dynamoDB;
        this.cognitoService = cognitoService;
    }

    createUser = async (username, password, email) => {
        const profile = this.uuid();

        await this.dynamoDB.put('UserData', {
            profile: profile,
            email: email,
            conversations: []
        });
        
        const userAttributes = [
            {Name: 'email', Value: email},
            {Name: 'profile', Value: profile}
        ];

        const response = await this.cognitoService.createUser(username, password, userAttributes);
        
        return response;
    }

    getUser = async (userProfile) => {
        const userKey = {
            profile: userProfile
        };
        const user = await this.dynamoDB.get('UserData', userKey);

        return user;
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

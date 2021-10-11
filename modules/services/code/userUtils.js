class userUtils {

    constructor(uuid, dynamoDB, cognitoService) {
        this.uuid = uuid;
        this.dynamoDB = dynamoDB;
        this.cognitoService = cognitoService;
    }

    createUser = async (username, password, email) => {
        const userId = this.uuid();

        await this.dynamoDB.put('UserData', {
            profile: userId,
            email: email
        });
        
        const userAttributes = [
            {Name: 'email', Value: email},
            {Name: 'profile', Value: userId}
        ];

        const response = await this.cognitoService.createUser(username, password, userAttributes);
        
        return response;
    }
}

exports._userUtilsService = (deps) => {
    return new userUtils(deps.uuid, deps.dynamoDB, deps.cognitoService);
}

exports.default = () => {
    const uuid = require('uuid').v4;
    const dynamoDB = require('./dynamoService');
    const cognitoService = require('./cognitoService');

    const deps = {
        uuid: uuid,
        dynamoDB: dynamoDB,
        cognitoService: cognitoService    
    };

    return exports._userUtilsService(deps);
}

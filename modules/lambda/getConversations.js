const errorRepository = require('./opt/errorRepository');

class getConversations {
    
    constructor(userUtils, createAPIResponse, cognitoService, convoUtils, event) {
        this.userUtils = userUtils;
        this.createAPIResponse = createAPIResponse;
        this.cognitoService = cognitoService;
        this.convoUtils = convoUtils;
        this.event = event;
    }

    handler = async () => {
        try {
            const claims = this.cognitoService.getClaims(this.event);
            const user = await this.userUtils.getUser(claims.sub);

            const conversations = await this.convoUtils.getConversations(user.profile);

            return this.createAPIResponse.Ok({conversations});
        } catch (error) {
            let newError = error;
            switch (error.code) {
                case errorRepository.REPOSITORY_ERROR_CODE:
                    break;
                default:
                    newError = errorRepository.createError(1000, error);
            }
            return this.createAPIResponse.Error(newError);
        }
    }
}

exports.getConversationsService = (deps) => {
    return new getConversations(deps.userUtils, deps.createAPIResponse, deps.cognitoService, deps.convoUtils, deps.event);   
}

exports.handler = async (event) => {
    const userUtils = require('/opt/userUtils').default();
    const createAPIResponse = require('/opt/createAPIResponse');
    const cognitoService = require('/opt/cognitoService');
    const convoUtils = require('/opt/convoUtils').default();
    const deps = {
        userUtils,
        createAPIResponse,
        cognitoService,
        convoUtils,
        event
    };

    return await exports.getConversationsService(deps).handler();
}
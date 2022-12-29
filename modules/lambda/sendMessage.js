const errorRepository = require('./opt/errorRepository');

class sendMessage {
    
    constructor(userUtils, createAPIResponse, cognitoService, convoUtils, event) {
        this.userUtils = userUtils;
        this.createAPIResponse = createAPIResponse;
        this.cognitoService = cognitoService;
        this.convoUtils = convoUtils;
        this.event = event;
    }

    handler = async () => {
        const reqBody = JSON.parse(this.event.body);
        
        try {
            const claims = this.cognitoService.getClaims(this.event);
            const user = await this.userUtils.getUser(claims.profile);
            const conversationId = this.event.pathParameters.conversationId;

            if (!await this.convoUtils.userHasAccessToConvo(user, conversationId))
                throw errorRepository.createError(4403, new Error('User is not a member of this conversation'));

            const message = await this.convoUtils.sendMessage(user, conversationId, reqBody.messageBody);

            return this.createAPIResponse.Ok({message});
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

exports.sendMessageService = (deps) => {
    return new sendMessage(deps.userUtils, deps.createAPIResponse, deps.cognitoService, deps.convoUtils, deps.event);   
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

    return await exports.sendMessageService(deps).handler();
}
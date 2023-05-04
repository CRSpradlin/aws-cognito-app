const errorRepository = require('./opt/errorRepository');

class getMessages {
    
    constructor(userUtils, createAPIResponse, cognitoService, convoUtils, event) {
        this.userUtils = userUtils;
        this.createAPIResponse = createAPIResponse;
        this.cognitoService = cognitoService;
        this.convoUtils = convoUtils;
        this.event = event;
        this.latest = this.event.queryStringParameters?.latest;
        this.conversationId = this.event.pathParameters.conversationId;
    }

    handler = async () => {
        try {
            // TODO: Add query parameters for Limit and LatestTimeStamp (to query messages before the given time)
            const claims = this.cognitoService.getClaims(this.event);
            const user = await this.userUtils.getUser(claims.sub);

            if (!await this.convoUtils.userHasAccessToConvo(user, this.conversationId)) 
                throw errorRepository.createError(4403, new Error('User is not a member of this conversation'));

            const messages = await this.processGetMessages();

            return this.createAPIResponse.Ok({user, conversationId: this.conversationId, messages});
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
    
    processGetMessages = async () => {
        if (this.latest && parseInt(this.latest) > 0) {
            const latest = parseInt(this.latest);
            return await this.convoUtils.getMessages(this.conversationId, latest);
        } else {
            return await this.convoUtils.getMessages(this.conversationId);
        }
    }
}

exports.getMessagesService = (deps) => {
    return new getMessages(deps.userUtils, deps.createAPIResponse, deps.cognitoService, deps.convoUtils, deps.event);   
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

    return await exports.getMessagesService(deps).handler();
}
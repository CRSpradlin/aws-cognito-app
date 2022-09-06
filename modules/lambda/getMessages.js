const errorRepository = require('./opt/errorRepository');

class getMessages {
    
    constructor(userUtils, createAPIResponse, cognitoService, convoUtils, event) {
        this.userUtils = userUtils;
        this.createAPIResponse = createAPIResponse;
        this.cognitoService = cognitoService;
        this.convoUtils = convoUtils;
        this.event = event;
    }

    handler = async () => {
        try {
            // TODO: Add query parameters for Limit and LatestTimeStamp (to query messages before the given time)
            const claims = this.cognitoService.getClaims(this.event);
            const user = await this.userUtils.getUser(claims.profile);
            const conversationId = this.event.pathParameters.conversationId

            if (!await this.convoUtils.userHasAccessToConvo(user, conversationId)) 
                throw errorRepository.createError(4403, new Error('User is not a member of this conversation'));

            const messages = await this.convoUtils.getMessages(conversationId);

            return this.createAPIResponse.Ok({user, conversationId, messages});
        } catch (error) {
            return this.createAPIResponse.Error(error);
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
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
        //TODO: Get User
        // - Check user is in coversation
        // - Send message

        const reqBody = JSON.parse(this.event.body);
        
        try {
            const claims = this.cognitoService.getClaims(this.event);
            const user = await this.userUtils.getUser(claims.profile);
            // conversionID: reqBody.conversationId
            // messageBody: reqBody.messageBody
            // const body = await this.userUtils.createUser(reqBody.username, reqBody.password, reqBody.email);

            // should there be a check for user in conversation?
            // should there be a check for conversation exists?

            await this.convoUtils.appendMessage(claims.profile, reqBody.conversationId, reqBody.messageBody);

            return this.createAPIResponse.Ok({user, conversationId: this.event.pathParameters.conversationId});
        } catch (error) {
            const newError = errorRepository.createError(1000, error);
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
    const convoUtils = require('/opt/convoUtils');
    const deps = {
        userUtils,
        createAPIResponse,
        cognitoService,
        convoUtils,
        event
    };

    return await exports.sendMessageService(deps).handler();
}
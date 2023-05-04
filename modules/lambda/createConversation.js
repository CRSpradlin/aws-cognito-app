const errorRepository = require('./opt/errorRepository');

class createConversation {
    
    constructor(convoUtils, cognitoService, createAPIResponse, event) {
        this.convoUtils = convoUtils;
        this.cognitoService = cognitoService;
        this.createAPIResponse = createAPIResponse;
        this.event = event;
    }

    handler = async () => {

        const reqBody = JSON.parse(this.event.body);
        
        try {
            const claims = this.cognitoService.getClaims(this.event);
            const response = await this.convoUtils.createConvo(claims.sub, reqBody.members);
            return this.createAPIResponse.Ok(response);
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

exports.createConversationService = (deps) => {
    return new createConversation(deps.convoUtils, deps.cognitoService, deps.createAPIResponse, deps.event);   
}

exports.handler = async (event) => {
    const convoUtils = require('/opt/convoUtils').default();
    const cognitoService = require('/opt/cognitoService');
    const createAPIResponse = require('/opt/createAPIResponse');
    const deps = {
        convoUtils,
        cognitoService,
        createAPIResponse,
        event
    };

    return await exports.createConversationService(deps).handler();
}
const errorRepository = require('./opt/errorRepository');

class socketAuthorizer {
    
    constructor(cognitoService, createAPIResponse, userUtils, event) {
        this.cognitoService = cognitoService;
        this.createAPIResponse = createAPIResponse;
        this.userUtils = userUtils;
        this.token = event.headers.Authorization;
        this.connectionId = event.requestContext.connectionId;
    }

    handler = async () => {
        try {
            if (this.token !== undefined) {
                await this.cognitoService.getUser(this.token);
                //TODO: add connection id to user
            } else {
                throw errorRepository.createError(404);
            }
            
            return this.createAPIResponse.Ok();
        } catch (error) {
            let newError = error;

            if (!error.code) {
                newError = errorRepository.createError(403, error);
            }

            return this.createAPIResponse.Error(newError, newError.code);
        }
    }
}

exports.socketAuthorizerService = (deps) => {
    return new socketAuthorizer(deps.cognitoService, deps.createAPIResponse, deps.userUtils, deps.event);   
}

exports.handler = async (event) => {
    const cognitoService = require('/opt/cognitoService');
    const createAPIResponse = require('/opt/createAPIResponse');
    const userUtils = require('/opt/userUtils');
    const deps = {
        cognitoService,
        createAPIResponse,
        userUtils,
        event
    };

    return await exports.socketAuthorizerService(deps).handler();
}
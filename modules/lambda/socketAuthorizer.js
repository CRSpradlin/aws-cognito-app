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
                const user = await this.cognitoService.getUser(this.token);
                await this.userUtils.addUserSession(user.UserAttributes.find((item) => item.Name == 'profile').Value, this.connectionId);
            } else {
                throw errorRepository.createError(4404);
            }
            
            return this.createAPIResponse.Ok();
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

exports.socketAuthorizerService = (deps) => {
    return new socketAuthorizer(deps.cognitoService, deps.createAPIResponse, deps.userUtils, deps.event);   
}

exports.handler = async (event) => {
    const cognitoService = require('/opt/cognitoService');
    const createAPIResponse = require('/opt/createAPIResponse');
    const userUtils = require('/opt/userUtils').default();
    const deps = {
        cognitoService,
        createAPIResponse,
        userUtils,
        event
    };

    return await exports.socketAuthorizerService(deps).handler();
}
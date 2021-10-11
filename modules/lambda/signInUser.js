const errorRepository = require('./opt/errorRepository');

class signInUser {
    
    constructor(cognitoService, createAPIResponse, event) {
        this.cognitoService = cognitoService;
        this.createAPIResponse = createAPIResponse;
        this.event = event;
    }

    handler = async () => {

        const reqBody = JSON.parse(this.event.body);
        
        try {
            const body = await this.cognitoService.getAuthToken(reqBody.username, reqBody.password);
            const attributes = await this.cognitoService.getUser(body.AuthenticationResult.AccessToken);

            body.UserAttributes = attributes;

            return this.createAPIResponse.Ok(body);
        } catch (error) {
            const newError = errorRepository.createError(1000, error);
            return this.createAPIResponse.Error(newError);
        }
    }
}

exports.signInUserService = (deps) => {
    return new signInUser(deps.cognitoService, deps.createAPIResponse, deps.event);   
}

exports.handler = async (event) => {
    const cognitoService = require('/opt/cognitoService');
    const createAPIResponse = require('/opt/createAPIResponse');
    const deps = {
        cognitoService,
        createAPIResponse,
        event
    };

    return await exports.signInUserService(deps).handler();
}
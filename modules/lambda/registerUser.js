const errorRepository = require('./opt/errorRepository');

class registerUser {
    constructor(cognitoService, createAPIResponse, event) {
        this.cognitoService = cognitoService;
        this.createAPIResponse = createAPIResponse;
        this.event = event;
    }

    handler = async () => {

        const reqBody = JSON.parse(this.event.body);
        
        try {
            const userAttributes = [
                {Name: 'email', Value: reqBody.email}
            ];
    
            const body = await this.cognitoService.createUser(process.env.APP_CLIENT_ID, reqBody.username, reqBody.password, userAttributes);

            return this.createAPIResponse.Ok(body);
        } catch (error) {
            const newError = errorRepository.createError(1000, error);
            return this.createAPIResponse.Error(newError);
        }
    }
}

exports.registerUserService = (deps) => {
    return new registerUser(deps.cognitoService, deps.createAPIResponse, deps.event);   
}

exports.handler = async (event) => {
    const cognitoService = require('/opt/cognitoService');
    const createAPIResponse = require('/opt/createAPIResponse');
    const deps = {
        cognitoService,
        createAPIResponse,
        event
    };

    return await exports.registerUserService(deps).handler();
}
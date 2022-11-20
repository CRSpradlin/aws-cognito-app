const errorRepository = require('./opt/errorRepository');

class confirmUser {
    
    constructor(cognitoService, createAPIResponse, event) {
        this.cognitoService = cognitoService;
        this.createAPIResponse = createAPIResponse;
        this.event = event;
    }

    handler = async () => {

        const reqBody = JSON.parse(this.event.body);
        
        try {
            await this.cognitoService.confirmUser(reqBody.username, reqBody.confirmation);

            return this.createAPIResponse.Ok();
        } catch (error) {
            let newError;
            switch (error.code) {
                case 'CodeMismatchException':
                    newError = errorRepository.createError(1402, error);
                    break;
                default:
                    newError = errorRepository.createError(1000, error);
            }
            return this.createAPIResponse.Error(newError);
        }
    }
}

exports.confirmUserService = (deps) => {
    return new confirmUser(deps.cognitoService, deps.createAPIResponse, deps.event);   
}

exports.handler = async (event) => {
    const cognitoService = require('/opt/cognitoService');
    const createAPIResponse = require('/opt/createAPIResponse');
    const deps = {
        cognitoService,
        createAPIResponse,
        event
    };

    return await exports.confirmUserService(deps).handler();
}
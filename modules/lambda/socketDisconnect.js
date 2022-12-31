const errorRepository = require('./opt/errorRepository'); 

class socketDisconnect {
    
    constructor(createAPIResponse, userUtils, event) {
        this.createAPIResponse = createAPIResponse;
        this.userUtils = userUtils;
        this.connectionId = event.requestContext.connectionId;

        this.event = event;
    }

    handler = async () => {
        try {
            await this.userUtils.removeUserSession(this.connectionId);
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

exports.socketDisconnectService = (deps) => {
    return new socketDisconnect(deps.createAPIResponse, deps.userUtils, deps.event);   
}

exports.handler = async (event) => {
    const createAPIResponse = require('/opt/createAPIResponse');
    const userUtils = require('/opt/userUtils').default();
    const deps = {
        createAPIResponse,
        userUtils,
        event
    };

    return await exports.socketDisconnectService(deps).handler();
}
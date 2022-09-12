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
            return this.createAPIResponse.Error(error);
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
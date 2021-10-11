const errorRepository = require('./opt/errorRepository');

class registerUser {
    
    constructor(userUtils, createAPIResponse, event) {
        this.userUtils = userUtils;
        this.createAPIResponse = createAPIResponse;
        this.event = event;
    }

    handler = async () => {

        const reqBody = JSON.parse(this.event.body);
        
        try {
            const body = await this.userUtils.createUser(reqBody.username, reqBody.password, reqBody.email);
            return this.createAPIResponse.Ok(body);
        } catch (error) {
            const newError = errorRepository.createError(1000, error);
            return this.createAPIResponse.Error(newError);
        }
    }
}

exports.registerUserService = (deps) => {
    return new registerUser(deps.userUtils, deps.createAPIResponse, deps.event);   
}

exports.handler = async (event) => {
    const userUtils = require('/opt/userUtils').default();
    const createAPIResponse = require('/opt/createAPIResponse');
    const deps = {
        userUtils,
        createAPIResponse,
        event
    };

    return await exports.registerUserService(deps).handler();
}
const errorRepository = require('./opt/errorRepository');

class registerUser {
    
    constructor(userUtils, statesUtils, createAPIResponse, event) {
        this.userUtils = userUtils;
        this.statesUtils = statesUtils;
        this.createAPIResponse = createAPIResponse;
        this.event = event;
    }

    handler = async () => {

        const reqBody = JSON.parse(this.event.body);
        
        try {
            const body = await this.userUtils.createUser(reqBody.username, reqBody.password, reqBody.email);

            const stateInput = {
                userProfile: body.UserSub
            };
            await this.statesUtils.startExecution(process.env.APP_USER_CONFRIM_STATE_ARN, stateInput);

            return this.createAPIResponse.Ok(body);
        } catch (error) {
            let newError = error;
            switch (error.code) {
                case errorRepository.REPOSITORY_ERROR_CODE:
                    break;
                case 'UsernameExistsException':
                    newError = errorRepository.createError(1400, error);
                    break;
                case 'InvalidPasswordException':
                    newError = errorRepository.createError(1401, error);
                    break;
                default:
                    newError = errorRepository.createError(1000, error);
            }
            return this.createAPIResponse.Error(newError);
        }
    }
}

exports.registerUserService = (deps) => {
    return new registerUser(deps.userUtils, deps.statesUtils, deps.createAPIResponse, deps.event);   
}

exports.handler = async (event) => {
    const userUtils = require('/opt/userUtils').default();
    const statesUtils = require('/opt/statesUtils');
    const createAPIResponse = require('/opt/createAPIResponse');
    const deps = {
        userUtils,
        statesUtils,
        createAPIResponse,
        event
    };

    return await exports.registerUserService(deps).handler();
}
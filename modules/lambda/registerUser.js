const errorRepository = require('./opt/errorRepository');

class registerUser {
    
    constructor(userUtils, statesService, createAPIResponse, event) {
        this.userUtils = userUtils;
        this.statesService = statesService;
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
            await this.statesService.startExecution(process.env.APP_USER_CONFRIM_STATE_ARN, stateInput);

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
    return new registerUser(deps.userUtils, deps.statesService, deps.createAPIResponse, deps.event);   
}

exports.handler = async (event) => {
    const userUtils = require('/opt/userUtils').default();
    const statesService = require('/opt/statesService');
    const createAPIResponse = require('/opt/createAPIResponse');
    const deps = {
        userUtils,
        statesService,
        createAPIResponse,
        event
    };

    return await exports.registerUserService(deps).handler();
}
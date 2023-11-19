const errorRepository = require('./opt/errorRepository');

class signInUser {
    
    constructor(cognitoService, userUtils, createAPIResponse, event) {
        this.cognitoService = cognitoService;
        this.userUtils = userUtils;
        this.createAPIResponse = createAPIResponse;
        this.event = event;
    }

    handler = async () => {

        const reqBody = JSON.parse(this.event.body);
        let userObj = {};
        
        try {
            const body = await this.cognitoService.getAuthToken(reqBody.username, reqBody.password);
            const cognitoUser = await this.cognitoService.getUser(body.AuthenticationResult.AccessToken);

            userObj = await this.userUtils.getUser(cognitoUser.UserAttributes.find(item => item.Name === 'sub').Value);

            body.User = userObj;

            return this.createAPIResponse.Ok(body);
        } catch (error) {
            let newError = error;
            switch (error.code) {
                case 'NotAuthorizedException':
                case 'InvalidParameterException':
                case 'UserNotFoundException':
                    newError = errorRepository.createError(5404, error);
                    break;
                case 'UserNotConfirmedException':
                    userObj = await this.userUtils.getUser(reqBody.username, true);

                    newError = errorRepository.createError(5504, error);
                    newError.context.user = userObj;
                    break;
                case errorRepository.REPOSITORY_ERROR_CODE:
                    break;
                default:
                    newError = errorRepository.createError(1000, error);
            }
            return this.createAPIResponse.Error(newError);
        }
    }
}

exports.signInUserService = (deps) => {
    return new signInUser(deps.cognitoService, deps.userUtils, deps.createAPIResponse, deps.event);   
}

exports.handler = async (event) => {
    const cognitoService = require('/opt/cognitoService');
    const userUtils = require('/opt/userUtils').default();
    const createAPIResponse = require('/opt/createAPIResponse');
    const deps = {
        cognitoService,
        userUtils,
        createAPIResponse,
        event
    };

    return await exports.signInUserService(deps).handler();
}
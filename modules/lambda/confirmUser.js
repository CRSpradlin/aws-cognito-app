const errorRepository = require('./opt/errorRepository');

class confirmUser {
    
    constructor(dynamoService, userUtils, cognitoService, createAPIResponse, event) {
        this.dynamoService = dynamoService;
        this.userUtils = userUtils;
        this.cognitoService = cognitoService;
        this.createAPIResponse = createAPIResponse;
        this.event = event;
    }

    handler = async () => {

        const reqBody = JSON.parse(this.event.body);
        
        try {
            const userObj = await this.userUtils.getUser(reqBody.profile);

            await this.cognitoService.confirmUser(userObj.name, reqBody.confirmation);

            const additionalConfig = {
                ExpressionAttributeNames: {
                    '#key': 'confirmed'
                },
                ExpressionAttributeValues: {
                    ':value': true
                }
            };
            await this.dynamoService.update('UserData', {profile: reqBody.profile}, 'set #key = :value', additionalConfig);

            return this.createAPIResponse.Ok();
        } catch (error) {
            let newError = error;
            switch (error.code) {
                case errorRepository.REPOSITORY_ERROR_CODE:
                    break;
                case 'InvalidParameterException':
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
    return new confirmUser(deps.dynamoService, deps.userUtils, deps.cognitoService, deps.createAPIResponse, deps.event);   
}

exports.handler = async (event) => {
    const dynamoService = require('/opt/dynamoService');
    const userUtils = require('/opt/userUtils').default();
    const cognitoService = require('/opt/cognitoService');
    const createAPIResponse = require('/opt/createAPIResponse');
    const deps = {
        dynamoService,
        userUtils,
        cognitoService,
        createAPIResponse,
        event
    };

    return await exports.confirmUserService(deps).handler();
}
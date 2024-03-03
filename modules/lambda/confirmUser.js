const errorRepository = require('./opt/errorRepository');

class confirmUser {
    
    constructor(dynamoService, userUtils, cognitoService, statesUtils, createAPIResponse, event) {
        this.dynamoService = dynamoService;
        this.userUtils = userUtils;
        this.cognitoService = cognitoService;
        this.statesUtils = statesUtils;
        this.createAPIResponse = createAPIResponse;
        this.event = event;
    }

    handler = async () => {
        if (this.event.body) {
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
    
                await this.statesUtils.sendTaskSuccess(userObj.confirmationToken);

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
        } else {
            try {
                if (this.event.taskToken) {
                    const additionalConfig = {
                        ExpressionAttributeNames: {
                            '#key': 'confirmationToken'
                        },
                        ExpressionAttributeValues: {
                            ':value': this.event.taskToken
                        }
                    };
                    return await this.dynamoService.update('UserData', {profile: this.event.userProfile}, 'set #key = :value', additionalConfig);
                } else {
                    return await this.userUtils.removeUser(this.event.userProfile);
                }
            } catch (error) {
                let newError = error;
                switch (error.code) {
                    case errorRepository.REPOSITORY_ERROR_CODE:
                        break;
                    default:
                        newError = errorRepository.createError(1000, error);
                }
                throw newError;
            }
        }
    }
}

exports.confirmUserService = (deps) => {
    return new confirmUser(deps.dynamoService, deps.userUtils, deps.cognitoService, deps.statesUtils, deps.createAPIResponse, deps.event);   
}

exports.handler = async (event) => {
    const dynamoService = require('/opt/dynamoService');
    const userUtils = require('/opt/userUtils').default();
    const cognitoService = require('/opt/cognitoService');
    const statesUtils = require('/opt/statesUtils');
    const createAPIResponse = require('/opt/createAPIResponse');
    const deps = {
        dynamoService,
        userUtils,
        cognitoService,
        statesUtils,
        createAPIResponse,
        event
    };

    return await exports.confirmUserService(deps).handler();
}
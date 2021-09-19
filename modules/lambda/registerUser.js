
class registerUser {
    constructor(cognitoService, event) {
        this.cognitoService = cognitoService;
        this.event = event;
    }

    handler = async () => {
        // TODO: Add Service to Relay API Response
        // 1. Should have ability to take in an error
        // 2. Should have ability to send body

        const reqBody = JSON.parse(this.event.body);
        
        const response = {
            statusCode: 200,
            isBase64Encoded: false
        };
        
        try {
            const userAttributes = [
                { Name: 'email', Value: reqBody.email }
            ];
    
            response.body = await this.cognitoService.createUser(process.env.APP_CLIENT_ID, reqBody.username, reqBody.password, userAttributes);
        } catch (error) {
            response.statusCode = 500;
            response.body = {
                event: this.event,
                error: error.message,
                stack: error.stack
            };
        }
        
        response.body = JSON.stringify(response.body);
        
        return response;
    }
}

exports.registerUserService = (deps) => {
    return new registerUser(deps.cognitoService, deps.event);   
}

exports.handler = async (event) => {
    const cognitoService = require('/opt/cognitoService');
    const deps = {
        cognitoService,
        event
    };

    return await exports.registerUserService(deps).handler();
}
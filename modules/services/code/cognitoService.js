const AWS = require('aws-sdk');
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

const self = exports;

self.createUser = async (appClientId, username, password, userAttributes=undefined) => {
    const params = {
        ClientId: appClientId,
        Username: username,
        Password: password,
        UserAttributes: userAttributes
    }

    const response = await cognitoIdentityServiceProvider.signUp(params).promise();
    
    return response;
}
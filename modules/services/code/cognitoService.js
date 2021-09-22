const AWS = require('aws-sdk');
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

const self = exports;

self.createUser = async (username, password, userAttributes=undefined) => {
    const params = {
        ClientId: process.env.APP_CLIENT_ID,
        Username: username,
        Password: password,
        UserAttributes: userAttributes
    };

    const response = await cognitoIdentityServiceProvider.signUp(params).promise();
    
    return response;
};

self.getAuthToken = async (username, password) => {
    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH', /* required */
        ClientId: process.env.APP_CLIENT_ID, /* required */
        AuthParameters: {
          'USERNAME': username,
          'PASSWORD': password
        }
    };

    const response = await cognitoIdentityServiceProvider.initiateAuth(params).promise();

    return response;
};
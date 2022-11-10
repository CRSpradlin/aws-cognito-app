const errorRepository = require('./errorRepository');

const self = exports;

const HEADERS = {
    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Accept,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

self.Ok = (body = null, statusCode = 204) => {
    const response = {
        headers: HEADERS,
        isBase64Encoded: false,
        statusCode
    }
    
    if (body) {
        response.statusCode = statusCode === 204 ? 200 : statusCode
        response.body = JSON.stringify(body);
    }

    return response;
};

self.Error = (error, statusCode = undefined) => {
    if (!statusCode){
        statusCode = error.defaultStatusCode ? error.defaultStatusCode : 500
    }

    if (!error.defaultStatusCode) {
        error = errorRepository.createError(1000, error);
    }

    const body = {
        error: {
            message: error.message,
            code: error.code,
        },
        context: error.context
    }

    const response = {
        headers: HEADERS,
        isBase64Encoded: false,
        body: JSON.stringify(body),
        statusCode
    }

    return response;
};
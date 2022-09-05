const self = exports;

const ERRORS = [
    {
        errorCode: 4403,
        name: 'UnAuthorized',
        message: 'You are not authorized to access this resource',
        defaultStatusCode: 403
    },
    {
        errorCode: 4404,
        name: 'Resource Not Found',
        message: 'The resource you have requested does not exist',
        defaultStatusCode: 404
    },
    {
        errorCode: 1000,
        name: 'GENERIC_LAMBDA_ERROR',
        message: 'An error has occured during a lambda function execution runtime',
        defaultStatusCode: 500
    }
];

self.createError = (errorCode, originalError = undefined) => {
    const errorDetails = ERRORS.find(err => { return err.errorCode === errorCode });
    const error = new Error();
    error.message = errorDetails.message;
    error.code = errorDetails.errorCode;
    error.context = originalError;
    error.defaultStatusCode = errorDetails.defaultStatusCode;

    if (originalError instanceof Error) {
        error.context = originalError.message;
        console.log('Error Encountered: ', originalError);
    }

    return error;
};
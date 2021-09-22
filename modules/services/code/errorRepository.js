const self = exports;

const ERRORS = [
    {
        errorCode: 1000,
        name: 'GENERIC_LAMBDA_ERROR',
        message: 'An error has occured during a lambda function execution runtime'
    }
];

self.createError = (errorCode, originalError = undefined) => {
    const errorDetails = ERRORS.find(err => { return err.errorCode === errorCode });
    const error = new Error();
    error.message = errorDetails.message;
    error.code = errorDetails.errorCode;
    error.context = originalError;

    if (originalError) {
        error.stack = originalError.stack;
        error.devMessage = originalError.message;
    }

    return error;
};
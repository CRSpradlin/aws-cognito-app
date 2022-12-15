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
        name: 'Unknown Error',
        message: 'An error has occured during processing your request, please try again later',
        defaultStatusCode: 500
    },
    {
        errorCode: 1400,
        name: 'User Already Exists',
        message: 'User with that username already exists, please try another one',
        defaultStatusCode: 400
    },
    {
        errorCode: 1401,
        name: 'Invalid Password',
        message: 'Password must be longer than 8 characters, include at least an uppercase character, lowercase character, a number and a symbol character.',
        defaultStatusCode: 400
    },
    {
        errorCode: 1402,
        name: 'Invalid Confirmation Code',
        message: 'The confirmation code you entered is incorrect, please be sure you have entered the proper code sent to your email',
        defaultStatusCode: 400
    },
    {
        errorCode: 1403,
        name: 'No Support Email Defined',
        message: 'You have tried to email application logs to support but no support email has been defined within the application infrastructure',
        defaultStatusCode: 400
    }
];

self.createError = (errorCode, originalError = undefined) => {
    const errorDetails = ERRORS.find(err => { return err.errorCode === errorCode });
    const error = new Error();
    error.message = errorDetails.message;
    error.code = errorDetails.errorCode;
    error.context = originalError;
    error.defaultStatusCode = errorDetails.defaultStatusCode;

    if (originalError instanceof Error && errorCode === 1000) {
        error.context = originalError.message;
        console.error('Uknown Error with Code 1000 Encountered. ', 'Original Error: ', originalError);
    }

    return error;
};
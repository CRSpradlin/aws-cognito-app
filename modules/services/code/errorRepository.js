const self = exports;

const ERRORS = [
    {
        errorCode: 4403,
        name: 'UnAuthorized',
        message: 'You are not authorized to access this resource.',
        defaultStatusCode: 403
    },
    {
        errorCode: 4404,
        name: 'Resource Not Found',
        message: 'The resource you have requested does not exist.',
        defaultStatusCode: 404
    },
    {
        errorCode: 5404,
        name: 'User Not Found',
        message: 'Username and Password combination not found.',
        defaultStatusCode: 404
    },
    {
        errorCode: 5504,
        name: 'User Not Confirmed',
        message: 'The user has not been confirmed.',
        defaultStatusCode: 403
    },
    {
        errorCode: 1000,
        name: 'Unknown Error',
        message: 'An error has occured during processing your request, please try again later.',
        defaultStatusCode: 500
    },
    {
        errorCode: 1400,
        name: 'User Already Exists',
        message: 'User with that username already exists, please try another one.',
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
        message: 'The confirmation code you entered is incorrect, please be sure you have entered the proper code sent to your email.',
        defaultStatusCode: 400
    },
    {
        errorCode: 1403,
        name: 'No Support Email Defined',
        message: 'You have tried to email application logs to support but no support email has been defined within the application infrastructure.',
        defaultStatusCode: 400
    }
];

self.REPOSITORY_ERROR_CODE = 'REPOSITORY ERROR';

self.createError = (errorCode, originalError = undefined) => {
    const errorDetails = ERRORS.find(err => { return err.errorCode === errorCode });
    const error = new Error();
    error.message = errorDetails.message;
    error.code = self.REPOSITORY_ERROR_CODE;
    error.repoCode = errorDetails.errorCode;
    error.context = originalError;
    error.defaultStatusCode = errorDetails.defaultStatusCode;

    if (originalError instanceof Error && errorCode === 1000) {
        error.context = originalError.message;
        console.error('Uknown Error with Code 1000 Encountered. ', 'Original Error: ', originalError);
    }

    return error;
};
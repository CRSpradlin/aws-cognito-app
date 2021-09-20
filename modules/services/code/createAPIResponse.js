const self = exports;

self.Ok = (body, statusCode = 200) => {
    const response = {
        isBase64Encoded: false,
        body: JSON.stringify(body),
        statusCode
    }

    return response;
}

self.Error = (error, statusCode = 400) => {
    const body = {
        error: {
            message: error.message,
            code: error.code,
        },
        context: error.context
    }

    const response = {
        isBase64Encoded: false,
        body: JSON.stringify(body),
        statusCode
    }

    return response;
}
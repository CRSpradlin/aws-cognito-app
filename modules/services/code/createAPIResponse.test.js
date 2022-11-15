
const createAPIResponse = require('./createAPIResponse');
const errorRepository = require('./errorRepository');

const HEADERS = {
    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Accept,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'    
}

describe('Test createAPIResponse', () => {
    test('Test Ok call', async () => {
        const mockBody = {message: 'mockBody'};
        const expectedAPIResponse = {
            isBase64Encoded: false,
            body: JSON.stringify(mockBody),
            statusCode: 200,
            headers: HEADERS
        }

        const apiResponse = createAPIResponse.Ok(mockBody);

        expect(apiResponse).toEqual(expectedAPIResponse);
    });

    test('Test Ok call with specified statusCode', async () => {
        const mockBody = {message: 'mockBody'};
        const expectedAPIResponse = {
            isBase64Encoded: false,
            body: JSON.stringify(mockBody),
            statusCode: 205,
            headers: HEADERS
        };

        const apiResponse = createAPIResponse.Ok(mockBody, 205);

        expect(apiResponse).toEqual(expectedAPIResponse);
    });

    test('Test Ok call with no body', async () => {
        const expectedAPIResponse = {
            isBase64Encoded: false,
            statusCode: 204,
            headers: HEADERS
        };

        const apiResponse = createAPIResponse.Ok();

        expect(apiResponse).toEqual(expectedAPIResponse);
    });

    test('Test Ok call with body', async () => {
        const mockBody = {message: 'mockBody'};
        const expectedAPIResponse = {
            isBase64Encoded: false,
            body: JSON.stringify(mockBody),
            statusCode: 200,
            headers: HEADERS
        };

        const apiResponse = createAPIResponse.Ok(mockBody);

        expect(apiResponse).toEqual(expectedAPIResponse);
    });

    test('Test Error call', async () => {
        const mockError = errorRepository.createError(1000);
        const expectedAPIResponse = {
            isBase64Encoded: false,
            body: JSON.stringify({
                info: {
                    message: 'An error has occured during a lambda function execution runtime',
                    code: 1000
                }
            }),
            statusCode: 500,
            headers: HEADERS
        };

        const apiResponse = createAPIResponse.Error(mockError);

        expect(apiResponse).toEqual(expectedAPIResponse);
    });

    test('Test Error call with specified statusCode', async () => {
        const mockError = errorRepository.createError(1000);
        const expectedAPIResponse = {
            isBase64Encoded: false,
            body: JSON.stringify({
                info: {
                    message: 'An error has occured during a lambda function execution runtime',
                    code: 1000
                }
            }),
            statusCode: 501,
            headers: HEADERS
        };

        const apiResponse = createAPIResponse.Error(mockError, 501);

        expect(apiResponse).toEqual(expectedAPIResponse);
    });

    test('Test Error call with non-repository error', async () => {
        const mockError = new Error('Unexpected Error')

        const expectedAPIResponse = {
            isBase64Encoded: false,
            body: JSON.stringify({
                info: {
                    message: 'An error has occured during a lambda function execution runtime',
                    code: 1000
                },
                context: 'Unexpected Error'
            }),
            statusCode: 500,
            headers: HEADERS
        };

        const apiResponse = createAPIResponse.Error(mockError);

        expect(apiResponse).toEqual(expectedAPIResponse);
    });
})
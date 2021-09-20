
const createAPIResponse = require('./createAPIResponse');
const errorRepository = require('./errorRepository');

describe('Test createAPIResponse', () => {
    test('Test Ok call', async () => {
        const mockBody = { message: 'mockBody' };
        const expectedAPIResponse = {
            isBase64Encoded: false,
            body: JSON.stringify(mockBody),
            statusCode: 200
        }

        const apiResponse = createAPIResponse.Ok(mockBody);

        expect(apiResponse).toEqual(expectedAPIResponse);
    });

    test('Test Ok call with specified statusCode', async () => {
        const mockBody = { message: 'mockBody' };
        const expectedAPIResponse = {
            isBase64Encoded: false,
            body: JSON.stringify(mockBody),
            statusCode: 201
        };

        const apiResponse = createAPIResponse.Ok(mockBody, 201);

        expect(apiResponse).toEqual(expectedAPIResponse);
    });

    test('Test Error call', async () => {
        const mockError = errorRepository.createError(1000);
        const expectedAPIResponse = {
            isBase64Encoded: false,
            body: JSON.stringify({
                error: {
                    message: 'An error has occured during a lambda function execution runtime',
                    code: 1000
                }
            }),
            statusCode: 400
        };

        const apiResponse = createAPIResponse.Error(mockError);

        expect(apiResponse).toEqual(expectedAPIResponse);
    });

    test('Test Error call with specified statusCode', async () => {
        const mockError = errorRepository.createError(1000);
        const expectedAPIResponse = {
            isBase64Encoded: false,
            body: JSON.stringify({
                error: {
                    message: 'An error has occured during a lambda function execution runtime',
                    code: 1000
                }
            }),
            statusCode: 500
        };

        const apiResponse = createAPIResponse.Error(mockError, 500);

        expect(apiResponse).toEqual(expectedAPIResponse);
    });
})
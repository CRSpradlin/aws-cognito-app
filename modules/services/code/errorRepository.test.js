const errorRepository = require('./errorRepository');

describe('Test errorRepository', () => {
    test('Test 1000 error', async () => {
        const mockOriginalError = new Error('originalMessage');

        const errorRepositoryObj = errorRepository.createError(1000, mockOriginalError);

        expect(errorRepositoryObj.message).toEqual('An error has occured during a lambda function execution runtime');
        expect(errorRepositoryObj.devMessage).toEqual('originalMessage');
    });
})
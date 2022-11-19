const errorRepository = require('./errorRepository');

describe('Test errorRepository', () => {
    // TODO: Turn into for loop to test all errors
    test('Test error creation', async () => {
        const mockOriginalError = new Error('originalMessage');

        const errorRepositoryObj = errorRepository.createError(1000, mockOriginalError);

        expect(errorRepositoryObj.message).toEqual('An error has occured during processing your request, please try again later');
        expect(errorRepositoryObj.context).toEqual('originalMessage');
    });
})
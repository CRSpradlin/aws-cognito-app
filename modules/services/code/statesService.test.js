
const statesService = require('./statesService');

const mockResponse = 'mockResponse';

const mockStepFunctionsResponse = jest.fn().mockResolvedValue(mockResponse);

jest.mock('@aws-sdk/client-sfn', () => {
    class MockStepFunctions {
        constructor() {}

        sendTaskSuccess = async (params) => {return mockStepFunctionsResponse(params)}
        startExecution = async (params) => {return mockStepFunctionsResponse(params)}
    }

    return {
        SFN: MockStepFunctions
    };
});

describe('Test statesService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    })

    test("Test sendTaskSuccess call with payload", async () => {
        const mockToken = 'mockToken';
        const mockPayload = 'mockPayload';

        const response = await statesService.sendTaskSuccess(mockToken, mockPayload);
        expect(response).toEqual(mockResponse);
        const expectedParams = {
            output: JSON.stringify('mockPayload'), //need to be a string
            taskToken: 'mockToken'
        };
        expect(mockStepFunctionsResponse).toHaveBeenCalledWith(expectedParams);
    });

    test("Test sendTaskSuccess call without payload", async () => {
        const mockToken = 'mockToken';

        const response = await statesService.sendTaskSuccess(mockToken);
        expect(response).toEqual(mockResponse);
        const expectedParams = {
            output: JSON.stringify(null), //need to be a string
            taskToken: 'mockToken'
        };
        expect(mockStepFunctionsResponse).toHaveBeenCalledWith(expectedParams);
    });

    test("Test startExecution call with input", async () => {
        const mockStateMachineArn = 'mockStateMachineArn';
        const mockInput = 'mockInput';

        const response = await statesService.startExecution(mockStateMachineArn, mockInput);
        expect(response).toEqual(mockResponse);
        const expectedParams = {
            input: JSON.stringify('mockInput'), //need to be a string
            stateMachineArn: 'mockStateMachineArn'
        };
        expect(mockStepFunctionsResponse).toHaveBeenCalledWith(expectedParams);
    });

    test("Test startExecution call without input", async () => {
        const mockStateMachineArn = 'mockStateMachineArn';

        const response = await statesService.startExecution(mockStateMachineArn);
        expect(response).toEqual(mockResponse);
        const expectedParams = {
            input: JSON.stringify(null), //need to be a string
            stateMachineArn: 'mockStateMachineArn'
        };
        expect(mockStepFunctionsResponse).toHaveBeenCalledWith(expectedParams);
    });
})
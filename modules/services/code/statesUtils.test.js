
const AWS = require('aws-sdk');
const statesUtils = require('./statesUtils');

const mockResponse = 'mockResponse';

const mockStepFunctionsResponse = jest.fn().mockResolvedValue(mockResponse);

jest.mock('aws-sdk', () => {
    return {
        StepFunctions: jest.fn(() => {
            return {
                sendTaskSuccess: jest.fn((params) => {
                    return {
                        promise: async () => {return mockStepFunctionsResponse(params)}
                    };
                }),
                startExecution: jest.fn((params) => {
                    return {
                        promise: async () => {return mockStepFunctionsResponse(params)}
                    };
                }),
            };
        }),
    };
});

describe('Test statesUtils', () => {
    beforeEach(() => {
        AWS // Needed for eslint usage
        jest.clearAllMocks();
        jest.resetModules();
    })

    test("Test sendTaskSuccess call with payload", async () => {
        const mockToken = 'mockToken';
        const mockPayload = 'mockPayload';

        const response = await statesUtils.sendTaskSuccess(mockToken, mockPayload);
        expect(response).toEqual(mockResponse);
        const expectedParams = {
            output: JSON.stringify('mockPayload'), //need to be a string
            taskToken: 'mockToken'
        };
        expect(mockStepFunctionsResponse).toHaveBeenCalledWith(expectedParams);
    });

    test("Test sendTaskSuccess call without payload", async () => {
        const mockToken = 'mockToken';

        const response = await statesUtils.sendTaskSuccess(mockToken);
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

        const response = await statesUtils.startExecution(mockStateMachineArn, mockInput);
        expect(response).toEqual(mockResponse);
        const expectedParams = {
            input: JSON.stringify('mockInput'), //need to be a string
            stateMachineArn: 'mockStateMachineArn'
        };
        expect(mockStepFunctionsResponse).toHaveBeenCalledWith(expectedParams);
    });

    test("Test startExecution call without input", async () => {
        const mockStateMachineArn = 'mockStateMachineArn';

        const response = await statesUtils.startExecution(mockStateMachineArn);
        expect(response).toEqual(mockResponse);
        const expectedParams = {
            input: JSON.stringify(null), //need to be a string
            stateMachineArn: 'mockStateMachineArn'
        };
        expect(mockStepFunctionsResponse).toHaveBeenCalledWith(expectedParams);
    });
})
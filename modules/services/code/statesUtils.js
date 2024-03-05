var AWS = require("aws-sdk");
var states = new AWS.StepFunctions();

const self = exports;


self.sendTaskSuccess = async (token, payload = null) => {
    const params = {
        output: JSON.stringify(payload), //need to be a string
        taskToken: token
    };
    
    return await states.sendTaskSuccess(params).promise();
}

self.startExecution = async (stateMachineArn, input = null) => {
    const params = {
        stateMachineArn,
        input: JSON.stringify(input)
    };

    return await states.startExecution(params).promise();
}
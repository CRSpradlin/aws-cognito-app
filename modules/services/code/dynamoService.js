const {DynamoDBDocument} = require("@aws-sdk/lib-dynamodb");
const {DynamoDB} = require("@aws-sdk/client-dynamodb");

const documentClient = DynamoDBDocument.from(new DynamoDB());

const self = exports;

// var params = {
//     TableName : 'Table',
//     Key: {
//       HashKey: 'hashkey'
//     }
//   };

//   var documentClient = new AWS.DynamoDB.DocumentClient();

//   documentClient.get(params, function(err, data) {
//     if (err) console.log(err);
//     else console.log(data);
//   });

self.get = async (tableName, key) => {

    const params = {
        TableName: tableName,
        Key: key
    };

    const response = await documentClient.get(params);

    return response.Item;
}

// var params = {
//     TableName : 'Table',
//     Item: {
//        HashKey: 'haskey',
//        NumAttribute: 1,
//        BoolAttribute: true,
//        ListAttribute: [1, 'two', false],
//        MapAttribute: { foo: 'bar'},
//        NullAttribute: null
//     }
//   };

//   var documentClient = new AWS.DynamoDB.DocumentClient();

//   documentClient.put(params, function(err, data) {
//     if (err) console.log(err);
//     else console.log(data);
//   });

self.put = async (tableName, item) => {

    const params = {
        TableName: tableName,
        Item: item
    }

    const response = await documentClient.put(params);

    return response;
}

self.delete = async (tableName, key) => {
    const params = {
        TableName: tableName,
        Key: key
    };

    const response = await documentClient.delete(params);

    return response;
}

self.update = async (tableName, key, updateExpression, additionalConfig={}) => {
    const params = {
        TableName: tableName,
        Key: key,
        UpdateExpression : updateExpression,
        ReturnValues: "UPDATED_NEW",
        ...additionalConfig
    };

    const response = await documentClient.update(params);
    
    return response;
}

self.query = async (tableName, keyConditionExpression, expressionAttributeValues, additionalConfig = {}) => {
    var params = {
        TableName: tableName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ...additionalConfig
    };

    const response = await documentClient.query(params);

    return response.Items;
}
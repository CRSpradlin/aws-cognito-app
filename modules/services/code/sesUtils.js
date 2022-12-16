var AWS = require("aws-sdk");
var ses = new AWS.SES({region: "us-east-1"});

const zlib = require('zlib');
const errorRepository = require('./errorRepository');

exports.gunzip = (base64BufferData) => {
  return new Promise((resolve, reject) => {
    zlib.gunzip(base64BufferData, function(e, result) {
      if (e) { 
          reject(e);
      } else {
          result = JSON.parse(result.toString());
          resolve(JSON.stringify(result, null, 2));
      }
    });
  });
}

exports.sendHTMLToSupport = async (html) => {
  if (process.env.APP_SUPPORT_EMAIL.trim() === "") {
    throw errorRepository.createError(1403);
  }

  var params = {
    Destination: {
      ToAddresses: [process.env.APP_SUPPORT_EMAIL],
    },
    Message: {
      Body: {
        Html: {
            Charset: "UTF-8", 
            Data: html
        },
      },

      Subject: {Data: process.env.APP_NAME + ' Automated Alert'},
    },
    Source: process.env.APP_SUPPORT_EMAIL,
  };
 
  return await ses.sendEmail(params).promise()
}; 
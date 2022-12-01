var AWS = require("aws-sdk");
var ses = new AWS.SES({region: "us-east-1"});

const errorRepository = require('./errorRepository');

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

      Subject: {Data: `${process.env.APP_NAME} Automated Alert`},
    },
    Source: process.env.APP_SUPPORT_EMAIL,
  };
 
  return await ses.sendEmail(params).promise()
}; 
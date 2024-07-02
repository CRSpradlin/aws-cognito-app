
const zlib = require('zlib');
const sesService = require('./sesService');

const errorRepository = require('./errorRepository');
const mockResponse = 'mockResponse';

const mockSendEmailResponse = jest.fn().mockResolvedValue(mockResponse);


jest.mock('@aws-sdk/client-ses', () => {
    class mockSES {
        constructor(){}
    
        sendEmail = async (params) => {return mockSendEmailResponse(params)}
    }

    return {
        SES: mockSES 
    }
});

let mockCallbackErrorParam = null;
let base64DataParam = 'base64Data';
jest.mock('zlib', () => {
    return {
        gunzip: (bufferedData, callback) => {
            callback(mockCallbackErrorParam, JSON.stringify({mockResponse: mockResponse}));
            expect(bufferedData).equal(base64DataParam);
        }
    }
});

describe('Test sesService', () => {
    beforeEach(() => {
        zlib
    });

    test('Test gunzip call', async () => {
        const response = await sesService.gunzip(base64DataParam);
        expect(response).toEqual('{\n  "mockResponse": "mockResponse"\n}');
    });

    test('Test gunzip call with error', async () => {
        const expectedError = new Error('test error');
        mockCallbackErrorParam = expectedError;
        try {
            await sesService.gunzip(base64DataParam);
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
        expect.assertions(1);
    })

    test('Test sendToSupportEmail call', async () => {
        process.env.APP_SUPPORT_EMAIL = 'example@example.com';
        process.env.APP_NAME = 'Test App Name';
        const expectedParams = {
            Destination: {
              ToAddresses: ['example@example.com'],
            },
            Message: {
              Body: {
                Html: {
                    Charset: "UTF-8", 
                    Data: 'test html'
                },
              },
        
              Subject: {Data: 'Test App Name Automated Alert'},
            },
            Source: process.env.APP_SUPPORT_EMAIL,
          }

        const response = await sesService.sendHTMLToSupport('test html');

        expect(mockSendEmailResponse).toHaveBeenCalledWith(expectedParams);
        expect(response).toEqual(mockResponse);
    });

    test('Test sendToSupportEmail call with undefined email error thrown', async () => {
        process.env.APP_SUPPORT_EMAIL = '';
        process.env.APP_NAME = 'Test App Name';
        const expectedError = errorRepository.createError(1403);

        try {
            await sesService.sendHTMLToSupport('test html');
        } catch (error) {
            expect(error).toEqual(expectedError);
        }

        expect.assertions(1);
    });
})
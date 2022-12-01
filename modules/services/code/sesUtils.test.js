const AWS = require('aws-sdk');
const sesUtils = require('./sesUtils');

const errorRepository = require('./errorRepository');
const mockResponse = 'mockResponse';

const mockSendEmailResponse = jest.fn().mockResolvedValue(mockResponse);

jest.mock('aws-sdk', () => {
    return {
        SES: jest.fn(() => {
            return {
                sendEmail: jest.fn((params) => {
                    return {
                        promise: async () => {return mockSendEmailResponse(params)}
                    }
                })
            }
        })
    }
});

describe('Test sesUtils', () => {
    beforeEach(() => {
        AWS // Needed for eslint usage
    });

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

        const response = await sesUtils.sendHTMLToSupport('test html');

        expect(mockSendEmailResponse).toHaveBeenCalledWith(expectedParams);
        expect(response).toEqual(mockResponse);
    });

    test('Test sendToSupportEmail call with undefined email error thrown', async () => {
        process.env.APP_SUPPORT_EMAIL = '';
        process.env.APP_NAME = 'Test App Name';
        const expectedError = errorRepository.createError(1403);

        try {
            await sesUtils.sendHTMLToSupport('test html');
        } catch (error) {
            expect(error).toEqual(expectedError);
        }

        expect.assertions(1);
    });
})
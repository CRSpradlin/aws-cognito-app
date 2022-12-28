
const emailToSupport = require('./emailToSupport');
const errorRepository = require('./opt/errorRepository');

const mockSESUtils = { };

let instance;
let event = {
    awslogs: {
        data: 'data'
    }
};

describe('Test emailToSupport', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    })

    beforeEach(() => {
        const deps = {
            sesUtils: mockSESUtils,
            event: event
        }

        instance = emailToSupport.emailToSupportService(deps);
    });

    test('Test handler call', async () => {
        mockSESUtils.gunzip = jest.fn().mockResolvedValue('data');
        mockSESUtils.sendHTMLToSupport = jest.fn().mockResolvedValue(true);
        
        await instance.handler();

        expect(mockSESUtils.gunzip).toHaveBeenCalledWith(Buffer.from('data', 'base64'));
        expect(mockSESUtils.sendHTMLToSupport).toHaveBeenCalledWith('<html><body><h1>1000 Error Has Been Logged</h1><br><br><code>data</code></body></html>');
    });

    test('Test handler call with caught errorRepository error', async () => {
        const mockError = errorRepository.createError(1403);
        mockSESUtils.gunzip = jest.fn().mockImplementation(() => {
            throw mockError;
        });

        try {
            await instance.handler();
        } catch (error) {
            expect(error).toEqual(mockError);
        }

        expect.assertions(1);      
    });

    test('Test handler call with unexpected error', async () => {
        const mockError = new Error('test error');
        mockSESUtils.gunzip = jest.fn().mockImplementation(() => {
            throw mockError;
        });

        const expectedError = errorRepository.createError(1000, mockError);

        try {
            await instance.handler();
        } catch (error) {
            expect(error).toEqual(expectedError);
        }

        expect.assertions(1);
    });

    test('Test lambda handler export', async () => {
        jest.mock('/opt/sesUtils', () => { return { }}, {virtual: true});

        const mockEvent = 'mockEvent';

        const mockEmailToSupport = require('./emailToSupport');
        mockEmailToSupport.emailToSupportService = jest.fn().mockImplementation(() => {
            return {
                handler: jest.fn().mockResolvedValue('mockHandlerResponse')
            }
        });

        const response = await mockEmailToSupport.handler(mockEvent);

        expect(response).toEqual('mockHandlerResponse');
        expect(mockEmailToSupport.emailToSupportService).toHaveBeenCalledWith({
            sesUtils: { },
            event: mockEvent
        });
    });
});
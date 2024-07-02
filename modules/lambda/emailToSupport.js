const errorRepository = require('./opt/errorRepository');

class emailToSupport {
    
    constructor(sesService, event) {
        this.sesService = sesService;
        this.event = event;
    }

    handler = async () => {
        try {
            const payload = Buffer.from(this.event.awslogs.data, 'base64');

            let errorLoggedStr = await this.sesService.gunzip(payload);
            const htmlBody = '<html><body><h1>1000 Error Has Been Logged</h1><br><br><code>' + errorLoggedStr + '</code></body></html>';
            
            await this.sesService.sendHTMLToSupport(htmlBody);
        } catch (error) {
            let newError = error;
            switch (error.__type) {
                case errorRepository.REPOSITORY_ERROR_CODE:
                    break;
                default:
                    newError = errorRepository.createError(1000, error);
            }
            throw newError;
        }
    }
}

exports.emailToSupportService = (deps) => {
    return new emailToSupport(deps.sesService, deps.event);   
}

exports.handler = async (event) => {
    const sesService = require('/opt/sesService');
    const deps = {
        sesService,
        event
    };

    return await exports.emailToSupportService(deps).handler();
}
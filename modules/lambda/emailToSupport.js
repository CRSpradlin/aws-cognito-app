const errorRepository = require('/opt/errorRepository');

class emailToSupport {
    
    constructor(sesUtils, event) {
        this.sesUtils = sesUtils;
        this.event = event;
    }

    handler = async () => {
        try {
            const payload = Buffer.from(this.event.awslogs.data, 'base64');

            let errorLoggedStr = await this.sesUtils.gunzip(payload);
            const htmlBody = '<html><body><h1>1000 Error Has Been Logged</h1><br><br><code>' + errorLoggedStr + '</code></body></html>';
            
            await this.sesUtils.sendHTMLToSupport(htmlBody);
        } catch (error) {
            const newError = errorRepository.createError(1000, error);
            return this.createAPIResponse.Error(newError);
        }
    }
}

exports.emailToSupportService = (deps) => {
    return new emailToSupport(deps.sesUtils, deps.event);   
}

exports.handler = async (event) => {
    const sesUtils = require('/opt/sesUtils');
    const deps = {
        sesUtils,
        event
    };

    return await exports.emailToSupportService(deps).handler();
}
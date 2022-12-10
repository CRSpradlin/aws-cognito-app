const errorRepository = require('./opt/errorRepository');

class emailToSupport {
    
    constructor(sesUtils, event) {
        this.sesUtils = sesUtils
        this.event = event;
    }

    handler = async () => {

        const reqBody = JSON.parse(this.event.body);
        
        try {
            console.log(reqBody);
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
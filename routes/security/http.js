function sendJson(res, payload) {
    res.type('application/json');
    if (typeof payload === 'string') {
        return res.send(payload);
    }
    return res.send(JSON.stringify(payload));
}

function jsonRoute(handler) {
    return async (req, res, next) => {
        try {
            sendJson(res, await handler(req, res));
        }
        catch(e) {
            next(e);
        }
    };
}

function successRoute(handler) {
    return async (req, res) => {
        try {
            sendJson(res, {success: !!await handler(req, res)});
        }
        catch(e) {
            console.log(e);
            sendJson(res, {success: false});
        }
    };
}

module.exports = {sendJson, jsonRoute, successRoute};

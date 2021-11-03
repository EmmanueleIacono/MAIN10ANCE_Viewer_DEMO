function controllaLoggedIn(req, res, next) {
    if (req.signedCookies.user_id) {
        next();
    }
    else {
        res.status(401).send({message: 'Non autorizzato'});
    }
}

function consentiAccesso(req, res, next) {
    if (req.signedCookies.user_id === req.params.username) {
        next();
    }
    else {
        res.status(401).send({message: 'Non autorizzato'});
    }
}

function controllaRuoli(req, res, next) {
    if (req.signedCookies.role === 'amministratore') {
        next();
    }
    else {
        res.status(401).send({message: 'Non autorizzato'});
    }
}

module.exports = {controllaLoggedIn, consentiAccesso, controllaRuoli};

import type {Request, Response, NextFunction} from 'express';

function controllaLoggedIn(req: Request, res: Response, next: NextFunction) {
    if (req.signedCookies.user_id) {
        next();
    }
    else {
        res.status(401).send({message: 'Non autorizzato'});
    }
}

function consentiAccesso(req: Request, res: Response, next: NextFunction) {
    const usr = req.path.split('/')[2];
    if (req.signedCookies.user_id === usr) {
        next();
    }
    else {
        res.status(401).send({message: 'Non autorizzato'});
    }
}

function controllaRuoli(stringaRuoli = '') {
    return (req: Request, res: Response, next: NextFunction) => {
        const listaRuoli = stringaRuoli.split(' ');
        if (listaRuoli.includes(req.signedCookies.role)) {
            next();
        }
        else {
            res.status(401).send({message: 'Non autorizzato'});
        }
    };
}

module.exports = {controllaLoggedIn, consentiAccesso, controllaRuoli};

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
router.use(express.json());

const {clientServ} = require('../database/connessioni');

// questi percorsi di route sono sempre preceduti da /auth (vedi index.js)

router.post('/signup', async (req, res, next) => {
    if (validazioneUsers(req.body)) {
        const datiUtente = await getUtenteByNome(req.body.username);
        // se non trovo nessun nome utente, ricevo "undefined"
        // se ricevo "undefined", il nuovo nome utente è disponibile
        if (!datiUtente) {
            const hash = await bcrypt.hash(req.body.pw, 10);
            const user = {
                username: req.body.username,
                pw: hash
            };
            const successo = await insertNuovoUtente(user);
            if (successo) {
                res.json({
                    message: 'Registrazione completata'
                });
            }
            else {
                res.status(500).send({message: 'Registrazione fallita, riprovare'});
            }
        }
        else {
            res.status(401).send({message: 'ATTENZIONE: Il nome utente è già in uso'});
        }
    }
    else {
        res.status(400).send({message: 'Dati utente non validi'});
    }
});

router.post('/login', async (req, res, next) => {
    if (validazioneUsers(req.body)) {
        // controlla se utente è presente in db
        const datiUtente = await getUtenteByNome(req.body.username);
        // se l'utente non è registrato, ricevo "undefined"
        // se ricevo un nome utente valido, l'account esiste
        if (datiUtente) {
            // confronta con pw in db -> comp è bool
            const comp = await bcrypt.compare(req.body.pw, datiUtente.pw);
            if (comp) {
                const roleSettings = await getSettingsByRuolo(datiUtente.role);
                res.cookie('user_id', datiUtente.username, {
                    httpOnly: true,
                    secure: (!process.env.DEV_PLACEHOLDER),
                    signed: true
                });
                res.cookie('role', datiUtente.role, {
                    httpOnly: true,
                    secure: (!process.env.DEV_PLACEHOLDER),
                    signed: true
                });
                res.json({
                    message: 'Login completato',
                    id: datiUtente.username,
                    bim_vw_sets: roleSettings.bim_vw_sets,
                    usr_vw: roleSettings.usr_vw
                });
            }
            else {
                res.status(401).send({message: 'ATTENZIONE: Nome utente o password non validi'});
            }
        }
        else {
            res.status(401).send({message: 'ATTENZIONE: Nome utente o password non validi'});
        }
    }
    else {
        res.status(400).send({message: 'Dati utente non validi'});
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('user_id');
    res.clearCookie('role');
    res.json({
        message: 'Logout avvenuto con successo'
    });
});

// validazione TRUE se nome e pw sono corrette
// validazione FALSE se campo nome è vuoto o mancante
// validazione FALSE se campo pw è vuoto o incorretto
function validazioneUsers(user) {
    const validUsername = typeof user.username == 'string' && user.username.trim() != '';
    const validPassword = typeof user.pw == 'string' && user.pw.trim() != '' && user.pw.trim().length >= 6;
    return validUsername && validPassword;
}

//////////          QUERY          //////////

async function getUtenteByNome(nome) {
    try {
        const results = await clientServ.query(`SELECT "user" AS "username", "pw", "ruolo" AS "role" FROM "utenti" WHERE "user" = ($1);`, [nome]);
        return results.rows[0];
    }
    catch(e) {
        return [];
    }
}

async function insertNuovoUtente(user) {
    try {
        await clientServ.query(`INSERT INTO "utenti" ("user", "pw", "ruolo") VALUES (($1), ($2), 'turista');`, [user.username, user.pw]);
        return true;
    }
    catch(e) {
        console.log(e);
        return false;
    }
}

async function getSettingsByRuolo(ruolo) {
    try {
        const results = await clientServ.query(`SELECT "bim_vw_sets", "elementi_visibili" AS "usr_vw" FROM "ruoli" WHERE "ruolo" = ($1);`, [ruolo]);
        return results.rows[0];
    }
    catch(e) {
        return [];
    }
}

module.exports = router;

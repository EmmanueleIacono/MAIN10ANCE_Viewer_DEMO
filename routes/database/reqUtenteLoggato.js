const express = require('express');
const appU = express.Router();
appU.use(express.json());
appU.use(express.static("public"));

const {clientServ} = require('./connessioni');

//////////          RICHIESTE          //////////

// per testare la richiesta:
// fetch("/utenti/mario", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appU.get(`/utenti/:username`, async (req, res) => {
    const username = req.params.username;
    const risp = await getInfoUtenteByNome(username);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(risp));
});

//////////          QUERY          //////////

async function getInfoUtenteByNome(nome) {
    try {
        const results = await clientServ.query(`SELECT "user" AS "username", "ruolo" AS "role" FROM "utenti" WHERE "user" = ($1);`, [nome]);
        return results.rows[0];
    }
    catch(e) {
        return [];
    }
}

module.exports = appU;

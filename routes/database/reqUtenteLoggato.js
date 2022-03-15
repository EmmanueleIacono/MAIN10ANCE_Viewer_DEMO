const express = require('express');
const app = express.Router();
app.use(express.json());
app.use(express.static("public"));

const {clientM10a} = require('./connessioni');

//////////          RICHIESTE          //////////

// per testare la richiesta:
// fetch("l//utenti/mario", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get(`/utenti/:username`, async (req, res) => {
    const username = req.params.username;
    const risp = await getInfoUtenteByNome(username);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(risp));
});

//////////          QUERY          //////////

async function getInfoUtenteByNome(nome) {
    try {
        const results = await clientM10a.query(`SELECT "user" AS "username", "ruolo" AS "role" FROM servizio."utenti" WHERE "user" = ($1);`, [nome]);
        return results.rows[0];
    }
    catch(e) {
        return [];
    }
}

module.exports = app;

const express = require('express');
const app = express.Router();
app.use(express.json());
app.use(express.static("public"));

const {clientM10a} = require('./connessioni');
const {utility_schema} = require('./schemi');
const {jsonRoute} = require('../security/http');

//////////          RICHIESTE          //////////

app.get(`/utenti/:username`, jsonRoute(async (req) => {
    const username = req.params.username;
    return getInfoUtenteByNome(username);
}));

//////////          QUERY          //////////

async function getInfoUtenteByNome(nome) {
    try {
        const results = await clientM10a.query(`SELECT "user" AS "username", "ruolo" AS "role" FROM ${utility_schema}."utenti" WHERE "user" = ($1);`, [nome]);
        return results.rows[0];
    }
    catch(e) {
        return [];
    }
}

module.exports = app;

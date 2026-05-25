const express = require('express');
const app = express.Router();
app.use(express.json());
app.use(express.static("public"));

const {poolM10a} = require('./connessioni');
const {utility_schema} = require('./schemi');
const {jsonRoute, successRoute} = require('../security/http');

//////////          RICHIESTE          //////////

app.get('/utenti', jsonRoute(() => getUtenti()));

app.get('/ruoli', jsonRoute(() => getListaRuoli()));

app.patch('/ruoli/nuovo-ruolo', successRoute(req => updateRuoloUtente(req.body).then(() => true)));

app.get('/conteggio-ruoli', jsonRoute(() => conteggioRuoli()));

//////////          QUERY          //////////

async function getUtenti() {
    try {
        const results = await poolM10a.query(`SELECT "user", "email", "ruolo" FROM ${utility_schema}."utenti" ORDER BY "user";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function getListaRuoli() {
    try {
        const result = await poolM10a.query(`SELECT ARRAY(SELECT "ruolo" FROM ${utility_schema}."ruoli") AS "roles";`);
        return result.rows[0].roles;
    }
    catch(e) {
        return [];
    }
}

async function updateRuoloUtente(userJson) {
    try {
        await poolM10a.query(`UPDATE ${utility_schema}."utenti" SET "ruolo" = ($1) WHERE "user" = ($2);`, [userJson.ruolo, userJson.user]);
    }
    catch(e) {
        throw(e);
    }
}

async function conteggioRuoli() {
    try {
        const result = await poolM10a.query(`SELECT "ruolo", COUNT(ruolo) FROM ${utility_schema}."utenti" GROUP BY "ruolo";`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

module.exports = app;

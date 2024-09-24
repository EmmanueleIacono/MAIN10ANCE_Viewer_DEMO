const express = require('express');
const app = express.Router();
app.use(express.json());
app.use(express.static("public"));

const {clientM10a} = require('./connessioni');
const {utility_schema} = require('./schemi');

//////////          RICHIESTE          //////////

// per testare la richiesta:
// fetch("/a/utenti", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/utenti', async (req, res) => {
    const users = await getUtenti();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(users));
});

// per testare la richiesta
// fetch("/a/ruoli", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/ruoli', async (req, res) => {
    const ruoli = await getListaRuoli();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(ruoli));
});

app.patch('/ruoli/nuovo-ruolo', async (req, res) => {
    let result = {}
    try {
        const reqJson = req.body;
        await updateRuoloUtente(reqJson);
        result.success = true;
    }
    catch(e) {
        result.success = false;
    }
    finally {
        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify(result));
    }
});

// per testare la richiesta
// fetch("/a/conteggio-ruoli", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/conteggio-ruoli', async (req, res) => {
    const ruoli = await conteggioRuoli();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(ruoli));
});

//////////          QUERY          //////////

async function getUtenti() {
    try {
        const results = await clientM10a.query(`SELECT "user", "email", "ruolo" FROM ${utility_schema}."utenti" ORDER BY "user";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function getListaRuoli() {
    try {
        const result = await clientM10a.query(`SELECT ARRAY(SELECT "ruolo" FROM ${utility_schema}."ruoli") AS "roles";`);
        return result.rows[0].roles;
    }
    catch(e) {
        return [];
    }
}

async function updateRuoloUtente(userJson) {
    try {
        await clientM10a.query(`UPDATE ${utility_schema}."utenti" SET "ruolo" = ($1) WHERE "user" = ($2);`, [userJson.ruolo, userJson.user]);
    }
    catch(e) {
        throw(e);
    }
}

async function conteggioRuoli() {
    try {
        const result = await clientM10a.query(`SELECT "ruolo", COUNT(ruolo) FROM ${utility_schema}."utenti" GROUP BY "ruolo";`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

module.exports = app;

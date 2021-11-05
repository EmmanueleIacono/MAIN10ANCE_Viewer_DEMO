const express = require('express');
const appG = express.Router();
appG.use(express.json());
appG.use(express.static("public"));

const {clientM10a, clientServ} = require('./connessioni');

//////////          RICHIESTE          //////////

// per testare la richiesta:
// fetch("/utenti", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appG.get('/utenti', async (req, res) => {
    const users = await getUtenti();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(users));
});

//////////          QUERY          //////////

async function getUtenti() {
    try {
        const results = await clientServ.query(`SELECT * FROM "utenti";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

module.exports = appG;

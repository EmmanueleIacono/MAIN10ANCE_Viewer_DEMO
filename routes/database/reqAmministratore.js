const express = require('express');
const appA = express.Router();
appA.use(express.json());
appA.use(express.static("public"));

const {clientM10a, clientServ} = require('./connessioni');

//////////          RICHIESTE          //////////

// per testare la richiesta:
// fetch("/a/utenti", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appA.get('/utenti', async (req, res) => {
    const users = await getUtenti();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(users));
});

// per testare la richiesta
// fetch("/a/ruoli", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appA.get('/ruoli', async (req, res) => {
    const ruoli = await getListaRuoli();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(ruoli));
});

appA.patch('/ruoli/nuovo-ruolo', async (req, res) => {
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

// // per testare la richiesta
// // fetch("/a/conteggio-ruoli", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
// appA.get('/conteggio-ruoli', async (req, res) => {
//     const ruoli = await conteggioRuoli();
//     res.setHeader('content-type', 'application/json');
//     res.send(JSON.stringify(ruoli));
// });

//////////          QUERY          //////////

async function getUtenti() {
    try {
        const results = await clientServ.query(`SELECT "user", "email", "ruolo" FROM "utenti" ORDER BY "user";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function getListaRuoli() {
    try {
        const result = await clientServ.query(`SELECT ARRAY(SELECT "ruolo" FROM "ruoli") AS "roles";`);
        return result.rows[0].roles;
    }
    catch(e) {
        return [];
    }
}

async function updateRuoloUtente(userJson) {
    try {
        await clientServ.query(`UPDATE "utenti" SET "ruolo" = ($1) WHERE "user" = ($2);`, [userJson.ruolo, userJson.user]);
    }
    catch(e) {
        throw(e);
    }
}

// async function conteggioRuoli() {
//     try {
//         const result = await clientServ.query(`SELECT ruolo, COUNT(ruolo) FROM utenti GROUP BY ruolo;`);
//         return result.rows;
//     }
//     catch(e) {
//         return [];
//     }
// }

module.exports = appA;
const { Client } = require('pg');
const express = require('express');
const appPG = express.Router();
appPG.use(express.json()); /*questo è quello che una volta si chiamava "bodyparser"*/
appPG.use(express.static("public"));

const client = new Client({
    user: process.env.BIM_DB_USER,
    password: process.env.BIM_DB_PASSWORD,
    host: process.env.BIM_DB_HOST,
    port: process.env.BIM_DB_PORT,
    database: process.env.BIM_DB_DATABASE,
    ssl: process.env.SEGNAPOSTO_LOCALE ? false : { rejectUnauthorized: false }
});

// per testare la richiesta:
// fetch("http://localhost:3000/Main10ance_DB/all", {method: "GET", headers: {"content-type": "application/json", "categoria": "Walls", "id": 365029} }).then(a => a.json()).then(console.log)
appPG.get('/Main10ance_DB/all', async (req, res) => {
    const reqJson = req.headers;
    const identificativo = await leggiDBAll(reqJson.categoria, reqJson.id);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(identificativo[0]));
});

// per testare la richiesta:
// fetch("http://localhost:3000/Main10ance_DB/all", {method: "PATCH", headers: {"content-type": "application/json"}, body: JSON.stringify({"categoria": "Walls", "parametro": "Comments", "valore": "ciao", "id": 365029}) }).then(a => a.json()).then(console.log)
appPG.patch('/Main10ance_DB/all', async (req, res) => {
    let result = {}
    try {
        const reqJson = req.body;
        await scriviDBAll(reqJson.categoria, reqJson.parametro, reqJson.valore, reqJson.id);
        result.success = true;
    }
    catch(e) {
    result.success = false
    }
    finally {
        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify(result));
    }
});

start();

async function start() {
    await connect();
};

async function connect() {
    try {
        await client.connect();
        console.log('Connessione al database Main10ance riuscita');
    }
    catch(e) {
        console.error(`Connessione al database Main10ance fallita: ${e}`);
    }
};

async function leggiDBAll(nomeCategoria, idElemento) {
    try {
        const results = await client.query(`SELECT * FROM "${nomeCategoria}" WHERE "Id" = ($1);`, [idElemento]);
        return results.rows;
    }
    catch(e) {
        return [];
    }
};

async function scriviDBAll(nomeCategoria, nomeParametro, testoParametro, idElemento) {
    try {
        await client.query(`UPDATE "${nomeCategoria}" SET "${nomeParametro}" = ($1) WHERE "Id" = ($2);`, [testoParametro, idElemento]);
        return true;
    }
    catch(e) {
        return false;
    }
};

module.exports = appPG
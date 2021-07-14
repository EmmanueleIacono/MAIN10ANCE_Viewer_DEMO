const { Client } = require('pg');
const express = require('express');
const appServizio = express.Router();
appServizio.use(express.json());
appServizio.use(express.static("public"));

const client = new Client({
    // user: process.env.DB_SERVIZIO_USER,
    // password: process.env.DB_SERVIZIO_PASSWORD,
    // host: process.env.DB_SERVIZIO_HOST,
    // port: process.env.DB_SERVIZIO_PORT,
    // database: process.env.DB_SERVIZIO_DATABASE,
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// per testare la richiesta:
// fetch("/DB_Servizio/MarkerSM", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appServizio.get('/DB_Servizio/MarkerSM', async (req, res) => {
    const markerSacriMonti = await leggiMarkerSM();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(markerSacriMonti));
});

// per testare la richiesta:
// fetch("/DB_Servizio/MarkerCapp", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appServizio.get('/DB_Servizio/MarkerCapp', async (req, res) => {
    const markerCappelle = await leggiMarkerCapp();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(markerCappelle));
});

start();

async function start() {
    await connect();
};

async function connect() {
    try {
        await client.connect();
        console.log('Connessione al database di servizio riuscita');
    }
    catch(e) {
        console.error(`Connessione al database di servizio fallita: ${e}`);
    }
};

async function leggiMarkerSM() {
    try {
        const results = await client.query(`SELECT * FROM "MarkerSM";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
};

async function leggiMarkerCapp() {
    try {
        const results = await client.query(`SELECT * FROM "MarkerCapp";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
};

module.exports = appServizio

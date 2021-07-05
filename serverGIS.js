const { Client } = require('pg');
const express = require('express');
const appGIS = express.Router();
appGIS.use(express.json());
appGIS.use(express.static("public"));

const client = new Client({
    user: 'postgres',
    password: 'rilievo',
    host: 'localhost',
    port: 5432,
    database: 'main10ance_v2_0'
});

// per testare la richiesta:
// fetch("http://localhost:3000/Main10ance_DB/GIS", {method: "GET", headers: {"content-type": "application/json", "tabella": "bosco", "oid": 1066778289} }).then(a => a.json()).then(console.log)
appGIS.get('/Main10ance_DB/GIS', async (req, res) => {
    const reqJson = req.headers;
    const identificativo = await leggiGIS(reqJson.tabella, reqJson.oid);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(identificativo[0]));
});

start();

async function start() {
    await connect();
};

async function connect() {
    try {
        await client.connect();
        console.log('Connessione al database GIS riuscita');
    }
    catch(e) {
        console.error(`Connessione al database GIS fallita: ${e}`);
    }
};


async function leggiGIS(nomeTabella, oidElemento) {
    try {
        const results = await client.query(`SELECT ST_AsGeoJSON FROM main10ance_sacrimonti."${nomeTabella}" WHERE "oid" = ($1);`, [oidElemento]);
        return results.rows;
    }
    catch(e) {
        return [];
    }
};

async function prova() {
    try {
    // const result = await client.query('SELECT ST_AsGeoJSON("geom_pol", 9, 4) FROM main10ance_sacrimonti."bosco" WHERE "oid" = 1066795976;');
    const result = await client.query('SELECT ST_AsGeoJSON("geom_pol") FROM main10ance_sacrimonti."bosco" WHERE "oid" = 1066795976;');
    // return result.rows;
    return result.rows[0].st_asgeojson;
    }
    catch(e) {
        return [];
    }
}

// per testare la richiesta:
// fetch("http://localhost:3000/Main10ance_DB/GIS_prova", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appGIS.get('/Main10ance_DB/GIS_prova', async (req, res) => {
    // const reqJson = req.headers;
    const risultato = await prova();
    res.setHeader('content-type', 'application/json');
    res.send(risultato);
    // console.log(risultato);
});

module.exports = appGIS
const { Client } = require('pg');
const express = require('express');
const appGIS = express.Router();
appGIS.use(express.json());
appGIS.use(express.static("public"));

const client = new Client({
    connectionString: process.env.MAIN10ANCE_DB_URL,
    ssl: { rejectUnauthorized: false }
});

// per testare la richiesta:
// fetch("/Main10ance_DB/GIS", {method: "GET", headers: {"content-type": "application/json", "tabella": "bosco", "oid": 1066778289} }).then(a => a.json()).then(console.log)
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
    // const result = await client.query('SELECT ST_AsGeoJSON("geom_pun"), "loc_sg_top" FROM main10ance_sacrimonti."località_significativa";');
    const result = await client.query('SELECT ST_AsGeoJSON("geom_pol"), "bosco_ty" FROM main10ance_sacrimonti."bosco";');
    // return result.rows[0].st_asgeojson;
    return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiListaTabelle() {
    try {
        const results = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'main10ance_sacrimonti';`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
};

// per testare la richiesta:
// fetch("/Main10ance_DB/GIS_prova", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appGIS.get('/Main10ance_DB/GIS_prova', async (req, res) => {
    // const reqJson = req.headers;
    const risultato = await prova();
    res.setHeader('content-type', 'application/json');
    res.send(risultato);
    // console.log(risultato);
});

// per testare la richiesta:
// fetch("/Main10ance_DB/tabelle", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appGIS.get('/Main10ance_DB/tabelle', async (req, res) => {
    const risposta = await leggiListaTabelle();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
})

module.exports = appGIS

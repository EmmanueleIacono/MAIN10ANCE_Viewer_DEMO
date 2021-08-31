const { Client } = require('pg');
const express = require('express');
const appGIS_BIM = express.Router();
appGIS_BIM.use(express.json());
appGIS_BIM.use(express.static("public"));

const client = new Client({
    connectionString: process.env.MAIN10ANCE_DB_URL,
    ssl: { rejectUnauthorized: false }
});

//////////          RICHIESTE          //////////

// per testare la richiesta:
// fetch("/Main10ance_DB/GIS", {method: "GET", headers: {"content-type": "application/json", "tabella": "bosco", "alias": "Bosco", "geometria": "geom_pol", "colonneUtili": ["bosco_gov", "bosco_ty"]} }).then(a => a.json()).then(console.log)
appGIS_BIM.get('/Main10ance_DB/GIS', async (req, res) => {
    const reqJson = req.headers;
    // const identificativo = await leggiGIS(reqJson.tabella, reqJson.oid);
    const rispostaGIS = await leggiGIS(reqJson.tabella, reqJson.alias, reqJson.geometria, reqJson.colonneutili); //N.B.: scrivo "colonneutili" tutto minuscolo perché arriva così dagli headers della richiesta
    res.setHeader('content-type', 'application/json');
    // res.send(JSON.stringify(identificativo[0]));
    res.send(JSON.stringify(rispostaGIS));
});

// per testare la richiesta:
// fetch("/Main10ance_DB/tabelle", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appGIS_BIM.get('/Main10ance_DB/tabelle', async (req, res) => {
    const risposta = await leggiListaTabelle();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

appGIS_BIM.get('/Main10ance_DB/BIMViewer', async (req, res) => {
    const reqJson = req.headers;
    const risposta = await leggiBIMViewer(reqJson.categoria, reqJson.id);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(risposta[0]));
});

// per testare la richiesta:
// fetch("/Main10ance_DB/colonne", {method: "GET", headers: {"content-type": "application/json", tab: "catena"} }).then(a => a.json()).then(console.log)
appGIS_BIM.get('/Main10ance_DB/colonne', async (req, res) => {
    const reqJson = req.headers;
    const risposta = await leggiColonneTabella(reqJson.tab);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/Main10ance_DB/tabellaDB", {method: "GET", headers: {"content-type": "application/json", tab: "catena"} }).then(a => a.json()).then(console.log)
appGIS_BIM.get('/Main10ance_DB/tabellaDB', async (req, res) => {
    const reqJson = req.headers;
    const risposta = await leggiTabellaDB(reqJson.tab);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/Main10ance_DB/tabellaDB/glossario", {method: "GET", headers: {"content-type": "application/json", tab: "glossario"} }).then(a => a.json()).then(console.log)
appGIS_BIM.get('/Main10ance_DB/tabellaDB/glossario', async (req, res) => {
    const reqJson = req.headers;
    const risposta = await leggiTabellaGlossario(reqJson.tab);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

//////////          AVVIO SERVER          //////////

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

//////////          QUERY          //////////

async function leggiGIS(tabella, alias, geometria, colonneUtili) {
    try {
        const result = await client.query(`SELECT ST_AsGeoJSON(${geometria}) AS "geom", CONCAT_WS(', ', ${colonneUtili}) AS "info" FROM main10ance_sacrimonti.${tabella} AS "${alias}";`);
        return result.rows;
    }
    catch(e) {
        return [`errore: ${e}`];
    }
};

async function leggiListaTabelle() {
    try {
        const results = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'main10ance_sacrimonti';`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
};

async function leggiBIMViewer(nomeCategoria, idElemento) {
    try {
        const result = await client.query(`SELECT * FROM main10ance_sacrimonti."${nomeCategoria}" WHERE "id_main10ance" = ($1);`, [idElemento]);
        return result.rows;
    }
    catch(e) {
        return [];
    }
};

async function leggiColonneTabella(nomeTab) {
    try {
        const result = await client.query(`SELECT * FROM information_schema.columns WHERE table_schema = 'main10ance_sacrimonti' AND table_name = ($1);`, [nomeTab]);
        return result.rows;
    }
    catch(e) {
        return [];
    }
};

async function leggiTabellaDB(nomeTab) {
    try {
        const result = await client.query(`SELECT * FROM main10ance_sacrimonti."${nomeTab}" ORDER BY "id_main10ance"`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
};

async function leggiTabellaGlossario(nomeTab) {
    try {
        const result = await client.query(`SELECT * FROM main10ance_sacrimonti."${nomeTab}" ORDER BY "id_gloss"`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
};

module.exports = appGIS_BIM

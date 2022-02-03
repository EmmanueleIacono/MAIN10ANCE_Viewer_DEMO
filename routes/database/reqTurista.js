const express = require('express');
const appT = express.Router();
appT.use(express.json());
appT.use(express.static("public"));

const {clientM10a, clientServ} = require('./connessioni');

//////////          RICHIESTE          //////////

// per testare la richiesta:
// fetch("/t/Main10ance_DB/GIS", {method: "GET", headers: {"content-type": "application/json", "tabella": "bosco", "geometria": "geom_pol", "colonneUtili": ["bosco_gov", "bosco_ty"]} }).then(a => a.json()).then(console.log)
appT.get('/Main10ance_DB/GIS', async (req, res) => {
    const reqJson = req.headers;
    const rispostaGIS = await leggiGIS(reqJson.tabella, reqJson.geometria, reqJson.colonneutili); //N.B.: scrivo "colonneutili" tutto minuscolo perché arriva così dagli headers della richiesta
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(rispostaGIS));
});

// per testare la richiesta:
// fetch("/t/DB_Servizio/MarkerLoc", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appT.get('/DB_Servizio/MarkerLoc', async (req, res) => {
    const markerSacriMonti = await leggiMarkerLoc();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(markerSacriMonti));
});

// per testare la richiesta:
// fetch("/t/DB_Servizio/MarkerEdif", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appT.get('/DB_Servizio/MarkerEdif', async (req, res) => {
    const markerCappelle = await leggiMarkerEdif();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(markerCappelle));
});

// per testare la richiesta:
// fetch("/t/DB_Servizio/LOD/TabelleGIS", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appT.get('/DB_Servizio/LOD/TabelleGIS', async (req, res) => {
    const tabelleGIS = await leggiListaTabelleGIS();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(tabelleGIS));
});

//////////          QUERY          //////////

async function leggiGIS(tabella, geometria, colonneUtili) {
    try {
        const result = await clientM10a.query(`SELECT ST_AsGeoJSON(${geometria}) AS "geom", CONCAT_WS(', ', ${colonneUtili}) AS "info" FROM main10ance_sacrimonti.${tabella};`);
        return result.rows;
    }
    catch(e) {
        return [`errore: ${e}`];
    }
}

async function leggiMarkerLoc() {
    try {
        const results = await clientServ.query(`SELECT * FROM "dati_sm" ORDER BY "nome";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiMarkerEdif() {
    try {
        const results = await clientServ.query(`SELECT * FROM "dati_cappelle" ORDER BY CAST("numero" AS INTEGER);`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiListaTabelleGIS() {
    try {
        const results = await clientServ.query(`SELECT "entità_db_m10a" AS "tabella", "nome_esteso" AS "alias", "geometria", "colonne_utili" AS "colonneUtili" FROM "lod" WHERE "BIM-GIS" = 'GIS' ORDER BY "alias";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

module.exports = appT;

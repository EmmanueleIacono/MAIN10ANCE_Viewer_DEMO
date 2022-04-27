const express = require('express');
const app = express.Router();
app.use(express.json());
app.use(express.static("public"));

const {clientM10a} = require('./connessioni');
const {ambito} = require('./ambito');
const {supabase} = require('../../supabase_config');

//////////          RICHIESTE          //////////

// per testare la richiesta:
// fetch("/t/Main10ance_DB/GIS", {method: "GET", headers: {"content-type": "application/json", "tabella": "bosco", "geometria": "geom_pol", "colonneUtili": ["bosco_gov", "bosco_ty"]} }).then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/GIS', async (req, res) => {
    const reqJson = req.headers;
    const rispostaGIS = await leggiGIS(reqJson.tabella, reqJson.geometria, reqJson.colonneutili); //N.B.: scrivo "colonneutili" tutto minuscolo perché arriva così dagli headers della richiesta
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(rispostaGIS));
});

// per testare la richiesta:
// fetch("/t/DB_Servizio/MarkerLoc", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/DB_Servizio/MarkerLoc', async (req, res) => {
    const markerLocalità = await leggiMarkerLoc();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(markerLocalità));
});

// per testare la richiesta:
// fetch("/t/DB_Servizio/MarkerEdif", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/DB_Servizio/MarkerEdif', async (req, res) => {
    const markerEdifici = await leggiMarkerEdif();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(markerEdifici));
});

// per testare la richiesta:
// fetch("/t/DB_Servizio/LOD/TabelleGIS", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/DB_Servizio/LOD/TabelleGIS', async (req, res) => {
    const tabelleGIS = await leggiListaTabelleGIS();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(tabelleGIS));
});

// per testare la richiesta:
// fetch("/t/DB_Servizio/LOD/TabelleLOD", {method: "GET", headers: {"content-type": "application/json", lod: 5} }).then(a => a.json()).then(console.log)
app.get('/DB_Servizio/LOD/TabelleLOD', async (req, res) => {
    const reqJson = req.headers;
    const tabelleLOD = await leggiListaTabelleLOD(reqJson.lod);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(tabelleLOD));
});

app.get('/storage/img-list', async (req, res) => {
    const reqJson = req.headers;
    const listaImmagini = await leggiListaImmagini(reqJson.path);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(listaImmagini));
});

app.get('/storage/img-download', async (req, res) => {
    try {
        const reqJson = req.headers;
        const percorsoFile = JSON.parse(reqJson.percorso);
        const immagine = await downloadImmagini(percorsoFile);
        if (!immagine.length) throw new Error('Nessun file presente');
        const type = immagine[0].type;
        if (type) {
            res.type(type);
            const buffer = await immagine[0].arrayBuffer();
            res.send(Buffer.from(buffer));
        }
    }
    catch(e) {
        console.log(e);
        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify({errMsg: 'Nessun file presente'}));
    }
});

//////////          QUERY          //////////

async function leggiGIS(tabella, geometria, colonneUtili) {
    try {
        const result = await clientM10a.query(`SELECT ST_AsGeoJSON(${geometria}) AS "geom", CONCAT_WS(', ', ${colonneUtili}) AS "info" FROM ${ambito}.${tabella};`);
        return result.rows;
    }
    catch(e) {
        return [`errore: ${e}`];
    }
}

async function leggiMarkerLoc() {
    try {
        const results = await clientM10a.query(`SELECT * FROM servizio."dati_località" ORDER BY "nome";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiMarkerEdif() {
    try {
        const results = await clientM10a.query(`SELECT * FROM servizio."dati_edifici" ORDER BY CAST("numero" AS INTEGER);`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiListaTabelleGIS() {
    try {
        const results = await clientM10a.query(`SELECT "entità_db_m10a" AS "tabella", "nome_esteso" AS "alias", "geometria", "colonne_utili" AS "colonneUtili" FROM servizio."lod" WHERE "BIM-GIS" = 'GIS' ORDER BY "alias";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiListaTabelleLOD(LOD) {
    try {
        const results = await clientM10a.query(`SELECT "entità_db_m10a" AS "tabella", "nome_esteso" AS "alias" FROM servizio."lod" WHERE "LOD" = ($1) ORDER BY "alias";`, [LOD]);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiListaImmagini(percorso) {
    try {
      const {data, error} = await supabase.storage.from('sacri-monti').list(percorso);

      if (error) throw error;

      const fileNames = data.map(data => data.name);
      const filePaths = fileNames.map(name => `${percorso}/${name}`);
      return filePaths;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function downloadImmagini(percorsoFile) {
    try {
        const {data, error} = await supabase.storage.from("sacri-monti").download(percorsoFile);

        if (error) throw error;

        if (!data.size) return [];

        return [data];
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

module.exports = app;

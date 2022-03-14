const express = require('express');
const app = express.Router();
app.use(express.json());
app.use(express.static("public"));

const {clientM10a, clientServ} = require('./connessioni');
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
    const reqJson = req.headers;
    const lista = JSON.parse(reqJson.lista);
    const listaImmagini = await downloadImmagini(lista);
    // res.setHeader('content-type', 'application/json');
    res.setHeader('content-type', 'application/octet-stream');
    res.send(listaImmagini);
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

async function leggiListaTabelleLOD(LOD) {
    try {
        const results = await clientServ.query(`SELECT "entità_db_m10a" AS "tabella", "nome_esteso" AS "alias" FROM "lod" WHERE "LOD" = ($1) ORDER BY "alias";`, [LOD]);
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

// async function downloadImmagini(listaPercorsi) {
async function downloadImmagini(percorsoFile) {
    try {
        // const listaFiles = await Promise.all(listaPercorsi.map(async img => {
        //     const {data, error} = await supabase.storage.from("sacri-monti").download(img);
        //     console.log(data);

        //     if (error) throw error;

        //     const dataBuffer = await data.arrayBuffer();
        //     const buffer = Buffer.from(dataBuffer);

        //     return {file: buffer, filetype: data.type, path: img};
        // }));

        // console.log(listaFiles);
        // return listaFiles;
        const {data, error} = await supabase.storage.from("sacri-monti").download(percorsoFile);

        if (error) throw error;

        console.log(data);
        return data;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

module.exports = app;

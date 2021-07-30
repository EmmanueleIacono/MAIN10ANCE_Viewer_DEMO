const { Client } = require('pg');
const express = require('express');
const appGIS_BIM = express.Router();
appGIS_BIM.use(express.json());
appGIS_BIM.use(express.static("public"));

const client = new Client({
    // connectionString: process.env.MAIN10ANCE_DB_URL,
    // ssl: { rejectUnauthorized: false }
    connectionString: "postgresql://postgres:rilievo@localhost:5432/main10ance_v4",
});

// per testare la richiesta:
// fetch("/Main10ance_DB/GIS", {method: "GET", headers: {"content-type": "application/json", "tabella": "bosco", "oid": 1066778289} }).then(a => a.json()).then(console.log)
// fetch("/Main10ance_DB/GIS", {method: "GET", headers: {"content-type": "application/json", "tabella": "bosco", "alias": "Bosco", "geometria": "geom_pol", "colonneUtili": ["bosco_gov", "bosco_ty"]} }).then(a => a.json()).then(console.log)
appGIS_BIM.get('/Main10ance_DB/GIS', async (req, res) => {
    const reqJson = req.headers;
    // const identificativo = await leggiGIS(reqJson.tabella, reqJson.oid);
    const rispostaGIS = await leggiGIS(reqJson.tabella, reqJson.alias, reqJson.geometria, reqJson.colonneutili); //N.B.: scrivo "colonneutili" tutto minuscolo perché arriva così dagli headers della richiesta
    res.setHeader('content-type', 'application/json');
    // res.send(JSON.stringify(identificativo[0]));
    res.send(JSON.stringify(rispostaGIS));
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

// VECCHIA
// async function leggiGIS(nomeTabella, oidElemento) {
//     try {
//         const results = await client.query(`SELECT ST_AsGeoJSON FROM main10ance_sacrimonti."${nomeTabella}" WHERE "oid" = ($1);`, [oidElemento]);
//         return results.rows;
//     }
//     catch(e) {
//         return [];
//     }
// };

async function leggiGIS(tabella, alias, geometria, colonneUtili) {
    try {
        // console.log(colonneUtili);
        const result = await client.query(`SELECT ST_AsGeoJSON(${geometria}) AS "geom", CONCAT_WS(', ', ${colonneUtili}) AS "info" FROM main10ance_sacrimonti.${tabella} AS "${alias}";`);
        // const result = await client.query(`SELECT ST_AsGeoJSON(geom_pol) AS "geom", ar_vms_ty,ar_vms_fon FROM main10ance_sacrimonti.strade_sentieri_e_altri_percorsi_interni AS "Strade, sentieri e altri percorsi interni";`);
        return result.rows;
    }
    catch(e) {
        return [`errore: ${e}`];
    }
}

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
}

// per testare la richiesta:
// fetch("/Main10ance_DB/GIS_prova", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appGIS_BIM.get('/Main10ance_DB/GIS_prova', async (req, res) => {
    // const reqJson = req.headers;
    const risultato = await prova();
    res.setHeader('content-type', 'application/json');
    res.send(risultato);
    // console.log(risultato);
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

module.exports = appGIS_BIM

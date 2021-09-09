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
    const rispostaGIS = await leggiGIS(reqJson.tabella, reqJson.alias, reqJson.geometria, reqJson.colonneutili); //N.B.: scrivo "colonneutili" tutto minuscolo perché arriva così dagli headers della richiesta
    res.setHeader('content-type', 'application/json');
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
    // res.send(JSON.stringify(risposta[0]));
    res.send(JSON.stringify(risposta));
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
    const risposta = await leggiTabellaGlossario();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/Main10ance_DB/tabellaDB/enum", {method: "GET", headers: {"content-type": "application/json", nomeenum: "cl_ogg_fr"} }).then(a => a.json()).then(console.log)
appGIS_BIM.get('/Main10ance_DB/tabellaDB/enum', async (req, res) => {
    const reqJson = req.headers;
    const risposta = await leggiEnum(reqJson.nomeenum);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

appGIS_BIM.post('/Main10ance_DB/schede/nuova', async (req, res) => {
    let result = {};
    try {
        const reqJson = req.body;
        const listaStringheValues = gestisciStringheSchede(reqJson);
        await transazioneScheda(listaStringheValues);
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

async function leggiTabellaGlossario() {
    try {
        const result = await client.query(`SELECT * FROM main10ance_sacrimonti."glossario" ORDER BY regexp_replace("id_gloss", '\\D', '', 'g')`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
};

async function leggiEnum(nomeEnum) {
    try {
        const result = await client.query(`SELECT unnest(enum_range(null::main10ance_sacrimonti.${nomeEnum}));`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
};

// async function transazioneScheda(listaJSON) {
//     try {
//         await client.query("BEGIN;");
//         listaJSON.forEach(async jsn => {
//             const stringaColonne = jsn.colonne.join(', ');
//             const lenColonne = (jsn.colonne).length;
//             let listaValues = [];
//             for (let n=1; n<=lenColonne; n++) {
//                 let str = `$${n}`;
//                 listaValues.push(str);
//             }
//             const stringaValues = listaValues.join(', ');
//             // const stringaValori = "'"+jsn.valori.join("', '")+"'";
//             await client.query(`INSERT INTO main10ance_sacrimonti.${jsn.tabella} (${stringaColonne}) VALUES (${stringaValues});`, [...jsn.valori]);
//         });
//         await client.query("COMMIT;");
//         console.log('COMMIT');
//         return true;
//     }
//     catch (ex) {
//         console.log(`Errore: ${ex}`);
//         await client.query("ROLLBACK;");
//         console.log('ROLLBACK');
//         return false;
//     }
// };
async function transazioneScheda(listaStrVals) {
    try {
        await client.query("BEGIN;");
        try {
            for (const sv of listaStrVals) {
                await client.query(sv[0], sv[1]);
            }
        }
        catch(e) {
            console.log('Errore interno: ' + e);
            throw e;
        }

        await client.query("COMMIT;");
        return true;
    }
    catch (ex) {
        console.log(`Errore: ${ex}`);
        await client.query("ROLLBACK;");
        return false;
    }
};

//////////          ALTRE FUNZIONI          //////////

function gestisciStringheSchede(listaOggetti) {
    let listaStringheEValori = [];
    listaOggetti.forEach(async jsn => {
        let listaInterna = [];
        const listaValori = jsn.valori;
        const stringaColonne = jsn.colonne.join(', ');
        const lenColonne = (jsn.colonne).length;
        let listaValues = [];
        for (let n=1; n<=lenColonne; n++) {
            let str = `$${n}`;
            listaValues.push(str);
        }
        const stringaValues = listaValues.join(', ');
        const stringa = `INSERT INTO main10ance_sacrimonti.${jsn.tabella} (${stringaColonne}) VALUES (${stringaValues});`;
        listaInterna.push(stringa);
        listaInterna.push(listaValori);
        listaStringheEValori.push(listaInterna);
    });
    return listaStringheEValori;
}

module.exports = appGIS_BIM

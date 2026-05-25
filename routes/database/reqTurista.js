const express = require('express');
const app = express.Router();
app.use(express.json());
app.use(express.static("public"));

const {poolM10a} = require('./connessioni');
const {data_schema, utility_schema} = require('./schemi');
const {supabase} = require('../../supabase_config');
const {quoteIdentifier, qualifiedName, parseCsvIdentifiers} = require('../security/sql');
const {safeStoragePath} = require('../security/upload');
const {jsonRoute, sendJson} = require('../security/http');

//////////          RICHIESTE          //////////

app.get('/Main10ance_DB/GIS', jsonRoute(async (req) => {
    const reqJson = req.headers;
    const rispostaGIS = await leggiGIS(reqJson.tabella, reqJson.geometria, reqJson.colonneutili); //N.B.: scrivo "colonneutili" tutto minuscolo perché arriva così dagli headers della richiesta
    return rispostaGIS;
}));

app.get('/MarkerLoc', jsonRoute(() => leggiMarkerLoc()));

app.get('/MarkerEdif', jsonRoute(() => leggiMarkerEdif()));

app.get('/MarkerLocPdiff', jsonRoute(() => leggiMarkerLocPdiff()));

app.get('/LOD/TabelleGIS', jsonRoute(() => leggiListaTabelleGIS()));

app.get('/LOD/TabelleLOD', jsonRoute(async (req) => {
    const reqJson = req.headers;
    const tabelleLOD = await leggiListaTabelleLOD(reqJson.lod);
    return tabelleLOD;
}));

app.get('/storage/img-list', jsonRoute(async (req) => {
    const reqJson = req.headers;
    const listaImmagini = await leggiListaImmagini(reqJson.path);
    return listaImmagini;
}));

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
        // console.log(e);
        sendJson(res, {errMsg: 'Nessun file presente'});
    }
});

app.get('/Main10ance_DB/LOD4/info', jsonRoute(async (req) => {
    const reqJson = req.headers;
    const percorso = JSON.parse(reqJson.percorso);
    const tabella = JSON.parse(reqJson.tabella);
    const datiLOD4 = await getInfoImmagine(percorso, tabella);
    return datiLOD4;
}));

app.get('/definizioni_classi', jsonRoute(() => getDefinizioniClassiElementi()));

//////////          QUERY          //////////

async function leggiGIS(tabella, geometria, colonneUtili) {
    try {
        const geomIdent = quoteIdentifier(geometria, 'colonna geometria');
        const infoColumns = parseCsvIdentifiers(colonneUtili, 'colonne GIS').join(', ');
        const tableName = qualifiedName(data_schema, tabella);
        const result = await poolM10a.query(`SELECT ST_AsGeoJSON(${geomIdent}) AS "geom", CONCAT_WS(', ', ${infoColumns}) AS "info" FROM ${tableName};`);
        return result.rows;
    }
    catch(e) {
        return [`errore: ${e}`];
    }
}

async function leggiMarkerLoc() {
    try {
        const results = await poolM10a.query(`SELECT * FROM ${data_schema}."dati_località" ORDER BY "nome";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiMarkerEdif() {
    try {
        const results = await poolM10a.query(`SELECT * FROM ${data_schema}."dati_edifici" ORDER BY CAST("numero" AS INTEGER);`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiMarkerLocPdiff() {
    try {
        const results = await poolM10a.query(`SELECT "dati_loc_pdiff".*, 'loc-pdiff' AS "località" FROM ${utility_schema}."dati_loc_pdiff" ORDER BY "nome";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiListaTabelleGIS() {
    try {
        const results = await poolM10a.query(`SELECT "entità_db_m10a" AS "tabella", "nome_esteso" AS "alias", "geometria", "colonne_utili" AS "colonneUtili" FROM ${utility_schema}."lod" WHERE "BIM-GIS" = 'GIS' ORDER BY "alias";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiListaTabelleLOD(LOD) {
    try {
        const results = await poolM10a.query(`SELECT "entità_db_m10a" AS "tabella", "nome_esteso" AS "alias" FROM ${utility_schema}."lod" WHERE "LOD" = ($1) ORDER BY "alias";`, [LOD]);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiListaImmagini(percorso) {
    percorso = safeStoragePath(percorso);
    const is_pdiff = percorso.startsWith('loc-pdiff');
    const bucket = is_pdiff ? 'generale' : 'elementi';
    try {
        // PATRIMONIO DIFFUSO
        if (is_pdiff) {
            const {data, error} = await supabase.storage.from(bucket).list(percorso);
            if (error) throw error;
            return data.map(file => `${percorso}/${file.name}`);
        }

        // AMBITI
        const sigla = percorso.split('/')[0];
        const ambito_sigla = await getAmbitoPerLoc(sigla);
        if (!ambito_sigla.length) return [];

        const full_path = `${ambito_sigla[0]["ambito"]}/${percorso}`; // [0] perché c'è sempre corrispondenza univoca tra località e ambito
        const {data, error} = await supabase.storage.from(bucket).list(full_path);
        if (error) throw error;
        return data.map(file => `${percorso}/${file.name}`);
    } catch(e) {
        console.log(e);
        return [];
    }
}

async function downloadImmagini(percorsoFile) {
    percorsoFile = safeStoragePath(percorsoFile);
    const is_pdiff = percorsoFile.startsWith('loc-pdiff');
    const bucket = is_pdiff ? 'generale' : 'elementi';
    try {
        // PATRIMONIO DIFFUSO
        if (is_pdiff) {
            const {data, error} = await supabase.storage.from(bucket).download(percorsoFile);
            if (error) throw error;
            if (!data.size) return [];
            return [data];
        }

        // AMBITI
        const sigla = percorsoFile.split('/')[0];
        const ambito_sigla = await getAmbitoPerLoc(sigla);
        if (!ambito_sigla.length) return [];

        const full_path = `${ambito_sigla[0]["ambito"]}/${percorsoFile}`; // [0] perché c'è sempre corrispondenza univoca tra località e ambito
        const {data, error} = await supabase.storage.from(bucket).download(full_path);
        if (error) throw error;
        if (!data.size) return [];
        return [data];
    } catch(e) {
        console.log(e);
        return [];
    }
}

async function getInfoImmagine(percorsoFile, tabella) {
    percorsoFile = safeStoragePath(percorsoFile);
    const schema = percorsoFile.startsWith('loc-pdiff') ? utility_schema : data_schema;
    try {
        const tableName = qualifiedName(schema, tabella);
        const result = await poolM10a.query(`SELECT "nome" AS "Nome", "artista" AS "Artista", "datazione" AS "Datazione", "dimensioni" AS "Dimensioni", "commenti" AS "Note", "codice" AS "Codice", "id_main10ance" FROM ${tableName} WHERE "immagine" = ($1);`, [percorsoFile]);
        return result.rows;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function getDefinizioniClassiElementi() {
    try {
        const result = await poolM10a.query(`SELECT full_hierarchy FROM ${utility_schema}.vw_definizioni_classificazione_elementi_json;`);
        return result.rows[0]["full_hierarchy"];
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

////////////////////////// FUNZIONI DI UTILITY //////////////////////////

async function getAmbitoPerLoc(sigla_loc) {
    try {
        const results = await poolM10a.query(`SELECT sigla, ambito FROM ${data_schema}."dati_località" WHERE sigla = $1;`, [sigla_loc]);
        return results.rows;
    } catch(e) {
        console.log('Errore nella lettura delle sigle località:\n', e);
        return [];
    }
}

module.exports = app;

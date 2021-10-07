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
// fetch("/Main10ance_DB/tabellaDB/glossario/degradi", {method: "GET", headers: {"content-type": "application/json", tab: "glossario"} }).then(a => a.json()).then(console.log)
appGIS_BIM.get('/Main10ance_DB/tabellaDB/glossario/degradi', async (req, res) => {
    const risposta = await leggiTabellaGlossarioDegradi();
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
        const succ = await transazioneScheda(listaStringheValues);
        if (succ) {
            result.success = true;
        }
        else {
            result.success = false;
        }
    }
    catch(e) {
        result.success = false;
    }
    finally {
        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify(result));
    }
});

// per testare la richiesta:
// fetch("/Main10ance_DB/tabellaDB/schede-controllo", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appGIS_BIM.get('/Main10ance_DB/tabellaDB/schede-controllo', async (req, res) => {
    const risposta = await leggiSchedeControllo();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/Main10ance_DB/tabellaDB/schede-controllo-2", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appGIS_BIM.get('/Main10ance_DB/tabellaDB/schede-controllo-2', async (req, res) => {
    const risposta = await leggiSchedeControllo2();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/Main10ance_DB/tabellaDB/schede-manutenzione-regolare", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appGIS_BIM.get('/Main10ance_DB/tabellaDB/schede-manutenzione-regolare', async (req, res) => {
    const risposta = await leggiSchedeManReg();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/Main10ance_DB/tabellaDB/schede-manutenzione-correttiva", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appGIS_BIM.get('/Main10ance_DB/tabellaDB/schede-manutenzione-correttiva', async (req, res) => {
    const risposta = await leggiSchedeManCorr();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/Main10ance_DB/tabellaDB/schede-restauro", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appGIS_BIM.get('/Main10ance_DB/tabellaDB/schede-restauro', async (req, res) => {
    const risposta = await leggiSchedeRestauro();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/Main10ance_DB/tabellaDB/eventi-manutenzione-regolare", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appGIS_BIM.get('/Main10ance_DB/tabellaDB/eventi-manutenzione-regolare', async (req, res) => {
    const risposta = await leggiEventiManutenzioneRegolare();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/Main10ance_DB/tabellaDB/eventi-manutenzione-correttiva", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appGIS_BIM.get('/Main10ance_DB/tabellaDB/eventi-manutenzione-correttiva', async (req, res) => {
    const risposta = await leggiEventiManutenzioneCorrettiva();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

//////////          AVVIO SERVER          //////////

start();

async function start() {
    await connect();
}

async function connect() {
    try {
        await client.connect();
        console.log('Connessione al database Main10ance riuscita');
    }
    catch(e) {
        console.error(`Connessione al database Main10ance fallita: ${e}`);
    }
}

//////////          QUERY          //////////

async function leggiGIS(tabella, alias, geometria, colonneUtili) {
    try {
        const result = await client.query(`SELECT ST_AsGeoJSON(${geometria}) AS "geom", CONCAT_WS(', ', ${colonneUtili}) AS "info" FROM main10ance_sacrimonti.${tabella} AS "${alias}";`);
        return result.rows;
    }
    catch(e) {
        return [`errore: ${e}`];
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
}

async function leggiBIMViewer(nomeCategoria, idElemento) {
    try {
        const result = await client.query(`SELECT * FROM main10ance_sacrimonti."${nomeCategoria}" WHERE "id_main10ance" = ($1);`, [idElemento]);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiColonneTabella(nomeTab) {
    try {
        const result = await client.query(`SELECT * FROM information_schema.columns WHERE table_schema = 'main10ance_sacrimonti' AND table_name = ($1);`, [nomeTab]);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiTabellaDB(nomeTab) {
    try {
        const result = await client.query(`SELECT * FROM main10ance_sacrimonti."${nomeTab}" ORDER BY "id_main10ance";`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiTabellaGlossario() {
    try {
        const result = await client.query(`SELECT * FROM main10ance_sacrimonti."glossario" ORDER BY regexp_replace("id_gloss", '\\D', '', 'g');`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiTabellaGlossarioDegradi() {
    try {
        const result = await client.query(`SELECT * FROM main10ance_sacrimonti."glossario" WHERE ("gloss_ty"='danno' OR "gloss_ty"='alterazione' OR "gloss_ty"='degrado' OR "gloss_ty"='nessuno') ORDER BY regexp_replace("id_gloss", '\\D', '', 'g');`);
        return result.rows;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function leggiEnum(nomeEnum) {
    try {
        const result = await client.query(`SELECT unnest(enum_range(null::main10ance_sacrimonti.${nomeEnum}));`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function transazioneScheda(listaStrVals) {
    try {
        await client.query("BEGIN;");
        try {
            for (const sv of listaStrVals) {
                await client.query(sv[0], sv[1]);
            }
        }
        catch(e) {
            // console.log('Errore interno: ' + e);
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
}

async function leggiSchedeControllo() {
    try {
        const result = await client.query(`SELECT mc.data_con, mc.controllo, md.id_dad, md.id_main10ance, md.rid_gloss, mf.mn_reg, mf.frequenza, mf.mn_nec, mc.liv_urg FROM main10ance_sacrimonti.controllo_stato_di_conservazione_livello_di_urgenza AS mc JOIN main10ance_sacrimonti.danno_alterazione_degrado AS md ON mc.id_contr = md.id_dad JOIN main10ance_sacrimonti.frase_di_rischio AS mf ON mc.id_contr = mf.id_fr_risc ORDER BY data_con;`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiSchedeControllo2() {
    try {
        const result = await client.query(`SELECT mc.esecutori AS "Operatore", mc.data_con AS "Data controllo", mc.controllo AS "Tipo di controllo", mc.strumentaz AS "Strumentazione", md.materiale AS "Materiale", mc.st_cons AS "Stato di conservazione", md.dad_ty AS "Tipo di fenomeno", md.rid_gloss AS "Nome fenomeno", md.causa_e AS "Causa", md.est_sup AS "Estensione", mf.fr_risc AS "Frase di rischio", mf.mn_reg AS "Manutenzione regolare prevista", mf.frequenza AS "Frequenza prevista (mesi)", mf.mn_nec AS "Manutenzione correttiva prevista", mc.liv_urg AS "Livello di urgenza", mc.costo AS "Costo previsto (€)", mc.commenti AS "Commenti", mc.doc AS "Documenti", md.id_dad AS "Codice scheda controllo", md.id_main10ance AS "Elementi controllati", mc.data_ins AS "Data registrazione scheda" FROM main10ance_sacrimonti.controllo_stato_di_conservazione_livello_di_urgenza AS mc JOIN main10ance_sacrimonti.danno_alterazione_degrado AS md ON mc.id_contr = md.id_dad JOIN main10ance_sacrimonti.frase_di_rischio AS mf ON mc.id_contr = mf.id_fr_risc ORDER BY data_con;`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiSchedeManReg() {
    try {
        const result = await client.query(`SELECT esecutori AS "Operatore", data_ese AS "Data intervento", id_contr AS "Scheda controllo", rid_gloss AS "Fenomeno interessato", fq_eff AS "Frequenza effettiva (mesi)", azione AS "Azione", strumentaz AS "Strumentazione", materiale AS "Materiali utilizzati", costo AS "Costo (€)", commenti AS "Commenti", doc AS "Documenti", id_mn_reg AS "Codice scheda manutenzione regolare", id_main10ance AS "Elementi interessati", data_ins AS "Data registrazione scheda" FROM main10ance_sacrimonti.manutenzione_regolare ORDER BY data_ese;`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiSchedeManCorr() {
    try {
        const result = await client.query(`SELECT esecutori AS "Operatore", data_ese AS "Data intervento", id_contr AS "Scheda controllo", rid_gloss AS "Fenomeno interessato", progettist AS "Progettista/i", azione AS "Azione", strumentaz AS "Strumentazione", materiale AS "Materiali utilizzati", costo AS "Costo (€)", causa AS "Causa", commenti AS "Commenti", doc AS "Documenti", id_mn_gu AS "Codice scheda manutenzione correttiva", id_main10ance AS "Elementi interessati", data_ins AS "Data registrazione scheda" FROM main10ance_sacrimonti.manutenzione_correttiva_o_a_guasto ORDER BY data_ese;`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiSchedeRestauro() {
    try {
        const result = await client.query(`SELECT operatore AS "Operatore", anno_iniz AS "Anno inizio", anno_fine AS "Anno fine", progettist AS "Progettista/i", rid_gloss AS "Fenomeno interessato", descriz AS "Descrizione intervento", costo AS "Costo (€)", commenti AS "Commenti", doc AS "Documenti", id_restaur AS "Codice scheda restauro", id_main10ance AS "Elementi interessati", data_ins AS "Data registrazione scheda" FROM main10ance_sacrimonti.restauri ORDER BY anno_iniz;`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiEventiManutenzioneRegolare() {
    try {
        const result = await client.query(`SELECT "id_mn_reg", "id_contr", "id_main10ance", "rid_gloss", "data_ese", "azione" FROM main10ance_sacrimonti."manutenzione_regolare" ORDER BY "id_mn_reg";`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiEventiManutenzioneCorrettiva() {
    try {
        const result = await client.query(`SELECT "id_mn_gu", "id_contr", "id_main10ance", "rid_gloss", "data_ese", "azione" FROM main10ance_sacrimonti."manutenzione_correttiva_o_a_guasto" ORDER BY "id_mn_gu";`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

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

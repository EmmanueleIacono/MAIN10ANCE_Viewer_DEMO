const express = require('express');
const appG = express.Router();
appG.use(express.json());
appG.use(express.static("public"));

const {clientM10a, clientServ} = require('./connessioni');

//////////          RICHIESTE          //////////

// per testare la richiesta:
// fetch("/g/utenti/smv", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appG.get('/utenti/:progetto', async (req, res) => {
    const users = await getUtentiProgetto();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(users));
});

// per testare la richiesta
// fetch("/g/ruoli/smv", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appG.get('/ruoli/:progetto', async (req, res) => {
    const ruoli = await getListaRuoliProgetto();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(ruoli));
});

appG.patch('/ruoli/nuovo-ruolo/:progetto', async (req, res) => {
    let result = {}
    try {
        const reqJson = req.body;
        await updateRuoloUtenteProgetto(reqJson);
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

//////////          RICHIESTE DASHBOARD          //////////

// per testare la richiesta:
// fetch("/g/Main10ance_DB/dashboard/numero-oggetti", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appG.get('/Main10ance_DB/dashboard/numero-oggetti', async (req, res) => {
    const reqJson = req.headers;
    const listaTabelle = reqJson.tabelle;
    const risposta = await leggiNumeroOggetti(listaTabelle);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/g/Main10ance_DB/dashboard/conteggio-elementi", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appG.get('/Main10ance_DB/dashboard/conteggio-elementi', async (req, res) => {
    const reqJson = req.headers;
    const listaTabelle = reqJson.tabelle;
    const listaAlias = reqJson.alias;
    const risposta = await conteggioElementi(listaTabelle, listaAlias);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta
// fetch("/g/Main10ance_DB/dashboard/conteggio-ruoli", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appG.get('/Main10ance_DB/dashboard/conteggio-ruoli', async (req, res) => {
    const ruoli = await conteggioRuoliAmbito();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(ruoli));
});

// per testare la richiesta:
// fetch("/g/DB_Servizio/LOD/TabelleBIM", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appG.get('/DB_Servizio/LOD/TabelleBIM', async (req, res) => {
    const tabelleBIM = await leggiListaTabelleBIM();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(tabelleBIM));
});

// per testare la richiesta:
// fetch("/g/DB_Servizio/lista-localita", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appG.get('/DB_Servizio/lista-localita', async (req, res) => {
    const località = await getSigleSacriMonti();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(località));
});

// per testare la richiesta:
// fetch("/g/Main10ance_DB/dashboard/conteggio-modelli", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appG.get('/Main10ance_DB/dashboard/conteggio-modelli', async (req, res) => {
    const reqJson = req.headers;
    const listaLocalità = reqJson.nomi;
    const listaSigle = reqJson.sigle;
    const risposta = await conteggioModelli(listaLocalità, listaSigle);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/g/DB_Servizio/sigle-edifici", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appG.get('/DB_Servizio/sigle-edifici', async (req, res) => {
    const edifici = await getSigleEdifici();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(edifici));
});

// per testare la richiesta:
// fetch("/g/Main10ance_DB/frasi-rischio", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appG.get('/Main10ance_DB/frasi-rischio', async (req, res) => {
    const frasi = await getFrasiDiRischio();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(frasi));
});

// per testare la richiesta:
// fetch("/g/DB_Servizio/entita-oggetti", {method: "GET", headers: {"content-type": "application/json", "cl_ogg": "3.1 superfici interne"} }).then(a => a.json()).then(console.log)
appG.get('/DB_Servizio/entita-oggetti', async (req, res) => {
    const reqJson = req.headers;
    const cl_ogg = reqJson.cl_ogg;
    const entità = await getEntitàDaClOgg(cl_ogg);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(entità));
});

// per testare la richiesta:
// fetch("/g/Main10ance_DB/lista-identificativi", {method: "GET", headers: {"content-type": "application/json", "entità": "tetto", "id_parziale": "SMV|16-24|tetto|"} }).then(a => a.json()).then(console.log)
appG.get('/Main10ance_DB/lista-identificativi', async (req, res) => {
    const reqJson = req.headers;
    const ent = reqJson.entita;
    const id = reqJson.id_parziale;
    const frasi = await getIdentificativiDaEntità(ent, id);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(frasi));
});

appG.post('/Main10ance_DB/pianificazione/rischi', async (req, res) => {
    const result = {};
    try {
        const reqJson = req.body;
        const res = await creaAttProgControllo(reqJson);
        result.success = res;
    }
    catch(e) {
        result.success = false;
    }
    finally {
        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify(result));
    }
});

appG.post('/Main10ance_DB/programmazione/nuovi-controlli', async (req, res) => {
    let result = {}
    try {
        const reqJson = req.body;
        const res = await registraNuoviControlli(reqJson);
        result.success = res;
    }
    catch(e) {
        result.success = false;
    }
    finally {
        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify(result));
    }
});

//////////          QUERY          //////////

async function getUtentiProgetto() {
    try {
        const results = await clientServ.query(``);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function getListaRuoliProgetto() {
    try {
        const result = await clientServ.query(``);
        return result.rows[0].roles;
    }
    catch(e) {
        return [];
    }
}

async function updateRuoloUtenteProgetto(userJson) {
    try {
        await clientServ.query(``, []);
    }
    catch(e) {
        throw(e);
    }
}

//////////          QUERY DASHBOARD          //////////

async function leggiNumeroOggetti(listaTabelle) {
    const listaTabs = JSON.parse(listaTabelle);
    const listaStringhe = listaTabs.map(tab => `SELECT COUNT(*) FROM main10ance_sacrimonti."${tab}"`);
    const stringheJoin = listaStringhe.join(' UNION ');
    try {
        const result = await clientM10a.query(`SELECT SUM(count) FROM (${stringheJoin}) AS tabelle;`);
        return result.rows[0];
    }
    catch(e) {
        return [];
    }
}

async function conteggioElementi(listaTabelle, listaAlias) {
    const listaTabs = JSON.parse(listaTabelle);
    const listaAls = JSON.parse(listaAlias);
    const listaAlsReplaced = listaAls.map(a => a.replace("'", "''"));
    let listaStringhe = [];
    for (let i=0; i<listaTabs.length; i++) {
        const stringa = `SELECT COUNT(*), '${listaAlsReplaced[i]}' AS nome_tabella FROM main10ance_sacrimonti."${listaTabs[i]}"`;
        listaStringhe.push(stringa);
    }
    const stringheJoin = listaStringhe.join(' UNION ');
    try {
        const result = await clientM10a.query(`${stringheJoin} ORDER BY nome_tabella;`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function conteggioRuoliAmbito() {
    try {
        const result = await clientServ.query(`SELECT ruolo, COUNT(ruolo) FROM utenti GROUP BY ruolo;`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiListaTabelleBIM() {
    try {
        const results = await clientServ.query(`SELECT "entità_db_m10a" AS "tabella", "nome_esteso" AS "alias", "LOD" FROM "lod" WHERE "BIM-GIS" = 'BIM' ORDER BY "tabella";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function getSigleSacriMonti() {
    try {
        const results = await clientServ.query(`SELECT "nome", "sigla" FROM "dati_sm" ORDER BY "nome";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function conteggioModelli(listaLocalità, listaSigle) {
    const listaLocs = JSON.parse(listaLocalità);
    const listaSigs = JSON.parse(listaSigle);
    let listaStringhe = [];
    for (let i=0; i<listaLocs.length; i++) {
        const stringa = `SELECT COUNT(DISTINCT "urn"), '${listaLocs[i]}' AS nome_tabella FROM dati_cappelle WHERE "sacro_monte" = '${listaSigs[i]}'`;
        listaStringhe.push(stringa);
    }
    const stringheJoin = listaStringhe.join(' UNION ');
    try {
        const results = await clientServ.query(`${stringheJoin} ORDER BY nome_tabella;`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function getSigleEdifici() {
    try {
        const results = await clientServ.query(`SELECT DISTINCT "edificio", "sacro_monte" FROM "dati_cappelle" WHERE "urn" IS NOT null ORDER BY "edificio";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function getFrasiDiRischio() {
    try {
        const results = await clientM10a.query(`SELECT "id_fr_risc", "cl_ogg_fr", "fr_risc", "controllo", "mn_reg", "mn_nec" FROM main10ance_sacrimonti."frase_di_rischio" ORDER BY "id_fr_risc";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function getEntitàDaClOgg(cl_ogg) {
    try {
        const results = await clientServ.query(`SELECT "entità_db_m10a" FROM "lod" WHERE ($1)=ANY("cl_ogg_fr");`, [cl_ogg]);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function getIdentificativiDaEntità(entità, id) {
    try {
        // QUESTO FUNZIONA, MA CAPIRE COME FARE MEGLIO LIKE '${}%' USANDO ($1) ECC.
        const results = await clientM10a.query(`SELECT "id_main10ance" FROM main10ance_sacrimonti."${entità}" WHERE "id_main10ance" LIKE '${id}%';`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function creaAttProgControllo(listaAtt) {
    try {
        await clientM10a.query("BEGIN;");
        try {
            for (const att of listaAtt) {
                const tipo_att = att.man_reg ? ['controllo', 'manutenzione regolare'] : ['controllo'];
                const valuesArray = [att.id_att_prog, tipo_att, att.cl_ogg, att.rid_fr_risc, att.freq, att.data_prog, att.id_group, att.elementi, att.data_ins, true];
                await clientM10a.query(`INSERT INTO main10ance_sacrimonti."attività_prog" ("id_att_prog", "tipo_attività", "cl_ogg_fr", "rid_fr_risc", "frequenza", "data_prog", "id_group", "id_main10ance", "data_ins", "da_integrare") VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10));`, valuesArray);
            }
        }
        catch(e) {
            throw e;
        }
        await clientM10a.query("COMMIT;");
        return true;
    }
    catch(er) {
        console.log(`Errore: ${er}`);
        await clientM10a.query("ROLLBACK;");
        return false;
    }
}

///////////// QUESTA DA ELIMINARE FORSE, O DA RIUTILIZZARE PER FASE 2 PROG CONTROLLI ////////////////
async function registraNuoviControlli(listaReqJson) {
    try {
        await clientM10a.query("BEGIN;");
        try {
            for (const reqJson of listaReqJson) {
                await clientM10a.query(`INSERT INTO main10ance_sacrimonti."controllo_stato_di_conservazione_livello_di_urgenza" ("id_contr", "cl_ogg_fr", "controllo", "data_con", "data_ins", "id_main10ance", "rid_fr_risc", "freq") VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8));`, [reqJson.id_contr, reqJson.cl_ogg, reqJson.controllo, reqJson.data_con, reqJson.data_ins, reqJson.id_main10ance, reqJson.rid_fr_risc, reqJson.frequenza]);
                if (reqJson.dati_manutenzione) {
                    await clientM10a.query(`INSERT INTO main10ance_sacrimonti."manutenzione_regolare" ("id_mn_reg", "cl_ogg_fr", "azione", "data_ese", "data_ins", "id_main10ance") VALUES (($1), ($2), ($3), ($4), ($5), ($6));`, [reqJson.dati_manutenzione.id_mn_reg, reqJson.dati_manutenzione.cl_ogg, reqJson.dati_manutenzione.azione, reqJson.dati_manutenzione.data_ese, reqJson.dati_manutenzione.data_ins, reqJson.dati_manutenzione.id_main10ance]);
                }
            }
        }
        catch(e) {
            throw e;
        }

        await clientM10a.query("COMMIT;");
        return true;
    }
    catch (ex) {
        console.log(`Errore: ${ex}`);
        await clientM10a.query("ROLLBACK;");
        return false;
    }
}

///////////////// PROVVISORIE //////////////

// per testare la richiesta:
// fetch("/g/utenti-provv", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appG.get('/utenti-provv', async (req, res) => {
    const users = await getUtentiProvv();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(users));
});

async function getUtentiProvv() {
    try {
        const results = await clientServ.query(`SELECT "user", "email", "ruolo" FROM "utenti" WHERE NOT "ruolo" = 'amministratore' ORDER BY "user";`);
        return results.rows;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

module.exports = appG;

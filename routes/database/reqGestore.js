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
        const results = await clientM10a.query(`SELECT "cl_ogg_fr", "fr_risc", "controllo", "mn_reg", "mn_nec" FROM main10ance_sacrimonti."frase_di_rischio" ORDER BY "cl_ogg_fr";`);
        return results.rows;
    }
    catch(e) {
        return [];
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

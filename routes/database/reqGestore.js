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

// // per testare la richiesta:
// // fetch("/g/Main10ance_DB/dashboard/oggettiBIM", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
// appG.get('/Main10ance_DB/dashboard/oggettiBIM', async (req, res) => {
//     const reqJson = req.headers;
//     const listaTabelleBIM = reqJson.tabelle;
//     const risposta = await leggiNumeroOggettiBIM(listaTabelleBIM);
//     res.setHeader('content-type', 'application/json');
//     res.send(risposta);
// });

// // per testare la richiesta:
// // fetch("/g/Main10ance_DB/dashboard/oggettiGIS", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
// appG.get('/Main10ance_DB/dashboard/oggettiGIS', async (req, res) => {
//     const reqJson = req.headers;
//     const listaTabelleGIS = reqJson.tabelle;
//     const risposta = await leggiNumeroOggettiGIS(listaTabelleGIS);
//     res.setHeader('content-type', 'application/json');
//     res.send(risposta);
// });

// per testare la richiesta:
// fetch("/g/Main10ance_DB/dashboard/numero-oggetti", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appG.get('/Main10ance_DB/dashboard/numero-oggetti', async (req, res) => {
    const reqJson = req.headers;
    const listaTabelle = reqJson.tabelle;
    const risposta = await leggiNumeroOggetti(listaTabelle);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// // per testare la richiesta:
// // fetch("/g/Main10ance_DB/dashboard/BIMobject", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
// appG.get('/Main10ance_DB/dashboard/BIMobject', async (req, res) => {
//     const risposta = await BIMobject();
//     res.setHeader('content-type', 'application/json');
//     res.send(risposta);
// });

// // per testare la richiesta:
// // fetch("/g/Main10ance_DB/dashboard/GISobject", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
// appG.get('/Main10ance_DB/dashboard/GISobject', async (req, res) => {
//     const risposta = await GISobject();
//     res.setHeader('content-type', 'application/json');
//     res.send(risposta);
// });


// per testare la richiesta:
// fetch("/g/Main10ance_DB/dashboard/SMmodel", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appG.get('/Main10ance_DB/dashboard/SMmodel', async (req, res) => {
    const risposta = await SMmodel();
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

// async function leggiNumeroOggettiBIM(listaTabelle) {
//     const listaTabs = JSON.parse(listaTabelle);
//     const listaStringhe = listaTabs.map(tab => `SELECT COUNT(*) FROM main10ance_sacrimonti."${tab}"`);
//     const stringheJoin = listaStringhe.join(' UNION ');
//     try {
//         const result = await clientM10a.query(`SELECT SUM(count) FROM (${stringheJoin}) AS tabelle;`);
//         return result.rows[0];
//     }
//     catch(e) {
//         return [];
//     }
// }

// async function leggiNumeroOggettiGIS(listaTabelle) {
//     const listaTabs = JSON.parse(listaTabelle);
//     const listaStringhe = listaTabs.map(tab => `SELECT COUNT(*) FROM main10ance_sacrimonti."${tab}"`);
//     const stringheJoin = listaStringhe.join(' UNION ');
//     try {
//         // const result = await clientM10a.query(`SELECT SUM(count) FROM (SELECT COUNT(*) FROM main10ance_sacrimonti.accesso_civico_toponimo_stradale UNION SELECT COUNT(*) FROM main10ance_sacrimonti.aiuola UNION SELECT COUNT(*) FROM main10ance_sacrimonti.albero_isolato UNION SELECT COUNT(*) FROM main10ance_sacrimonti.area_di_circolazione_veicolare UNION SELECT COUNT(*) FROM main10ance_sacrimonti.area_verde UNION SELECT COUNT(*) FROM main10ance_sacrimonti.arredo_urbano UNION SELECT COUNT(*) FROM main10ance_sacrimonti.bosco UNION SELECT COUNT(*) FROM main10ance_sacrimonti.cappella UNION SELECT COUNT(*) FROM main10ance_sacrimonti.carte_storiche UNION SELECT COUNT(*) FROM main10ance_sacrimonti.coltura_agricola UNION SELECT COUNT(*) FROM main10ance_sacrimonti.corso_d_acqua UNION SELECT COUNT(*) FROM main10ance_sacrimonti.curve_di_livello UNION SELECT COUNT(*) FROM main10ance_sacrimonti.edificio UNION SELECT COUNT(*) FROM main10ance_sacrimonti.edificio_minore UNION SELECT COUNT(*) FROM main10ance_sacrimonti.linee_vita UNION SELECT COUNT(*) FROM main10ance_sacrimonti.località_significativa UNION SELECT COUNT(*) FROM main10ance_sacrimonti.nodo_rete_di_approvvigionamento_idrico UNION SELECT COUNT(*) FROM main10ance_sacrimonti.nodo_rete_di_smaltimento_acque UNION SELECT COUNT(*) FROM main10ance_sacrimonti.nodo_rete_elettrica UNION SELECT COUNT(*) FROM main10ance_sacrimonti.reti_di_sottoservizi UNION SELECT COUNT(*) FROM main10ance_sacrimonti.sistema_di_raccolta_acque UNION SELECT COUNT(*) FROM main10ance_sacrimonti.sistemi_di_sicurezza UNION SELECT COUNT(*) FROM main10ance_sacrimonti.specchio_d_acqua UNION SELECT COUNT(*) FROM main10ance_sacrimonti.strade_sentieri_e_altri_percorsi_interni UNION SELECT COUNT(*) FROM main10ance_sacrimonti.tratto_rete_di_approvvigionamento_idrico UNION SELECT COUNT(*) FROM main10ance_sacrimonti.tratto_rete_di_smaltimento_acque UNION SELECT COUNT(*) FROM main10ance_sacrimonti.tratto_rete_elettrica) AS tabelle;`);
//         const result = await clientM10a.query(`SELECT SUM(count) FROM (${stringheJoin}) AS tabelle;`);
//         return result.rows[0];
//     }
//     catch(e) {
//         return [];
//     }
// }

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

// async function BIMobject() {
//     try {
//         const result = await clientM10a.query(`SELECT COUNT(*), 'apparato decorativo' AS nome_tabella FROM main10ance_sacrimonti.apparato_decorativo UNION SELECT COUNT(*), 'catena' FROM main10ance_sacrimonti.catena UNION SELECT COUNT(*), 'finestra' FROM main10ance_sacrimonti.finestra 
//         UNION SELECT COUNT(*), 'grata' FROM main10ance_sacrimonti.grata UNION SELECT COUNT(*), 'muro' FROM main10ance_sacrimonti.muro UNION SELECT COUNT(*), 'pavimento' FROM main10ance_sacrimonti.pavimento UNION SELECT COUNT(*), 'pilastro' FROM main10ance_sacrimonti.pilastro UNION SELECT COUNT(*), 'porta' FROM main10ance_sacrimonti.porta UNION SELECT COUNT(*), 'scala' FROM main10ance_sacrimonti.scala UNION SELECT COUNT(*), 'tetto' FROM main10ance_sacrimonti.tetto UNION SELECT COUNT(*), 'trave' FROM main10ance_sacrimonti.trave UNION SELECT COUNT(*), 'volta' FROM main10ance_sacrimonti.volta AS tabelle;`);
//         return result.rows;
//     }
//     catch(e) {
//         return [];
//     }
// }

// async function GISobject() {
//     try {
//         const result = await clientM10a.query(`SELECT COUNT(*), 'accesso civico' AS nome_tabella FROM main10ance_sacrimonti.accesso_civico_toponimo_stradale UNION SELECT COUNT(*), 'aiuola' FROM main10ance_sacrimonti.aiuola UNION SELECT COUNT(*), 'albero isolato' FROM main10ance_sacrimonti.albero_isolato UNION SELECT COUNT(*), 'area veicolare' FROM main10ance_sacrimonti.area_di_circolazione_veicolare UNION SELECT COUNT(*), 'area verde' FROM main10ance_sacrimonti.area_verde UNION SELECT COUNT(*), 'arredo urbano' FROM main10ance_sacrimonti.arredo_urbano UNION SELECT COUNT(*), 'bosco' FROM main10ance_sacrimonti.bosco UNION SELECT COUNT(*), 'cappella' FROM main10ance_sacrimonti.cappella UNION SELECT COUNT(*), 'carte storiche' FROM main10ance_sacrimonti.carte_storiche UNION SELECT COUNT(*), 'coltura agricola' FROM main10ance_sacrimonti.coltura_agricola UNION SELECT COUNT(*), 'corso d''acqua' FROM main10ance_sacrimonti.corso_d_acqua UNION SELECT COUNT(*), 'curve di livello' FROM main10ance_sacrimonti.curve_di_livello UNION SELECT COUNT(*), 'edificio' FROM main10ance_sacrimonti.edificio UNION SELECT COUNT(*), 'edificio minore' FROM main10ance_sacrimonti.edificio_minore UNION SELECT COUNT(*), 'linee vita' FROM main10ance_sacrimonti.linee_vita 
//         UNION SELECT COUNT(*), 'località significativa' FROM main10ance_sacrimonti.località_significativa UNION SELECT COUNT(*), 'nodo rete di approvigionamento idrico' FROM main10ance_sacrimonti.nodo_rete_di_approvvigionamento_idrico UNION SELECT COUNT(*), 'nodo rete di smaltimento acque' FROM main10ance_sacrimonti.nodo_rete_di_smaltimento_acque UNION SELECT COUNT(*), 'nodo rete elettrica' FROM main10ance_sacrimonti.nodo_rete_elettrica UNION SELECT COUNT(*), 'rete di sottoservizi' FROM main10ance_sacrimonti.reti_di_sottoservizi UNION SELECT COUNT(*), 'sistema di raccolta acque' FROM main10ance_sacrimonti.sistema_di_raccolta_acque UNION SELECT COUNT(*), 'sistemi di sicurezza' FROM main10ance_sacrimonti.sistemi_di_sicurezza UNION SELECT COUNT(*), 'specchio d''acqua' FROM main10ance_sacrimonti.specchio_d_acqua UNION SELECT COUNT(*), 'percorsi e sentieri' FROM main10ance_sacrimonti.strade_sentieri_e_altri_percorsi_interni UNION SELECT COUNT(*), 'tratto rete di approvigionamento idrico' FROM main10ance_sacrimonti.tratto_rete_di_approvvigionamento_idrico UNION SELECT COUNT(*), 'tratto rete di smaltimento acque' FROM main10ance_sacrimonti.tratto_rete_di_smaltimento_acque UNION SELECT COUNT(*), 'tratto rete elettrica' FROM main10ance_sacrimonti.tratto_rete_elettrica AS tabelle`);
//         return result.rows;
//     }
//     catch(e) {
//         return [];
//     }
// }

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

async function SMmodel() {
    try {
        const result = await clientServ.query(`SELECT COUNT(DISTINCT urn), 'Varallo' AS nome_tabella FROM dati_cappelle WHERE sacro_monte = 'SMV' UNION SELECT COUNT(DISTINCT urn), 'Ghiffa' AS nome_tabella FROM dati_cappelle WHERE sacro_monte = 'SMG'`);
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

module.exports = appG;

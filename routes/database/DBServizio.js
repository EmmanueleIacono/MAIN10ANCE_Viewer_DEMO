// const { Client } = require('pg');
const express = require('express');
const appServizio = express.Router();
appServizio.use(express.json());
appServizio.use(express.static("public"));

// const {controllaRuoli, consentiAccesso} = require('../auth/middleware');

// const clientServ = new Client({
//     connectionString: process.env.DATABASE_URL,
//     ssl: { rejectUnauthorized: false }
// });
const {clientServ} = require('./connessioni');

// // per testare la richiesta:
// // fetch("/DB_Servizio/MarkerSM", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
// appServizio.get('/DB_Servizio/MarkerSM', async (req, res) => {
//     const markerSacriMonti = await leggiMarkerSM();
//     res.setHeader('content-type', 'application/json');
//     res.send(JSON.stringify(markerSacriMonti));
// }); // FATTA

// // per testare la richiesta:
// // fetch("/DB_Servizio/MarkerCapp", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
// appServizio.get('/DB_Servizio/MarkerCapp', async (req, res) => {
//     const markerCappelle = await leggiMarkerCapp();
//     res.setHeader('content-type', 'application/json');
//     res.send(JSON.stringify(markerCappelle));
// }); // FATTA

// // per testare la richiesta:
// // fetch("/DB_Servizio/LOD/TabelleGIS", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
// appServizio.get('/DB_Servizio/LOD/TabelleGIS', async (req, res) => {
//     const tabelleGIS = await leggiListaTabelleGIS();
//     res.setHeader('content-type', 'application/json');
//     res.send(JSON.stringify(tabelleGIS));
// }); // FATTA

// // per testare la richiesta:
// // fetch("/DB_Servizio/LOD/TabelleLOD", {method: "GET", headers: {"content-type": "application/json", lod: 5} }).then(a => a.json()).then(console.log)
// appServizio.get('/DB_Servizio/LOD/TabelleLOD', async (req, res) => {
//     const reqJson = req.headers;
//     const tabelleLOD = await leggiListaTabelleLOD(reqJson.lod);
//     res.setHeader('content-type', 'application/json');
//     res.send(JSON.stringify(tabelleLOD));
// }); // FATTA

// // per testare la richiesta:
// // fetch("/DB_Servizio/LOD/UrnCappelle", {method: "GET", headers: {"content-type": "application/json", sm: 'SMV', capp: '38'} }).then(a => a.json()).then(console.log)
// appServizio.get('/DB_Servizio/LOD/UrnCappelle', async (req, res) => {
//     const reqJson = req.headers;
//     const urn = await recuperaUrnLOD3(reqJson.sm, reqJson.capp);
//     res.setHeader('content-type', 'application/json');
//     res.send(JSON.stringify(urn[0]));
// }); // FATTA

// // per testare la richiesta:
// // fetch("/DB_Servizio/LOD/3e4", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
// appServizio.get('/DB_Servizio/LOD/3e4', async (req, res) => {
//     const lod = await leggiTabelleLOD3e4();
//     res.setHeader('content-type', 'application/json');
//     res.send(JSON.stringify(lod));
// }); // FATTA

// // per testare la richiesta:
// // fetch("/utenti", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
// appServizio.get('/utenti', controllaRuoli, async (req, res) => {
//     const users = await getUtenti();
//     res.setHeader('content-type', 'application/json');
//     res.send(JSON.stringify(users));
// }); // FATTA

// // per testare la richiesta:
// // fetch("/utenti/mario", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
// appServizio.get(`/utenti/:username`,/* consentiAccesso,*/ async (req, res) => {
//     const username = req.params.username;
//     const risp = await getInfoUtenteByNome(username);
//     res.setHeader('content-type', 'application/json');
//     res.send(JSON.stringify(risp));
// }); // FATTA

// start();

// async function start() {
//     await connect();
// }

// async function connect() {
//     try {
//         await clientServ.connect();
//         console.log('Connessione al database di servizio riuscita');
//     }
//     catch(e) {
//         console.error(`Connessione al database di servizio fallita: ${e}`);
//     }
// }

// async function leggiMarkerSM() {
//     try {
//         const results = await clientServ.query(`SELECT * FROM "dati_sm" ORDER BY "nome";`);
//         return results.rows;
//     }
//     catch(e) {
//         return [];
//     }
// } // FATTA

// async function leggiMarkerCapp() {
//     try {
//         const results = await clientServ.query(`SELECT * FROM "dati_cappelle" ORDER BY CAST("numero" AS INTEGER);`);
//         return results.rows;
//     }
//     catch(e) {
//         return [];
//     }
// } // FATTA

// async function leggiListaTabelleGIS() {
//     try {
//         const results = await clientServ.query(`SELECT "entità_db_m10a" AS "tabella", "nome_esteso" AS "alias", "geometria", "colonne_utili" AS "colonneUtili" FROM "lod" WHERE "BIM-GIS" = 'GIS' ORDER BY "tabella";`);
//         return results.rows;
//     }
//     catch(e) {
//         return [];
//     }
// } // FATTA

// async function leggiListaTabelleLOD(LOD) {
//     try {
//         const results = await clientServ.query(`SELECT "entità_db_m10a" AS "tabella", "nome_esteso" AS "alias" FROM "lod" WHERE "LOD" = ($1) ORDER BY "tabella";`, [LOD]);
//         return results.rows;
//     }
//     catch(e) {
//         return [];
//     }
// } // FATTA

// async function recuperaUrnLOD3(sm, capp) {
//     try {
//         const results = await clientServ.query(`SELECT "urn" FROM "dati_cappelle" WHERE "sacro_monte" = ($1) AND "numero" = ($2);`, [sm, capp]);
//         return results.rows;
//     }
//     catch(e) {
//         return [];
//     }
// } // FATTA

// async function leggiTabelleLOD3e4() {
//     try {
//         const results = await clientServ.query(`SELECT "entità_db_m10a" AS "tabella", "nome_esteso" AS "alias" FROM "lod" WHERE "LOD" = 3 OR "LOD" = 4 ORDER BY "tabella";`);
//         return results.rows;
//     }
//     catch(e) {
//         return [];
//     }
// } // FATTA

// async function getUtenti() {
//     try {
//         const results = await clientServ.query(`SELECT * FROM "utenti";`);
//         return results.rows;
//     }
//     catch(e) {
//         return [];
//     }
// } // FATTA

// async function getUtenteByNome(nome) {
//     try {
//         const results = await clientServ.query(`SELECT "user" AS "username", "pw", "ruolo" AS "role" FROM "utenti" WHERE "user" = ($1);`, [nome]);
//         return results.rows[0];
//     }
//     catch(e) {
//         return [];
//     }
// } // FATTA

// async function getInfoUtenteByNome(nome) {
//     try {
//         const results = await clientServ.query(`SELECT "user" AS "username", "ruolo" AS "role" FROM "utenti" WHERE "user" = ($1);`, [nome]);
//         return results.rows[0];
//     }
//     catch(e) {
//         return [];
//     }
// } // FATTA

// async function insertNuovoUtente(user) {
//     try {
//         await clientServ.query(`INSERT INTO "utenti" ("user", "pw", "ruolo") VALUES (($1), ($2), 'turista');`, [user.username, user.pw]);
//         return true;
//     }
//     catch(e) {
//         console.log(e);
//         return false;
//     }
// } // FATTA

module.exports = {appServizio/*, getUtenteByNome, insertNuovoUtente*/}

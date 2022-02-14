const express = require('express');
const appO = express.Router();
appO.use(express.json());
appO.use(express.static("public"));

const {clientM10a, clientServ} = require('./connessioni');

//////////          RICHIESTE          //////////

// per testare la richiesta:
// fetch("/o/Main10ance_DB/colonne", {method: "GET", headers: {"content-type": "application/json", tab: "catena"} }).then(a => a.json()).then(console.log)
appO.get('/Main10ance_DB/colonne', async (req, res) => {
    const reqJson = req.headers;
    const risposta = await leggiColonneTabella(reqJson.tab);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB", {method: "GET", headers: {"content-type": "application/json", tab: "catena"} }).then(a => a.json()).then(console.log)
appO.get('/Main10ance_DB/tabellaDB', async (req, res) => {
    const reqJson = req.headers;
    const risposta = await leggiTabellaDB(reqJson.tab);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB/glossario", {method: "GET", headers: {"content-type": "application/json", tab: "glossario"} }).then(a => a.json()).then(console.log)
appO.get('/Main10ance_DB/tabellaDB/glossario', async (req, res) => {
    const risposta = await leggiTabellaGlossario();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB/glossario/degradi", {method: "GET", headers: {"content-type": "application/json", tab: "glossario"} }).then(a => a.json()).then(console.log)
appO.get('/Main10ance_DB/tabellaDB/glossario/degradi', async (req, res) => {
    const risposta = await leggiTabellaGlossarioDegradi();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB/enum", {method: "GET", headers: {"content-type": "application/json", nomeenum: "cl_ogg_fr"} }).then(a => a.json()).then(console.log)
appO.get('/Main10ance_DB/tabellaDB/enum', async (req, res) => {
    const reqJson = req.headers;
    const risposta = await leggiEnum(reqJson.nomeenum);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

appO.post('/Main10ance_DB/schede/nuova', async (req, res) => {
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
// fetch("/o/Main10ance_DB/tabellaDB/schede-anagrafica", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appO.get('/Main10ance_DB/tabellaDB/schede-anagrafica', async (req, res) => {
    const risposta = await leggiSchedeAnagrafica();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB/schede-controllo", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appO.get('/Main10ance_DB/tabellaDB/schede-controllo', async (req, res) => {
    const risposta = await leggiSchedeControllo();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB/schede-controllo-2", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appO.get('/Main10ance_DB/tabellaDB/schede-controllo-2', async (req, res) => {
    const risposta = await leggiSchedeControllo2();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB/schede-manutenzione-regolare", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appO.get('/Main10ance_DB/tabellaDB/schede-manutenzione-regolare', async (req, res) => {
    const risposta = await leggiSchedeManReg();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB/schede-manutenzione-correttiva", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appO.get('/Main10ance_DB/tabellaDB/schede-manutenzione-correttiva', async (req, res) => {
    const risposta = await leggiSchedeManCorr();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB/schede-restauro", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appO.get('/Main10ance_DB/tabellaDB/schede-restauro', async (req, res) => {
    const risposta = await leggiSchedeRestauro();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB/eventi-manutenzione-regolare", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appO.get('/Main10ance_DB/tabellaDB/eventi-manutenzione-regolare', async (req, res) => {
    const risposta = await leggiEventiManutenzioneRegolare();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB/eventi-manutenzione-correttiva", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appO.get('/Main10ance_DB/tabellaDB/eventi-manutenzione-correttiva', async (req, res) => {
    const risposta = await leggiEventiManutenzioneCorrettiva();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/DB_Servizio/LOD/TabelleLOD", {method: "GET", headers: {"content-type": "application/json", lod: 5} }).then(a => a.json()).then(console.log)
appO.get('/DB_Servizio/LOD/TabelleLOD', async (req, res) => {
    const reqJson = req.headers;
    const tabelleLOD = await leggiListaTabelleLOD(reqJson.lod);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(tabelleLOD));
});

// per testare la richiesta:
// fetch("/o/DB_Servizio/LOD/UrnCappelle", {method: "GET", headers: {"content-type": "application/json", sm: 'SMV', capp: '38'} }).then(a => a.json()).then(console.log)
appO.get('/DB_Servizio/LOD/UrnCappelle', async (req, res) => {
    const reqJson = req.headers;
    const urn = await recuperaUrnLOD3(reqJson.sm, reqJson.capp);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(urn[0]));
});

// per testare la richiesta:
// fetch("/o/DB_Servizio/LOD/3e4", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appO.get('/DB_Servizio/LOD/3e4', async (req, res) => {
    const lod = await leggiTabelleLOD3e4();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(lod));
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/controlli-programmati", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
appO.get('/Main10ance_DB/controlli-programmati', async (req, res) => {
    const contr = await leggiDatiControlloProg();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(contr));
});

appO.get('/Main10ance_DB/attivita-programmate', async (req, res) => {
    const resp = await leggiAttivitàProg();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(resp));
});

appO.patch('/Main10ance_DB/esecuzione/nuova-attivita', async (req, res) => {
    const result = {};
    try {
        const reqJson = req.body;
        const resp = await registraAttivitàEsecuzione(reqJson);
        result.success = resp;
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

async function leggiColonneTabella(nomeTab) {
    try {
        const result = await clientM10a.query(`SELECT * FROM information_schema.columns WHERE table_schema = 'main10ance_sacrimonti' AND table_name = ($1);`, [nomeTab]);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiTabellaDB(nomeTab) {
    try {
        const result = await clientM10a.query(`SELECT * FROM main10ance_sacrimonti."${nomeTab}" ORDER BY "id_main10ance";`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiTabellaGlossario() {
    try {
        const result = await clientM10a.query(`SELECT * FROM main10ance_sacrimonti."glossario" ORDER BY regexp_replace("id_gloss", '\\D', '', 'g');`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiTabellaGlossarioDegradi() {
    try {
        const result = await clientM10a.query(`SELECT * FROM main10ance_sacrimonti."glossario" WHERE ("gloss_ty"='danno' OR "gloss_ty"='alterazione' OR "gloss_ty"='degrado' OR "gloss_ty"='nessuno') ORDER BY regexp_replace("id_gloss", '\\D', '', 'g');`);
        return result.rows;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function leggiEnum(nomeEnum) {
    try {
        const result = await clientM10a.query(`SELECT unnest(enum_range(null::main10ance_sacrimonti.${nomeEnum}));`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function transazioneScheda(listaStrVals) {
    try {
        await clientM10a.query("BEGIN;");
        try {
            for (const sv of listaStrVals) {
                await clientM10a.query(sv[0], sv[1]);
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

async function leggiSchedeAnagrafica() {
    try {
        const result = await clientM10a.query(`SELECT descrizione_sistema AS "Descrizione sistema", descrizione_subsistema AS "Descrizione subsistema", tecnica_costruttiva AS "Tecnica costruttiva", dimensioni AS "Dimensioni", materiale AS "Materiale", epoca AS "Epoca", ispezionabilità AS "Ispezionabilità", fonti AS "Fonti", data_registrazione AS "Data di registrazione", autore_scheda AS "Autore scheda", data_ultima_mod AS "Data ultima modifica", autore_ultima_mod AS "Autore ultima modifica", id_anagr AS "Codice scheda anagrafica", id_main10ance AS "Elemento schedato" FROM main10ance_sacrimonti.scheda_anagrafica ORDER BY data_registrazione;`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiSchedeControllo() {
    try {
        const result = await clientM10a.query(`SELECT mc.data_con, mc.controllo, md.id_dad, md.id_main10ance, md.rid_gloss, mf.mn_reg, mf.frequenza, mf.mn_nec, mc.liv_urg FROM main10ance_sacrimonti.controllo_stato_di_conservazione_livello_di_urgenza AS mc JOIN main10ance_sacrimonti.danno_alterazione_degrado AS md ON mc.id_contr = md.id_dad JOIN main10ance_sacrimonti.frase_di_rischio AS mf ON mc.id_contr = mf.id_fr_risc ORDER BY data_con;`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiSchedeControllo2() {
    try {
        // const result = await clientM10a.query(`SELECT mc.esecutori AS "Operatore", mc.data_con AS "Data controllo", mc.controllo AS "Tipo di controllo", mc.strumentaz AS "Strumentazione", md.materiale AS "Materiale", mc.st_cons AS "Stato di conservazione", md.dad_ty AS "Tipo di fenomeno", md.rid_gloss AS "Nome fenomeno", md.causa_e AS "Causa", md.est_sup AS "Estensione", mf.fr_risc AS "Frase di rischio", mf.mn_reg AS "Manutenzione regolare prevista", mf.frequenza AS "Frequenza prevista (mesi)", mf.mn_nec AS "Manutenzione correttiva prevista", mc.liv_urg AS "Livello di urgenza", mc.costo AS "Costo previsto (€)", mc.commenti AS "Commenti", mc.doc AS "Documenti", md.id_dad AS "Codice scheda controllo", md.id_main10ance AS "Elementi controllati", mc.data_ins AS "Data registrazione scheda" FROM main10ance_sacrimonti.controllo_stato_di_conservazione_livello_di_urgenza AS mc JOIN main10ance_sacrimonti.danno_alterazione_degrado AS md ON mc.id_contr = md.id_dad JOIN main10ance_sacrimonti.frase_di_rischio AS mf ON mc.id_contr = mf.id_fr_risc ORDER BY data_con;`);
        const result = await clientM10a.query(`SELECT mc.esecutori AS "Operatore", mc.data_con AS "Data controllo", mc.controllo AS "Tipo di controllo", mc.strumentaz AS "Strumentazione", ap.costo AS "Costo previsto (€)", ap.ore AS "Ore previste", ap.commenti AS "Note", mc.doc AS "Documenti", mc.id_contr AS "Codice scheda controllo", ap.cl_ogg_fr AS "Classe oggetti", ap."località_estesa" AS "Località", (string_to_array(ap.id_main10ance[1], '|'))[2] AS "Edificio", mc.id_main10ance AS "Elementi da controllare", mc.data_ins AS "Data programmazione attività" FROM main10ance_sacrimonti.controllo_stato_di_conservazione_livello_di_urgenza AS mc JOIN main10ance_sacrimonti.attività_prog AS ap ON mc.rid_att_prog = ap.id_att_prog WHERE mc.eseguito = FALSE ORDER BY mc.data_ins;`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiSchedeManReg() {
    try {
        // const result = await clientM10a.query(`SELECT esecutori AS "Operatore", data_ese AS "Data intervento", id_contr AS "Scheda controllo", rid_gloss AS "Fenomeno interessato", fq_eff AS "Frequenza effettiva (mesi)", azione AS "Azione", strumentaz AS "Strumentazione", materiale AS "Materiali utilizzati", costo AS "Costo (€)", commenti AS "Commenti", doc AS "Documenti", id_mn_reg AS "Codice scheda manutenzione regolare", id_main10ance AS "Elementi interessati", data_ins AS "Data registrazione scheda" FROM main10ance_sacrimonti.manutenzione_regolare ORDER BY data_ese;`);
        const result = await clientM10a.query(`SELECT mr.esecutori AS "Operatore", mr.data_ese AS "Data intervento", mr.azione AS "Tipo di intervento", mr.strumentaz AS "Strumentazione", ap.costo AS "Costo previsto (€)", ap.ore AS "Ore previste", ap.commenti AS "Note", mr.doc AS "Documenti", mr.id_mn_reg AS "Codice scheda manutenzione regolare", ap.cl_ogg_fr AS "Classe oggetti", ap."località_estesa" AS "Località", (string_to_array(ap.id_main10ance[1], '|'))[2] AS "Edificio", mr.id_main10ance AS "Elementi interessati", mr.data_ins AS "Data programmazione attività" FROM main10ance_sacrimonti.manutenzione_regolare AS mr JOIN main10ance_sacrimonti.attività_prog AS ap ON mr.rid_att_prog = ap.id_att_prog WHERE mr.eseguito = FALSE ORDER BY mr.data_ins;`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiSchedeManCorr() {
    try {
        const result = await clientM10a.query(`SELECT esecutori AS "Operatore", data_ese AS "Data intervento", id_contr AS "Scheda controllo", rid_gloss AS "Fenomeno interessato", progettist AS "Progettista/i", azione AS "Azione", strumentaz AS "Strumentazione", materiale AS "Materiali utilizzati", costo AS "Costo (€)", causa AS "Causa", commenti AS "Commenti", doc AS "Documenti", id_mn_gu AS "Codice scheda manutenzione correttiva", id_main10ance AS "Elementi interessati", data_ins AS "Data registrazione scheda" FROM main10ance_sacrimonti.manutenzione_correttiva_o_a_guasto ORDER BY data_ese;`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiSchedeRestauro() {
    try {
        const result = await clientM10a.query(`SELECT operatore AS "Operatore", anno_iniz AS "Anno inizio", anno_fine AS "Anno fine", progettist AS "Progettista/i", rid_gloss AS "Fenomeno interessato", descriz AS "Descrizione intervento", costo AS "Costo (€)", commenti AS "Commenti", doc AS "Documenti", id_restaur AS "Codice scheda restauro", id_main10ance AS "Elementi interessati", data_ins AS "Data registrazione scheda" FROM main10ance_sacrimonti.restauri ORDER BY anno_iniz;`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiEventiManutenzioneRegolare() {
    try {
        const result = await clientM10a.query(`SELECT "id_mn_reg", "id_contr", "id_main10ance", "rid_gloss", "data_ese", "azione" FROM main10ance_sacrimonti."manutenzione_regolare" ORDER BY "id_mn_reg";`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiEventiManutenzioneCorrettiva() {
    try {
        const result = await clientM10a.query(`SELECT "id_mn_gu", "id_contr", "id_main10ance", "rid_gloss", "data_ese", "azione" FROM main10ance_sacrimonti."manutenzione_correttiva_o_a_guasto" ORDER BY "id_mn_gu";`);
        return result.rows;
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

async function recuperaUrnLOD3(sm, capp) {
    try {
        const results = await clientServ.query(`SELECT "urn" FROM "dati_cappelle" WHERE "sacro_monte" = ($1) AND "numero" = ($2);`, [sm, capp]);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiTabelleLOD3e4() {
    try {
        const results = await clientServ.query(`SELECT "entità_db_m10a" AS "tabella", "nome_esteso" AS "alias" FROM "lod" WHERE "LOD" = 3 OR "LOD" = 4 ORDER BY "alias";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

/////// DA ELIMINARE O DA RIVEDERE PER FASE 2 //////////////
// async function leggiDatiControlloProg() {
//     try {
//         const results = await clientM10a.query(`SELECT "c".id_contr AS "id", "fr".cl_ogg_fr AS "classe", "fr".fr_risc AS "frase", "fr".controllo, "fr".mn_reg AS "manutenzione_regolare", "fr".mn_nec AS "manutenzione_correttiva", "c".data_con AS "data_operazione", "c".freq AS "frequenza", "c".data_ins AS "data_registrazione", "c".id_main10ance FROM main10ance_sacrimonti.controllo_stato_di_conservazione_livello_di_urgenza AS "c" JOIN main10ance_sacrimonti.frase_di_rischio AS "fr" ON "c".rid_fr_risc = "fr".id_fr_risc ORDER BY data_con;`);
//         return results.rows;
//     }
//     catch(e) {
//         return [];
//     }
// }

async function leggiAttivitàProg() {
    try {
        // const results = await clientM10a.query('SELECT * FROM main10ance_sacrimonti."attività_prog" ORDER BY "id_att_prog";');
        const results = await clientM10a.query('SELECT "id_att_prog", "rid_fr_risc", "data_prog", "costo", "ore", "esecutori", "strumentaz", "commenti", to_json("id_main10ance") AS "id_main10ance", "id_group", "cl_ogg_fr", to_json("tipo_attività") AS "tipo_attività", "data_ins", "frequenza", "da_integrare" FROM main10ance_sacrimonti."attività_prog" ORDER BY "id_att_prog";');
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function registraAttivitàEsecuzione(dati) {
    const stringaContr = 'controllo_stato_di_conservazione_livello_di_urgenza';
    const stringaManReg = 'manutenzione_regolare';
    const stringaManCorr = 'manutenzione_correttiva_o_a_guasto';
    const stringaManStr = 'manutenzione_straordinaria';
    const stringaRestauro = 'restauri';
    const stringaDiagnosi = 'danno_alterazione_degrado';
    try {
        await clientM10a.query('BEGIN;');
        switch (dati.tabella) {
            case stringaContr: {
                console.log(dati);
                if (dati.nuovo_record) {
                    // - NUOVO id_contr, stessa cl_ogg_fr, stesso controllo, stessi esecutori, data_ins+data_ultima_mod, stesso rid_fr_risc, stesso rid_att_prog
                    console.log('DA FARE INSERT');
                    const arrayInsertContr = [dati.nuovo_id, dati.data_con, dati.data_ultima_mod, dati.data_ultima_mod, dati.strumentaz, dati.id_main10ance, dati.cl_racc, dati.st_cons, dati.liv_urg, dati.commenti, dati.doc, dati.autore_ultima_mod, true];
                    // qui NON registro costo effettivo e ore effettive
                    const stringaSelect = `SELECT "cl_ogg_fr", "controllo", "esecutori", "rid_fr_risc", "rid_att_prog", "id_group" WHERE "id_contr" = ${dati.id_contr}`;
                    await clientM10a.query(`INSERT INTO main10ance_sacrimonti."${stringaContr}" ("id_contr", "cl_ogg_fr", "controllo", "esecutori", "rid_fr_risc", "rid_att_prog", "id_group", "data_con", "data_ins", "data_ultima_mod", "strumentaz", "id_main10ance", "cl_racc", "st_cons", "liv_urg", "commenti", "doc", "autore_ultima_mod", "eseguito") VALUES (($1), (${stringaSelect}), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12), ($13));`, arrayInsertContr);
                    // copiare dati tabella da record con id_contr = dati[id_contr], quindi INSERT INTO con campi nuovi presi da "dati", e campi uguali presi da record di riferimento
                }
                else {
                    console.log('DA FARE UPDATE');
                    // qui registro costo effettivo e ore effettive
                    // registrare campo "eseguito" come TRUE
                    const arrayUpdateContr = [dati.id_contr, dati.cl_racc, dati.st_cons, dati.liv_urg, dati.strumentaz, dati.commenti, dati.doc, dati.costo, dati.ore, dati.data_con, dati.data_ultima_mod, dati.autore_ultima_mod, dati.id_main10ance, true];
                    await clientM10a.query(`UPDATE main10ance_sacrimonti."${stringaContr}" SET "cl_racc" = ($2), "st_cons" = ($3), "liv_urg" = ($4), "strumentaz" = ($5), "commenti" = ($6), "doc" = ($7), "costo" = ($8), "ore" = ($9), "data_con" = ($10), "data_ultima_mod" = ($11), "autore_ultima_mod" = ($12), "id_main10ance" = ($13), "eseguito" = ($14) WHERE "id_contr" = ($1);`, arrayUpdateContr);
                }

                switch (dati.cl_racc) {
                    case 'cr 0 - nessuna misura': {
                        console.log('prossima attività prog, semplice');
                        const valuesArray = [/* DA COMPILARE BENE!!!!! */];
                        // await clientM10a.query(`INSERT INTO main10ance_sacrimonti."attività_prog" ("id_att_prog", "tipo_attività", "cl_ogg_fr", "rid_fr_risc", "frequenza", "data_prog", "id_group", "id_main10ance", "data_ins", "data_ultima_mod", "località_estesa", "da_integrare") VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12));`, valuesArray);
                        break;
                    }
                    case 'cr 1 - conservazione preventiva': {
                        console.log('prossima attività prog, ma con "necessaria_revisione" = TRUE');
                        break;
                    }
                    case 'cr 2 - riparazioni di media entità': {
                        console.log('prossima attività prog, ma CORRETTIVA');
                        break;
                    }
                    case 'cr 3 - interventi rilevanti dipendenti dalla diagnosi': {
                        console.log('prossima attività prog, ma DIAGNOSI');
                        break;
                    }
                    default: throw new Error('ERRORE: La richiesta non è andata a buon fine.');
                }

                // NOTE:
                // se CR0: registro attività fatta, registro prossima attività prog
                // se CR1: registro attività fatta, registro prossima attività prog con "necessaria_revisione" = TRUE
                // se CR2: registro attività fatta, registro attività prog CORRETTIVA
                // se CR3: registro attività fatta, registro attività prog DIAGNOSI
                break;
            }
            case stringaManReg: {
                // NOTE:
                // registrare campo "eseguito" come TRUE
                break;
            }
            case stringaManCorr: {
                // NOTE:
                // registrare campo "eseguito" come TRUE
                break;
            }
            case stringaManStr: {
                // NOTE:
                // registrare campo "eseguito" come TRUE
                break;
            }
            case stringaRestauro: {
                // NOTE:
                // registrare campo "eseguito" come TRUE
                break;
            }
            case stringaDiagnosi: {
                // NOTE:
                // registrare campo "eseguito" come TRUE
                break;
            }
            default: throw new Error('ERRORE: La richiesta non è andata a buon fine.');
        }
        await clientM10a.query('COMMIT;');
        return true;
    }
    catch(e) {
        console.log(`Errore: ${e}`);
        await clientM10a.query("ROLLBACK;");
        return false;
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

module.exports = appO;

const express = require('express');
const app = express.Router();
app.use(express.json());
app.use(express.static("public"));

const {clientM10a} = require('./connessioni');
const {data_schema, utility_schema} = require('./schemi');

//////////          RICHIESTE          //////////

// per testare la richiesta:
// fetch("/o/Main10ance_DB/colonne", {method: "GET", headers: {"content-type": "application/json", tab: "catena"} }).then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/colonne', async (req, res) => {
    const reqJson = req.headers;
    const risposta = await leggiColonneTabella(reqJson.tab);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB", {method: "GET", headers: {"content-type": "application/json", tab: "catena"} }).then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/tabellaDB', async (req, res) => {
    const reqJson = req.headers;
    const risposta = await leggiTabellaDB(reqJson.tab);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB/glossario", {method: "GET", headers: {"content-type": "application/json", tab: "glossario"} }).then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/tabellaDB/glossario', async (req, res) => {
    const risposta = await leggiTabellaGlossario();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB/glossario/degradi", {method: "GET", headers: {"content-type": "application/json", tab: "glossario"} }).then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/tabellaDB/glossario/degradi', async (req, res) => {
    const risposta = await leggiTabellaGlossarioDegradi();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB/enum", {method: "GET", headers: {"content-type": "application/json", nomeenum: "cl_ogg_fr"} }).then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/tabellaDB/enum', async (req, res) => {
    const reqJson = req.headers;
    const risposta = await leggiEnum(reqJson.nomeenum);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

app.post('/Main10ance_DB/schede/nuova', async (req, res) => {
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
app.get('/Main10ance_DB/tabellaDB/schede-anagrafica', async (req, res) => {
    const risposta = await leggiSchedeAnagrafica();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB/schede-controllo", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/tabellaDB/schede-controllo', async (req, res) => {
    const risposta = await leggiSchedeControllo();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB/schede-controllo-2", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/tabellaDB/schede-controllo-2', async (req, res) => {
    const risposta = await leggiSchedeControllo2();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB/schede-manutenzione-regolare", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/tabellaDB/schede-manutenzione-regolare', async (req, res) => {
    const risposta = await leggiSchedeManReg();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB/schede-manutenzione-correttiva", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/tabellaDB/schede-manutenzione-correttiva', async (req, res) => {
    const risposta = await leggiSchedeManCorr();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB/schede-restauro", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/tabellaDB/schede-restauro', async (req, res) => {
    const risposta = await leggiSchedeRestauro();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB/eventi-manutenzione-regolare", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/tabellaDB/eventi-manutenzione-regolare', async (req, res) => {
    const risposta = await leggiEventiManutenzioneRegolare();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/tabellaDB/eventi-manutenzione-correttiva", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/tabellaDB/eventi-manutenzione-correttiva', async (req, res) => {
    const risposta = await leggiEventiManutenzioneCorrettiva();
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/DB_Servizio/LOD/UrnEdifici", {method: "GET", headers: {"content-type": "application/json", sm: 'SMV', capp: '38'} }).then(a => a.json()).then(console.log)
app.get('/DB_Servizio/LOD/UrnEdifici', async (req, res) => {
    const reqJson = req.headers;
    const urn = await recuperaUrnLOD3(reqJson.sm, reqJson.capp);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(urn[0]));
});

// per testare la richiesta:
// fetch("/o/DB_Servizio/LOD/UrnLoc", {method: "GET", headers: {"content-type": "application/json", sm: 'SMV', capp: '38'} }).then(a => a.json()).then(console.log)
app.get('/DB_Servizio/LOD/UrnLoc', async (req, res) => {
    const reqJson = req.headers;
    const urn = await recuperaUrnLOD2(reqJson.loc);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(urn[0]));
});

// per testare la richiesta:
// fetch("/o/DB_Servizio/LOD/3e4", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/DB_Servizio/LOD/3e4', async (req, res) => {
    const lod = await leggiTabelleLOD3e4();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(lod));
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/controlli-programmati", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/controlli-programmati', async (req, res) => {
    const contr = await leggiDatiControlloProg();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(contr));
});

app.get('/Main10ance_DB/attivita-programmate', async (req, res) => {
    const cookies = req.signedCookies;
    let resp;
    if (cookies.role === 'operatore') {
        resp = await leggiAttivitàProgOperatore();
    }
    else {
        resp = await leggiAttivitàProg();
    }
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(resp));
});

app.patch('/esecuzione/nuova-attivita', async (req, res) => {
    const ambito = req.signedCookies.ambito;
    const result = {};
    try {
        const reqJson = req.body;
        const resp = await registraAttivitàEsecuzione(reqJson, ambito);
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

app.get('/Main10ance_DB/esecuzione/frequenza', async (req, res) => {
    const reqJson = req.headers;
    const resp = await recuperaFrequenzaAttProg(reqJson.id, reqJson.tabella);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(resp[0]));
});

// per testare la richiesta:
// fetch("/o/schede-storico-controllo").then(a => a.json()).then(console.log)
app.get('/schede-storico-controllo', async (req, res) => {
    const ambito = req.signedCookies.ambito;
    const risposta = await leggiSchedeStoricoControllo(ambito);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/schede-storico-manutenzione-regolare").then(a => a.json()).then(console.log)
app.get('/schede-storico-manutenzione-regolare', async (req, res) => {
    const ambito = req.signedCookies.ambito;
    const risposta = await leggiSchedeStoricoManReg(ambito);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/schede-storico-manutenzione-correttiva").then(a => a.json()).then(console.log)
app.get('/schede-storico-manutenzione-correttiva', async (req, res) => {
    const ambito = req.signedCookies.ambito;
    const risposta = await leggiSchedeStoricoManCorr(ambito);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/anagrafica/artifact-viewer/interroga/SMV|39|grata|1826323").then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/anagrafica/artifact-viewer/interroga/:id', async (req, res) => {
    const id = req.params.id;
    const categoria = JSON.parse(req.headers.categoria);
    let risposta;
    // qui verifica se LOD4, Manufatto o Dettaglio
    console.log(categoria);
    switch (categoria) {
        // se Manufatto:
        case 'manufatto':
            console.log('richiesta manufatto');
            risposta = await interrogaAnagraficaManufatto(id);
            break;
    
        // se Dettaglio:
        case 'dettaglio':
            console.log('richiesta dettaglio');
            risposta = await interrogaAnagraficaDettaglio(id);
            break;

        // ALTRIMENTI, se LOD4:
        default:
            risposta = await interrogaAnagraficaLOD4(id);
            break;
    }
    console.log(risposta);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/o/Main10ance_DB/segnalazione/artifact-viewer/interroga/loc-pdiff|LPD_230301184934871|manufatto|231124123134626").then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/segnalazione/artifact-viewer/interroga/:id', async (req, res) => {
    const id = req.params.id;
    const categoria = JSON.parse(req.headers.categoria);
    let risposta;
    // qui verifica se LOD4, Manufatto o Dettaglio
    console.log(categoria);
    risposta = await interrogaSegnalazione(id);
    console.log(risposta);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// diversa da quella equivalente per turista, qui richiedo dati associati ad ambito specifico utente
app.get('/MarkerLoc', async (req, res) => {
    const ambito_loc = req.signedCookies.ambito;
    const markerLocalità = await leggiMarkerLocAmbito(ambito_loc);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(markerLocalità));
});

// diversa da quella equivalente per turista, qui richiedo dati associati ad ambito specifico utente
app.get('/MarkerEdif', async (req, res) => {
    const ambito_edif = req.signedCookies.ambito;
    const markerEdifici = await leggiMarkerEdifAmbito(ambito_edif);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(markerEdifici));
});

//////////          QUERY          //////////

async function leggiColonneTabella(nomeTab) {
    try {
        const result = await clientM10a.query(`SELECT * FROM information_schema.columns WHERE table_schema = '${data_schema}' AND table_name = ($1);`, [nomeTab]);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiTabellaDB(nomeTab) {
    try {
        const result = await clientM10a.query(`SELECT * FROM ${data_schema}."${nomeTab}" ORDER BY "id_main10ance";`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiTabellaGlossario() {
    try {
        const result = await clientM10a.query(`SELECT * FROM ${utility_schema}."glossario" ORDER BY regexp_replace("id_gloss", '\\D', '', 'g');`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiTabellaGlossarioDegradi() {
    try {
        const result = await clientM10a.query(`SELECT * FROM ${utility_schema}."glossario" WHERE ("gloss_ty"='danno' OR "gloss_ty"='alterazione' OR "gloss_ty"='degrado' OR "gloss_ty"='nessuno') ORDER BY regexp_replace("id_gloss", '\\D', '', 'g');`);
        return result.rows;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function leggiEnum(nomeEnum) {
    try {
        const result = await clientM10a.query(`SELECT unnest(enum_range(null::${data_schema}.${nomeEnum}));`); // SANIFICARE INPUT
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
        const result = await clientM10a.query(`SELECT descrizione_sistema AS "Descrizione sistema", descrizione_subsistema AS "Descrizione subsistema", tecnica_costruttiva AS "Tecnica costruttiva", dimensioni AS "Dimensioni", materiale AS "Materiale", epoca AS "Epoca", ispezionabilità AS "Ispezionabilità", fonti AS "Fonti", data_registrazione AS "Data di registrazione", autore_scheda AS "Autore scheda", data_ultima_mod AS "Data ultima modifica", autore_ultima_mod AS "Autore ultima modifica", id_anagr AS "Codice scheda anagrafica", id_main10ance AS "Elemento schedato" FROM ${data_schema}.scheda_anagrafica ORDER BY data_registrazione;`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiSchedeControllo() {
    try {
        const result = await clientM10a.query(`SELECT mc.data_con, mc.controllo, md.id_dad, md.id_main10ance, md.rid_gloss, mf.mn_reg, mf.frequenza, mf.mn_nec, mc.liv_urg FROM ${data_schema}.controllo_stato_di_conservazione_livello_di_urgenza AS mc JOIN ${data_schema}.danno_alterazione_degrado AS md ON mc.id_contr = md.id_dad JOIN ${utility_schema}.frase_di_rischio AS mf ON mc.id_contr = mf.id_fr_risc ORDER BY data_con;`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiSchedeControllo2() {
    try {
        // const result = await clientM10a.query(`SELECT mc.esecutori AS "Operatore", mc.data_con AS "Data controllo", mc.controllo AS "Tipo di controllo", mc.strumentaz AS "Strumentazione", md.materiale AS "Materiale", mc.st_cons AS "Stato di conservazione", md.dad_ty AS "Tipo di fenomeno", md.rid_gloss AS "Nome fenomeno", md.causa_e AS "Causa", md.est_sup AS "Estensione", mf.fr_risc AS "Frase di rischio", mf.mn_reg AS "Manutenzione regolare prevista", mf.frequenza AS "Frequenza prevista (mesi)", mf.mn_nec AS "Manutenzione correttiva prevista", mc.liv_urg AS "Livello di urgenza", mc.costo AS "Costo previsto (€)", mc.commenti AS "Commenti", mc.doc AS "Documenti", md.id_dad AS "Codice scheda controllo", md.id_main10ance AS "Elementi controllati", mc.data_ins AS "Data registrazione scheda" FROM ${data_schema}.controllo_stato_di_conservazione_livello_di_urgenza AS mc JOIN ${data_schema}.danno_alterazione_degrado AS md ON mc.id_contr = md.id_dad JOIN ${utility_schema}.frase_di_rischio AS mf ON mc.id_contr = mf.id_fr_risc ORDER BY data_con;`);
        const result = await clientM10a.query(`SELECT ap."località_estesa" AS "Località", (string_to_array(ap.id_main10ance[1], '|'))[2] AS "Edificio", ap.cl_ogg_fr AS "Classe oggetti", mc.controllo AS "Tipo di controllo", mc.strumentaz AS "Strumentazione", ap.costo AS "Costo previsto (€)", ap.ore AS "Durata prevista (ore)", mc.data_con AS "Data controllo", mc.data_ins AS "Data programmazione attività", mc.esecutori AS "Operatore", mc.doc AS "Documenti", ap.commenti AS "Note", mc.id_contr AS "Codice scheda controllo", mc.id_main10ance AS "Elementi da controllare" FROM ${data_schema}.controllo_stato_di_conservazione_livello_di_urgenza AS mc JOIN ${data_schema}.attività_prog AS ap ON mc.rid_att_prog = ap.id_att_prog WHERE mc.eseguito = FALSE ORDER BY mc.data_ins;`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiSchedeManReg() {
    try {
        // const result = await clientM10a.query(`SELECT esecutori AS "Operatore", data_ese AS "Data intervento", id_contr AS "Scheda controllo", rid_gloss AS "Fenomeno interessato", fq_eff AS "Frequenza effettiva (mesi)", azione AS "Azione", strumentaz AS "Strumentazione", materiale AS "Materiali utilizzati", costo AS "Costo (€)", commenti AS "Commenti", doc AS "Documenti", id_mn_reg AS "Codice scheda manutenzione regolare", id_main10ance AS "Elementi interessati", data_ins AS "Data registrazione scheda" FROM ${data_schema}.manutenzione_regolare ORDER BY data_ese;`);
        const result = await clientM10a.query(`SELECT ap."località_estesa" AS "Località", (string_to_array(ap.id_main10ance[1], '|'))[2] AS "Edificio", ap.cl_ogg_fr AS "Classe oggetti", mr.azione AS "Tipo di intervento", mr.strumentaz AS "Strumentazione", ap.costo AS "Costo previsto (€)", ap.ore AS "Durata prevista (ore)", mr.data_ese AS "Data intervento", mr.data_ins AS "Data programmazione attività", mr.esecutori AS "Operatore", mr.doc AS "Documenti", ap.commenti AS "Note", mr.id_mn_reg AS "Codice scheda manutenzione regolare", mr.id_main10ance AS "Elementi interessati" FROM ${data_schema}.manutenzione_regolare AS mr JOIN ${data_schema}.attività_prog AS ap ON mr.rid_att_prog = ap.id_att_prog WHERE mr.eseguito = FALSE ORDER BY mr.data_ins;`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiSchedeManCorr() {
    try {
        // const result = await clientM10a.query(`SELECT esecutori AS "Operatore", data_ese AS "Data intervento", progettist AS "Progettista/i", azione AS "Azione", strumentaz AS "Strumentazione", materiale AS "Materiali utilizzati", costo AS "Costo (€)", causa AS "Causa", commenti AS "Commenti", doc AS "Documenti", id_mn_gu AS "Codice scheda manutenzione correttiva", id_main10ance AS "Elementi interessati", data_ins AS "Data registrazione scheda" FROM ${data_schema}.manutenzione_correttiva_o_a_guasto ORDER BY data_ese;`);
        const result = await clientM10a.query(`SELECT ap."località_estesa" AS "Località", (string_to_array(ap.id_main10ance[1], '|'))[2] AS "Edificio", ap.cl_ogg_fr AS "Classe oggetti", mc.azione AS "Tipo di intervento", mc.strumentaz AS "Strumentazione", ap.costo AS "Costo previsto (€)", ap.ore AS "Durata prevista (ore)", mc.data_ese AS "Data intervento", mc.data_ins AS "Data programmazione attività", mc.esecutori AS "Operatore", mc.doc AS "Documenti", ap.commenti AS "Note", mc.id_mn_gu AS "Codice scheda manutenzione correttiva", mc.id_main10ance AS "Elementi interessati" FROM ${data_schema}.manutenzione_correttiva_o_a_guasto AS mc JOIN ${data_schema}.attività_prog AS ap ON mc.rid_att_prog = ap.id_att_prog WHERE mc.eseguito = FALSE ORDER BY mc.data_ins;`);
        return result.rows;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function leggiSchedeRestauro() {
    try {
        const result = await clientM10a.query(`SELECT operatore AS "Operatore", anno_iniz AS "Anno inizio", anno_fine AS "Anno fine", progettist AS "Progettista/i", rid_gloss AS "Fenomeno interessato", descriz AS "Descrizione intervento", costo AS "Costo (€)", commenti AS "Commenti", doc AS "Documenti", id_restaur AS "Codice scheda restauro", id_main10ance AS "Elementi interessati", data_ins AS "Data registrazione scheda" FROM ${data_schema}.restauri ORDER BY anno_iniz;`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiEventiManutenzioneRegolare() {
    try {
        const result = await clientM10a.query(`SELECT "id_mn_reg", "id_contr", "id_main10ance", "rid_gloss", "data_ese", "azione" FROM ${data_schema}."manutenzione_regolare" ORDER BY "id_mn_reg";`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiEventiManutenzioneCorrettiva() {
    try {
        const result = await clientM10a.query(`SELECT "id_mn_gu", "id_contr", "id_main10ance", "rid_gloss", "data_ese", "azione" FROM ${data_schema}."manutenzione_correttiva_o_a_guasto" ORDER BY "id_mn_gu";`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function recuperaUrnLOD3(sm, capp) {
    try {
        const results = await clientM10a.query(`SELECT "urn" FROM ${data_schema}."dati_edifici" WHERE "località" = ($1) AND "numero" = ($2);`, [sm, capp]);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function recuperaUrnLOD2(loc) {
    try {
        const results = await clientM10a.query(`SELECT "urn" FROM ${data_schema}."dati_località" WHERE "sigla" = ($1);`, [loc]);
        return results.rows;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function leggiTabelleLOD3e4() {
    try {
        const results = await clientM10a.query(`SELECT "entità_db_m10a" AS "tabella", "nome_esteso" AS "alias" FROM ${utility_schema}."lod" WHERE "LOD" = 3 OR "LOD" = 4 ORDER BY "alias";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

/////// DA ELIMINARE O DA RIVEDERE PER FASE 2 //////////////
// async function leggiDatiControlloProg() {
//     try {
//         const results = await clientM10a.query(`SELECT "c".id_contr AS "id", "fr".cl_ogg_fr AS "classe", "fr".fr_risc AS "frase", "fr".controllo, "fr".mn_reg AS "manutenzione_regolare", "fr".mn_nec AS "manutenzione_correttiva", "c".data_con AS "data_operazione", "c".freq AS "frequenza", "c".data_ins AS "data_registrazione", "c".id_main10ance FROM ${data_schema}.controllo_stato_di_conservazione_livello_di_urgenza AS "c" JOIN ${utility_schema}.frase_di_rischio AS "fr" ON "c".rid_fr_risc = "fr".id_fr_risc ORDER BY data_con;`);
//         return results.rows;
//     }
//     catch(e) {
//         return [];
//     }
// }

async function leggiAttivitàProg() {
    try {
        const withString = `WITH totale AS (
            (SELECT rid_att_prog FROM ${data_schema}."controllo_stato_di_conservazione_livello_di_urgenza" WHERE eseguito = FALSE)
            UNION ALL (SELECT rid_att_prog FROM ${data_schema}."manutenzione_regolare" WHERE eseguito = FALSE)
            UNION ALL (SELECT rid_att_prog FROM ${data_schema}."manutenzione_correttiva_o_a_guasto" WHERE eseguito = FALSE)
            UNION ALL (SELECT rid_att_prog FROM ${data_schema}."manutenzione_straordinaria" WHERE eseguito = FALSE)
            UNION ALL (SELECT rid_att_prog FROM ${data_schema}."restauri" WHERE eseguito = FALSE)
            UNION ALL (SELECT rid_att_prog FROM ${data_schema}."danno_alterazione_degrado" WHERE eseguito = FALSE)
            )`;
        const subQueryString = `SELECT ("rid_att_prog") AS "lista_id" FROM totale`;
        const results = await clientM10a.query(`${withString} SELECT "id_att_prog", "rid_fr_risc", "data_prog", "costo", "ore", "esecutori", "strumentaz", "commenti", to_json("id_main10ance") AS "id_main10ance", "id_group", "cl_ogg_fr", to_json("tipo_attività") AS "tipo_attività", "data_ins", "frequenza", "da_integrare" FROM ${data_schema}."attività_prog" WHERE "id_att_prog" = ANY(${subQueryString}) OR "da_integrare" = TRUE ORDER BY "id_att_prog";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiAttivitàProgOperatore() {
    try {
        const withString = `WITH totale AS (
            (SELECT rid_att_prog FROM ${data_schema}."controllo_stato_di_conservazione_livello_di_urgenza" WHERE eseguito = FALSE)
            UNION ALL (SELECT rid_att_prog FROM ${data_schema}."manutenzione_regolare" WHERE eseguito = FALSE)
            UNION ALL (SELECT rid_att_prog FROM ${data_schema}."manutenzione_correttiva_o_a_guasto" WHERE eseguito = FALSE)
            UNION ALL (SELECT rid_att_prog FROM ${data_schema}."manutenzione_straordinaria" WHERE eseguito = FALSE)
            UNION ALL (SELECT rid_att_prog FROM ${data_schema}."restauri" WHERE eseguito = FALSE)
            UNION ALL (SELECT rid_att_prog FROM ${data_schema}."danno_alterazione_degrado" WHERE eseguito = FALSE)
            )`;
        const subQueryString = `SELECT ("rid_att_prog") AS "lista_id" FROM totale`;
        const results = await clientM10a.query(`${withString} SELECT "id_att_prog", "rid_fr_risc", "data_prog", "costo", "ore", "esecutori", "strumentaz", "commenti", to_json("id_main10ance") AS "id_main10ance", "id_group", "cl_ogg_fr", to_json("tipo_attività") AS "tipo_attività", "data_ins", "frequenza", "da_integrare" FROM ${data_schema}."attività_prog" WHERE "id_att_prog" = ANY(${subQueryString}) AND "da_integrare" = FALSE ORDER BY "id_att_prog";`);
        return results.rows;
    }
    catch(e) {
        console.log(e);
        return []
    }
}

async function registraAttivitàEsecuzione(dati, ambito) {
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
                if (dati.nuovo_record) {
                    const arrayInsertContr = [dati.nuovo_id, dati.data_con, dati.data_ultima_mod, dati.data_ultima_mod, dati.strumentaz, dati.id_main10ance, dati.cl_racc, dati.st_cons, dati.liv_urg, dati.commenti, dati.doc, dati.autore_ultima_mod, dati.id_contr, true, ambito];
                    const stringaSelectClOgg = `SELECT "cl_ogg_fr" FROM ${data_schema}.${stringaContr} WHERE "id_contr" = ${dati.id_contr}`; // TUTTI QUESTI SUB-SELECT ANDREBBERO CAMBIATI CON PREPARED STATEMENTS E AGGIUNTO WHERE CON AMBITO (11/10/2024)
                    const stringaSelectContr = `SELECT "controllo" FROM ${data_schema}.${stringaContr} WHERE "id_contr" = ${dati.id_contr}`;
                    const stringaSelectEsec = `SELECT "esecutori" FROM ${data_schema}.${stringaContr} WHERE "id_contr" = ${dati.id_contr}`;
                    const stringaSelectRidFrRisc = `SELECT "rid_fr_risc" FROM ${data_schema}.${stringaContr} WHERE "id_contr" = ${dati.id_contr}`;
                    const stringaSelectRidAttProg = `SELECT "rid_att_prog" FROM ${data_schema}.${stringaContr} WHERE "id_contr" = ${dati.id_contr}`;
                    const stringaSelectIdGroup = `SELECT "id_group" FROM ${data_schema}.${stringaContr} WHERE "id_contr" = ${dati.id_contr}`;
                    await clientM10a.query(`INSERT INTO ${data_schema}."${stringaContr}" ("id_contr", "cl_ogg_fr", "controllo", "esecutori", "rid_fr_risc", "rid_att_prog", "id_group", "data_con", "data_ins", "data_ultima_mod", "strumentaz", "id_main10ance", "cl_racc", "st_cons", "liv_urg", "commenti", "doc", "autore_ultima_mod", "id_att_ciclica", "eseguito", "ambito") VALUES (($1), (${stringaSelectClOgg}), (${stringaSelectContr}), (${stringaSelectEsec}), (${stringaSelectRidFrRisc}), (${stringaSelectRidAttProg}), (${stringaSelectIdGroup}), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12), ($13), ($14), ($15));`, arrayInsertContr);
                }
                else {
                    const arrayUpdateContr = [dati.id_contr, dati.cl_racc, dati.st_cons, dati.liv_urg, dati.strumentaz, dati.commenti, dati.doc, dati.costo, dati.ore, dati.data_con, dati.data_ultima_mod, dati.autore_ultima_mod, dati.id_main10ance, true, ambito];
                    await clientM10a.query(`UPDATE ${data_schema}."${stringaContr}" SET "cl_racc" = ($2), "st_cons" = ($3), "liv_urg" = ($4), "strumentaz" = ($5), "commenti" = ($6), "doc" = ($7), "costo" = ($8), "ore" = ($9), "data_con" = ($10), "data_ultima_mod" = ($11), "autore_ultima_mod" = ($12), "id_main10ance" = ($13), "eseguito" = ($14) WHERE "id_contr" = ($1) AND "ambito" = ($2);`, arrayUpdateContr);
                }

                const rid_contr = dati.nuovo_record ? dati.nuovo_id : dati.id_contr;
                const stringaSelectIdGroup = `SELECT "id_group" FROM ${data_schema}.${stringaContr} WHERE "id_contr" = ${dati.id_contr}`;
                const stringaSelectRidFrRisc = `SELECT "rid_fr_risc" FROM ${data_schema}.${stringaContr} WHERE "id_contr" = ${dati.id_contr}`;
                const stringaSelectAttProgClOgg = `SELECT "cl_ogg_fr" FROM ${data_schema}.attività_prog WHERE id_group = (${stringaSelectIdGroup}) AND rid_fr_risc = (${stringaSelectRidFrRisc}) AND 'controllo' = ANY("tipo_attività") AND id_main10ance[1] LIKE '%|${dati.edificio}|%' ORDER BY data_prog DESC LIMIT 1`;
                const stringaSelectAttProgRidFrRisc = `SELECT "rid_fr_risc" FROM ${data_schema}.attività_prog WHERE id_group = (${stringaSelectIdGroup}) AND rid_fr_risc = (${stringaSelectRidFrRisc}) AND 'controllo' = ANY("tipo_attività") AND id_main10ance[1] LIKE '%|${dati.edificio}|%' ORDER BY data_prog DESC LIMIT 1`;
                const stringaSelectAttProgFreq = `SELECT "frequenza" FROM ${data_schema}.attività_prog WHERE id_group = (${stringaSelectIdGroup}) AND rid_fr_risc = (${stringaSelectRidFrRisc}) AND 'controllo' = ANY("tipo_attività") AND id_main10ance[1] LIKE '%|${dati.edificio}|%' ORDER BY data_prog DESC LIMIT 1`;
                const stringaSelectAttProgIdGroup = `SELECT "id_group" FROM ${data_schema}.attività_prog WHERE id_group = (${stringaSelectIdGroup}) AND rid_fr_risc = (${stringaSelectRidFrRisc}) AND 'controllo' = ANY("tipo_attività") AND id_main10ance[1] LIKE '%|${dati.edificio}|%' ORDER BY data_prog DESC LIMIT 1`;
                const stringaSelectAttProgLoc = `SELECT "località_estesa" FROM ${data_schema}.attività_prog WHERE id_group = (${stringaSelectIdGroup}) AND rid_fr_risc = (${stringaSelectRidFrRisc}) AND 'controllo' = ANY("tipo_attività") AND id_main10ance[1] LIKE '%|${dati.edificio}|%' ORDER BY data_prog DESC LIMIT 1`;
                switch (dati.cl_racc) {
                    case 'cr 0 - nessuna misura': {
                        const valuesArray = [parseInt(dati.id_att_prog), dati.data_next, dati.id_main10ance, dati.data_ultima_mod, dati.data_ultima_mod, dati.costo, dati.ore, dati.strumentaz, dati.esecutori, dati.id_contr, true, ambito];
                        await clientM10a.query(`INSERT INTO ${data_schema}."attività_prog" ("id_att_prog", "tipo_attività", "cl_ogg_fr", "rid_fr_risc", "frequenza", "id_group", "località_estesa", "data_prog", "id_main10ance", "data_ins", "data_ultima_mod", "costo", "ore", "strumentaz", "esecutori", "rid_att_ciclica_prec", "da_integrare", "ambito") VALUES (($1), '{controllo}', (${stringaSelectAttProgClOgg}), (${stringaSelectAttProgRidFrRisc}), (${stringaSelectAttProgFreq}), (${stringaSelectAttProgIdGroup}), (${stringaSelectAttProgLoc}), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12));`, valuesArray);
                        break;
                    }
                    case 'cr 1 - modifica attività ciclica': {
                        const valuesArray = [parseInt(dati.id_att_prog), dati.data_next, dati.id_main10ance, dati.data_ultima_mod, dati.data_ultima_mod, dati.costo, dati.ore, dati.strumentaz, dati.esecutori, dati.id_contr, true, true, ambito];
                        await clientM10a.query(`INSERT INTO ${data_schema}."attività_prog" ("id_att_prog", "tipo_attività", "cl_ogg_fr", "rid_fr_risc", "frequenza", "id_group", "località_estesa", "data_prog", "id_main10ance", "data_ins", "data_ultima_mod", "costo", "ore", "strumentaz", "esecutori", "rid_att_ciclica_prec", "da_integrare", "ambito", "necessaria_revisione") VALUES (($1), '{controllo}', (${stringaSelectAttProgClOgg}), (${stringaSelectAttProgRidFrRisc}), (${stringaSelectAttProgFreq}), (${stringaSelectAttProgIdGroup}), (${stringaSelectAttProgLoc}), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12), ($13));`, valuesArray);
                        break;
                    }
                    case 'cr 2 - intervento correttivo': {
                        const valuesArray = [parseInt(dati.id_att_prog), dati.id_main10ance, dati.data_ultima_mod, dati.data_ultima_mod, dati.liv_priorità, rid_contr, true, ambito];
                        await clientM10a.query(`INSERT INTO ${data_schema}."attività_prog" ("id_att_prog", "tipo_attività", "cl_ogg_fr", "rid_fr_risc", "id_group", "località_estesa", "id_main10ance", "data_ins", "data_ultima_mod", "liv_priorità", "rid_contr", "da_integrare", "ambito") VALUES (($1), '{manutenzione correttiva}', (${stringaSelectAttProgClOgg}), (${stringaSelectAttProgRidFrRisc}), (${stringaSelectAttProgIdGroup}), (${stringaSelectAttProgLoc}), ($2), ($3), ($4), ($5), ($6), ($7), ($8));`, valuesArray);
                        break;
                    }
                    // case 'cr 3 - intervento rilevante dipendente da progetto': {
                    //     const valuesArray = [parseInt(dati.id_att_prog), dati.id_main10ance, dati.data_ultima_mod, dati.data_ultima_mod, dati.liv_priorità, rid_contr, true, ambito];
                    //     await clientM10a.query(`INSERT INTO ${data_schema}."attività_prog" ("id_att_prog", "tipo_attività", "cl_ogg_fr", "rid_fr_risc", "id_group", "località_estesa", "id_main10ance", "data_ins", "data_ultima_mod", "liv_priorità", "rid_contr", "da_integrare") VALUES (($1), '{diagnosi}', (${stringaSelectAttProgClOgg}), (${stringaSelectAttProgRidFrRisc}), (${stringaSelectAttProgIdGroup}), (${stringaSelectAttProgLoc}), ($2), ($3), ($4), ($5), ($6), ($7), ($8));`, valuesArray);
                    //     break;
                    // }
                    default: throw new Error('ERRORE: La richiesta non è andata a buon fine.');
                }

                if (dati.listaCRregistrati && dati.listaCRregistrati.every(cr => cr > 1)) {
                    const valuesArray = [parseInt(dati.idDiEmergenza), dati.data_next, [], dati.data_ultima_mod, dati.data_ultima_mod, dati.costo, dati.ore, dati.strumentaz, dati.esecutori, rid_contr, true, ambito];
                    await clientM10a.query(`INSERT INTO ${data_schema}."attività_prog" ("id_att_prog", "tipo_attività", "cl_ogg_fr", "rid_fr_risc", "frequenza", "id_group", "località_estesa", "data_prog", "id_main10ance", "data_ins", "data_ultima_mod", "costo", "ore", "strumentaz", "esecutori", "rid_att_ciclica_prec", "da_integrare", "ambito") VALUES (($1), '{controllo}', (${stringaSelectAttProgClOgg}), (${stringaSelectAttProgRidFrRisc}), (${stringaSelectAttProgFreq}), (${stringaSelectAttProgIdGroup}), (${stringaSelectAttProgLoc}), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12));`, valuesArray);
                }
                break;
            }
            case stringaManReg: {
                if (dati.nuovo_record) {
                    const arrayInsertManReg = [dati.nuovo_id, dati.data_ese, dati.data_ultima_mod, dati.data_ultima_mod, dati.materiale, dati.strumentaz, dati.id_main10ance, dati.commenti, dati.doc, dati.autore_ultima_mod, dati.id_mn_reg, true, ambito];
                    const stringaSelectClOgg = `SELECT "cl_ogg_fr" FROM ${data_schema}.${stringaManReg} WHERE "id_mn_reg" = ${dati.id_mn_reg}`;
                    const stringaSelectAzione = `SELECT "azione" FROM ${data_schema}.${stringaManReg} WHERE "id_mn_reg" = ${dati.id_mn_reg}`;
                    const stringaSelectEsec = `SELECT "esecutori" FROM ${data_schema}.${stringaManReg} WHERE "id_mn_reg" = ${dati.id_mn_reg}`;
                    const stringaSelectRidFrRisc = `SELECT "rid_fr_risc" FROM ${data_schema}.${stringaManReg} WHERE "id_mn_reg" = ${dati.id_mn_reg}`;
                    const stringaSelectRidAttProg = `SELECT "rid_att_prog" FROM ${data_schema}.${stringaManReg} WHERE "id_mn_reg" = ${dati.id_mn_reg}`;
                    const stringaSelectIdGroup = `SELECT "id_group" FROM ${data_schema}.${stringaManReg} WHERE "id_mn_reg" = ${dati.id_mn_reg}`;
                    await clientM10a.query(`INSERT INTO ${data_schema}."${stringaManReg}" ("id_mn_reg", "cl_ogg_fr", "azione", "esecutori", "rid_fr_risc", "rid_att_prog", "id_group", "data_ese", "data_ins", "data_ultima_mod", "materiale", "strumentaz", "id_main10ance", "commenti", "doc", "autore_ultima_mod", "id_att_ciclica", "eseguito", "ambito") VALUES (($1), (${stringaSelectClOgg}), (${stringaSelectAzione}), (${stringaSelectEsec}), (${stringaSelectRidFrRisc}), (${stringaSelectRidAttProg}), (${stringaSelectIdGroup}), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12), ($13));`, arrayInsertManReg);
                }
                else {
                    const arrayUpdateManReg = [dati.id_mn_reg, dati.materiale, dati.strumentaz, dati.commenti, dati.doc, dati.costo, dati.ore, dati.data_ese, dati.data_ultima_mod, dati.autore_ultima_mod, dati.id_main10ance, true];
                    await clientM10a.query(`UPDATE ${data_schema}."${stringaManReg}" SET "materiale" = ($2), "strumentaz" = ($3), "commenti" = ($4), "doc" = ($5), "costo" = ($6), "ore" = ($7), "data_ese" = ($8), "data_ultima_mod" = ($9), "autore_ultima_mod" = ($10), "id_main10ance" = ($11), "eseguito" = ($12) WHERE "id_mn_reg" = ($1);`, arrayUpdateManReg);
                }

                const rid_mn_reg = dati.nuovo_record ? dati.nuovo_id : dati.id_mn_reg;
                const stringaSelectIdGroup = `SELECT "id_group" FROM ${data_schema}.${stringaManReg} WHERE "id_mn_reg" = ${dati.id_mn_reg}`;
                const stringaSelectRidFrRisc = `SELECT "rid_fr_risc" FROM ${data_schema}.${stringaManReg} WHERE "id_mn_reg" = ${dati.id_mn_reg}`;
                const stringaSelectAttProgClOgg = `SELECT "cl_ogg_fr" FROM ${data_schema}.attività_prog WHERE id_group = (${stringaSelectIdGroup}) AND rid_fr_risc = (${stringaSelectRidFrRisc}) AND 'controllo' = ANY("tipo_attività") AND id_main10ance[1] LIKE '%|${dati.edificio}|%' ORDER BY data_prog DESC LIMIT 1`;
                const stringaSelectAttProgRidFrRisc = `SELECT "rid_fr_risc" FROM ${data_schema}.attività_prog WHERE id_group = (${stringaSelectIdGroup}) AND rid_fr_risc = (${stringaSelectRidFrRisc}) AND 'controllo' = ANY("tipo_attività") AND id_main10ance[1] LIKE '%|${dati.edificio}|%' ORDER BY data_prog DESC LIMIT 1`;
                const stringaSelectAttProgFreq = `SELECT "frequenza" FROM ${data_schema}.attività_prog WHERE id_group = (${stringaSelectIdGroup}) AND rid_fr_risc = (${stringaSelectRidFrRisc}) AND 'controllo' = ANY("tipo_attività") AND id_main10ance[1] LIKE '%|${dati.edificio}|%' ORDER BY data_prog DESC LIMIT 1`;
                const stringaSelectAttProgIdGroup = `SELECT "id_group" FROM ${data_schema}.attività_prog WHERE id_group = (${stringaSelectIdGroup}) AND rid_fr_risc = (${stringaSelectRidFrRisc}) AND 'controllo' = ANY("tipo_attività") AND id_main10ance[1] LIKE '%|${dati.edificio}|%' ORDER BY data_prog DESC LIMIT 1`;
                const stringaSelectAttProgLoc = `SELECT "località_estesa" FROM ${data_schema}.attività_prog WHERE id_group = (${stringaSelectIdGroup}) AND rid_fr_risc = (${stringaSelectRidFrRisc}) AND 'controllo' = ANY("tipo_attività") AND id_main10ance[1] LIKE '%|${dati.edificio}|%' ORDER BY data_prog DESC LIMIT 1`;
                const valuesArray = [parseInt(dati.id_att_prog), dati.data_next, dati.id_main10ance, dati.data_ultima_mod, dati.data_ultima_mod, dati.costo, dati.ore, dati.strumentaz, dati.esecutori, rid_mn_reg, true, ambito];
                await clientM10a.query(`INSERT INTO ${data_schema}."attività_prog" ("id_att_prog", "tipo_attività", "cl_ogg_fr", "rid_fr_risc", "frequenza", "id_group", "località_estesa", "data_prog", "id_main10ance", "data_ins", "data_ultima_mod", "costo", "ore", "strumentaz", "esecutori", "rid_att_ciclica_prec", "da_integrare", "ambito") VALUES (($1), '{manutenzione regolare}', (${stringaSelectAttProgClOgg}), (${stringaSelectAttProgRidFrRisc}), (${stringaSelectAttProgFreq}), (${stringaSelectAttProgIdGroup}), (${stringaSelectAttProgLoc}), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12));`, valuesArray);
                break;
            }
            case stringaManCorr: {
                if (dati.nuovo_record) {
                    const arrayInsertManCorr = [dati.nuovo_id, dati.data_ese, dati.data_ultima_mod, dati.data_ultima_mod, dati.materiale, dati.strumentaz, dati.id_main10ance, dati.commenti, dati.doc, dati.autore_ultima_mod, true, ambito];
                    const stringaSelectClOgg = `SELECT "cl_ogg_fr" FROM ${data_schema}.${stringaManCorr} WHERE "id_mn_gu" = ${dati.id_mn_gu}`;
                    const stringaSelectAzione = `SELECT "azione" FROM ${data_schema}.${stringaManCorr} WHERE "id_mn_gu" = ${dati.id_mn_gu}`;
                    const stringaSelectEsec = `SELECT "esecutori" FROM ${data_schema}.${stringaManCorr} WHERE "id_mn_gu" = ${dati.id_mn_gu}`;
                    const stringaSelectRidFrRisc = `SELECT "rid_fr_risc" FROM ${data_schema}.${stringaManCorr} WHERE "id_mn_gu" = ${dati.id_mn_gu}`;
                    const stringaSelectRidAttProg = `SELECT "rid_att_prog" FROM ${data_schema}.${stringaManCorr} WHERE "id_mn_gu" = ${dati.id_mn_gu}`;
                    const stringaSelectIdGroup = `SELECT "id_group" FROM ${data_schema}.${stringaManCorr} WHERE "id_mn_gu" = ${dati.id_mn_gu}`;
                    await clientM10a.query(`INSERT INTO ${data_schema}."${stringaManCorr}" ("id_mn_gu", "cl_ogg_fr", "azione", "esecutori", "rid_fr_risc", "rid_att_prog", "id_group", "data_ese", "data_ins", "data_ultima_mod", "materiale", "strumentaz", "id_main10ance", "commenti", "doc", "autore_ultima_mod", "eseguito", "ambito") VALUES (($1), (${stringaSelectClOgg}), (${stringaSelectAzione}), (${stringaSelectEsec}), (${stringaSelectRidFrRisc}), (${stringaSelectRidAttProg}), (${stringaSelectIdGroup}), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12));`, arrayInsertManCorr);
                }
                else {
                    const arrayUpdateManCorr = [dati.id_mn_gu, dati.materiale, dati.strumentaz, dati.commenti, dati.doc, dati.costo, dati.ore, dati.data_ese, dati.data_ultima_mod, dati.autore_ultima_mod, dati.id_main10ance, true];
                    await clientM10a.query(`UPDATE ${data_schema}."${stringaManCorr}" SET "materiale" = ($2), "strumentaz" = ($3), "commenti" = ($4), "doc" = ($5), "costo" = ($6), "ore" = ($7), "data_ese" = ($8), "data_ultima_mod" = ($9), "autore_ultima_mod" = ($10), "id_main10ance" = ($11), "eseguito" = ($12) WHERE "id_mn_gu" = ($1);`, arrayUpdateManCorr);
                }

                const attRiall = await cercaAttProgPerRiallineamento(dati.id_mn_gu, 'id_mn_gu', stringaManCorr);
                const id_att_prog_riall = parseInt(attRiall.id_att_prog);
                await clientM10a.query(`UPDATE ${data_schema}.attività_prog SET "id_main10ance" = array_cat("id_main10ance", ($1)) WHERE "id_att_prog" = ($2);`, [dati.id_main10ance, id_att_prog_riall]);
                if (!attRiall.da_integrare) {
                    const attEsec = await cercaAttEsecPerRiallineamento(attRiall.id_att_prog, 'id_contr', stringaContr);
                    await clientM10a.query(`UPDATE ${data_schema}.${stringaContr} SET "id_main10ance" = array_cat("id_main10ance", ($1)) WHERE "id_contr" = ($2);`, [dati.id_main10ance, parseInt(attEsec.id_contr)]);
                }
                break;
            }
            case stringaManStr: {
                // NOTE:
                // registrare campo "eseguito" come TRUE
                console.log('MANUTENZIONE STRAORDINARIA');
                await clientM10a.query('ROLLBACK;');
                break;
            }
            case stringaRestauro: {
                // NOTE:
                // registrare campo "eseguito" come TRUE
                console.log('RESTAURO');
                await clientM10a.query('ROLLBACK;');
                break;
            }
            case stringaDiagnosi: {
                // NOTE:
                // registrare campo "eseguito" come TRUE
                console.log('DIAGNOSI');
                await clientM10a.query('ROLLBACK;');
                break;
            }
            default: throw new Error('ERRORE: La richiesta non è andata a buon fine.');
        }
        await clientM10a.query('COMMIT;');
        // await clientM10a.query('ROLLBACK;');
        return true;
    }
    catch(e) {
        console.log(`Errore: ${e}`);
        await clientM10a.query("ROLLBACK;");
        return false;
    }
}

async function recuperaFrequenzaAttProg(id, tabella) {
    const id_tab = tabella === 'controllo_stato_di_conservazione_livello_di_urgenza' ? 'id_contr' : 'id_mn_reg';
    const stringaSelectIdGroup = `SELECT "id_group" FROM ${data_schema}.${tabella} WHERE "${id_tab}" = ${id}`;
    const stringaSelectRidAttProg = `SELECT "rid_att_prog" FROM ${data_schema}.${tabella} WHERE "${id_tab}" = ${id}`;
    try {
        const results = await clientM10a.query(`SELECT "frequenza" FROM ${data_schema}.attività_prog WHERE id_att_prog = (${stringaSelectRidAttProg}) AND id_group = (${stringaSelectIdGroup});`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function cercaAttProgPerRiallineamento(id, nomeId, nomeTabella) {
    const stringaSelectRidContr = `SELECT "rid_contr" FROM ${data_schema}.${nomeTabella} WHERE "${nomeId}" = ${id}`;
    const stringaSelectIdAttCiclica = `SELECT id_att_ciclica FROM ${data_schema}.controllo_stato_di_conservazione_livello_di_urgenza WHERE id_contr = (${stringaSelectRidContr})`;
    try {
        const res = await clientM10a.query(`SELECT "id_att_prog", "rid_fr_risc", "id_main10ance", "id_group", "tipo_attività", "da_integrare", "necessaria_revisione", "rid_att_ciclica_prec" FROM ${data_schema}.attività_prog WHERE "rid_att_ciclica_prec" = (${stringaSelectIdAttCiclica}) AND 'controllo' = ANY("tipo_attività") AND ("necessaria_revisione" IS NULL OR "necessaria_revisione" = FALSE) ORDER BY "id_att_prog" ASC LIMIT 1;`);
        if (res.rowCount) return res.rows[0];
        const resTrue = await clientM10a.query(`SELECT "id_att_prog", "rid_fr_risc", "id_main10ance", "id_group", "tipo_attività", "da_integrare", "necessaria_revisione", "rid_att_ciclica_prec" FROM ${data_schema}.attività_prog WHERE "rid_att_ciclica_prec" = (${stringaSelectIdAttCiclica}) AND 'controllo' = ANY("tipo_attività") AND "necessaria_revisione" = TRUE ORDER BY "id_att_prog" ASC LIMIT 1;`);
        return resTrue.rows[0];
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function cercaAttEsecPerRiallineamento(id, nomeId, nomeTabella) {
    try {
        const res = await clientM10a.query(`SELECT "${nomeId}" FROM ${data_schema}.${nomeTabella} WHERE "rid_att_prog" = ${id} LIMIT 1;`);
        return res.rows[0];
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function leggiSchedeStoricoControllo(ambito) {
    try {
        const result = await clientM10a.query(`SELECT mc.data_con AS "Data controllo", ap."località_estesa" AS "Località", (string_to_array(mc.id_main10ance[1], '|'))[2] AS "Edificio", mc.cl_ogg_fr AS "Classe oggetti",  mc.controllo AS "Tipo di controllo", mc.strumentaz AS "Strumentazione", mc.st_cons AS "Stato di conservazione", mc.cl_racc AS "Classe di raccomandazione", mc.liv_urg AS "Livello di urgenza", mc.costo AS "Costo effettivo (€)", mc.ore AS "Ore effettive", mc.esecutori AS "Operatore", mc.doc AS "Documenti", mc.commenti AS "Note", mc.id_contr AS "Codice scheda controllo", mc.id_main10ance AS "Elementi da controllare", mc.data_ins AS "Data programmazione attività" FROM ${data_schema}.controllo_stato_di_conservazione_livello_di_urgenza AS mc JOIN ${data_schema}.attività_prog AS ap ON mc.rid_att_prog = ap.id_att_prog WHERE mc.eseguito = TRUE AND mc.ambito LIKE ($1) ORDER BY mc.data_ins;`, [ambito]);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiSchedeStoricoManReg(ambito) {
    try {
        const result = await clientM10a.query(`SELECT mr.data_ese AS "Data intervento", ap."località_estesa" AS "Località", (string_to_array(mr.id_main10ance[1], '|'))[2] AS "Edificio", mr.cl_ogg_fr AS "Classe oggetti", mr.azione AS "Tipo di intervento", mr.strumentaz AS "Strumentazione", mr.materiale AS "Materiale", mr.costo AS "Costo effettivo (€)", mr.ore AS "Ore effettive", mr.esecutori AS "Operatore", mr.doc AS "Documenti", mr.commenti AS "Note", mr.id_mn_reg AS "Codice scheda manutenzione regolare", mr.id_main10ance AS "Elementi interessati", mr.data_ins AS "Data programmazione attività" FROM ${data_schema}.manutenzione_regolare AS mr JOIN ${data_schema}.attività_prog AS ap ON mr.rid_att_prog = ap.id_att_prog WHERE mr.eseguito = TRUE AND mc.ambito LIKE ($1) ORDER BY mr.data_ins;`, [ambito]);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiSchedeStoricoManCorr(ambito) {
    try {
        const result = await clientM10a.query(`SELECT mc.data_ese AS "Data intervento", ap."località_estesa" AS "Località", (string_to_array(mc.id_main10ance[1], '|'))[2] AS "Edificio", mc.cl_ogg_fr AS "Classe oggetti", mc.azione AS "Tipo di intervento", mc.strumentaz AS "Strumentazione", mc.materiale AS "Materiale", mc.costo AS "Costo effettivo (€)", mc.ore AS "Ore effettive", mc.esecutori AS "Operatore", mc.doc AS "Documenti", mc.commenti AS "Note", mc.id_mn_gu AS "Codice scheda manutenzione correttiva", mc.id_main10ance AS "Elementi interessati", mc.data_ins AS "Data programmazione attività" FROM ${data_schema}.manutenzione_correttiva_o_a_guasto AS mc JOIN ${data_schema}.attività_prog AS ap ON mc.rid_att_prog = ap.id_att_prog WHERE mc.eseguito = TRUE AND mc.ambito LIKE ($1) ORDER BY mc.data_ins;`, [ambito]);
        return result.rows;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function interrogaAnagraficaLOD4(id) {
    try {
        const result = await clientM10a.query(`SELECT sa.autore_ultima_mod AS "Operatore", sa.descrizione_sistema AS "Descrizione sistema", sa.descrizione_subsistema AS "Descrizione subsistema", sa.tecnica_costruttiva AS "Tecnica costruttiva", sa.dimensioni AS "Dimensioni", sa.materiale AS "Materiale/i", sa.epoca AS "Epoca", sa.ispezionabilità AS "Ispezionabilità", sa.fonti AS "Fonti" FROM ${data_schema}.scheda_anagrafica AS sa WHERE sa.id_main10ance = '${id}';`);
        return result.rows;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function interrogaAnagraficaManufatto(id) {
    try {
        const result = await clientM10a.query(`SELECT sa.autore_ultima_mod AS "Operatore", sa.definizione AS "Definizione", sa.epoca AS "Epoca", sa.autore AS "Autore", sa.descrizione AS "Descrizione", sa.materiale AS "Materiale/i", sa.tecniche AS "Tecniche", sa.documenti AS "Documenti", sa.iter_autorizzativo AS "Iter autorizzativo" FROM ${utility_schema}.anagrafica_manufatto AS sa WHERE sa.id_main10ance = '${id}' ORDER BY sa.id_anagr DESC;`);
        return result.rows;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function interrogaAnagraficaDettaglio(id) {
    try {
        const result = await clientM10a.query(`SELECT sa.autore_ultima_mod AS "Operatore", sa.definizione AS "Definizione", sa.descrizione AS "Descrizione", sa.materiale AS "Materiale/i", sa.tecniche AS "Tecniche", sa.epoca AS "Epoca", sa.documenti AS "Documenti", sa.autore AS "Autore", sa.data AS "Data" FROM ${utility_schema}.anagrafica_dettaglio AS sa WHERE sa.id_main10ance = '${id}' ORDER BY sa.id_anagr DESC;`);
        return result.rows;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function interrogaSegnalazione(id) {
    try {
        const result = await clientM10a.query(`SELECT sg.autore_ultima_mod AS "Operatore", sg.meteo AS "Meteo", sg.temperatura AS "Temperatura", sg.condizioni_sett_precedente AS "Condizioni sett. precedente", sg.descrizione AS "Descrizione", sg.intervento_urgenza AS "Intervento di urgenza" FROM ${utility_schema}.segnalazione AS sg WHERE sg.id_main10ance = '${id}' ORDER BY sg.id_segnalazione DESC;`);
        return result.rows;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function leggiMarkerLocAmbito(ambito_loc) {
    try {
        const results = await clientM10a.query(`SELECT * FROM ${data_schema}."dati_località" WHERE "ambito" LIKE ($1) ORDER BY "nome";`, [ambito_loc]);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiMarkerEdifAmbito(ambito_edif) {
    try {
        const results = await clientM10a.query(`SELECT * FROM ${data_schema}."dati_edifici" WHERE "ambito" LIKE ($1) ORDER BY CAST("numero" AS INTEGER);`, [ambito_edif]);
        return results.rows;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

//////////          ALTRE FUNZIONI          //////////

function gestisciStringheSchede(listaOggetti) {
    let listaStringheEValori = [];
    listaOggetti.forEach(async jsn => {
        const schema = (jsn.tabella === 'anagrafica_manufatto' || jsn.tabella === 'anagrafica_dettaglio' || jsn.tabella === 'segnalazione') ? utility_schema : data_schema;
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
        const stringa = `INSERT INTO ${schema}.${jsn.tabella} (${stringaColonne}) VALUES (${stringaValues});`;
        listaInterna.push(stringa);
        listaInterna.push(listaValori);
        listaStringheEValori.push(listaInterna);
    });
    return listaStringheEValori;
}

module.exports = app;

const express = require('express');
const fileupload = require('express-fileupload');
const app = express.Router();
app.use(express.json());
app.use(express.static("public"));
app.use(fileupload());

const {clientM10a} = require('./connessioni');
const {data_schema, utility_schema} = require('./schemi');
const {supabase} = require('../../supabase_config');

//////////          RICHIESTE          //////////

// per testare la richiesta:
// fetch("/g/Main10ance_DB/dashboard/numero-oggetti", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/dashboard/numero-oggetti', async (req, res) => {
    const reqJson = req.headers;
    const listaTabelle = reqJson.tabelle;
    const risposta = await leggiNumeroOggetti(listaTabelle);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta:
// fetch("/g/Main10ance_DB/dashboard/conteggio-elementi", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/dashboard/conteggio-elementi', async (req, res) => {
    const reqJson = req.headers;
    const listaTabelle = reqJson.tabelle;
    const listaAlias = reqJson.alias;
    const risposta = await conteggioElementi(listaTabelle, listaAlias);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

// per testare la richiesta
// fetch("/g/Main10ance_DB/dashboard/conteggio-ruoli", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/dashboard/conteggio-ruoli', async (req, res) => {
    const ruoli = await conteggioRuoliAmbito();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(ruoli));
});

// per testare la richiesta:
// fetch("/g/DB_Servizio/LOD/TabelleBIM", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/DB_Servizio/LOD/TabelleBIM', async (req, res) => {
    const tabelleBIM = await leggiListaTabelleBIM();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(tabelleBIM));
});

// per testare la richiesta:
// fetch("/g/DB_Servizio/lista-localita", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/DB_Servizio/lista-localita', async (req, res) => {
    const località = await getSigleSacriMonti();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(località));
});

// per testare la richiesta:
// fetch("/g/Main10ance_DB/dashboard/conteggio-modelli", {method: "GET", headers: {"content-type": "application/json"} }).then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/dashboard/conteggio-modelli', async (req, res) => {
    const reqJson = req.headers;
    const listaLocalità = reqJson.nomi;
    const listaSigle = reqJson.sigle;
    const risposta = await conteggioModelli(listaLocalità, listaSigle);
    res.setHeader('content-type', 'application/json');
    res.send(risposta);
});

app.get('/sigle-edifici', async (req, res) => {
    const ambito = req.signedCookies.ambito;
    const edifici = await getSigleEdifici(ambito);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(edifici));
});

app.get('/frasi-rischio', async (req, res) => {
    const ambito = req.signedCookies.ambito;
    const frasi = await getFrasiDiRischio(ambito);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(frasi));
});

// per testare la richiesta:
// fetch("/g/DB_Servizio/entita-oggetti", {method: "GET", headers: {"content-type": "application/json", "cl_ogg": "3.1 superfici interne"} }).then(a => a.json()).then(console.log)
app.get('/DB_Servizio/entita-oggetti', async (req, res) => {
    const reqJson = req.headers;
    const cl_ogg = reqJson.cl_ogg;
    const entità = await getEntitàDaClOgg(cl_ogg);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(entità));
});

// per testare la richiesta:
// fetch("/g/Main10ance_DB/lista-identificativi", {method: "GET", headers: {"content-type": "application/json", "entità": "tetto", "id_parziale": "SMV|16-24|tetto|"} }).then(a => a.json()).then(console.log)
app.get('/Main10ance_DB/lista-identificativi', async (req, res) => {
    const reqJson = req.headers;
    const ent = reqJson.entita;
    const id = reqJson.id_parziale;
    const frasi = await getIdentificativiDaEntità(ent, id);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(frasi));
});

app.post('/pianificazione', async (req, res) => {
    const ambito = req.signedCookies.ambito;
    const result = {};
    try {
        const reqJson = req.body;
        const res = await creaAttProgControllo(reqJson, ambito);
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

app.post('/Main10ance_DB/programmazione/nuovi-controlli', async (req, res) => {
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

app.get('/integrazione/attivita-per-integrazione', async (req, res) => {
    const ambito = req.signedCookies.ambito;
    const reqJson = req.headers;
    const bool = JSON.parse(reqJson.bool);
    const resp = await leggiAttProgPerIntegrazione(bool, ambito);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(resp));
});

app.patch('/integrazione/integrazione-attivita', async (req, res) => {
    const ambito = req.signedCookies.ambito;
    const result = {};
    try {
        const reqJson = req.body;
        const res = await integraAtt(reqJson, ambito);
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

app.post('/LOD4/nuovo', async (req, res) => {
    const ambito = req.signedCookies.ambito;
    const result = {};
    try {
        const reqJson = req.body;
        const reqFiles = req.files;
        const res = await uploadImmagine(reqFiles, reqJson, ambito);
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

app.delete('/LOD4/elimina', async (req, res) => {
    const ambito = req.signedCookies.ambito;
    const result = {};
    try {
        const reqJson = req.body;
        const res = await eliminaImmagini(reqJson, ambito);
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

// NUOVO PUNTO SU LIVELLO GIS LOCALITÀ MATERIALI
app.post('/DB_Servizio/loc-pdiff/nuovo', async (req, res) => {
    const result = {};
    try {
        const reqJson = req.body;
        const res = await creaNuovoLocPdiff(reqJson);
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

// NUOVO PUNTO SU AMBITO UTENTE
app.post('/DB_Servizio/mk-ambito/nuovo', async (req, res) => {
    const result = {};
    try {
        const reqJson = req.body;
        const res = await creaNuovoMarkerAmbito(reqJson);
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

// REGISTRAZIONE ATTIVITÀ PRECEDENTI
app.post('/programmazione/att-precedenti', async (req, res) => {
    let result = {}
    try {
        const reqJson = req.body;
        const res = await registraAttPrecedenti(reqJson);
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

// REGISTRAZIONE PUNTEGGI LAVORI SU EDIFICI
app.post('/edifici/punteggi-lavori', async (req, res) => {
    const ambito = req.signedCookies.ambito;
    const autore = req.signedCookies.user_id;
    const result = {};
    try {
        const reqJson = req.body;
        const res = await registraScoreLavori(reqJson, ambito, autore);
        result.success = res;
    } catch(e) {
        result.success = false;
    } finally {
        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify(result));
    }
});

// RECUPERO PUNTEGGI LAVORI ---RECENTI--- SU EDIFICI
app.get('/edifici/punteggi-lavori-recenti', async (req, res) => {
    const reqJson = req.headers;
    const ambito = req.signedCookies.ambito;
    const loc = JSON.parse(reqJson.loc);
    const resp = await leggiScoreUltimiLavori(loc, ambito);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(resp));
});

// RECUPERO PUNTEGGI LAVORI SU EDIFICI
app.get('/edifici/punteggi-lavori', async (req, res) => {
    const reqJson = req.headers;
    const ambito = req.signedCookies.ambito;
    const loc = JSON.parse(reqJson.loc);
    const resp = await leggiScoreLavori(loc, ambito);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(resp));
});

//////////          QUERY          //////////

async function leggiNumeroOggetti(listaTabelle) {
    const listaTabs = JSON.parse(listaTabelle);
    const listaStringhe = listaTabs.map(tab => `SELECT COUNT(*) FROM ${data_schema}."${tab}"`);
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
        const stringa = `SELECT COUNT(*), '${listaAlsReplaced[i]}' AS nome_tabella FROM ${data_schema}."${listaTabs[i]}"`;
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
        const result = await clientM10a.query(`SELECT "ruolo", COUNT(ruolo) FROM ${utility_schema}."utenti" GROUP BY "ruolo";`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiListaTabelleBIM() {
    try {
        const results = await clientM10a.query(`SELECT "entità_db_m10a" AS "tabella", "nome_esteso" AS "alias", "LOD" FROM ${utility_schema}."lod" WHERE "BIM-GIS" = 'BIM' ORDER BY "tabella";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function getSigleSacriMonti() {
    try {
        const results = await clientM10a.query(`SELECT "nome", "sigla" FROM ${data_schema}."dati_località" ORDER BY "nome";`);
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
        const stringa = `SELECT COUNT(DISTINCT "urn"), '${listaLocs[i]}' AS nome_tabella FROM ${data_schema}."dati_edifici" WHERE "località" = '${listaSigs[i]}'`;
        listaStringhe.push(stringa);
    }
    const stringheJoin = listaStringhe.join(' UNION ');
    try {
        const results = await clientM10a.query(`${stringheJoin} ORDER BY "nome_tabella";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function getSigleEdifici(ambito) {
    try {
        const results = await clientM10a.query(`SELECT DISTINCT "edificio", "località", "edif_nome_menu" FROM ${data_schema}."dati_edifici" WHERE "ambito" LIKE ($1) ORDER BY "edificio";`, [ambito]);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function getFrasiDiRischio(ambito) {
    try {
        const results = await clientM10a.query(`SELECT "id_fr_risc", "cl_ogg_fr", "fr_risc", "controllo", "mn_reg", "mn_nec", "entità", "aggregatori", "temi", "materiali" FROM ${utility_schema}."frase_di_rischio" WHERE ($1 = '%' OR $1 = ANY(ambiti)) ORDER BY "id_fr_risc";`, [ambito]);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function getEntitàDaClOgg(cl_ogg) {
    try {
        const results = await clientM10a.query(`SELECT "entità_db_m10a" FROM ${utility_schema}."lod" WHERE ($1)=ANY("cl_ogg_fr");`, [cl_ogg]);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function getIdentificativiDaEntità(entità, id) {
    try {
        // QUESTO FUNZIONA, MA CAPIRE COME FARE MEGLIO LIKE '${}%' USANDO ($1) ECC.
        const results = await clientM10a.query(`SELECT "id_main10ance" FROM ${data_schema}."${entità}" WHERE "id_main10ance" LIKE '${id}%';`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function creaAttProgControllo(listaAtt, ambito) {
    try {
        await clientM10a.query("BEGIN;");
        try {
            for (const att of listaAtt) {
                const tipo_att = att.data_prog_mr && att.freq_mr ? ['manutenzione regolare'] : ['controllo'];
                const data_prog = att.data_prog_mr ? att.data_prog_mr : att.data_prog_c;
                const freq = att.freq_mr ? att.freq_mr : att.freq_c;
                const valuesArray = [att.id_att_prog, tipo_att, att.cl_ogg, att.rid_fr_risc, freq, data_prog, att.id_group, att.elementi, att.data_ins, att.data_ins, att.loc_estesa, true, ambito];
                await clientM10a.query(`INSERT INTO ${data_schema}."attività_prog" ("id_att_prog", "tipo_attività", "cl_ogg_fr", "rid_fr_risc", "frequenza", "data_prog", "id_group", "id_main10ance", "data_ins", "data_ultima_mod", "località_estesa", "da_integrare", "ambito") VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12), ($13));`, valuesArray);
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

async function creaNuovoLocPdiff(reqJson) {
    try {
        await clientM10a.query("BEGIN;");
        try {
            const coord = reqJson.coord;
            const nome = reqJson.nome;
            const sigla = reqJson.id_marker;
            const valuesArray = [[coord.lat, coord.lng], nome, sigla];
            await clientM10a.query(`INSERT INTO ${utility_schema}."dati_loc_pdiff" ("coord", "nome", "sigla") VALUES (($1), ($2), ($3))`, valuesArray);
        } catch (e) {
            throw e;
        }
        await clientM10a.query("COMMIT;");
        return true;
    } catch (er) {
        console.log(`Errore: ${er}`);
        await clientM10a.query("ROLLBACK;");
        return false;
    }
}

async function creaNuovoMarkerAmbito(reqJson) {
    try {
        await clientM10a.query("BEGIN;");
        try {
            const coord = reqJson.coord;
            const nome = reqJson.nome;
            const sigla = reqJson.sigla;
            const descrizione = reqJson.descrizione;
            const numero = reqJson.numero;
            const edificio = reqJson.edificio;
            const edif_nome_menu = reqJson.edif_nome_menu;
            const ambito = reqJson.ambito;
            const valuesArray = [[coord.lat, coord.lng], nome, sigla, descrizione, numero, edificio, edif_nome_menu, ambito];
            await clientM10a.query(`INSERT INTO ${data_schema}."dati_edifici" ("coord", "nome", "sigla", "descrizione", "numero", "edificio", "edif_nome_menu", "ambito") VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8))`, valuesArray);
        } catch (e) {
            throw e;
        }
        await clientM10a.query("COMMIT;");
        return true;
    } catch (er) {
        console.log(`Errore: ${er}`);
        await clientM10a.query("ROLLBACK;");
        return false;
    }
}

async function leggiAttProgPerIntegrazione(bool, ambito) {
    try {
        const resp = await clientM10a.query(`SELECT a."id_att_prog", a."rid_fr_risc", a."data_prog", to_json(a."id_main10ance") AS "id_main10ance", a."id_group", a."località_estesa", a."cl_ogg_fr", to_json(a."tipo_attività") AS "tipo_attività", a."data_ins", a."data_ultima_mod", a."frequenza", a."da_integrare", a."necessaria_revisione", a."costo", a."ore", a."esecutori", a."strumentaz" AS "strumentazione", a."commenti", a."liv_priorità", a."rid_contr", a."rid_dad", a."rid_att_ciclica_prec", f."fr_risc", f."controllo", f."mn_reg" AS "manutenzione regolare", f."mn_nec" AS "manutenzione correttiva" FROM ${data_schema}."attività_prog" AS "a" JOIN ${utility_schema}."frase_di_rischio" AS "f" ON a."rid_fr_risc" = f."id_fr_risc" WHERE a."da_integrare" = ($1) AND a."ambito" LIKE ($2) ORDER BY "id_att_prog";`, [bool, ambito]);
        return resp.rows;
    }
    catch(e) {
        return [];
    }
}

async function integraAtt(jsonAtt, ambito) {
    const nums = Object.keys(jsonAtt).filter(e => e !== 'dati_inserimento').map((e, i) => `($${i+1})`);
    const ultimoNum = nums.pop();
    const entriesFiltr = Object.entries(jsonAtt).filter(e => e[0] !== 'dati_inserimento').filter(e => e[0] !== 'id_att_prog');
    const values = entriesFiltr.map(e => `${e[1]}`);
    values.push(jsonAtt['id_att_prog']);
    const strSet = entriesFiltr.map((e, i) => `"${e[0]}" = ($${i+1})`).join(', ');
    try {
        await clientM10a.query('BEGIN;');
        try {
            await clientM10a.query(`UPDATE ${data_schema}."attività_prog" SET ${strSet}, "da_integrare" = FALSE WHERE "id_att_prog" = ${ultimoNum};`, values);
            const datiInsert = jsonAtt.dati_inserimento;
            const stringaContr = 'scheda_controllo';
            const stringaManReg = 'scheda_manutenzione_regolare';
            const stringaManCorr = 'scheda_manutenzione_correttiva';
            const stringaManStr = 'scheda_manutenzione_straordinaria';
            const stringaRestauro = 'scheda_restauro';
            const stringaDiagnosi = 'danno_alterazione_degrado';
            for (const tab of datiInsert.tabelle) {
                switch (tab) {
                    case stringaContr: {
                        const arrayInsertContr = [datiInsert.id_att, datiInsert.cl_ogg_fr, datiInsert.descrizione[datiInsert.tabelle.indexOf(stringaContr)], datiInsert.data_azione, jsonAtt.esecutori, jsonAtt.strumentaz, jsonAtt.data_ultima_mod, datiInsert.id_main10ance, datiInsert.rid_fr_risc, jsonAtt.id_att_prog, datiInsert.id_group, datiInsert.id_att, false, ambito];
                        await clientM10a.query(`INSERT INTO ${data_schema}."${stringaContr}" ("id_contr", "cl_ogg_fr", "controllo", "data_con", "esecutori", "strumentaz", "data_ins", "id_main10ance", "rid_fr_risc", "rid_att_prog", "id_group", "id_att_ciclica", "eseguito", "ambito") VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12), ($13), ($14));`, arrayInsertContr);
                        break;
                    }

                    case stringaManReg: {
                        const arrayInsertManReg = [datiInsert.id_att, datiInsert.cl_ogg_fr, datiInsert.descrizione[datiInsert.tabelle.indexOf(stringaManReg)], datiInsert.data_azione, jsonAtt.esecutori, jsonAtt.strumentaz, jsonAtt.data_ultima_mod, datiInsert.id_main10ance, datiInsert.rid_fr_risc, jsonAtt.id_att_prog, datiInsert.id_group, false, ambito];
                        await clientM10a.query(`INSERT INTO ${data_schema}."${stringaManReg}" ("id_mn_reg", "cl_ogg_fr", "azione", "data_ese", "esecutori", "strumentaz", "data_ins", "id_main10ance", "rid_fr_risc", "rid_att_prog", "id_group", "eseguito", "ambito") VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12), ($13));`, arrayInsertManReg);
                        break;
                    }

                    case stringaManCorr: {
                        const arrayInsertManCorr = [datiInsert.id_att, datiInsert.rid_contr, datiInsert.cl_ogg_fr, datiInsert.descrizione[datiInsert.tabelle.indexOf(stringaManCorr)], datiInsert.data_azione, jsonAtt.esecutori, jsonAtt.strumentaz, jsonAtt.data_ultima_mod, datiInsert.id_main10ance, datiInsert.rid_fr_risc, jsonAtt.id_att_prog, datiInsert.id_group, false, ambito];
                        await clientM10a.query(`INSERT INTO ${data_schema}."${stringaManCorr}" ("id_mn_gu", "rid_contr", "cl_ogg_fr", "azione", "data_ese", "esecutori", "strumentaz", "data_ins", "id_main10ance", "rid_fr_risc", "rid_att_prog", "id_group", "eseguito", "ambito") VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12), ($13), ($14));`, arrayInsertManCorr);
                        break;
                    }

                    default: throw new Error('ERRORE: La richiesta non è andata a buon fine.');
                }
            }
        }
        catch(err) {
            throw err;
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

async function uploadImmagine(files, dati, ambito) {
    const file = files.file;
    const datiJson = JSON.parse(dati.dati);
    const percorso = datiJson.percorso;
    const arrayDatiImg = [datiJson.id_immagine, datiJson.nome, datiJson.codice, datiJson.artista, datiJson.datazione, datiJson.dimensioni, datiJson.commenti, datiJson.data_ins, datiJson.id_main10ance, `${percorso}/${file.name}`];
    const idMap = {
        arredo: 'id_arr',
        dipinto_murale: 'id_dipmur',
        pavimento_decorativo: 'id_pd',
        quadro: 'id_quadro',
        statua: 'id_statua',
        manufatto: 'id_man',
        dettaglio: 'id_dett',
    };
    const fileOptions = {contentType: file.mimetype};
    try {
        await clientM10a.query('BEGIN;');
        try { // QUI CONDIZIONI DA RISISTEMARE COME QUELLE IN REQTURISTA DOWNLOADIMMAGINI, GETINFOIMMAGINE
            if (datiJson.id_main10ance.startsWith('loc-pdiff')) {
                const rid_loc_pdiff = datiJson.id_main10ance.split('|')[1];
                // query con dati
                await clientM10a.query(`INSERT INTO ${utility_schema}."${datiJson.entità}" ("${idMap[datiJson.entità]}", "nome", "codice", "artista", "datazione", "dimensioni", "commenti", "data_ins", "id_main10ance", "immagine", "rid_loc_pdiff") VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11));`, [...arrayDatiImg, rid_loc_pdiff]);
                // caricamento immagine supabase
                const {error} = await supabase.storage.from("generale").upload(`${percorso}/${file.name}`, file.data, fileOptions);
                if (error) throw error;
            }
            else {
                // query con dati
                await clientM10a.query(`INSERT INTO ${data_schema}."${datiJson.entità}" ("${idMap[datiJson.entità]}", "nome", "codice", "artista", "datazione", "dimensioni", "commenti", "data_ins", "id_main10ance", "immagine", "ambito") VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11));`, [...arrayDatiImg, ambito]); // e "codice"?
                // caricamento immagine supabase
                const {error} = await supabase.storage.from("elementi").upload(`${ambito}/${percorso}/${file.name}`, file.data, fileOptions);
                if (error) throw error;
            }
        }
        catch(err) {
            throw err;
        }
        await clientM10a.query('COMMIT;');
        return true;
    }
    catch(e) {
        console.log(e);
        await clientM10a.query("ROLLBACK;");
        return false;
    }
}

async function eliminaImmagini(jsonDati, ambito) {
    const listaImmagini = jsonDati.immagini;
    const listaImmaginiSupa = ambito ? listaImmagini.map(img => `${ambito}/${img}`) : listaImmagini;
    const bucket = (jsonDati.entità === 'manufatto' || jsonDati.entità === 'dettaglio') ? 'generale' : 'elementi';
    const schema = (jsonDati.entità === 'manufatto' || jsonDati.entità === 'dettaglio') ? utility_schema : data_schema;
    try {
        await clientM10a.query('BEGIN;');
        try {
            // query elimina record
            for await (const img of listaImmagini) {
                await clientM10a.query(`DELETE FROM ${schema}.${jsonDati.entità} WHERE "immagine" IN (($1)) AND "ambito" = ($2);`, [img, ambito]);
            }

            // eliminazione immagine supabase
            const {error} = await supabase.storage.from(bucket).remove(listaImmaginiSupa);
            if (error) throw error;
        }
        catch(err) {
            throw err;
        }
        await clientM10a.query('COMMIT;');
        return true;
    }
    catch(e) {
        console.log(e);
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
                await clientM10a.query(`INSERT INTO ${data_schema}."scheda_controllo" ("id_contr", "cl_ogg_fr", "controllo", "data_con", "data_ins", "id_main10ance", "rid_fr_risc", "freq") VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8));`, [reqJson.id_contr, reqJson.cl_ogg, reqJson.controllo, reqJson.data_con, reqJson.data_ins, reqJson.id_main10ance, reqJson.rid_fr_risc, reqJson.frequenza]);
                if (reqJson.dati_manutenzione) {
                    await clientM10a.query(`INSERT INTO ${data_schema}."scheda_manutenzione_regolare" ("id_mn_reg", "cl_ogg_fr", "azione", "data_ese", "data_ins", "id_main10ance") VALUES (($1), ($2), ($3), ($4), ($5), ($6));`, [reqJson.dati_manutenzione.id_mn_reg, reqJson.dati_manutenzione.cl_ogg, reqJson.dati_manutenzione.azione, reqJson.dati_manutenzione.data_ese, reqJson.dati_manutenzione.data_ins, reqJson.dati_manutenzione.id_main10ance]);
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

// REGISTRAZIONE ATTIVITÀ PRECEDENTI
async function registraAttPrecedenti(reqJson) {
    const stringaContr = 'scheda_controllo';
    const stringaManReg = 'scheda_manutenzione_regolare';
    const stringaManCorr = 'scheda_manutenzione_correttiva';
    const stringaManStr = 'scheda_manutenzione_straordinaria';
    const stringaRestauro = 'scheda_restauro';
    const stringaDiagnosi = 'danno_alterazione_degrado';
    try {
        await clientM10a.query("BEGIN;");
        console.log(reqJson);
        try {
            switch (reqJson.metadati.tabella) {
                case stringaContr:
                    for (const edificio of reqJson.edifici) {
                        const id_main10ance = `${reqJson.località}|${edificio}|${reqJson.categoria ? reqJson.categoria : '*'}|${reqJson.elemento ? reqJson.elemento : '*'}`; // si potrebbe parametrizzare anche terzo parametro, ma per ora va bene così
                        await clientM10a.query(`INSERT INTO ${data_schema}."${stringaContr}"
                        ("id_contr", "cl_ogg_fr", "controllo", "esecutori", "strumentaz", "commenti", "costo", "data_inizio", "data_fine", "st_cons", "liv_urg", "cl_racc", "data_ins", "autore_ultima_mod", "id_main10ance")
                        VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12), ($13), ($14), ($15));`,
                        [(reqJson.metadati.id_scheda + reqJson.edifici.indexOf(edificio)), reqJson.cl_ogg, reqJson.dati.descrizioneContr, reqJson.dati.esecutori, reqJson.dati.strumentazione, reqJson.dati.note, reqJson.dati.costo, reqJson.dati.dataInizio, reqJson.dati.dataFine, reqJson.dati.st_cons, reqJson.dati.liv_urg, reqJson.dati.cl_racc, reqJson.metadati.data_ins, reqJson.metadati.autore, [id_main10ance]]);
                    }
                    break;
                case stringaManReg:
                    for (const edificio of reqJson.edifici) {
                        const id_main10ance = `${reqJson.località}|${edificio}|${reqJson.categoria ? reqJson.categoria : '*'}|${reqJson.elemento ? reqJson.elemento : '*'}`; // si potrebbe parametrizzare anche terzo parametro, ma per ora va bene così
                        await clientM10a.query(`INSERT INTO ${data_schema}."${stringaManReg}"
                        ("id_mn_reg", "cl_ogg_fr", "azione", "esecutori", "strumentaz", "commenti", "costo", "data_inizio", "data_fine", "data_ins", "autore_ultima_mod", "id_main10ance")
                        VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12));`,
                        [(reqJson.metadati.id_scheda + reqJson.edifici.indexOf(edificio)), reqJson.cl_ogg, reqJson.dati.descrizioneManReg, reqJson.dati.esecutori, reqJson.dati.strumentazione, reqJson.dati.note, reqJson.dati.costo, reqJson.dati.dataInizio, reqJson.dati.dataFine, reqJson.metadati.data_ins, reqJson.metadati.autore, [id_main10ance]]);
                    }
                    break;
                case stringaManCorr:
                    for (const edificio of reqJson.edifici) {
                        const id_main10ance = `${reqJson.località}|${edificio}|${reqJson.categoria ? reqJson.categoria : '*'}|${reqJson.elemento ? reqJson.elemento : '*'}`; // si potrebbe parametrizzare anche terzo parametro, ma per ora va bene così
                        await clientM10a.query(`INSERT INTO ${data_schema}."${stringaManCorr}"
                        ("id_mn_gu", "cl_ogg_fr", "azione", "esecutori", "strumentaz", "commenti", "costo", "data_inizio", "data_fine", "data_ins", "autore_ultima_mod", "id_main10ance")
                        VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12));`,
                        [(reqJson.metadati.id_scheda + reqJson.edifici.indexOf(edificio)), reqJson.cl_ogg, reqJson.dati.descrizioneManCorr, reqJson.dati.esecutori, reqJson.dati.strumentazione, reqJson.dati.note, reqJson.dati.costo, reqJson.dati.dataInizio, reqJson.dati.dataFine, reqJson.metadati.data_ins, reqJson.metadati.autore, [id_main10ance]]);
                    }
                    break;
                case stringaManStr:
                    for (const edificio of reqJson.edifici) {
                        const id_main10ance = `${reqJson.località}|${edificio}|${reqJson.categoria ? reqJson.categoria : '*'}|${reqJson.elemento ? reqJson.elemento : '*'}`; // si potrebbe parametrizzare anche terzo parametro, ma per ora va bene così
                        await clientM10a.query(`INSERT INTO ${data_schema}."${stringaManStr}"
                        ("id_mn_str", "cl_ogg_fr", "azione", "esecutori", "strumentaz", "commenti", "costo", "data_inizio", "data_fine", "data_ins", "autore_ultima_mod", "id_main10ance")
                        VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12));`,
                        [(reqJson.metadati.id_scheda + reqJson.edifici.indexOf(edificio)), reqJson.cl_ogg, reqJson.dati.descrizioneManStr, reqJson.dati.esecutori, reqJson.dati.strumentazione, reqJson.dati.note, reqJson.dati.costo, reqJson.dati.dataInizio, reqJson.dati.dataFine, reqJson.metadati.data_ins, reqJson.metadati.autore, [id_main10ance]]);
                    }
                    break;
                case stringaRestauro:
                    for (const edificio of reqJson.edifici) {
                        const id_main10ance = `${reqJson.località}|${edificio}|${reqJson.categoria ? reqJson.categoria : '*'}|${reqJson.elemento ? reqJson.elemento : '*'}`; // si potrebbe parametrizzare anche terzo parametro, ma per ora va bene così
                        await clientM10a.query(`INSERT INTO ${data_schema}."${stringaRestauro}"
                        ("id_restaur", "cl_ogg_fr", "descriz", "esecutori", "strumentaz", "commenti", "costo", "data_inizio", "data_fine", "data_ins", "autore_ultima_mod", "id_main10ance")
                        VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12));`,
                        [(reqJson.metadati.id_scheda + reqJson.edifici.indexOf(edificio)), reqJson.cl_ogg, reqJson.dati.descrizioneRestauro, reqJson.dati.esecutori, reqJson.dati.strumentazione, reqJson.dati.note, reqJson.dati.costo, reqJson.dati.dataInizio, reqJson.dati.dataFine, reqJson.metadati.data_ins, reqJson.metadati.autore, [id_main10ance]]);
                    }
                    break;
                default:
                    console.log('altra tabella');
                    console.log(reqJson.metadati.tabella);
                    break;
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

async function registraScoreLavori(reqJson, ambito, autore) {
    try {
        await clientM10a.query("BEGIN;");
        for (const lavoro of reqJson) {
            const queryTxt = `
                INSERT INTO main10ance."a_temp" (
                    "località", edificio,
                    tetti, "umidità", statica, interni, esterni,
                    ambito, data_ins, autore_ins,
                    anno_tetti, "anno_umidità", anno_statica, anno_interni, anno_esterni,
                    id_interno
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
                );
            `;

            const listaValori = [
                lavoro.edificio.località,
                lavoro.edificio.edificio, // questo è lo stesso campo "edificio" di "dati_edifici"
                lavoro.score_tetti?.score_interno || null,
                lavoro.score_umidità?.score_interno || null,
                lavoro.score_statica?.score_interno || null,
                lavoro.score_interni?.score_interno || null,
                lavoro.score_esterni?.score_interno || null,
                ambito,
                lavoro.data,
                autore,
                lavoro.anno_tetti || null,
                lavoro.anno_umidità || null,
                lavoro.anno_statica || null,
                lavoro.anno_interni || null,
                lavoro.anno_esterni || null,
                lavoro.id_interno
            ];

            await clientM10a.query(queryTxt, listaValori);
        }
        await clientM10a.query("COMMIT;");
        return true;
    } catch (e) {
        console.log(`Errore: ${e}`);
        await clientM10a.query("ROLLBACK;");
        return false;
    }
}

async function leggiScoreUltimiLavori(località, ambito) {
    try {
        const queryTxt = `
            WITH distinct_edifici AS (
                SELECT DISTINCT edificio, edif_nome_menu
                FROM ${data_schema}.dati_edifici
                WHERE "località" = $1
                AND ambito = $2
            ),
            latest_per_edificio AS (
                SELECT DISTINCT ON (tp.edificio)
                    tp.data_ins, tp.id_interno,
                    tp.tetti, tp."umidità", tp.statica, tp.interni, tp.esterni,
                    tp.anno_tetti, tp."anno_umidità", tp.anno_statica, tp.anno_interni, tp.anno_esterni,
                    tp.edificio
                FROM ${data_schema}."a_temp" AS tp
                WHERE tp."località" = $1
                AND tp.ambito = $2
                ORDER BY tp.edificio, tp.id_interno DESC
            )
            SELECT
                lpe.data_ins, lpe.id_interno,
                lpe.tetti, lpe."umidità", lpe.statica, lpe.interni, lpe.esterni,
                lpe.anno_tetti, lpe."anno_umidità", lpe.anno_statica, lpe.anno_interni, lpe.anno_esterni,
                de.edif_nome_menu
            FROM latest_per_edificio AS lpe
            JOIN distinct_edifici AS de
            ON lpe.edificio = de.edificio
            ORDER BY lpe.edificio;
        `;
        const resp = await clientM10a.query(queryTxt, [località, ambito]);
        return resp.rows;
    }
    catch(e) {
        console.log(`Errore nella lettura delle attività precedenti: ${e}`);
        return [];
    }
}

async function leggiScoreLavori(località, ambito) {
    try {
        const queryTxt = `
            WITH distinct_edifici AS (
                SELECT DISTINCT edificio, edif_nome_menu
                FROM ${data_schema}.dati_edifici
                WHERE "località" = $1
                AND ambito = $2
            )
            SELECT 
                tp.data_ins, tp.id_interno,
                tp.tetti, tp."umidità", tp.statica, tp.interni, tp.esterni,
                tp.anno_tetti, tp."anno_umidità", tp.anno_statica, tp.anno_interni, tp.anno_esterni,
                de.edif_nome_menu
            FROM ${data_schema}."a_temp" AS tp
            JOIN distinct_edifici AS de
            ON tp.edificio = de.edificio
            WHERE tp."località" = $1
            AND tp.ambito = $2
            ORDER BY id_interno, tp.edificio;
        `;
        const resp = await clientM10a.query(queryTxt, [località, ambito]);
        return resp.rows;
    }
    catch(e) {
        console.log(`Errore nella lettura delle attività precedenti: ${e}`);
        return [];
    }
}

module.exports = app;

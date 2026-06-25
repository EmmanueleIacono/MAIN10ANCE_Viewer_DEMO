const express = require('express');
const fileupload = require('express-fileupload');
const {randomUUID} = require('crypto');
const app = express.Router();
app.use(express.json());
app.use(express.static("public"));

const {poolM10a, withTransaction} = require('./connessioni');
const {data_schema, utility_schema} = require('./schemi');
const {supabase} = require('../../supabase_config');
const {qualifiedName, parseJsonArray} = require('../security/sql');
const {uploadMiddlewareOptions, asSingleFile, validateFile, safeStoragePath} = require('../security/upload');
const {ACTIVITY_TABLES, getImageEntity} = require('./metadata');
const {jsonRoute, successRoute} = require('../security/http');

app.use(fileupload(uploadMiddlewareOptions));

//////////          RICHIESTE          //////////

app.get('/Main10ance_DB/dashboard/numero-oggetti', jsonRoute(async (req) => {
    const reqJson = req.headers;
    const listaTabelle = reqJson.tabelle;
    return leggiNumeroOggetti(listaTabelle);
}));

app.get('/Main10ance_DB/dashboard/conteggio-elementi', jsonRoute(async (req) => {
    const reqJson = req.headers;
    const listaTabelle = reqJson.tabelle;
    const listaAlias = reqJson.alias;
    return conteggioElementi(listaTabelle, listaAlias);
}));

app.get('/Main10ance_DB/dashboard/conteggio-ruoli', jsonRoute(() => conteggioRuoliAmbito()));

app.get('/DB_Servizio/LOD/TabelleBIM', jsonRoute(() => leggiListaTabelleBIM()));

app.get('/DB_Servizio/lista-localita', jsonRoute(() => getSigleSacriMonti()));

app.get('/Main10ance_DB/dashboard/conteggio-modelli', jsonRoute(async (req) => {
    const reqJson = req.headers;
    const listaLocalita = reqJson.nomi;
    const listaSigle = reqJson.sigle;
    return conteggioModelli(listaLocalita, listaSigle);
}));

app.get('/sigle-edifici', jsonRoute(async (req) => {
    const ambito = req.signedCookies.ambito;
    return getSigleEdifici(ambito);
}));

app.get('/frasi-rischio', jsonRoute(async (req) => {
    const ambito = req.signedCookies.ambito;
    return getFrasiDiRischio(ambito);
}));

app.get('/DB_Servizio/entita-oggetti', jsonRoute(async (req) => {
    const reqJson = req.headers;
    const cl_ogg = reqJson.cl_ogg;
    return getEntitàDaClOgg(cl_ogg);
}));

app.get('/Main10ance_DB/lista-identificativi', jsonRoute(async (req) => {
    const reqJson = req.headers;
    const ent = reqJson.entita;
    const id = reqJson.id_parziale;
    return getIdentificativiDaEntità(ent, id);
}));

app.post('/pianificazione', successRoute(req => creaAttProgControllo(req.body, req.signedCookies.ambito)));

app.post('/pianificazione/controlli-manutenzioni', successRoute(req => registraPianificazioneControlliManutenzioni(req.body, req.signedCookies.ambito, req.signedCookies.user_id)));

app.post('/Main10ance_DB/programmazione/nuovi-controlli', successRoute(req => registraNuoviControlli(req.body)));

app.get('/programmazione/pianificazioni-controlli-manutenzioni', jsonRoute(async (req) => {
    const ambito = req.signedCookies.ambito;
    return leggiPianificazioniDaProgrammare(ambito);
}));

app.patch('/programmazione/pianificazioni-controlli-manutenzioni', successRoute(req => programmaPianificazioneControlliManutenzioni(req.body, req.signedCookies.ambito, req.signedCookies.user_id)));

app.get('/integrazione/attivita-per-integrazione', jsonRoute(async (req) => {
    const ambito = req.signedCookies.ambito;
    const reqJson = req.headers;
    const bool = JSON.parse(reqJson.bool);
    return leggiAttProgPerIntegrazione(bool, ambito);
}));

app.patch('/integrazione/integrazione-attivita', successRoute(req => integraAtt(req.body, req.signedCookies.ambito)));

app.post('/LOD4/nuovo', successRoute(req => uploadImmagine(req.files, req.body, req.signedCookies.ambito)));

app.delete('/LOD4/elimina', successRoute(req => eliminaImmagini(req.body, req.signedCookies.ambito)));

// NUOVO PUNTO SU LIVELLO GIS LOCALITA MATERIALI
app.post('/DB_Servizio/loc-pdiff/nuovo', successRoute(req => creaNuovoLocPdiff(req.body)));

// NUOVO PUNTO SU AMBITO UTENTE
app.post('/DB_Servizio/mk-ambito/nuovo', successRoute(req => creaNuovoMarkerAmbito(req.body)));

// REGISTRAZIONE ATTIVITÀ PRECEDENTI
app.post('/programmazione/att-precedenti', successRoute(req => registraAttPrecedenti(req.body)));

// REGISTRAZIONE PUNTEGGI LAVORI SU EDIFICI
app.post('/edifici/punteggi-lavori', successRoute(req => registraScoreLavori(req.body, req.signedCookies.ambito, req.signedCookies.user_id)));

// RECUPERO PUNTEGGI LAVORI ---RECENTI--- SU EDIFICI
app.get('/edifici/punteggi-lavori-recenti', jsonRoute(async (req) => {
    const reqJson = req.headers;
    const ambito = req.signedCookies.ambito;
    const loc = JSON.parse(reqJson.loc);
    return leggiScoreUltimiLavori(loc, ambito);
}));

// RECUPERO PUNTEGGI LAVORI SU EDIFICI
app.get('/edifici/punteggi-lavori', jsonRoute(async (req) => {
    const reqJson = req.headers;
    const ambito = req.signedCookies.ambito;
    const loc = JSON.parse(reqJson.loc);
    return leggiScoreLavori(loc, ambito);
}));

//////////          QUERY          //////////

async function leggiNumeroOggetti(listaTabelle) {
    const listaTabs = parseJsonArray(listaTabelle, 'lista tabelle');
    const listaStringhe = listaTabs.map(tab => `SELECT COUNT(*) FROM ${qualifiedName(data_schema, tab)}`);
    const stringheJoin = listaStringhe.join(' UNION ');
    try {
        const result = await poolM10a.query(`SELECT SUM(count) FROM (${stringheJoin}) AS tabelle;`);
        return result.rows[0];
    }
    catch(e) {
        return [];
    }
}

async function conteggioElementi(listaTabelle, listaAlias) {
    const listaTabs = parseJsonArray(listaTabelle, 'lista tabelle');
    const listaAls = JSON.parse(listaAlias);
    const listaAlsReplaced = listaAls.map(a => a.replaceAll('_', ' '));
    let listaStringhe = [];
    let values = [];
    for (let i=0; i<listaTabs.length; i++) {
        const stringa = `SELECT COUNT(*), $${i + 1} AS nome_tabella FROM ${qualifiedName(data_schema, listaTabs[i])}`;
        listaStringhe.push(stringa);
        values.push(listaAlsReplaced[i]);
    }
    const stringheJoin = listaStringhe.join(' UNION ');
    try {
        const result = await poolM10a.query(`${stringheJoin} ORDER BY nome_tabella;`, values);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function conteggioRuoliAmbito() {
    try {
        const result = await poolM10a.query(`SELECT "ruolo", COUNT(ruolo) FROM ${utility_schema}."utenti" GROUP BY "ruolo";`);
        return result.rows;
    }
    catch(e) {
        return [];
    }
}

async function leggiListaTabelleBIM() {
    try {
        const results = await poolM10a.query(`SELECT "entità_db_m10a" AS "tabella", "nome_esteso" AS "alias", "LOD" FROM ${utility_schema}."lod" WHERE "BIM-GIS" = 'BIM' ORDER BY "tabella";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function getSigleSacriMonti() {
    try {
        const results = await poolM10a.query(`SELECT "nome", "sigla" FROM ${data_schema}."dati_localita" ORDER BY "nome";`);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function conteggioModelli(listaLocalita, listaSigle) {
    const listaLocs = JSON.parse(listaLocalita);
    const listaSigs = JSON.parse(listaSigle);
    let listaStringhe = [];
    let values = [];
    for (let i=0; i<listaLocs.length; i++) {
        const p = i * 2 + 1;
        const stringa = `SELECT COUNT(DISTINCT urn), $${p} AS nome_tabella FROM ${data_schema}.dati_edifici WHERE localita = $${p + 1}`;
        listaStringhe.push(stringa);
        values.push(listaLocs[i], listaSigs[i]);
    }
    const stringheJoin = listaStringhe.join(' UNION ');
    try {
        const results = await poolM10a.query(`${stringheJoin} ORDER BY "nome_tabella";`, values);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function getSigleEdifici(ambito) {
    try {
        const results = await poolM10a.query(`SELECT DISTINCT edificio, localita, edif_nome_menu FROM ${data_schema}.dati_edifici WHERE ambito LIKE ($1) ORDER BY edificio;`, [ambito]);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function getFrasiDiRischio(ambito) {
    try {
        const results = await poolM10a.query(`SELECT "id_fr_risc", "cl_ogg_fr", "fr_risc", "controllo", "mn_reg", "mn_nec", "entità", "aggregatori", "temi", "materiali" FROM ${utility_schema}."frase_di_rischio" WHERE ($1 = '%' OR $1 = ANY(ambiti)) ORDER BY "id_fr_risc";`, [ambito]);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function getEntitàDaClOgg(cl_ogg) {
    try {
        const results = await poolM10a.query(`SELECT "entità_db_m10a" FROM ${utility_schema}."lod" WHERE ($1)=ANY("cl_ogg_fr");`, [cl_ogg]);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function getIdentificativiDaEntità(entità, id) {
    try {
        const results = await poolM10a.query(`SELECT "id_main10ance" FROM ${qualifiedName(data_schema, entità)} WHERE "id_main10ance" LIKE $1;`, [`${id}%`]);
        return results.rows;
    }
    catch(e) {
        return [];
    }
}

async function creaAttProgControllo(listaAtt, ambito) {
    try {
        await withTransaction(async (tx) => {
            for (const att of listaAtt) {
                const tipo_att = att.data_prog_mr && att.freq_mr ? ['manutenzione regolare'] : ['controllo'];
                const data_prog = att.data_prog_mr ? att.data_prog_mr : att.data_prog_c;
                const freq = att.freq_mr ? att.freq_mr : att.freq_c;
                const valuesArray = [att.id_att_prog, tipo_att, att.cl_ogg, att.rid_fr_risc, freq, data_prog, att.id_group, att.elementi, att.data_ins, att.data_ins, att.loc_estesa, true, ambito];
                await tx.query(`INSERT INTO ${data_schema}."attivita_prog" (id_att_prog, tipo_attivita, cl_ogg_fr, rid_fr_risc, frequenza, data_prog, id_group, id_main10ance, data_ins, data_ultima_mod, localita_estesa, da_integrare, ambito) VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12), ($13));`, valuesArray);
            }
        });
        return true;
    }
    catch(er) {
        console.log(`Errore: ${er}`);
        return false;
    }
}

async function registraPianificazioneControlliManutenzioni(reqJson, ambito, nome_utente) {
    const localita = reqJson.localita;
    const edifici = Array.isArray(reqJson.edifici) ? reqJson.edifici : [];
    const ambitoOperativo = reqJson.ambito_operativo;
    const necessitaSupporto = reqJson.necessita_supporto || null;
    const attivita = Array.isArray(reqJson.attivita) ? reqJson.attivita.filter(attivitaPianificazioneValida) : [];
    const dataPianificazione = new Date().toISOString().slice(0, 10);
    const idPianificazione = `pian_${Date.now()}_${randomUUID().slice(0, 8)}`;

    if (!localita || !edifici.length || !ambitoOperativo || !attivita.length) return false;

    try {
        await withTransaction(async (tx) => {
            for (const edificio of edifici) {
                for (const att of attivita) {
                    const valuesArray = [
                        randomUUID(),
                        idPianificazione,
                        nome_utente,
                        dataPianificazione,
                        localita,
                        edificio,
                        ambitoOperativo,
                        necessitaSupporto,
                        att.tipo_attivita,
                        att.descrizione_attivita,
                        Number(att.frequenza_mesi),
                        att.data_inizio,
                        Number(att.durata_prevista_gg),
                        ambito
                    ];
                    await tx.query(`
                        INSERT INTO ${data_schema}.pianificazione_controlli_manutenzioni (
                            uuid,
                            id_pianificazione,
                            autore_pianificazione,
                            data_pianificazione,
                            localita,
                            edificio,
                            ambito_operativo,
                            necessita_supporto,
                            tipo_attivita,
                            descrizione_attivita,
                            frequenza_mesi,
                            data_inizio,
                            durata_prevista_gg,
                            ambito
                        )
                        VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12), ($13), ($14));
                    `, valuesArray);
                }
            }
        });
        return true;
    }
    catch(er) {
        console.log(`Errore: ${er}`);
        return false;
    }
}

function attivitaPianificazioneValida(att) {
    return att
        && att.tipo_attivita
        && Number.isInteger(Number(att.frequenza_mesi))
        && Number(att.frequenza_mesi) > 0
        && att.data_inizio
        && Number.isInteger(Number(att.durata_prevista_gg))
        && Number(att.durata_prevista_gg) > 0;
}

async function leggiPianificazioniDaProgrammare(ambito) {
    try {
        const results = await poolM10a.query(`
            SELECT
                pcm.id_pianificazione,
                pcm.tipo_attivita,
                MAX(pcm.descrizione_attivita) AS descrizione_attivita,
                MIN(pcm.data_inizio) AS data_inizio,
                MIN(pcm.durata_prevista_gg) AS durata_prevista_gg,
                MIN(pcm.frequenza_mesi) AS frequenza_mesi,
                pcm.localita,
                COALESCE(MAX(loc.nome), pcm.localita) AS localita_estesa,
                COALESCE(MAX(loc.nome_calendario), MAX(loc.nome), pcm.localita) AS localita_calendario,
                pcm.ambito_operativo,
                pcm.necessita_supporto,
                pcm.stato,
                ARRAY_AGG(DISTINCT pcm.edificio ORDER BY pcm.edificio) AS edifici,
                MAX(pcm.operatore_programmazione) AS operatore_programmazione,
                MAX(pcm.strumentazione_programmazione) AS strumentazione_programmazione,
                MAX(pcm.costo_previsto) AS costo_previsto,
                MIN(pcm.data_inizio_programmata) AS data_inizio_programmata,
                MIN(pcm.durata_programmata_gg) AS durata_programmata_gg,
                MAX(pcm.note_programmazione) AS note_programmazione
            FROM ${data_schema}.pianificazione_controlli_manutenzioni AS pcm
            LEFT JOIN ${data_schema}.dati_localita AS loc
                ON loc.sigla = pcm.localita
                AND loc.ambito LIKE pcm.ambito
            WHERE pcm.ambito LIKE $1
                AND pcm.stato <> 'programmata'
            GROUP BY
                pcm.id_pianificazione,
                pcm.tipo_attivita,
                pcm.localita,
                pcm.ambito_operativo,
                pcm.necessita_supporto,
                pcm.stato
            ORDER BY MIN(pcm.data_inizio), pcm.id_pianificazione, pcm.tipo_attivita;
        `, [ambito]);
        return results.rows;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function programmaPianificazioneControlliManutenzioni(reqJson, ambito, autore) {
    if (!programmazionePianificazioneValida(reqJson)) return false;

    const valuesArray = [
        reqJson.operatore,
        reqJson.strumentazione,
        Number(reqJson.costo_previsto),
        reqJson.data_inizio_attivita,
        Number(reqJson.durata_prevista_gg),
        reqJson.note || null,
        autore || null,
        new Date(),
        reqJson.id_pianificazione,
        reqJson.tipo_attivita,
        ambito,
    ];

    try {
        await withTransaction(async (tx) => {
            const result = await tx.query(`
                UPDATE ${data_schema}.pianificazione_controlli_manutenzioni
                SET
                    operatore_programmazione = $1,
                    strumentazione_programmazione = $2,
                    costo_previsto = $3,
                    data_inizio_programmata = $4,
                    durata_programmata_gg = $5,
                    note_programmazione = $6,
                    autore_programmazione = $7,
                    data_programmazione = $8,
                    stato = 'programmata'
                WHERE id_pianificazione = $9
                    AND tipo_attivita = $10
                    AND ambito LIKE $11;
            `, valuesArray);
            if (!result.rowCount) throw new Error('Nessuna pianificazione aggiornata');
        });
        return true;
    }
    catch(e) {
        console.log(e);
        return false;
    }
}

function programmazionePianificazioneValida(dati) {
    return dati
        && dati.id_pianificazione
        && dati.tipo_attivita
        && dati.operatore
        && dati.strumentazione
        && Number(dati.costo_previsto) >= 0
        && dati.data_inizio_attivita
        && Number.isInteger(Number(dati.durata_prevista_gg))
        && Number(dati.durata_prevista_gg) > 0;
}

async function creaNuovoLocPdiff(reqJson) {
    try {
        await withTransaction(async (tx) => {
            const coord = reqJson.coord;
            const nome = reqJson.nome;
            const sigla = reqJson.id_marker;
            const valuesArray = [[coord.lat, coord.lng], nome, sigla];
            await tx.query(`INSERT INTO ${utility_schema}."dati_loc_pdiff" ("coord", "nome", "sigla") VALUES (($1), ($2), ($3))`, valuesArray);
        });
        return true;
    } catch (er) {
        console.log(`Errore: ${er}`);
        return false;
    }
}

async function creaNuovoMarkerAmbito(reqJson) {
    try {
        await withTransaction(async (tx) => {
            const coord = reqJson.coord;
            const nome = reqJson.nome;
            const sigla = reqJson.sigla;
            const descrizione = reqJson.descrizione;
            const numero = reqJson.numero;
            const edificio = reqJson.edificio;
            const edif_nome_menu = reqJson.edif_nome_menu;
            const ambito = reqJson.ambito;
            const valuesArray = [[coord.lat, coord.lng], nome, sigla, descrizione, numero, edificio, edif_nome_menu, ambito];
            await tx.query(`INSERT INTO ${data_schema}."dati_edifici" ("coord", "nome", "sigla", "descrizione", "numero", "edificio", "edif_nome_menu", "ambito") VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8))`, valuesArray);
        });
        return true;
    } catch (er) {
        console.log(`Errore: ${er}`);
        return false;
    }
}

async function leggiAttProgPerIntegrazione(bool, ambito) {
    try {
        const resp = await poolM10a.query(`SELECT a.id_att_prog, a.rid_fr_risc, a.data_prog, to_json(a.id_main10ance) AS id_main10ance, a.id_group, a.localita_estesa, a.cl_ogg_fr, to_json(a.tipo_attivita) AS tipo_attivita, a.data_ins, a.data_ultima_mod, a.frequenza, a.da_integrare, a.necessaria_revisione, a.costo, a.ore, a.esecutori, a.strumentaz AS strumentazione, a.commenti, a."liv_priorità", a.rid_contr, a.rid_dad, a.rid_att_ciclica_prec, f.fr_risc, f.controllo, f.mn_reg AS manutenzione regolare, f.mn_nec AS manutenzione correttiva FROM ${data_schema}.attivita_prog AS a JOIN ${utility_schema}.frase_di_rischio AS f ON a.rid_fr_risc = f.id_fr_risc WHERE a.da_integrare = ($1) AND a.ambito LIKE ($2) ORDER BY id_att_prog;`, [bool, ambito]);
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
        await withTransaction(async (tx) => {
            await tx.query(`UPDATE ${data_schema}."attivita_prog" SET ${strSet}, "da_integrare" = FALSE WHERE "id_att_prog" = ${ultimoNum};`, values);
            const datiInsert = jsonAtt.dati_inserimento;
            const stringaContr = ACTIVITY_TABLES.CONTR;
            const stringaManReg = ACTIVITY_TABLES.MAN_REG;
            const stringaManCorr = ACTIVITY_TABLES.MAN_COR;
            const stringaManStr = ACTIVITY_TABLES.MAN_STR;
            const stringaRestauro = ACTIVITY_TABLES.REST;
            const stringaDiagnosi = ACTIVITY_TABLES.DIAGN;
            for (const tab of datiInsert.tabelle) {
                switch (tab) {
                    case stringaContr: {
                        const arrayInsertContr = [datiInsert.id_att, datiInsert.cl_ogg_fr, datiInsert.descrizione[datiInsert.tabelle.indexOf(stringaContr)], datiInsert.data_azione, jsonAtt.esecutori, jsonAtt.strumentaz, jsonAtt.data_ultima_mod, datiInsert.id_main10ance, datiInsert.rid_fr_risc, jsonAtt.id_att_prog, datiInsert.id_group, datiInsert.id_att, false, ambito];
                        await tx.query(`INSERT INTO ${data_schema}."${stringaContr}" ("id_contr", "cl_ogg_fr", "controllo", "data_con", "esecutori", "strumentaz", "data_ins", "id_main10ance", "rid_fr_risc", "rid_att_prog", "id_group", "id_att_ciclica", "eseguito", "ambito") VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12), ($13), ($14));`, arrayInsertContr);
                        break;
                    }

                    case stringaManReg: {
                        const arrayInsertManReg = [datiInsert.id_att, datiInsert.cl_ogg_fr, datiInsert.descrizione[datiInsert.tabelle.indexOf(stringaManReg)], datiInsert.data_azione, jsonAtt.esecutori, jsonAtt.strumentaz, jsonAtt.data_ultima_mod, datiInsert.id_main10ance, datiInsert.rid_fr_risc, jsonAtt.id_att_prog, datiInsert.id_group, false, ambito];
                        await tx.query(`INSERT INTO ${data_schema}."${stringaManReg}" ("id_mn_reg", "cl_ogg_fr", "azione", "data_ese", "esecutori", "strumentaz", "data_ins", "id_main10ance", "rid_fr_risc", "rid_att_prog", "id_group", "eseguito", "ambito") VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12), ($13));`, arrayInsertManReg);
                        break;
                    }

                    case stringaManCorr: {
                        const arrayInsertManCorr = [datiInsert.id_att, datiInsert.rid_contr, datiInsert.cl_ogg_fr, datiInsert.descrizione[datiInsert.tabelle.indexOf(stringaManCorr)], datiInsert.data_azione, jsonAtt.esecutori, jsonAtt.strumentaz, jsonAtt.data_ultima_mod, datiInsert.id_main10ance, datiInsert.rid_fr_risc, jsonAtt.id_att_prog, datiInsert.id_group, false, ambito];
                        await tx.query(`INSERT INTO ${data_schema}."${stringaManCorr}" ("id_mn_gu", "rid_contr", "cl_ogg_fr", "azione", "data_ese", "esecutori", "strumentaz", "data_ins", "id_main10ance", "rid_fr_risc", "rid_att_prog", "id_group", "eseguito", "ambito") VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12), ($13), ($14));`, arrayInsertManCorr);
                        break;
                    }

                    default: throw new Error('ERRORE: La richiesta non è andata a buon fine.');
                }
            }
        });
        return true;
    }
    catch(e) {
        console.log(`Errore: ${e}`);
        return false;
    }
}

async function uploadImmagine(files, dati, ambito) {
    const {file, safeName, options: fileOptions} = validateFile(asSingleFile(files), ['image/']);
    const datiJson = JSON.parse(dati.dati);
    const percorso = safeStoragePath(datiJson.percorso);
    const percorsoFile = safeStoragePath(percorso, safeName);
    const arrayDatiImg = [datiJson.id_immagine, datiJson.nome, datiJson.codice, datiJson.artista, datiJson.datazione, datiJson.dimensioni, datiJson.commenti, datiJson.data_ins, datiJson.id_main10ance, percorsoFile];
    const entityMeta = getImageEntity(datiJson.entità);
    try {
        await withTransaction(async (tx) => { // QUI CONDIZIONI DA RISISTEMARE COME QUELLE IN REQTURISTA DOWNLOADIMMAGINI, GETINFOIMMAGINE
            if (datiJson.id_main10ance.startsWith('loc-pdiff')) {
                const rid_loc_pdiff = datiJson.id_main10ance.split('|')[1];
                // query con dati
                await tx.query(`INSERT INTO ${qualifiedName(utility_schema, datiJson.entità)} ("${entityMeta.idColumn}", "nome", "codice", "artista", "datazione", "dimensioni", "commenti", "data_ins", "id_main10ance", "immagine", "rid_loc_pdiff") VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11));`, [...arrayDatiImg, rid_loc_pdiff]);
                // caricamento immagine supabase
                const {error} = await supabase.storage.from("generale").upload(percorsoFile, file.data, fileOptions);
                if (error) throw error;
            }
            else {
                // query con dati
                await tx.query(`INSERT INTO ${qualifiedName(data_schema, datiJson.entità)} ("${entityMeta.idColumn}", "nome", "codice", "artista", "datazione", "dimensioni", "commenti", "data_ins", "id_main10ance", "immagine", "ambito") VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11));`, [...arrayDatiImg, ambito]); // e "codice"?
                // caricamento immagine supabase
                const {error} = await supabase.storage.from("elementi").upload(safeStoragePath(ambito, percorsoFile), file.data, fileOptions);
                if (error) throw error;
            }
        });
        return true;
    }
    catch(e) {
        console.log(e);
        return false;
    }
}

async function eliminaImmagini(jsonDati, ambito) {
    const listaImmagini = jsonDati.immagini.map(img => safeStoragePath(img));
    const listaImmaginiSupa = ambito ? listaImmagini.map(img => safeStoragePath(ambito, img)) : listaImmagini;
    const entityMeta = getImageEntity(jsonDati.entità);
    const bucket = entityMeta.bucket;
    const schema = entityMeta.schema === 'utility' ? utility_schema : data_schema;
    try {
        await withTransaction(async (tx) => {
            // query elimina record
            for await (const img of listaImmagini) {
                await tx.query(`DELETE FROM ${qualifiedName(schema, jsonDati.entità)} WHERE "immagine" IN (($1)) AND "ambito" = ($2);`, [img, ambito]);
            }

            // eliminazione immagine supabase
            const {error} = await supabase.storage.from(bucket).remove(listaImmaginiSupa);
            if (error) throw error;
        });
        return true;
    }
    catch(e) {
        console.log(e);
        return false;
    }
}

///////////// QUESTA DA ELIMINARE FORSE, O DA RIUTILIZZARE PER FASE 2 PROG CONTROLLI ////////////////
async function registraNuoviControlli(listaReqJson) {
    try {
        await withTransaction(async (tx) => {
            for (const reqJson of listaReqJson) {
                await tx.query(`INSERT INTO ${data_schema}."scheda_controllo" ("id_contr", "cl_ogg_fr", "controllo", "data_con", "data_ins", "id_main10ance", "rid_fr_risc", "freq") VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8));`, [reqJson.id_contr, reqJson.cl_ogg, reqJson.controllo, reqJson.data_con, reqJson.data_ins, reqJson.id_main10ance, reqJson.rid_fr_risc, reqJson.frequenza]);
                if (reqJson.dati_manutenzione) {
                    await tx.query(`INSERT INTO ${data_schema}."scheda_manutenzione_regolare" ("id_mn_reg", "cl_ogg_fr", "azione", "data_ese", "data_ins", "id_main10ance") VALUES (($1), ($2), ($3), ($4), ($5), ($6));`, [reqJson.dati_manutenzione.id_mn_reg, reqJson.dati_manutenzione.cl_ogg, reqJson.dati_manutenzione.azione, reqJson.dati_manutenzione.data_ese, reqJson.dati_manutenzione.data_ins, reqJson.dati_manutenzione.id_main10ance]);
                }
            }
        });
        return true;
    }
    catch (ex) {
        console.log(`Errore: ${ex}`);
        return false;
    }
}

// REGISTRAZIONE ATTIVITÀ PRECEDENTI
async function registraAttPrecedenti(reqJson) {
    const stringaContr = ACTIVITY_TABLES.CONTR;
    const stringaManReg = ACTIVITY_TABLES.MAN_REG;
    const stringaManCorr = ACTIVITY_TABLES.MAN_COR;
    const stringaManStr = ACTIVITY_TABLES.MAN_STR;
    const stringaRestauro = ACTIVITY_TABLES.REST;
    const stringaDiagnosi = ACTIVITY_TABLES.DIAGN;
    try {
        await withTransaction(async (tx) => {
            console.log(reqJson);
            switch (reqJson.metadati.tabella) {
                case stringaContr:
                    for (const edificio of reqJson.edifici) {
                        const id_main10ance = `${reqJson.localita}|${edificio}|${reqJson.categoria ? reqJson.categoria : '*'}|${reqJson.elemento ? reqJson.elemento : '*'}`; // si potrebbe parametrizzare anche terzo parametro, ma per ora va bene così
                        await tx.query(`INSERT INTO ${data_schema}."${stringaContr}"
                        ("id_contr", "cl_ogg_fr", "controllo", "esecutori", "strumentaz", "commenti", "costo", "data_inizio", "data_fine", "st_cons", "liv_urg", "cl_racc", "data_ins", "autore_ultima_mod", "id_main10ance")
                        VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12), ($13), ($14), ($15));`,
                        [(reqJson.metadati.id_scheda + reqJson.edifici.indexOf(edificio)), reqJson.cl_ogg, reqJson.dati.descrizioneContr, reqJson.dati.esecutori, reqJson.dati.strumentazione, reqJson.dati.note, reqJson.dati.costo, reqJson.dati.dataInizio, reqJson.dati.dataFine, reqJson.dati.st_cons, reqJson.dati.liv_urg, reqJson.dati.cl_racc, reqJson.metadati.data_ins, reqJson.metadati.autore, [id_main10ance]]);
                    }
                    break;
                case stringaManReg:
                    for (const edificio of reqJson.edifici) {
                        const id_main10ance = `${reqJson.localita}|${edificio}|${reqJson.categoria ? reqJson.categoria : '*'}|${reqJson.elemento ? reqJson.elemento : '*'}`; // si potrebbe parametrizzare anche terzo parametro, ma per ora va bene così
                        await tx.query(`INSERT INTO ${data_schema}."${stringaManReg}"
                        ("id_mn_reg", "cl_ogg_fr", "azione", "esecutori", "strumentaz", "commenti", "costo", "data_inizio", "data_fine", "data_ins", "autore_ultima_mod", "id_main10ance")
                        VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12));`,
                        [(reqJson.metadati.id_scheda + reqJson.edifici.indexOf(edificio)), reqJson.cl_ogg, reqJson.dati.descrizioneManReg, reqJson.dati.esecutori, reqJson.dati.strumentazione, reqJson.dati.note, reqJson.dati.costo, reqJson.dati.dataInizio, reqJson.dati.dataFine, reqJson.metadati.data_ins, reqJson.metadati.autore, [id_main10ance]]);
                    }
                    break;
                case stringaManCorr:
                    for (const edificio of reqJson.edifici) {
                        const id_main10ance = `${reqJson.localita}|${edificio}|${reqJson.categoria ? reqJson.categoria : '*'}|${reqJson.elemento ? reqJson.elemento : '*'}`; // si potrebbe parametrizzare anche terzo parametro, ma per ora va bene così
                        await tx.query(`INSERT INTO ${data_schema}."${stringaManCorr}"
                        ("id_mn_gu", "cl_ogg_fr", "azione", "esecutori", "strumentaz", "commenti", "costo", "data_inizio", "data_fine", "data_ins", "autore_ultima_mod", "id_main10ance")
                        VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12));`,
                        [(reqJson.metadati.id_scheda + reqJson.edifici.indexOf(edificio)), reqJson.cl_ogg, reqJson.dati.descrizioneManCorr, reqJson.dati.esecutori, reqJson.dati.strumentazione, reqJson.dati.note, reqJson.dati.costo, reqJson.dati.dataInizio, reqJson.dati.dataFine, reqJson.metadati.data_ins, reqJson.metadati.autore, [id_main10ance]]);
                    }
                    break;
                case stringaManStr:
                    for (const edificio of reqJson.edifici) {
                        const id_main10ance = `${reqJson.localita}|${edificio}|${reqJson.categoria ? reqJson.categoria : '*'}|${reqJson.elemento ? reqJson.elemento : '*'}`; // si potrebbe parametrizzare anche terzo parametro, ma per ora va bene così
                        await tx.query(`INSERT INTO ${data_schema}."${stringaManStr}"
                        ("id_mn_str", "cl_ogg_fr", "azione", "esecutori", "strumentaz", "commenti", "costo", "data_inizio", "data_fine", "data_ins", "autore_ultima_mod", "id_main10ance")
                        VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10), ($11), ($12));`,
                        [(reqJson.metadati.id_scheda + reqJson.edifici.indexOf(edificio)), reqJson.cl_ogg, reqJson.dati.descrizioneManStr, reqJson.dati.esecutori, reqJson.dati.strumentazione, reqJson.dati.note, reqJson.dati.costo, reqJson.dati.dataInizio, reqJson.dati.dataFine, reqJson.metadati.data_ins, reqJson.metadati.autore, [id_main10ance]]);
                    }
                    break;
                case stringaRestauro:
                    for (const edificio of reqJson.edifici) {
                        const id_main10ance = `${reqJson.localita}|${edificio}|${reqJson.categoria ? reqJson.categoria : '*'}|${reqJson.elemento ? reqJson.elemento : '*'}`; // si potrebbe parametrizzare anche terzo parametro, ma per ora va bene così
                        await tx.query(`INSERT INTO ${data_schema}."${stringaRestauro}"
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
        });
        return true;
    }
    catch (ex) {
        console.log(`Errore: ${ex}`);
        return false;
    }
}

async function registraScoreLavori(reqJson, ambito, autore) {
    try {
        await withTransaction(async (tx) => {
            for (const lavoro of reqJson) {
            const queryTxt = `
                INSERT INTO ${data_schema}.sintesi_lavori (
                    localita, edificio,
                    tetti, umidita, statica, interni, esterni,
                    ambito, data_ins, autore_ins,
                    anno_tetti, anno_umidita, anno_statica, anno_interni, anno_esterni,
                    id_interno
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
                );
            `;

            const listaValori = [
                lavoro.edificio.localita,
                lavoro.edificio.edificio, // questo è lo stesso campo "edificio" di "dati_edifici"
                lavoro.score_tetti?.score_interno || null,
                lavoro.score_umidita?.score_interno || null,
                lavoro.score_statica?.score_interno || null,
                lavoro.score_interni?.score_interno || null,
                lavoro.score_esterni?.score_interno || null,
                ambito,
                lavoro.data,
                autore,
                lavoro.anno_tetti || null,
                lavoro.anno_umidita || null,
                lavoro.anno_statica || null,
                lavoro.anno_interni || null,
                lavoro.anno_esterni || null,
                lavoro.id_interno
            ];

            await tx.query(queryTxt, listaValori);
            }
        });
        return true;
    } catch (e) {
        console.log(`Errore: ${e}`);
        return false;
    }
}

async function leggiScoreUltimiLavori(localita, ambito) {
    try {
        const queryTxt = `
            WITH distinct_edifici AS (
                SELECT DISTINCT edificio, edif_nome_menu
                FROM ${data_schema}.dati_edifici
                WHERE localita = $1
                AND ambito = $2
            ),
            latest_per_edificio AS (
                SELECT DISTINCT ON (sl.edificio)
                    sl.data_ins, sl.id_interno,
                    sl.tetti, sl.umidita, sl.statica, sl.interni, sl.esterni,
                    sl.anno_tetti, sl.anno_umidita, sl.anno_statica, sl.anno_interni, sl.anno_esterni,
                    sl.edificio
                FROM ${data_schema}.sintesi_lavori AS sl
                WHERE sl.localita = $1
                AND sl.ambito = $2
                ORDER BY sl.edificio, sl.id_interno DESC
            )
            SELECT
                lpe.data_ins, lpe.id_interno,
                lpe.tetti, lpe.umidita, lpe.statica, lpe.interni, lpe.esterni,
                lpe.anno_tetti, lpe.anno_umidita, lpe.anno_statica, lpe.anno_interni, lpe.anno_esterni,
                de.edif_nome_menu
            FROM latest_per_edificio AS lpe
            JOIN distinct_edifici AS de
            ON lpe.edificio = de.edificio
            ORDER BY lpe.edificio;
        `;
        const resp = await poolM10a.query(queryTxt, [localita, ambito]);
        return resp.rows;
    }
    catch(e) {
        console.log(`Errore nella lettura delle attività precedenti: ${e}`);
        return [];
    }
}

async function leggiScoreLavori(localita, ambito) {
    try {
        const queryTxt = `
            WITH distinct_edifici AS (
                SELECT DISTINCT edificio, edif_nome_menu
                FROM ${data_schema}.dati_edifici
                WHERE localita = $1
                AND ambito = $2
            )
            SELECT 
                sl.data_ins, sl.id_interno,
                sl.tetti, sl.umidita, sl.statica, sl.interni, sl.esterni,
                sl.anno_tetti, sl.anno_umidita, sl.anno_statica, sl.anno_interni, sl.anno_esterni,
                de.edif_nome_menu
            FROM ${data_schema}."sintesi_lavori" AS sl
            JOIN distinct_edifici AS de
            ON sl.edificio = de.edificio
            WHERE sl.localita = $1
            AND sl.ambito = $2
            ORDER BY id_interno, sl.edificio;
        `;
        const resp = await poolM10a.query(queryTxt, [localita, ambito]);
        return resp.rows;
    }
    catch(e) {
        console.log(`Errore nella lettura delle attività precedenti: ${e}`);
        return [];
    }
}

module.exports = app;

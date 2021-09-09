const bottoneAggiungi = document.getElementById('aggiungiDB');
const apriTabControllo = document.getElementById('apriTabControllo');
const apriTabManutenzione = document.getElementById('apriTabManutenzione');
const bottoneSalvaSchedaControllo = document.getElementById('salvaSchedaControllo');
const bottoneSalvaSchedaManutenzione = document.getElementById('salvaSchedaManutenzione');
const bottoneChiudiSchede = document.getElementById('chiudiSchede');
const schedaControllo = document.getElementById('scheda-controllo');
const schedaManutenzione = document.getElementById('scheda-manutenzione');

bottoneAggiungi.addEventListener('click', () => {
    inizializzaModulo();
});

apriTabControllo.addEventListener('click', () => {
    schedaManutenzione.style.display = 'none';
    apriTabManutenzione.classList.remove('active');
    schedaControllo.style.display = 'block';
    apriTabControllo.classList.add('active');
    bottoneSalvaSchedaManutenzione.style.display = 'none';
    bottoneSalvaSchedaControllo.style.display = 'inline';
    preparaCampiControllo();
});

apriTabManutenzione.addEventListener('click', () => {
    schedaControllo.style.display = 'none';
    apriTabControllo.classList.remove('active');
    schedaManutenzione.style.display = 'block';
    apriTabManutenzione.classList.add('active');
    bottoneSalvaSchedaControllo.style.display = 'none';
    bottoneSalvaSchedaManutenzione.style.display = 'inline';
});

bottoneSalvaSchedaControllo.addEventListener('click', async () => {
    if (verificaVincoliControllo()) {
        const listaDati = preparaDati();
        const [listaDatiNascosti, listaIdMain10ance] = preparaDatiNascosti(true);
        const listaDatiCompleta = [...listaDati, ...listaDatiNascosti];
        const listaFiltrata = filtraOggetti(listaDatiCompleta);
        const listaTotaleFiltrata = filtraListeDatiId(listaFiltrata, listaIdMain10ance);
        const listaRinominata = rinominaID(listaTotaleFiltrata, true);
        const resp = await compilaScheda(listaRinominata);
        if (resp) {
            alert('Operazione andata a buon fine');
        }
        else {
            alert('Operazione non riuscita');
        }
    }
    else {
        alert('ATTENZIONE: I campi UTENTE, DATA, e NOME FENOMENO sono obbligatori.');
    }
});

bottoneChiudiSchede.addEventListener('click', () => {
    apriTabControllo.style.display = 'none';
    apriTabManutenzione.style.display = 'none';
    schedaControllo.style.display = 'none';
    schedaManutenzione.style.display = 'none';
    bottoneSalvaSchedaControllo.style.display = 'none';
    bottoneChiudiSchede.style.display = 'none';
});

/////   FUNZIONI    /////

function inizializzaModulo() {
    cancellaFormDB(formDB);

    if (!viewer) {
        alert('Nessun modello selezionato');
    }
    else {
        const selezione = viewer.getSelection();
        const isolato = viewer.getIsolatedNodes();
        // if ((selezione.length === 1) || (isolato.length === 1)) {
        if ((selezione.length !== 0) || (isolato.length !== 0)) {
            selezione.forEach(async (s) => {
                viewer.getProperties(s, async (props) => {
                    let nome = props.name;
                    props.properties.forEach(p => {
                        if (p.displayName === "id_main10ance") {
                            let idMain10ance = p.displayValue;
                            let arrayInfo = idMain10ance.split('|');
                            let entità = arrayInfo[2];
                            // jsonRequest = {};
                            // jsonRequest.nome = nome;
                            // jsonRequest.id = idMain10ance;
                            // jsonRequest.categoria = entità;
                            preparaModulo(nome, idMain10ance);
                            mostraBottoniSchede();
                        }
                    });
                }, (e) => {
                        console.log(`ATTENZIONE: ${e}`)
                    });
            });
        }
        else if ((selezione.length === 0) && (isolato.length === 0)) {
            alert('Nessun elemento selezionato');
        }
        // else {
        //     alert('Selezionare un solo elemento per volta');
        // }
        // viewer.clearSelection();
        viewer.isolate(selezione);
        viewer.fitToView(selezione);
    }
}

function preparaModulo(nome, id) {
    const hNome = document.createElement('h4');
    hNome.setAttribute('id', `modulo-aggiungi-${nome}`);
    hNome.innerHTML = `<b>NOME ELEMENTO: ${nome}</b>`;
    const hId = document.createElement('h5');
    hId.setAttribute('id', `modulo-aggiungi-${id}`);
    hId.innerHTML = `<b>ID ELEMENTO: ${id}</b>`;
    // formDB.appendChild(hNome);
    formDB.appendChild(hId);
}

function mostraBottoniSchede() {
    apriTabControllo.style.display = 'inline';
    apriTabManutenzione.style.display = 'inline';
    // bottoneSalvaSchedaControllo.style.display = 'inline';
    bottoneChiudiSchede.style.display = 'inline';
    apriTabControllo.classList.remove('active');
    apriTabManutenzione.classList.remove('active');
}

async function preparaCampiControllo() {
    schedaControllo.innerHTML = '';

    const listaEnumConservazione = await leggiEnum('st_cons');
    const listaEnumGlossario = await leggiGloss();
    const listaEnumFenomeno = await leggiEnum('dad_ty');
    const listaEnumEstensione = await leggiEnum('est_sup');
    const listaEnumUrgenza = await leggiEnum('liv_urg');

    // UTENTE
    const contLabelUtente = document.createElement('label');
    contLabelUtente.innerHTML = '<b>UTENTE</b>';
    const contInputUtente = document.createElement('input');
    contInputUtente.setAttribute('placeholder', 'es. Mario Rossi');
    contInputUtente.setAttribute('id', 'scheda-controllo-[controllo_stato_di_conservazione_livello_di_urgenza]-{esecutori}');
    // DATA
    const contLabelData = document.createElement('label');
    contLabelData.innerHTML = '<b>DATA</b>';
    const contInputData = document.createElement('input');
    contInputData.setAttribute('type', 'date');
    contInputData.setAttribute('id', 'scheda-controllo-[controllo_stato_di_conservazione_livello_di_urgenza]-{data_con}');
    // CONTROLLO
    const contLabelControllo = document.createElement('label');
    contLabelControllo.innerHTML = '<b>TIPO DI CONTROLLO</b>';
    const contInputControllo = document.createElement('input');
    contInputControllo.setAttribute('id', 'scheda-controllo-[controllo_stato_di_conservazione_livello_di_urgenza|frase_di_rischio]-{controllo}');
    // STRUMENTAZIONE
    const contLabelStrumentazione = document.createElement('label');
    contLabelStrumentazione.innerHTML = '<b>STRUMENTAZIONE</b>';
    const contInputStrumentazione = document.createElement('input');
    contInputStrumentazione.setAttribute('id', 'scheda-controllo-[controllo_stato_di_conservazione_livello_di_urgenza]-{strumentaz}');
    // STATO DI CONSERVAZIONE
    const contLabelStatoCons = document.createElement('label');
    contLabelStatoCons.innerHTML = '<b>STATO DI CONSERVAZIONE</b>';
    const contSelectStatoCons = document.createElement('select');
    contSelectStatoCons.setAttribute('id', 'scheda-controllo-[controllo_stato_di_conservazione_livello_di_urgenza]-{st_cons}');
    creaListaOpzioni(listaEnumConservazione, contSelectStatoCons, 'unnest');
    // TIPO DI FENOMENO
    const contLabelTipoFenomeno = document.createElement('label');
    contLabelTipoFenomeno.innerHTML = '<b>TIPO DI FENOMENO</b>';
    const contSelectTipoFenomeno = document.createElement('select');
    contSelectTipoFenomeno.setAttribute('id', 'scheda-controllo-[danno_alterazione_degrado]-{dad_ty}');
    creaListaOpzioni(listaEnumFenomeno, contSelectTipoFenomeno, 'unnest');
    // NOME FENOMENO
    const contLabelNomeFenomeno = document.createElement('label');
    contLabelNomeFenomeno.innerHTML = '<b>NOME FENOMENO</b>';
    const contSelectNomeFenomeno = document.createElement('select');
    contSelectNomeFenomeno.setAttribute('id', 'scheda-controllo-[danno_alterazione_degrado]-{rid_gloss}');
    creaListaOpzioni(listaEnumGlossario, contSelectNomeFenomeno, 'id_gloss');
    // CAUSA
    const contLabelCausa = document.createElement('label');
    contLabelCausa.innerHTML = '<b>CAUSA</b>';
    const contInputCausa = document.createElement('input');
    contInputCausa.setAttribute('id', 'scheda-controllo-[danno_alterazione_degrado]-{causa_e}');
    // ESTENSIONE
    const contLabelEstensione = document.createElement('label');
    contLabelEstensione.innerHTML = '<b>ESTENSIONE</b>';
    const contSelectEstensione = document.createElement('select');
    contSelectEstensione.setAttribute('id', 'scheda-controllo-[danno_alterazione_degrado]-{est_sup}');
    creaListaOpzioni(listaEnumEstensione, contSelectEstensione, 'unnest');
    // FRASE DI RISCHIO
    const contLabelFrase = document.createElement('label');
    contLabelFrase.innerHTML = '<b>FRASE DI RISCHIO</b>';
    const contInputFrase = document.createElement('input');
    contInputFrase.setAttribute('id', 'scheda-controllo-[frase_di_rischio]-{fr_risc}');
    // MANUTENZIONE ORDINARIA
    const contLabelManOrd = document.createElement('label');
    contLabelManOrd.innerHTML = '<b>MANUTENZIONE ORDINARIA</b>';
    const contInputManOrd = document.createElement('input');
    contInputManOrd.setAttribute('id', 'scheda-controllo-[frase_di_rischio]-{mn_reg}');
    // FREQUENZA
    const contLabelFrequenza = document.createElement('label');
    contLabelFrequenza.innerHTML = '<b>FREQUENZA (MESI)</b>';
    const contInputFrequenza = document.createElement('input');
    contInputFrequenza.setAttribute('type', 'number');
    contInputFrequenza.setAttribute('step', 1);
    contInputFrequenza.setAttribute('id', 'scheda-controllo-[frase_di_rischio]-{frequenza}');
    // MANUTENZIONE STRAORDINARIA
    const contLabelManStr = document.createElement('label');
    contLabelManStr.innerHTML = '<b>MANUTENZIONE STRAORDINARIA</b>';
    const contInputManStr = document.createElement('input');
    contInputManStr.setAttribute('id', 'scheda-controllo-[frase_di_rischio]-{mn_nec}');
    // LIVELLO DI URGENZA
    const contLabelUrgenza = document.createElement('label');
    contLabelUrgenza.innerHTML = '<b>LIVELLO DI URGENZA</b>';
    const contSelectUrgenza = document.createElement('select');
    contSelectUrgenza.setAttribute('id', 'scheda-controllo-[controllo_stato_di_conservazione_livello_di_urgenza]-{liv_urg}');
    creaListaOpzioni(listaEnumUrgenza, contSelectUrgenza, 'unnest');
    // COMMENTI
    const contLabelCommenti = document.createElement('label');
    contLabelCommenti.innerHTML = '<b>COMMENTI</b>';
    const contInputCommenti = document.createElement('textarea');
    contInputCommenti.setAttribute('id', 'scheda-controllo-[controllo_stato_di_conservazione_livello_di_urgenza|danno_alterazione_degrado]-{commenti}');

    schedaControllo.appendChild(contLabelUtente);
    schedaControllo.appendChild(contInputUtente);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contLabelData);
    schedaControllo.appendChild(contInputData);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contLabelControllo);
    schedaControllo.appendChild(contInputControllo);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contLabelStrumentazione);
    schedaControllo.appendChild(contInputStrumentazione);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contLabelStatoCons);
    schedaControllo.appendChild(contSelectStatoCons);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contLabelTipoFenomeno);
    schedaControllo.appendChild(contSelectTipoFenomeno);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contLabelNomeFenomeno);
    schedaControllo.appendChild(contSelectNomeFenomeno);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contLabelCausa);
    schedaControllo.appendChild(contInputCausa);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contLabelEstensione);
    schedaControllo.appendChild(contSelectEstensione);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contLabelFrase);
    schedaControllo.appendChild(contInputFrase);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contLabelManOrd);
    schedaControllo.appendChild(contInputManOrd);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contLabelFrequenza);
    schedaControllo.appendChild(contInputFrequenza);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contLabelManStr);
    schedaControllo.appendChild(contInputManStr);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contLabelUrgenza);
    schedaControllo.appendChild(contSelectUrgenza);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contLabelCommenti);
    schedaControllo.appendChild(contInputCommenti);
    schedaControllo.appendChild(document.createElement('br'));
}

async function leggiEnum(nomeEnum) {
    try {
        const risultato = await fetch('/Main10ance_DB/tabellaDB/enum', {method: "GET", headers: {"content-type": "application/json", "nomeEnum": nomeEnum} });
        const listaEnum = await risultato.json();
        return listaEnum;
    }
    catch(e) {
        console.log('Errore nella lettura delle Enumeration');
        console.log(e);
    }
}

function creaListaOpzioni(listaOpzioni, targetSelect, parametro) {
    // const selectOpzioni = document.createElement('select');
    // selectOpzioni.setAttribute('id', `${idSelect}`);
    const opzioneVuota = document.createElement('option');
    opzioneVuota.setAttribute('value', null);
    opzioneVuota.innerHTML = '';
    targetSelect.appendChild(opzioneVuota);
    listaOpzioni.forEach(op => {
        const opzioneSel = document.createElement('option');
        opzioneSel.setAttribute('value', `${op[parametro]}`);
        opzioneSel.innerHTML = `${op[parametro]}`;
        targetSelect.appendChild(opzioneSel);
    });
}

async function leggiGloss() {
    try {
        const risultato = await fetch('/Main10ance_DB/tabellaDB/glossario', {method: "GET", headers: {"content-type": "application/json"} });
        const listaGloss = await risultato.json();
        return listaGloss;
    }
    catch(e) {
        console.log('Errore nella lettura del glossario');
        console.log(e);
    }
}

function trovaElementi(stringa) {
    const oggInput = $(`[id^="${stringa}"]`);
    delete oggInput['length'];
    delete oggInput['prevObject'];
    const listaInput = Object.values(oggInput);
    return listaInput;
}

function preparaDati() {
    const listaInput = trovaElementi('scheda-controllo-');
    let listaJSON = [];
    listaInput.forEach(inp => {
        const idCompleto = inp.id;
        // const valoreInput = inp.value;
        let valoreInput;
        // if ((inp.value === '') || (inp.value === 'null')) {
        //     valoreInput = null;
        // }
        // else {
        //     valoreInput = inp.value;
        // }
        if ((inp.value === '') || (inp.value === 'null')) {
            return;
        }
        else {
            valoreInput = inp.value;
        }
        const idPulitoTabelle = idCompleto.match(/\[(.*)\]/).pop();
        const listaTabelle = idPulitoTabelle.split('|');
        const idColonna = idCompleto.match(/\{(.*)\}/).pop();
        listaTabelle.forEach(tab => {
            const jsonRequest = {};
            jsonRequest.tabella = tab;
            jsonRequest.colonna = idColonna;
            jsonRequest.valore = valoreInput;
            listaJSON.push(jsonRequest);
        });
    });
    return listaJSON;
}

function verificaVincoliControllo() {
    const utente = $('[id*="{esecutori}"]')[0];
    const data = $('[id*="{data_con}"]')[0];
    const gloss = $('[id*="{rid_gloss}"]')[0];
    if ((!utente.value) || (utente.value === 'null') || (!data.value) || (data.value === 'null') || (!gloss.value) || (gloss.value === 'null')) {
        return false;
    }
    else {
        return true;
    }
}

async function compilaScheda(jsonReq) {
    try {
        await fetch(`/Main10ance_DB/schede/nuova`, {method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify(jsonReq) }).then(res => {res.json();}).then(dati => {console.log(dati);});
    }
    catch(e) {
        console.log(e);
    }
}

function preparaDatiNascosti(controllo) {
    const listaIdMain10anceGrezza = trovaElementi('modulo-aggiungi-');
    let listaJSON = [];
    let listaIdMain10ance = [];
    listaIdMain10anceGrezza.forEach(idgr => {
        const idCompleto = idgr.id;
        const idMain10ance = idCompleto.replace('modulo-aggiungi-', '');
        listaIdMain10ance.push(idMain10ance);
    });
    const idUnivoco = dataInteger();
    const dataIns = dataCorta();
    if (controllo) {
        const contr = 'controllo_stato_di_conservazione_livello_di_urgenza';
        const dad = 'danno_alterazione_degrado';
        const frase = 'frase_di_rischio';
        const id_contr = {tabella: contr, colonna: 'id_id', valore: idUnivoco};
        const id_dad = {tabella: dad, colonna: 'id_id', valore: idUnivoco};
        const fr_risc = {tabella: frase, colonna: 'id_id', valore: idUnivoco};
        const data_ins_c = {tabella: contr, colonna: 'data_ins', valore: dataIns};
        const data_ins_d = {tabella: dad, colonna: 'data_ins', valore: dataIns};
        const data_ins_f = {tabella: frase, colonna: 'data_ins', valore: dataIns};
        listaJSON.push(id_contr);
        listaJSON.push(id_dad);
        listaJSON.push(fr_risc);
        listaJSON.push(data_ins_c);
        listaJSON.push(data_ins_d);
        listaJSON.push(data_ins_f);
    }
    else {
        return;
    }
    return [listaJSON, listaIdMain10ance];
}

function filtraOggetti(listaOggetti) {
    let listaFiltrata = [];
    let listaDiControllo = [];
    listaOggetti.forEach(ogg => {
        if (listaDiControllo.includes(ogg.tabella)) {
            listaFiltrata.forEach(obj => {
                if (obj.tabella === ogg.tabella) {
                    obj.colonne.push(ogg.colonna);
                    obj.valori.push(ogg.valore);
                }
            });
        }
        else {
            let nuovoOggetto = {};
            nuovoOggetto.tabella = ogg.tabella;
            nuovoOggetto.colonne = [];
            nuovoOggetto.valori = [];
            nuovoOggetto.colonne.push(ogg.colonna);
            nuovoOggetto.valori.push(ogg.valore);
            listaDiControllo.push(ogg.tabella);
            listaFiltrata.push(nuovoOggetto);
        }
    });
    return listaFiltrata;
}

function dataInteger() {
    const dataFull = new Date();
    const annoGrezzo = dataFull.getFullYear();
    const annoLista = [...`${annoGrezzo}`];
    const anno = `${annoLista[2]}${annoLista[3]}`;
    const meseGrezzo = dataFull.getMonth();
    let mese;
    if ((meseGrezzo+1) < 10) {
        mese = `0${meseGrezzo+1}`;
    }
    else {
        mese = meseGrezzo+1;
    }
    const giornoGrezzo = dataFull.getDate();
    let giorno;
    if ((giornoGrezzo) < 10) {
        giorno = `0${giornoGrezzo}`;
    }
    else {
        giorno = giornoGrezzo;
    }
    const oraGrezzo = dataFull.getHours();
    let ora;
    if ((oraGrezzo) < 10) {
        ora = `0${oraGrezzo}`;
    }
    else {
        ora = oraGrezzo;
    }
    const minutiGrezzo = dataFull.getMinutes();
    let minuti;
    if ((minutiGrezzo) < 10) {
        minuti = `0${minutiGrezzo}`;
    }
    else {
        minuti = minutiGrezzo;
    }
    const secondiGrezzo = dataFull.getSeconds();
    let secondi;
    if ((secondiGrezzo) < 10) {
        secondi = `0${secondiGrezzo}`;
    }
    else {
        secondi = secondiGrezzo;
    }
    const millisecondiGrezzo = dataFull.getMilliseconds();
    let millisecondi;
    if ((millisecondiGrezzo) < 10) {
        millisecondi = `00${millisecondiGrezzo}`;
    }
    else if (((millisecondiGrezzo) >= 10) && ((millisecondiGrezzo) < 100)) {
        millisecondi = `0${millisecondiGrezzo}`;
    }
    else {
        millisecondi = millisecondiGrezzo;
    }
    const dataStringa = `${anno}${mese}${giorno}${ora}${minuti}${secondi}${millisecondi}`;
    const dataInteger = parseInt(dataStringa);
    return dataInteger;
}

function dataCorta() {
    const dataFull = new Date();
    const dataStringa = dataFull.toISOString();
    const dataCorta = dataStringa.split('T')[0];
    return dataCorta;
}

function filtraListeDatiId(listaDati, listaId) {
    let listaTotaleFiltrata = [];
    listaId.forEach(id => {
        listaDati.forEach(d => {
            const indice = listaId.indexOf(id);
            let dCopia = JSON.parse(JSON.stringify(d));
            dCopia.colonne.push('id_main10ance');
            dCopia.valori.push(id);
            const indiceID = dCopia.colonne.indexOf('id_id');
            dCopia.valori[indiceID] += indice;
            listaTotaleFiltrata.push(dCopia);
        });
    });
    return listaTotaleFiltrata;
}

function rinominaID(listaOgg, controllo) {
    if (controllo) {
        listaOgg.forEach(ogg => {
            if (ogg.tabella === 'controllo_stato_di_conservazione_livello_di_urgenza') {
                const ind = ogg.colonne.indexOf('id_id');
                ogg.colonne[ind] = 'id_contr';
            }
            else if (ogg.tabella === 'danno_alterazione_degrado') {
                const ind = ogg.colonne.indexOf('id_id');
                ogg.colonne[ind] = 'id_dad';
            }
            else if (ogg.tabella === 'frase_di_rischio') {
                const ind = ogg.colonne.indexOf('id_id');
                ogg.colonne[ind] = 'id_fr_risc';
            }
        });
    }
    else {
        return;
    }
    return listaOgg;
}

const bottoneAggiungi = document.getElementById('aggiungiDB');
const apriTabControllo = document.getElementById('apriTabControllo');
const apriTabManutenzione = document.getElementById('apriTabManutenzione');
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
    preparaCampiControllo();
});

apriTabManutenzione.addEventListener('click', () => {
    schedaControllo.style.display = 'none';
    apriTabControllo.classList.remove('active');
    schedaManutenzione.style.display = 'block';
    apriTabManutenzione.classList.add('active');
});

bottoneChiudiSchede.addEventListener('click', () => {
    apriTabControllo.style.display = 'none';
    apriTabManutenzione.style.display = 'none';
    schedaControllo.style.display = 'none';
    schedaManutenzione.style.display = 'none';
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
    hId.innerHTML = `<b>IDENTIFICATIVO ELEMENTO: ${id}</b>`;
    formDB.appendChild(hNome);
    formDB.appendChild(hId);
}

function mostraBottoniSchede() {
    apriTabControllo.style.display = 'inline';
    apriTabManutenzione.style.display = 'inline';
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
    contInputControllo.setAttribute('id', 'scheda-controllo-[]-{controllo}');
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
    contSelectTipoFenomeno.setAttribute('id', 'scheda-controllo-[danno-alterazione-degrado]-{dad_ty}');
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
    contSelectEstensione.setAttribute('id', 'scheda-controllo-[danno-alterazione-degrado]-{est_sup}');
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
    contInputCommenti.setAttribute('id', 'scheda-controllo-[]-{commenti}');

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

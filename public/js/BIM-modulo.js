"use strict";

const detailsSelezione = document.getElementById('details-selezionati');
const divDetailsSelezione = document.getElementById('contenitore-id-selezionati');
const bottoneAggiungi = document.getElementById('aggiungiDB');
const contenitoreSchede = document.getElementById('contenitore-controllo-intervento');
const apriTabAnagrafica = document.getElementById('apriTabAnagrafica');
const apriTabControllo = document.getElementById('apriTabControllo');
const apriTabIntervento = document.getElementById('apriTabIntervento');
const bottoneSalvaSchedaAnagrafica = document.getElementById('salvaSchedaAnagrafica');
const bottoneSalvaSchedaControllo = document.getElementById('salvaSchedaControllo');
const bottoneSalvaSchedaIntervento = document.getElementById('salvaSchedaIntervento');
const bottoneChiudiSchede = document.getElementById('chiudiSchede');
const schedaAnagrafica = document.getElementById('scheda-anagrafica');
const schedaControllo = document.getElementById('scheda-controllo');
const schedaIntervento = document.getElementById('scheda-intervento');

bottoneAggiungi.addEventListener('click', inizializzaModulo);

apriTabAnagrafica.addEventListener('click', async () => {
    const nSchedati = await verificaPresenzaSchedaAnagrafica();
    if (nSchedati) {
        const verbo = nSchedati === 1 ? 'possiede' : 'possiedono';
        const sovrascrivi = confirm(`${nSchedati} degli elementi selezionati ${verbo} già una scheda anagrafica, desideri sovrascriverla?`);
        if (!sovrascrivi) {
            svuotaContenitore(divDetailsSelezione);
            bottoneChiudiSchede.click();
            return;
        }
    }
    schedaControllo.style.display = 'none';
    apriTabControllo.classList.remove('active');
    schedaIntervento.style.display = 'none';
    apriTabIntervento.classList.remove('active');
    schedaAnagrafica.style.display = 'block';
    apriTabAnagrafica.classList.add('active');
    bottoneSalvaSchedaControllo.style.display = 'none';
    bottoneSalvaSchedaIntervento.style.display = 'none';
    bottoneSalvaSchedaAnagrafica.style.display = 'inline';
    bottoneChiudiSchede.style.background = 'var(--gialloAnagrafica)';
    if (document.getElementById('apriPDF')) {
        document.getElementById('apriPDF').remove();
    }
    preparaCampiAnagrafica();
});

apriTabControllo.addEventListener('click', () => {
    schedaAnagrafica.style.display = 'none';
    apriTabAnagrafica.classList.remove('active');
    schedaIntervento.style.display = 'none';
    apriTabIntervento.classList.remove('active');
    schedaControllo.style.display = 'block';
    apriTabControllo.classList.add('active');
    bottoneSalvaSchedaAnagrafica.style.display = 'none';
    bottoneSalvaSchedaIntervento.style.display = 'none';
    bottoneSalvaSchedaControllo.style.display = 'inline';
    bottoneChiudiSchede.style.background = 'var(--verdeMain10ance)';
    if (document.getElementById('apriPDF')) {
        document.getElementById('apriPDF').remove();
    }
    preparaCampiControllo();
});

apriTabIntervento.addEventListener('click', () => {
    schedaAnagrafica.style.display = 'none';
    apriTabAnagrafica.classList.remove('active');
    schedaControllo.style.display = 'none';
    apriTabControllo.classList.remove('active');
    schedaIntervento.style.display = 'block';
    apriTabIntervento.classList.add('active');
    bottoneSalvaSchedaAnagrafica.style.display = 'none';
    bottoneSalvaSchedaControllo.style.display = 'none';
    bottoneSalvaSchedaIntervento.style.display = 'inline';
    bottoneChiudiSchede.style.background = 'var(--bluInterreg)';
    if (document.getElementById('apriPDF')) {
        document.getElementById('apriPDF').remove();
    }
    preparaSceltaIntervento();
});

bottoneSalvaSchedaAnagrafica.addEventListener('click', async () => {
    if (verificaPresenzaIDm10a()) {
        const listaDati = preparaDati('scheda-anagrafica-');
        const [listaDatiNascosti, listaIdMain10ance] = preparaDatiNascosti('anagrafica');
        const listaDatiCompleta = [...listaDati, ...listaDatiNascosti];
        const listaFiltrata = filtraOggetti(listaDatiCompleta);
        const listaTotaleFiltrata = moltiplicaSchede(listaFiltrata, listaIdMain10ance);
        const listaRinominata = rinominaID(listaTotaleFiltrata);
        const resp = await compilaScheda(listaRinominata);
        if (resp.success) {
            alert('Operazione andata a buon fine');
            const bottonePDF = document.createElement('button');
            bottonePDF.setAttribute('id', 'apriPDF');
            bottonePDF.innerHTML = '<b>VISUALIZZA REPORT</b>';
            bottonePDF.addEventListener('click', () => {
                viewer.fitToView(null, null, true);
                setTimeout(() => {
                    creaPDF2(listaIdMain10ance, listaDatiNascosti, 'SCHEDA-ANAGRAFICA');
                }, 500);
            });
            contenitoreSchede.appendChild(bottonePDF);
        }
        else {
            alert('Operazione non riuscita');
        }
    }
    else {
        alert('Nessun ID associato alla scheda. Selezionare un elemento e riprovare.');
        bottoneChiudiSchede.click();
    }
});

bottoneSalvaSchedaControllo.addEventListener('click', async () => {
    if (verificaPresenzaIDm10a()) {
        if (verificaVincoliControllo()) {
            if (verificaVincoliRadioManut()) {
                const listaDati = preparaDati('scheda-controllo-');
                const [listaDatiNascosti, listaIdMain10ance] = preparaDatiNascosti('controllo');
                const listaDatiCompleta = [...listaDati, ...listaDatiNascosti];
                const listaFiltrata = filtraOggetti(listaDatiCompleta);
                const listaTotaleFiltrata = filtraListeDatiId(listaFiltrata, listaIdMain10ance);
                const listaRinominata = rinominaID(listaTotaleFiltrata);
                const resp = await compilaScheda(listaRinominata);
                if (resp.success) {
                    alert('Operazione andata a buon fine');
                    const bottonePDF = document.createElement('button');
                    bottonePDF.setAttribute('id', 'apriPDF');
                    bottonePDF.innerHTML = '<b>VISUALIZZA REPORT</b>';
                    bottonePDF.addEventListener('click', () => {
                        viewer.fitToView(null, null, true);
                        setTimeout(() => {
                            creaPDF2(listaIdMain10ance, listaDatiNascosti, 'SCHEDA-CONTROLLO');
                        }, 500);
                    });
                    contenitoreSchede.appendChild(bottonePDF);
                }
                else {
                    alert('Operazione non riuscita');
                }
            }
            else {
                alert('ATTENZIONE: Inserire i valori mancanti per i campi sulla manutenzione ordinaria o correttiva.');
            }
        }
        else {
            alert('ATTENZIONE: I campi OPERATORE, DATA, STATO DI CONSERVAZIONE e NOME FENOMENO sono obbligatori.');
        }
    }
    else {
        alert('Nessun ID associato alla scheda. Selezionare un elemento e riprovare.');
        bottoneChiudiSchede.click();
    }
});

bottoneSalvaSchedaIntervento.addEventListener('click', async () => {
    const scelta = document.getElementById('scelta-intervento').value;
    if (verificaPresenzaIDm10a()) {
        if (verificaVincoliManutenzioneRestauro(scelta)) {
            const listaDati = preparaDati('scheda-intervento-');
            const [listaDatiNascosti, listaIdMain10ance] = preparaDatiNascosti(scelta);
            const listaDatiCompleta = [...listaDati, ...listaDatiNascosti];
            const listaFiltrata = filtraOggetti(listaDatiCompleta);
            const listaTotaleFiltrata = filtraListeDatiId(listaFiltrata, listaIdMain10ance);
            const listaRinominata = rinominaID(listaTotaleFiltrata);
            const resp = await compilaScheda(listaRinominata);
            if (resp.success) {
                alert('Operazione andata a buon fine');
                const bottonePDF = document.createElement('button');
                bottonePDF.setAttribute('id', 'apriPDF');
                bottonePDF.innerHTML = '<b>VISUALIZZA REPORT</b>';
                bottonePDF.addEventListener('click', () => {
                    viewer.fitToView(null, null, true);
                    setTimeout(() => {
                        creaPDF2(listaIdMain10ance, listaDatiNascosti, 'SCHEDA-INTERVENTO');
                    }, 500);
                });
                contenitoreSchede.appendChild(bottonePDF);
            }
            else {
                alert('Operazione non riuscita');
            }
        }
        else {
            if ((scelta === 'Manutenzione Ordinaria') || (scelta === 'Manutenzione Correttiva')) {
                alert('ATTENZIONE: I campi OPERATORE, DATA, e SCHEDA CONTROLLO sono obbligatori.');
            }
            else if (scelta === 'Restauro') {
                alert('ATTENZIONE: I campi OPERATORE e NOME FENOMENO sono obbligatori.');
            }
        }
    }
    else {
        alert('Nessun ID associato alla scheda. Selezionare un elemento e riprovare.');
        bottoneChiudiSchede.click();
    }
});

bottoneChiudiSchede.addEventListener('click', nascondiBottoniSchede);

/////   FUNZIONI    /////

async function inizializzaModulo() {
    svuotaContenitore(contenitoreRicerca);
    svuotaContenitore(divDetailsSelezione);
    svuotaContenitore(formDB);

    if (!viewer) {
        alert('Nessun modello selezionato');
    }
    else {
        const selezione = getElementiSelezionati();
        if (selezione) {
            const listaIds = await getIdM10AFromSelezione(selezione);
            listaIds.forEach(id => {
                preparaModulo(id);
            });
            detailsSelezione.style.display = 'block';
            mostraBottoniSchede();
            viewer.isolate(selezione);
            viewer.fitToView(selezione);
        }
    }
}

function preparaModulo(id) {
    const hId = document.createElement('h5');
    hId.setAttribute('id', `modulo-aggiungi-${id}`);
    hId.innerHTML = `<b>ID ELEMENTO: ${id}</b>`;
    divDetailsSelezione.appendChild(hId);
}

function mostraBottoniSchede() {
    apriTabAnagrafica.style.display = 'inline';
    apriTabControllo.style.display = 'inline';
    apriTabIntervento.style.display = 'inline';
    bottoneChiudiSchede.style.display = 'inline';
    bottoneChiudiSchede.style.background = 'var(--blackOlive)';
    apriTabAnagrafica.classList.remove('active');
    apriTabControllo.classList.remove('active');
    apriTabIntervento.classList.remove('active');
}

function preparaCampiAnagrafica() {
    schedaAnagrafica.innerHTML = '';

    // TITOLO
    const anTitolo = document.createElement('h4');
    anTitolo.innerHTML = '<b>SCHEDA ANAGRAFICA</b>';

    // OPERATORE
    const anLabelOperatore = document.createElement('label');
    anLabelOperatore.innerHTML = '<b>OPERATORE</b>';
    const anTestoOperatore = document.createElement('p');
    anTestoOperatore.setAttribute('id', 'sc-an');
    anTestoOperatore.innerText = localStorage.user_id;

    // DESCRIZIONE SISTEMA
    const anLabelDescSist = document.createElement('label');
    anLabelDescSist.innerHTML = '<b>DESCRIZIONE SISTEMA</b>';
    const anInputDescSist = document.createElement('textarea');
    anInputDescSist.style.height = '20px';
    anInputDescSist.setAttribute('id', 'scheda-anagrafica-[scheda_anagrafica]-{descrizione_sistema}');

    // DESCRIZIONE SUBSISTEMA
    const anLabelDescSubSist = document.createElement('label');
    anLabelDescSubSist.innerHTML = '<b>DESCRIZIONE SUBSISTEMA</b>';
    const anInputDescSubSist = document.createElement('textarea');
    anInputDescSubSist.style.height = '20px';
    anInputDescSubSist.setAttribute('id', 'scheda-anagrafica-[scheda_anagrafica]-{descrizione_subsistema}');

    // TECNICA COSTRUTTIVA
    const anLabelTecn = document.createElement('label');
    anLabelTecn.innerHTML = '<b>TECNICA COSTRUTTIVA</b>';
    const anInputTecn = document.createElement('input');
    anInputTecn.setAttribute('id', 'scheda-anagrafica-[scheda_anagrafica]-{tecnica_costruttiva}');

    // DIMENSIONI
    const anLabelDim = document.createElement('label');
    anLabelDim.innerHTML = '<b>DIMENSIONI</b>';
    const anInputDim = document.createElement('input');
    anInputDim.setAttribute('id', 'scheda-anagrafica-[scheda_anagrafica]-{dimensioni}');

    // MATERIALE
    const anLabelMat = document.createElement('label');
    anLabelMat.innerHTML = '<b>MATERIALE/I</b>';
    const anInputMat = document.createElement('input');
    anInputMat.setAttribute('id', 'scheda-anagrafica-[scheda_anagrafica]-{materiale}');

    // EPOCA
    const anLabelEpoc = document.createElement('label');
    anLabelEpoc.innerHTML = '<b>EPOCA</b>';
    const anInputEpoc = document.createElement('input');
    anInputEpoc.setAttribute('id', 'scheda-anagrafica-[scheda_anagrafica]-{epoca}');

    // ISPEZIONABILITÀ
    const anLabelIsp = document.createElement('label');
    anLabelIsp.innerHTML = '<b>ISPEZIONABILITÀ</b>';
    const anInputIsp = document.createElement('input');
    anInputIsp.setAttribute('id', 'scheda-anagrafica-[scheda_anagrafica]-{ispezionabilità}');

    // FONTI
    const anLabelFonti = document.createElement('label');
    anLabelFonti.innerHTML = '<b>FONTI</b>';
    const anInputFonti = document.createElement('input');
    anInputFonti.setAttribute('id', 'scheda-anagrafica-[scheda_anagrafica]-{fonti}');

    schedaAnagrafica.appendChild(anTitolo);
    schedaAnagrafica.appendChild(document.createElement('br'));
    schedaAnagrafica.appendChild(anLabelOperatore);
    schedaAnagrafica.appendChild(anTestoOperatore);
    schedaAnagrafica.appendChild(document.createElement('br'));
    schedaAnagrafica.appendChild(anLabelDescSist);
    schedaAnagrafica.appendChild(anInputDescSist);
    schedaAnagrafica.appendChild(document.createElement('br'));
    schedaAnagrafica.appendChild(anLabelDescSubSist);
    schedaAnagrafica.appendChild(anInputDescSubSist);
    schedaAnagrafica.appendChild(document.createElement('br'));
    schedaAnagrafica.appendChild(anLabelTecn);
    schedaAnagrafica.appendChild(anInputTecn);
    schedaAnagrafica.appendChild(document.createElement('br'));
    schedaAnagrafica.appendChild(anLabelDim);
    schedaAnagrafica.appendChild(anInputDim);
    schedaAnagrafica.appendChild(document.createElement('br'));
    schedaAnagrafica.appendChild(anLabelMat);
    schedaAnagrafica.appendChild(anInputMat);
    schedaAnagrafica.appendChild(document.createElement('br'));
    schedaAnagrafica.appendChild(anLabelEpoc);
    schedaAnagrafica.appendChild(anInputEpoc);
    schedaAnagrafica.appendChild(document.createElement('br'));
    schedaAnagrafica.appendChild(anLabelIsp);
    schedaAnagrafica.appendChild(anInputIsp);
    schedaAnagrafica.appendChild(document.createElement('br'));
    schedaAnagrafica.appendChild(anLabelFonti);
    schedaAnagrafica.appendChild(anInputFonti);
    schedaAnagrafica.appendChild(document.createElement('br'));
}

async function preparaCampiControllo() {
    schedaControllo.innerHTML = '';

    const listaEnumConservazione = await leggiEnum('st_cons');
    const listaEnumGlossario = await leggiGlossDegradi();
    const listaEnumMateriale = await leggiEnum('mat_ty');
    const listaEnumFenomeno = await leggiEnum('dad_ty');
    const listaEnumEstensione = await leggiEnum('est_sup');
    const listaEnumUrgenza = await leggiEnum('liv_urg');

    // TITOLO
    const contTitolo = document.createElement('h4');
    contTitolo.innerHTML = '<b>SCHEDA CONTROLLO</b>';

    // OPERATORE
    const contLabelOperatore = document.createElement('label');
    contLabelOperatore.innerHTML = '<b>OPERATORE</b>';
    const contInputOperatore = document.createElement('input');
    // contInputOperatore.setAttribute('placeholder', 'es. Mario Rossi');
    contInputOperatore.setAttribute('id', 'scheda-controllo-[controllo_stato_di_conservazione_livello_di_urgenza]-{esecutori}');
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
    // MATERIALE
    const contLabelMateriale = document.createElement('label');
    contLabelMateriale.innerHTML = '<b>MATERIALE</b>';
    const contSelectMateriale = document.createElement('select');
    contSelectMateriale.setAttribute('id', 'scheda-controllo-[danno_alterazione_degrado]-{materiale}');
    creaListaOpzioni(listaEnumMateriale, contSelectMateriale, 'unnest', 'unnest', true);
    contSelectMateriale.addEventListener('change', () => {
        filtraOpzioniGlossario(contSelectMateriale.value, contSelectNomeFenomeno, listaEnumGlossario, 'materiale');
    });
    // STATO DI CONSERVAZIONE
    const contLabelStatoCons = document.createElement('label');
    contLabelStatoCons.innerHTML = '<b>STATO DI CONSERVAZIONE</b>';
    const contSelectStatoCons = document.createElement('select');
    contSelectStatoCons.setAttribute('id', 'scheda-controllo-[controllo_stato_di_conservazione_livello_di_urgenza]-{st_cons}');
    creaListaOpzioni(listaEnumConservazione, contSelectStatoCons, 'unnest', 'unnest', true);
    // TIPO DI FENOMENO
    const contLabelTipoFenomeno = document.createElement('label');
    contLabelTipoFenomeno.innerHTML = '<b>TIPO DI FENOMENO</b>';
    const contSelectTipoFenomeno = document.createElement('select');
    contSelectTipoFenomeno.setAttribute('id', 'scheda-controllo-[danno_alterazione_degrado]-{dad_ty}');
    creaListaOpzioni(listaEnumFenomeno, contSelectTipoFenomeno, 'unnest', 'unnest', true);
    contSelectTipoFenomeno.addEventListener('change', () => {
        filtraOpzioniGlossario(contSelectTipoFenomeno.value, contSelectNomeFenomeno, listaEnumGlossario, 'gloss_ty');
    });
    // NOME FENOMENO
    const contLabelNomeFenomeno = document.createElement('label');
    contLabelNomeFenomeno.innerHTML = '<b>NOME FENOMENO</b>';
    const contSelectNomeFenomeno = document.createElement('select');
    contSelectNomeFenomeno.setAttribute('id', 'scheda-controllo-[danno_alterazione_degrado]-{rid_gloss}');
    creaListaOpzioni(listaEnumGlossario, contSelectNomeFenomeno, 'id_gloss', 'id_gloss', true);
    contSelectNomeFenomeno.addEventListener('change', () => {
        filtraOpzioniFenomeno(contSelectNomeFenomeno.value, contSelectTipoFenomeno, listaEnumGlossario);
        filtraOpzioniMateriale(contSelectNomeFenomeno.value, contSelectMateriale, listaEnumGlossario);
    });
    contSelectNomeFenomeno.addEventListener('click', () => {
        if ((!contSelectNomeFenomeno.value) || (contSelectNomeFenomeno.value === 'null') || (contSelectNomeFenomeno.value === '0 NESSUN FENOMENO')) {
            contRadioManOrd.checked = false;
            contRadioManStr.checked = false;
            contInputManOrd.value = null;
            contInputManOrd.disabled = true;
            contInputFrequenza.value = null;
            contInputFrequenza.disabled = true;
            contInputManStr.value = null;
            contInputManStr.disabled = true;
            contSelectUrgenza.value = null;
            contSelectUrgenza.disabled = true;
        }
    });
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
    creaListaOpzioni(listaEnumEstensione, contSelectEstensione, 'unnest', 'unnest', true);
    // FRASE DI RISCHIO
    const contLabelFrase = document.createElement('label');
    contLabelFrase.innerHTML = '<b>FRASE DI RISCHIO</b>';
    const contInputFrase = document.createElement('input');
    contInputFrase.setAttribute('id', 'scheda-controllo-[frase_di_rischio]-{fr_risc}');
    // MANUTENZIONE ORDINARIA
    const contRadioManOrd = document.createElement('input');
    contRadioManOrd.setAttribute('type', 'radio');
    contRadioManOrd.setAttribute('id', 'radio-man-ord');
    contRadioManOrd.disabled = false;
    contRadioManOrd.addEventListener('change', () => {
        if (contRadioManOrd.checked) {
            contRadioManStr.checked = false;
            contInputManOrd.disabled = false;
            contInputFrequenza.disabled = false;
            contInputManStr.value = null;
            contInputManStr.disabled = true;
            contSelectUrgenza.value = null;
            contSelectUrgenza.disabled = true;
        }
    });
    const contLabelManOrd = document.createElement('label');
    contLabelManOrd.innerHTML = '<b>MANUTENZIONE ORDINARIA</b>';
    const contInputManOrd = document.createElement('input');
    contInputManOrd.setAttribute('id', 'scheda-controllo-[frase_di_rischio]-{mn_reg}');
    contInputManOrd.disabled = true;
    // FREQUENZA
    const contLabelFrequenza = document.createElement('label');
    contLabelFrequenza.innerHTML = '<b>FREQUENZA (MESI)</b>';
    const contInputFrequenza = document.createElement('input');
    contInputFrequenza.setAttribute('type', 'number');
    contInputFrequenza.setAttribute('step', 1);
    contInputFrequenza.setAttribute('id', 'scheda-controllo-[frase_di_rischio]-{frequenza}');
    contInputFrequenza.disabled = true;
    // MANUTENZIONE STRAORDINARIA
    const contRadioManStr = document.createElement('input');
    contRadioManStr.setAttribute('type', 'radio');
    contRadioManStr.setAttribute('id', 'radio-man-str');
    contRadioManStr.disabled = false;
    contRadioManStr.addEventListener('change', () => {
        if (contRadioManStr.checked) {
            contRadioManOrd.checked = false;
            contInputManStr.disabled = false;
            contSelectUrgenza.disabled = false;
            contInputManOrd.value = null;
            contInputManOrd.disabled = true;
            contInputFrequenza.value = null;
            contInputFrequenza.disabled = true;
        }
    });
    const contLabelManStr = document.createElement('label');
    contLabelManStr.innerHTML = '<b>MANUTENZIONE CORRETTIVA</b>';
    const contInputManStr = document.createElement('input');
    contInputManStr.setAttribute('id', 'scheda-controllo-[frase_di_rischio]-{mn_nec}');
    contInputManStr.disabled = true;
    // LIVELLO DI URGENZA
    const contLabelUrgenza = document.createElement('label');
    contLabelUrgenza.innerHTML = '<b>LIVELLO DI URGENZA</b>';
    const contSelectUrgenza = document.createElement('select');
    contSelectUrgenza.setAttribute('id', 'scheda-controllo-[controllo_stato_di_conservazione_livello_di_urgenza]-{liv_urg}');
    creaListaOpzioni(listaEnumUrgenza, contSelectUrgenza, 'unnest', 'unnest', true);
    contSelectUrgenza.disabled = true;
    // COSTO PREVISTO
    const contLabelCosto = document.createElement('label');
    contLabelCosto.innerHTML = '<b>COSTO PREVISTO (€)</b>';
    const contInputCosto = document.createElement('input');
    contInputCosto.setAttribute('type', 'number');
    contInputCosto.setAttribute('step', 0.01);
    contInputCosto.setAttribute('id', 'scheda-controllo-[controllo_stato_di_conservazione_livello_di_urgenza]-{costo}');
    // NOTE
    const contLabelCommenti = document.createElement('label');
    contLabelCommenti.innerHTML = '<b>NOTE</b>';
    const contInputCommenti = document.createElement('textarea');
    contInputCommenti.style.height = '20px';
    contInputCommenti.setAttribute('id', 'scheda-controllo-[controllo_stato_di_conservazione_livello_di_urgenza|danno_alterazione_degrado]-{commenti}');
    // DOCUMENTI
    const contLabelDocumenti = document.createElement('label');
    contLabelDocumenti.innerHTML = '<b>DOCUMENTI</b>';
    const contInputDocumenti = document.createElement('input');
    contInputDocumenti.setAttribute('id', 'scheda-controllo-[controllo_stato_di_conservazione_livello_di_urgenza]-{doc}');

    schedaControllo.appendChild(contTitolo);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contLabelOperatore);
    schedaControllo.appendChild(contInputOperatore);
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
    schedaControllo.appendChild(contLabelMateriale);
    schedaControllo.appendChild(contSelectMateriale);
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
    schedaControllo.appendChild(contRadioManOrd);
    schedaControllo.appendChild(contLabelManOrd);
    schedaControllo.appendChild(contInputManOrd);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contLabelFrequenza);
    schedaControllo.appendChild(contInputFrequenza);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contRadioManStr);
    schedaControllo.appendChild(contLabelManStr);
    schedaControllo.appendChild(contInputManStr);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contLabelUrgenza);
    schedaControllo.appendChild(contSelectUrgenza);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contLabelCosto);
    schedaControllo.appendChild(contInputCosto);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contLabelCommenti);
    schedaControllo.appendChild(contInputCommenti);
    schedaControllo.appendChild(document.createElement('br'));
    schedaControllo.appendChild(contLabelDocumenti);
    schedaControllo.appendChild(contInputDocumenti);
    schedaControllo.appendChild(document.createElement('br'));
}

function preparaSceltaIntervento() {
    schedaIntervento.innerHTML = '';

    const divSceltaIntervento = document.createElement('div');
    divSceltaIntervento.setAttribute('id', 'contenitore-scelta-intervento');
    const divSchedaIntervento = document.createElement('div');
    divSchedaIntervento.setAttribute('id', 'contenitore-scheda-intervento');
    const labelIntervento = document.createElement('label');
    labelIntervento.innerHTML = '<b>TIPO DI INTERVENTO: </b>';
    const selectIntervento = document.createElement('select');
    selectIntervento.setAttribute('id', 'scelta-intervento');
    const listaOpzioniIntervento = [{intervento: 'Manutenzione Ordinaria'}, {intervento: 'Manutenzione Correttiva'}, {intervento: 'Restauro'}];
    creaListaOpzioni(listaOpzioniIntervento, selectIntervento, 'intervento', 'intervento', true);

    selectIntervento.addEventListener('change', () => {
        preparaCampiIntervento(selectIntervento);
    });

    divSceltaIntervento.appendChild(labelIntervento);
    divSceltaIntervento.appendChild(selectIntervento);

    schedaIntervento.appendChild(divSceltaIntervento);
    schedaIntervento.appendChild(divSchedaIntervento);
}

function preparaCampiIntervento(select) {
    const contenitoreSchedeIntervento = document.getElementById('contenitore-scheda-intervento');

    const interventoTarget = select.value;
    if (interventoTarget === 'Manutenzione Ordinaria') {
        preparaCampiManOrd(contenitoreSchedeIntervento);
    }
    else if (interventoTarget === 'Manutenzione Correttiva') {
        preparaCampiManStr(contenitoreSchedeIntervento);
    }
    else if (interventoTarget === 'Restauro') {
        preparaCampiRestauri(contenitoreSchedeIntervento);
    }
    else {
        contenitoreSchedeIntervento.innerHTML = '';
    }
}

async function preparaCampiManOrd(divScheda) {
    divScheda.innerHTML = '';

    const listaSchedeControllo = await leggiSchedeControllo();

    // TITOLO
    const intTitolo = document.createElement('h4');
    intTitolo.innerHTML = '<b>SCHEDA MANUTENZIONE ORDINARIA</b>';

    // OPERATORE
    const intLabelOperatore = document.createElement('label');
    intLabelOperatore.innerHTML = '<b>OPERATORE</b>';
    const intInputOperatore = document.createElement('input');
    // intInputOperatore.setAttribute('placeholder', 'es. Mario Rossi');
    intInputOperatore.setAttribute('id', 'scheda-intervento-[manutenzione_regolare]-{esecutori}');
    // DATA INTERVENTO
    const intLabelData = document.createElement('label');
    intLabelData.innerHTML = '<b>DATA INTERVENTO</b>';
    const intInputData = document.createElement('input');
    intInputData.setAttribute('type', 'date');
    intInputData.setAttribute('id', 'scheda-intervento-[manutenzione_regolare]-{data_ese}');
    // SCHEDA CONTROLLO
    const intLabelSchedaControllo = document.createElement('label');
    intLabelSchedaControllo.innerHTML = '<b>SCHEDA CONTROLLO</b>';
    const intSelectSchedaControllo = document.createElement('select');
    intSelectSchedaControllo.setAttribute('id', 'scheda-intervento-[manutenzione_regolare]-{id_contr}');
    creaListaOpzioni(listaSchedeControllo, intSelectSchedaControllo, 'valore', 'scheda', true);
    intSelectSchedaControllo.addEventListener('change', async () => {
        if ((intSelectSchedaControllo.value === null) || (intSelectSchedaControllo.value === 'null')) {
            viewer.clearSelection();
            svuotaContenitore(divDetailsSelezione);
        }
        else {
            svuotaContenitore(divDetailsSelezione);
            const schedaSelezionata = listaSchedeControllo.filter(sc => (sc.valore === intSelectSchedaControllo.value))[0];
            const listaIdM10A = schedaSelezionata.id_main10ance;
            listaIdM10A.forEach(id => preparaModulo(id));
            // QUESTO PROMISE.ALL CON MODELLI GRANDI DIVENTA LENTISSIMO -> PROBLEMATICO
            const listaElementi = await Promise.all(listaIdM10A.map(async id => (await ricercaIdM10A(id))));
            viewer.isolate(listaElementi);
            viewer.select(listaElementi);
            viewer.fitToView();
            // listaSchedeControllo.forEach(sc => {
            //     if (intSelectSchedaControllo.value === sc.valore) {
            //         const nuovaListaId = sc.id_main10ance;
            //         let listaElementi = [];
            //         nuovaListaId.forEach(id => {
            //             // preparaModulo(id);
            //             viewer.search(id, el => {
            //                 listaElementi.push(el[0]);
            //                 viewer.select(listaElementi);
            //                 // viewer.fitToView();
            //             }, () => {
            //                 alert('Errore nella ricerca');
            //             }, ['id_main10ance']);
            //         });
            //     }
            // });
        }
    });
    // FREQUENZA EFFETTIVA
    const intLabelFrequenza = document.createElement('label');
    intLabelFrequenza.innerHTML = '<b>FREQUENZA EFFETTIVA (MESI)</b>';
    const intInputFrequenza = document.createElement('input');
    intInputFrequenza.setAttribute('type', 'number');
    intInputFrequenza.setAttribute('step', 1);
    intInputFrequenza.setAttribute('id', 'scheda-intervento-[manutenzione_regolare]-{fq_eff}');
    // AZIONE
    const intLabelAzione = document.createElement('label');
    intLabelAzione.innerHTML = '<b>AZIONE</b>';
    const intInputAzione = document.createElement('input');
    intInputAzione.setAttribute('id', 'scheda-intervento-[manutenzione_regolare]-{azione}');
    // STRUMENTAZIONE
    const intLabelStrumentazione = document.createElement('label');
    intLabelStrumentazione.innerHTML = '<b>STRUMENTAZIONE</b>';
    const intInputStrumentazione = document.createElement('input');
    intInputStrumentazione.setAttribute('id', 'scheda-intervento-[manutenzione_regolare]-{strumentaz}');
    // MATERIALI UTILIZZATI
    const intLabelMateriale = document.createElement('label');
    intLabelMateriale.innerHTML = '<b>MATERIALI UTILIZZATI</b>';
    const intInputMateriale = document.createElement('input');
    intInputMateriale.setAttribute('id', 'scheda-intervento-[manutenzione_regolare]-{materiale}');
    // COSTO
    const intLabelCosto = document.createElement('label');
    intLabelCosto.innerHTML = '<b>COSTO (€)</b>';
    const intInputCosto = document.createElement('input');
    intInputCosto.setAttribute('type', 'number');
    intInputCosto.setAttribute('step', 0.01);
    intInputCosto.setAttribute('id', 'scheda-intervento-[manutenzione_regolare]-{costo}');
    // NOTE
    const intLabelCommenti = document.createElement('label');
    intLabelCommenti.innerHTML = '<b>NOTE</b>';
    const intInputCommenti = document.createElement('textarea');
    intInputCommenti.style.height = '20px';
    intInputCommenti.setAttribute('id', 'scheda-intervento-[manutenzione_regolare]-{commenti}');
    // DOCUMENTI
    const intLabelDocumenti = document.createElement('label');
    intLabelDocumenti.innerHTML = '<b>DOCUMENTI</b>';
    const intInputDocumenti = document.createElement('input');
    intInputDocumenti.setAttribute('id', 'scheda-intervento-[manutenzione_regolare]-{doc}');

    divScheda.appendChild(intTitolo);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelOperatore);
    divScheda.appendChild(intInputOperatore);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelData);
    divScheda.appendChild(intInputData);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelSchedaControllo);
    divScheda.appendChild(intSelectSchedaControllo);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelFrequenza);
    divScheda.appendChild(intInputFrequenza);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelAzione);
    divScheda.appendChild(intInputAzione);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelStrumentazione);
    divScheda.appendChild(intInputStrumentazione);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelMateriale);
    divScheda.appendChild(intInputMateriale);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelCosto);
    divScheda.appendChild(intInputCosto);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelCommenti);
    divScheda.appendChild(intInputCommenti);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelDocumenti);
    divScheda.appendChild(intInputDocumenti);
    divScheda.appendChild(document.createElement('br'));
}

async function preparaCampiManStr(divScheda) {
    divScheda.innerHTML = '';

    const listaSchedeControllo = await leggiSchedeControllo();

    // TITOLO
    const intTitolo = document.createElement('h4');
    intTitolo.innerHTML = '<b>SCHEDA MANUTENZIONE CORRETTIVA</b>';

    // OPERATORE
    const intLabelOperatore = document.createElement('label');
    intLabelOperatore.innerHTML = '<b>OPERATORE</b>';
    const intInputOperatore = document.createElement('input');
    // intInputOperatore.setAttribute('placeholder', 'es. Mario Rossi');
    intInputOperatore.setAttribute('id', 'scheda-intervento-[manutenzione_correttiva_o_a_guasto]-{esecutori}');
    // DATA INTERVENTO
    const intLabelData = document.createElement('label');
    intLabelData.innerHTML = '<b>DATA INTERVENTO</b>';
    const intInputData = document.createElement('input');
    intInputData.setAttribute('type', 'date');
    intInputData.setAttribute('id', 'scheda-intervento-[manutenzione_correttiva_o_a_guasto]-{data_ese}');
    // SCHEDA CONTROLLO
    const intLabelSchedaControllo = document.createElement('label');
    intLabelSchedaControllo.innerHTML = '<b>SCHEDA CONTROLLO</b>';
    const intSelectSchedaControllo = document.createElement('select');
    intSelectSchedaControllo.setAttribute('id', 'scheda-intervento-[manutenzione_correttiva_o_a_guasto]-{id_contr}');
    creaListaOpzioni(listaSchedeControllo, intSelectSchedaControllo, 'valore', 'scheda', true);
    intSelectSchedaControllo.addEventListener('change', async () => {
        if ((intSelectSchedaControllo.value === null) || (intSelectSchedaControllo.value === 'null')) {
            viewer.clearSelection();
            svuotaContenitore(divDetailsSelezione);
        }
        else {
            svuotaContenitore(divDetailsSelezione);
            const schedaSelezionata = listaSchedeControllo.filter(sc => (sc.valore === intSelectSchedaControllo.value))[0];
            const listaIdM10A = schedaSelezionata.id_main10ance;
            listaIdM10A.forEach(id => preparaModulo(id));
            // QUESTO PROMISE.ALL CON MODELLI GRANDI DIVENTA LENTISSIMO -> PROBLEMATICO
            const listaElementi = await Promise.all(listaIdM10A.map(async id => (await ricercaIdM10A(id))));
            viewer.isolate(listaElementi);
            viewer.select(listaElementi);
            viewer.fitToView();
            // listaSchedeControllo.forEach(sc => {
            //     if (intSelectSchedaControllo.value === sc.valore) {
            //         const nuovaListaId = sc.id_main10ance;
            //         let listaElementi = [];
            //         nuovaListaId.forEach(id => {
            //             // preparaModulo(id);
            //             viewer.search(id, el => {
            //                 listaElementi.push(el[0]);
            //                 viewer.select(listaElementi);
            //                 // viewer.fitToView();
            //             }, () => {
            //                 alert('Errore nella ricerca');
            //             }, ['id_main10ance']);
            //         });
            //     }
            // });
        }
    });
    // PROGETTISTI
    const intLabelProgettisti = document.createElement('label');
    intLabelProgettisti.innerHTML = '<b>PROGETTISTA/I</b>';
    const intInputProgettisti = document.createElement('input');
    intInputProgettisti.setAttribute('id', 'scheda-intervento-[manutenzione_correttiva_o_a_guasto]-{progettist}');
    // AZIONE
    const intLabelAzione = document.createElement('label');
    intLabelAzione.innerHTML = '<b>AZIONE</b>';
    const intInputAzione = document.createElement('input');
    intInputAzione.setAttribute('id', 'scheda-intervento-[manutenzione_correttiva_o_a_guasto]-{azione}');
    // STRUMENTAZIONE
    const intLabelStrumentazione = document.createElement('label');
    intLabelStrumentazione.innerHTML = '<b>STRUMENTAZIONE</b>';
    const intInputStrumentazione = document.createElement('input');
    intInputStrumentazione.setAttribute('id', 'scheda-intervento-[manutenzione_correttiva_o_a_guasto]-{strumentazione}');
    // MATERIALI UTILIZZATI
    const intLabelMateriale = document.createElement('label');
    intLabelMateriale.innerHTML = '<b>MATERIALI UTILIZZATI</b>';
    const intInputMateriale = document.createElement('input');
    intInputMateriale.setAttribute('id', 'scheda-intervento-[manutenzione_correttiva_o_a_guasto]-{materiale}');
    // COSTO
    const intLabelCosto = document.createElement('label');
    intLabelCosto.innerHTML = '<b>COSTO (€)</b>';
    const intInputCosto = document.createElement('input');
    intInputCosto.setAttribute('type', 'number');
    intInputCosto.setAttribute('step', 0.01);
    intInputCosto.setAttribute('id', 'scheda-intervento-[manutenzione_correttiva_o_a_guasto]-{costo}');
    // CAUSA
    const intLabelCausa = document.createElement('label');
    intLabelCausa.innerHTML = '<b>CAUSA</b>';
    const intInputCausa = document.createElement('input');
    intInputCausa.setAttribute('id', 'scheda-intervento-[manutenzione_correttiva_o_a_guasto]-{causa}');
    // NOTE
    const intLabelCommenti = document.createElement('label');
    intLabelCommenti.innerHTML = '<b>NOTE</b>';
    const intInputCommenti = document.createElement('textarea');
    intInputCommenti.style.height = '20px';
    intInputCommenti.setAttribute('id', 'scheda-intervento-[manutenzione_correttiva_o_a_guasto]-{commenti}');
    // DOCUMENTI
    const intLabelDocumenti = document.createElement('label');
    intLabelDocumenti.innerHTML = '<b>DOCUMENTI</b>';
    const intInputDocumenti = document.createElement('input');
    intInputDocumenti.setAttribute('id', 'scheda-intervento-[manutenzione_correttiva_o_a_guasto]-{doc}');

    divScheda.appendChild(intTitolo);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelOperatore);
    divScheda.appendChild(intInputOperatore);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelData);
    divScheda.appendChild(intInputData);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelSchedaControllo);
    divScheda.appendChild(intSelectSchedaControllo);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelProgettisti);
    divScheda.appendChild(intInputProgettisti);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelAzione);
    divScheda.appendChild(intInputAzione);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelStrumentazione);
    divScheda.appendChild(intInputStrumentazione);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelMateriale);
    divScheda.appendChild(intInputMateriale);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelCosto);
    divScheda.appendChild(intInputCosto);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelCausa);
    divScheda.appendChild(intInputCausa);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelCommenti);
    divScheda.appendChild(intInputCommenti);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelDocumenti);
    divScheda.appendChild(intInputDocumenti);
    divScheda.appendChild(document.createElement('br'));
}

async function preparaCampiRestauri(divScheda) {
    divScheda.innerHTML = '';

    const listaEnumGlossario = await leggiGlossDegradi();

    // TITOLO
    const intTitolo = document.createElement('h4');
    intTitolo.innerHTML = '<b>SCHEDA RESTAURI</b>';

    // OPERATORE
    const intLabelOperatore = document.createElement('label');
    intLabelOperatore.innerHTML = '<b>OPERATORE</b>';
    const intInputOperatore = document.createElement('input');
    // intInputOperatore.setAttribute('placeholder', 'es. Mario Rossi');
    intInputOperatore.setAttribute('id', 'scheda-intervento-[restauri]-{operatore}');
    // ANNO INIZIO
    const intLabelAnnoI = document.createElement('label');
    intLabelAnnoI.innerHTML = '<b>ANNO INIZIO</b>';
    const intInputAnnoI = document.createElement('input');
    intInputAnnoI.setAttribute('type', 'number');
    intInputAnnoI.setAttribute('min', 1800);
    intInputAnnoI.setAttribute('max', 2099);
    intInputAnnoI.setAttribute('step', 1);
    intInputAnnoI.setAttribute('id', 'scheda-intervento-[restauri]-{anno_iniz}');
    // ANNO FINE
    const intLabelAnnoF = document.createElement('label');
    intLabelAnnoF.innerHTML = '<b>ANNO FINE</b>';
    const intInputAnnoF = document.createElement('input');
    intInputAnnoF.setAttribute('type', 'number');
    intInputAnnoF.setAttribute('min', 1800);
    intInputAnnoF.setAttribute('max', 2099);
    intInputAnnoF.setAttribute('step', 1);
    intInputAnnoF.setAttribute('id', 'scheda-intervento-[restauri]-{anno_fine}');
    // PROGETTISTI
    const intLabelProgettisti = document.createElement('label');
    intLabelProgettisti.innerHTML = '<b>PROGETTISTA/I</b>';
    const intInputProgettisti = document.createElement('input');
    intInputProgettisti.setAttribute('id', 'scheda-intervento-[restauri]-{progettist}');
    // NOME FENOMENO
    const intLabelNomeFenomeno = document.createElement('label');
    intLabelNomeFenomeno.innerHTML = '<b>NOME FENOMENO</b>';
    const intSelectNomeFenomeno = document.createElement('select');
    intSelectNomeFenomeno.setAttribute('id', 'scheda-intervento-[restauri]-{rid_gloss}');
    creaListaOpzioni(listaEnumGlossario, intSelectNomeFenomeno, 'id_gloss', 'id_gloss', true);
    // DESCRIZIONE
    const intLabelDescrizione = document.createElement('label');
    intLabelDescrizione.innerHTML = '<b>DESCRIZIONE INTERVENTO</b>';
    const intInputDescrizione = document.createElement('input');
    intInputDescrizione.setAttribute('id', 'scheda-intervento-[restauri]-{descriz}');
    // COSTO
    const intLabelCosto = document.createElement('label');
    intLabelCosto.innerHTML = '<b>COSTO (€)</b>';
    const intInputCosto = document.createElement('input');
    intInputCosto.setAttribute('type', 'number');
    intInputCosto.setAttribute('step', 0.01);
    intInputCosto.setAttribute('id', 'scheda-intervento-[restauri]-{costo}');
    // NOTE
    const intLabelCommenti = document.createElement('label');
    intLabelCommenti.innerHTML = '<b>NOTE</b>';
    const intInputCommenti = document.createElement('textarea');
    intInputCommenti.style.height = '20px';
    intInputCommenti.setAttribute('id', 'scheda-intervento-[restauri]-{commenti}');
    // DOCUMENTI
    const intLabelDocumenti = document.createElement('label');
    intLabelDocumenti.innerHTML = '<b>DOCUMENTI</b>';
    const intInputDocumenti = document.createElement('input');
    intInputDocumenti.setAttribute('id', 'scheda-intervento-[restauri]-{doc}');

    divScheda.appendChild(intTitolo);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelOperatore);
    divScheda.appendChild(intInputOperatore);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelAnnoI);
    divScheda.appendChild(intInputAnnoI);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelAnnoF);
    divScheda.appendChild(intInputAnnoF);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelProgettisti);
    divScheda.appendChild(intInputProgettisti);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelNomeFenomeno);
    divScheda.appendChild(intSelectNomeFenomeno);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelDescrizione);
    divScheda.appendChild(intInputDescrizione);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelCosto);
    divScheda.appendChild(intInputCosto);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelCommenti);
    divScheda.appendChild(intInputCommenti);
    divScheda.appendChild(document.createElement('br'));
    divScheda.appendChild(intLabelDocumenti);
    divScheda.appendChild(intInputDocumenti);
    divScheda.appendChild(document.createElement('br'));
}

async function leggiEnum(nomeEnum) {
    try {
        const risultato = await fetch('/o/Main10ance_DB/tabellaDB/enum', {method: "GET", headers: {"content-type": "application/json", "nomeEnum": nomeEnum} });
        const listaEnum = await risultato.json();
        return listaEnum;
    }
    catch(e) {
        console.log('Errore nella lettura delle Enumeration');
        console.log(e);
    }
}

function creaListaOpzioni(listaOpzioni, targetSelect, parametroValue, parametroTesto, opzVuota) {
    if (opzVuota) {
        const opzioneVuota = document.createElement('option');
        opzioneVuota.setAttribute('value', null);
        opzioneVuota.innerHTML = '';
        targetSelect.appendChild(opzioneVuota);
    }
    listaOpzioni.forEach(op => {
        const opzioneSel = document.createElement('option');
        opzioneSel.setAttribute('value', `${op[parametroValue]}`);
        opzioneSel.innerHTML = `${op[parametroTesto]}`;
        targetSelect.appendChild(opzioneSel);
    });
}

async function leggiGlossDegradi() {
    try {
        const risultato = await fetch('/o/Main10ance_DB/tabellaDB/glossario/degradi', {method: "GET", headers: {"content-type": "application/json"} });
        const listaGloss = await risultato.json();
        return listaGloss;
    }
    catch(e) {
        console.log('Errore nella lettura del glossario');
        console.log(e);
    }
}

async function leggiSchedeControllo() {
    try {
        const risultato = await fetch('/o/Main10ance_DB/tabellaDB/schede-controllo', {method: "GET", headers: {"content-type": "application/json"} });
        const listaContr = await risultato.json();
        const listaIdMain10ance = trovaIdMain10ance();
        let listaFiltrata = [];
        listaIdMain10ance.forEach(id => {
            listaContr.forEach(contr => {
                if (contr['id_main10ance'].includes(id)) {
                    if (!(listaFiltrata.includes(contr))) {
                        listaFiltrata.push(contr);
                    }
                }
            });
        });
        let listaFinale = [];
        listaFiltrata.forEach(filtr => {
            let ogg = {};
            ogg.scheda = `${filtr['data_con']} - ${filtr['rid_gloss']}`;
            ogg.valore = `${filtr['id_dad']}`;
            ogg.id_main10ance = filtr['id_main10ance'];
            listaFinale.push(ogg);
        });
        return listaFinale;
    }
    catch(e) {
        console.log('Errore nella lettura delle schede di controllo');
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

function trovaIdMain10ance() {
    const listaIdMain10anceGrezza = trovaElementi('modulo-aggiungi-');
    let listaIdMain10ance = [];
    listaIdMain10anceGrezza.forEach(idgr => {
        const idCompleto = idgr.id;
        const idMain10ance = idCompleto.replace('modulo-aggiungi-', '');
        listaIdMain10ance.push(idMain10ance);
    });
    return listaIdMain10ance;
}

function preparaDati(idparziale) {
    const listaInput = trovaElementi(idparziale);
    let listaJSON = [];
    listaInput.forEach(inp => {
        const idCompleto = inp.id;
        let valoreInput;
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
    const operatore = $('[id*="{esecutori}"]')[0];
    const data = $('[id*="{data_con}"]')[0];
    const gloss = $('[id*="{rid_gloss}"]')[0];
    const st_cons = $('[id*="{st_cons}"]')[0];
    if ((!operatore.value) || (operatore.value === 'null') || (!data.value) || (data.value === 'null') || (!gloss.value) || (gloss.value === 'null') || (!st_cons.value) || (st_cons.value === 'null')) {
        return false;
    }
    else {
        return true;
    }
}

function verificaVincoliManutenzioneRestauro(scheda) {
    if ((scheda === 'Manutenzione Ordinaria') || (scheda === 'Manutenzione Correttiva')) {
        const operatore = $('[id*="{esecutori}"]')[0];
        const data = $('[id*="{data_ese}"]')[0];
        const contr = $('[id*="{id_contr}"]')[0];
        if ((!operatore.value) || (operatore.value === 'null') || (!data.value) || (data.value === 'null') || (!contr.value) || (contr.value === 'null')) {
            return false;
        }
        else {
            return true;
        }
    }
    else if (scheda === 'Restauro') {
        const operatore = $('[id*="{operatore}"]')[0];
        const rid_gloss = $('[id*="{rid_gloss}"]')[0];
        if ((!operatore.value) || (operatore.value === 'null') || (!rid_gloss.value) || (rid_gloss.value === 'null')) {
            return false;
        }
        else {
            return true;
        }
    }
}

function verificaVincoliRadioManut() {
    const fenomeno = $('[id*="{rid_gloss}"]')[0];
    const radioOrd = $('[id*="radio-man-ord"]')[0];
    const radioStr = $('[id*="radio-man-str"]')[0];
    const mn_reg = $('[id*="{mn_reg}"]')[0];
    const freq = $('[id*="{frequenza}"]')[0];
    const mn_nec = $('[id*="{mn_nec}"]')[0];
    const urg = $('[id*="{liv_urg}"]')[0];
    if ((fenomeno.value) && (fenomeno.value !== 'null') && (fenomeno.value !== '0 NESSUN FENOMENO')) {
        if ((!radioOrd.checked) && (!radioStr.checked)) {
            return false;
        }
        else if ((radioOrd.checked) && ((!mn_reg.value) || (mn_reg.value === 'null') || (!freq.value) || (freq.value === 'null'))) {
            return false;
        }
        else if ((radioStr.checked) && ((!mn_nec.value) || (mn_nec.value === 'null') || (!urg.value) || (urg.value === 'null'))) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}

function verificaPresenzaIDm10a() {
    if ($(`[id^="modulo-aggiungi-"]`)[0]) {
        return true;
    }
    else {
        return false;
    }
}

async function compilaScheda(jsonReq) {
    try {
        const resp = await fetch(`/o/Main10ance_DB/schede/nuova`, {method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify(jsonReq) });
        const respData = await resp.json();
        return respData;
    }
    catch(e) {
        console.log(e);
    }
}

function preparaDatiNascosti(scheda) {
    let listaJSON = [];
    const listaIdMain10ance = trovaIdMain10ance();
    const idUnivoco = dataInteger();
    const dataIns = dataCorta();
    if (scheda === 'controllo') {
        const contr = 'controllo_stato_di_conservazione_livello_di_urgenza';
        const dad = 'danno_alterazione_degrado';
        const frase = 'frase_di_rischio';
        const id_contr = {tabella: contr, colonna: 'id_id', valore: idUnivoco};
        const id_dad = {tabella: dad, colonna: 'id_id', valore: idUnivoco};
        const id_fr_risc = {tabella: frase, colonna: 'id_id', valore: idUnivoco};
        const data_ins_c = {tabella: contr, colonna: 'data_ins', valore: dataIns};
        const data_ins_d = {tabella: dad, colonna: 'data_ins', valore: dataIns};
        const data_ins_f = {tabella: frase, colonna: 'data_ins', valore: dataIns};
        listaJSON.push(id_contr);
        listaJSON.push(id_dad);
        listaJSON.push(id_fr_risc);
        listaJSON.push(data_ins_c);
        listaJSON.push(data_ins_d);
        listaJSON.push(data_ins_f);
    }
    else if ((scheda === 'Manutenzione Ordinaria') || (scheda === 'Manutenzione Correttiva')) {
        const tab = trovaTabellaIntervento();
        const id_tab = {tabella: tab, colonna: 'id_id', valore: idUnivoco};
        const data_ins_tab = {tabella: tab, colonna: 'data_ins', valore: dataIns};
        const rid_gloss = {tabella: tab, colonna: 'rid_gloss', valore: trovaRidGloss()};
        listaJSON.push(id_tab);
        listaJSON.push(data_ins_tab);
        listaJSON.push(rid_gloss);
    }
    else if (scheda === 'Restauro') {
        const tab = trovaTabellaIntervento();
        const id_tab = {tabella: tab, colonna: 'id_id', valore: idUnivoco};
        const data_ins_tab = {tabella: tab, colonna: 'data_ins', valore: dataIns};
        listaJSON.push(id_tab);
        listaJSON.push(data_ins_tab);
    }
    else if (scheda === 'anagrafica') {
        const tab = 'scheda_anagrafica';
        const utente = localStorage.user_id;
        const id_tab = {tabella: tab, colonna: 'id_id', valore: idUnivoco};
        const data_reg = {tabella: tab, colonna: 'data_registrazione', valore: dataIns};
        const data_mod = {tabella: tab, colonna: 'data_ultima_mod', valore: dataIns};
        const aut_scheda = {tabella: tab, colonna: 'autore_scheda', valore: utente};
        const aut_mod = {tabella: tab, colonna: 'autore_ultima_mod', valore: utente};
        listaJSON.push(id_tab);
        listaJSON.push(data_reg);
        listaJSON.push(data_mod);
        listaJSON.push(aut_scheda);
        listaJSON.push(aut_mod);
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
    listaDati.forEach(d => {
        d.colonne.push('id_main10ance');
        d.valori.push(listaId);
        listaTotaleFiltrata.push(d);
    });
    return listaTotaleFiltrata;
}

function rinominaID(listaOgg) {
    listaOgg.forEach(ogg => {
        const ind = ogg.colonne.indexOf('id_id');
        if (ogg.tabella === 'controllo_stato_di_conservazione_livello_di_urgenza') {
            ogg.colonne[ind] = 'id_contr';
        }
        else if (ogg.tabella === 'danno_alterazione_degrado') {
            ogg.colonne[ind] = 'id_dad';
        }
        else if (ogg.tabella === 'frase_di_rischio') {
            ogg.colonne[ind] = 'id_fr_risc';
        }
        else if (ogg.tabella === 'manutenzione_regolare') {
            ogg.colonne[ind] = 'id_mn_reg';
        }
        else if (ogg.tabella === 'manutenzione_correttiva_o_a_guasto') {
            ogg.colonne[ind] = 'id_mn_gu';
        }
        else if (ogg.tabella === 'restauri') {
            ogg.colonne[ind] = 'id_restaur';
        }
        else if (ogg.tabella === 'scheda_anagrafica') {
            ogg.colonne[ind] = 'id_anagr';
        }
    });
    return listaOgg;
}

function filtraOpzioniGlossario(valore, selectNomeFenomeno, enumGlossario, colonnaTarget) {
    if ((valore) && (valore !== 'null')) {
        let nuovaListaEnum = [];
        enumGlossario.forEach(en => {
            if (en[colonnaTarget] === valore) {
                nuovaListaEnum.push(en);
            }
        });
        selectNomeFenomeno.innerHTML = '';
        creaListaOpzioni(nuovaListaEnum, selectNomeFenomeno, 'id_gloss', 'id_gloss', false);
    }
    else {
        selectNomeFenomeno.innerHTML = '';
        creaListaOpzioni(enumGlossario, selectNomeFenomeno, 'id_gloss', 'id_gloss', true);
    }
}

function filtraOpzioniFenomeno(valore, selectTipoFenomeno, enumGlossario) {
    let valoreDaCercare;
    enumGlossario.every(gls => {
        if (gls['id_gloss'] === valore) {
            valoreDaCercare = gls['gloss_ty'];
            return false;
        }
        else {
            return true;
        }
    });
    if ((valoreDaCercare) && (valoreDaCercare !== 'nessuno')) {
        selectTipoFenomeno.value = valoreDaCercare;
    }
    else {
        selectTipoFenomeno.value = null;
    }
}

function filtraOpzioniMateriale(valore, selectMateriale, enumGlossario) {
    let valoreDaCercare;
    enumGlossario.every(gls => {
        if (gls['id_gloss'] === valore) {
            valoreDaCercare = gls['materiale'];
            return false;
        }
        else {
            return true;
        }
    });
    if ((valoreDaCercare) && (valoreDaCercare !== 'nessuno')) {
        selectMateriale.value = valoreDaCercare;
    }
    else {
        selectMateriale.value = null;
    }
}

// async function creaPDF(listaIdMain10ance, listaDatiNascosti, contr_manut) {
//     const stringaID = listaIdMain10ance.join('-');
//     let idUnivoco;
//     listaDatiNascosti.every(ls => {
//         if (ls['colonna'] === 'id_id') {
//             idUnivoco = ls['valore'];
//             return false;
//         }
//         else {
//             return true;
//         }
//     });
//     let pdf = new jsPDF({
//         orientation: 'l',
//         unit: 'mm',
//         format: 'a4'
//     });
//     const nomeFile = `${contr_manut}_${stringaID}_${idUnivoco}.pdf`;
//     pdf.setProperties({
//         title: nomeFile
//     });
//     pdf.setFontSize(14);

//     const idCanvasScheda = contr_manut.toLowerCase();
//     const canvasScheda = await html2canvas($(`#${idCanvasScheda}`)[0]);
//     const immagineScheda = await canvasScheda.toDataURL("image/png");
//     const canvasForge = document.getElementsByTagName('canvas')[0];
//     const canvasViewer = await html2canvas(canvasForge);
//     const immagineViewer = await canvasViewer.toDataURL("image/png");

//     pdf.text(5, 10, `ID ELEMENTO: ${stringaID}`);
//     pdf.text(5, 20, `ID RECORD: ${idUnivoco}`);
//     pdf.addImage(immagineViewer, 'PNG', 5, 30, 148, 135);
//     pdf.addImage(immagineScheda, 'PNG', 148, 30);

//     const fileCreato = pdf.output('bloburl', {filename: nomeFile});
//     window.open(fileCreato, '_blank');

//     // pdf.text(20, 20, 'PROVA PROVA');
//     // pdf.addPage();
//     // pdf.text(30, 30, 'PROVA PROVA PAG 2');

//     // let specialElementHandlers = {}

//     // pdf.fromHTML($('#scheda-controllo').get(0), {
//     //     elementHandlers: specialElementHandlers
//     // });

//     // pdf.fromHTML($('#scheda-controllo').get(0), 20, 20);

//     // pdf.save(nomeFile);
//     // const fileCreato = pdf.output('bloburl', {filename: nomeFile}); // QUESTO
//     // const stringaEmbed = `<embed type="application/pdf" src="${fileCreato}" width="1000" height="1000">`;
//     // window.open(fileCreato, '_blank'); // QUESTO

//     // let stringaFile = pdf.output('datauristring');
//     // let iframeFile = "<iframe width='100%' height='100%' src='" + stringaFile + "'></iframe>"
//     // let wOp = window.open();
//     // wOp.document.open();
//     // wOp.document.write(stringaEmbed);
//     // wOp.document.close();
// }

function trovaRidGloss() {
    const elemento = $('[id*="{id_contr}"]')[0];
    const opzioneSelezionata = elemento.selectedOptions[0];
    const stringaGrezza = opzioneSelezionata.innerHTML;
    const ridGloss = stringaGrezza.split(' - ')[1];
    return ridGloss;
}

function trovaTabellaIntervento() {
    const elemento = $('[id^="scheda-intervento-"]')[0];
    const idElemento = elemento.id;
    const tabellaElemento = idElemento.match(/\[(.*)\]/).pop();
    return tabellaElemento;
}

async function creaPDF2(listaIdMain10ance, listaDatiNascosti, contr_manut) {
    const stringaID = listaIdMain10ance.join(', ');
    let idUnivoco;
    listaDatiNascosti.every(ls => {
        if (ls['colonna'] === 'id_id') {
            idUnivoco = ls['valore'];
            return false;
        }
        else {
            return true;
        }
    });

    const idScheda = contr_manut.toLowerCase();
    const titoloScheda = contr_manut.replace('-', ' ');
    const schedaFull = document.getElementById(idScheda);
    const schedaChildren = schedaFull.getElementsByTagName('*');
    let listaPulita = [];
    schedaChildren.forEach(el => {
        if ((el.tagName !== 'BR') && (el.tagName !== 'B') && (el.tagName !== 'OPTION') && (el.tagName !== 'DIV') && (el.type !== 'radio')) {
            listaPulita.push(el);
        }
    });
    let listaStringhe = [];
    let listaCoppieValori = [];
    for (let n=0; n<listaPulita.length; n++) {
        let tag = listaPulita[n].tagName;
        if ((tag === 'LABEL') || (tag === 'H4')) {
            let testo = listaPulita[n].innerText;
            listaStringhe.push(testo);
            if (tag === 'LABEL') {
                let coppia = {pos: "sx", txt: testo};
                listaCoppieValori.push(coppia);
            }
            else {
                let coppia = {pos: "sx", txt: testo};
                let coppia2 = {pos: "dx", txt: ""};
                listaCoppieValori.push(coppia);
                listaCoppieValori.push(coppia2);
            }
        }
        else {
            let valore = listaPulita[n].value;
            if ((!valore) || (valore === 'null')) {
                valore = '';
            }
            listaStringhe.push(valore);
            let coppia = {pos: "dx", txt: valore};
            listaCoppieValori.push(coppia);
        }
    }

    let pdf = new jsPDF({
        orientation: 'l',
        unit: 'mm',
        format: 'a3'
    });
    const nomeFile = `${contr_manut}_${idUnivoco}.pdf`;
    pdf.setProperties({
        title: nomeFile
    });
    pdf.setFontSize(24);

    let titoloDoc = titoloScheda;

    pdf.text(10, 10, titoloDoc);

    const canvasForge = document.getElementsByTagName('canvas')[0];
    const canvasViewer = await html2canvas(canvasForge);
    const immagineViewer = await canvasViewer.toDataURL("image/png");
    let xImg = 10;
    let yImg = 20;
    let lImg = (420/2)-(xImg*2);
    let hImg = lImg;
    pdf.addImage(immagineViewer, 'PNG', xImg, yImg, lImg, hImg);

    let yRect = yImg;
    let xRect = (420/2)+0;
    let lRect = 200;
    let hRect = hImg;
    let coloreFill;
    if (contr_manut === 'SCHEDA-CONTROLLO') {
        coloreFill = '#a5e09b';
    }
    else if (contr_manut === 'SCHEDA-ANAGRAFICA') {
        coloreFill = '#e8d776';
    }
    else {
        coloreFill = '#9bb7e0';
    }
    pdf.setFillColor(coloreFill);
    pdf.rect(xRect, yRect, lRect, hRect, "F");

    pdf.setFontSize(14);
    let yTxt = 30;
    listaCoppieValori.forEach(cpp => {
        if (cpp.pos === 'sx') {
            pdf.text(xRect+5, yTxt, cpp.txt);
        }
        else {
            pdf.text(xRect+100, yTxt, cpp.txt);
            yTxt += 10;
        }
    });

    pdf.text(xImg, hImg+40, 'Elementi:');
    pdf.text(xImg, hImg+50, stringaID, {maxWidth: 400});

    const fileCreato = pdf.output('bloburl', {filename: nomeFile});
    window.open(fileCreato, '_blank');
}

function nascondiBottoniSchede() {
    apriTabAnagrafica.style.display = 'none';
    apriTabControllo.style.display = 'none';
    apriTabIntervento.style.display = 'none';
    schedaAnagrafica.style.display = 'none';
    schedaControllo.style.display = 'none';
    schedaIntervento.style.display = 'none';
    bottoneSalvaSchedaAnagrafica.style.display = 'none';
    bottoneSalvaSchedaControllo.style.display = 'none';
    bottoneSalvaSchedaIntervento.style.display = 'none';
    bottoneChiudiSchede.style.display = 'none';
    if (document.getElementById('apriPDF')) {
        document.getElementById('apriPDF').remove();
    }
}

function moltiplicaSchede(listaDati, listaId) {
    let listaTotaleFiltrata = [];
    listaId.forEach((id, ind) => {
        let dCopia = JSON.parse(JSON.stringify(listaDati[0]));
        dCopia.colonne.push('id_main10ance');
        dCopia.valori.push(id);
        const indiceID = dCopia.colonne.indexOf('id_id');
        dCopia.valori[indiceID] += ind;
        listaTotaleFiltrata.push(dCopia);
    });
    return listaTotaleFiltrata;
}

async function verificaPresenzaSchedaAnagrafica() {
    const listaIdM10A = trovaIdMain10ance();
    const schedeAn = await prendiSchedeAnagrafica();
    const listaSchedati = schedeAn.map(sc => (sc['Elemento schedato']));
    const idGiaSchedati = listaIdM10A.filter(sc => (listaSchedati.includes(sc)));
    return idGiaSchedati.length;
}

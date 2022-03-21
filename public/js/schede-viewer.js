"use strict";

const tabContenitoreSchede = document.getElementById('tabSchede');
const divContenitoreSchede = document.getElementById('contenitore-schede');
const aggiornaSchedeStart = document.getElementById('refreshSchede');
const contenitoreFiltriSchede = document.getElementById('pannello-lat-schede-body');
const listaCheckboxSchede = contenitoreFiltriSchede.getElementsByClassName('filtro-schede');
const checkGenerale = document.getElementById('check-generale');
const selezionaTutto = document.getElementById('vedi-schede-tutto');
const selezionaNulla = document.getElementById('vedi-schede-nulla');
const checkTipoScheda = document.getElementById('check-tipo-scheda');
const selectTipoScheda = document.getElementById('select-tipo-scheda');
const checkSacroMonte = document.getElementById('check-sacro-monte');
const selectSacroMonte = document.getElementById('select-sacro-monte');
const checkCappella = document.getElementById('check-cappella');
const selectCappella = document.getElementById('select-cappella');
const checkElemento = document.getElementById('check-elemento');
const selectElemento = document.getElementById('select-elemento');
const checkStatoCons = document.getElementById('check-stato-conservazione');
const selectStatoCons = document.getElementById('select-stato-conservazione');
const checkFenomeno = document.getElementById('check-fenomeno');
const selectFenomeno = document.getElementById('select-fenomeno');
const checkData = document.getElementById('check-data');
const inputDataDa = document.getElementById('input-data-da');
const inputDataA = document.getElementById('input-data-a');

let listaSigleNumericheCappelle;

divContenitoreSchede.innerHTML = '';

(() => {
    if ((localStorage.bim_vw_sets) && (localStorage.bim_vw_sets === '7-5')) {
        visualizzaSchedeStart();

        popolaSelectSacriMonti();
        popolaSelectElementi();
        popolaSelectFenomeno();
        popolaSelectStatoCons();
        popolaListaSigleNumCapp();
    }
})();

function visualizzaSchedeStart() {
    divContenitoreSchede.innerHTML = '';
    // compilaTabelleControllo();
    // compilaTabelleManReg();
    // compilaTabelleManCorr();
    // compilaTabelleRestauro();
    // compilaTabelleControlloProg();

    if (checkGenerale.checked) {
        checkGenerale.click();
    }
};

async function popolaListaSigleNumCapp() {
    listaSigleNumericheCappelle = await prendiSigleNumericheCappelle();
}

aggiornaSchedeStart.addEventListener('click', visualizzaSchedeStart);

checkGenerale.addEventListener('change', () => {
    const listaSelect = contenitoreFiltriSchede.getElementsByTagName('select');
    const listaInput = contenitoreFiltriSchede.getElementsByTagName('input');
    if (checkGenerale.checked) {
        listaCheckboxSchede.forEach(cbx => {
            cbx.disabled = false;
        });
        selezionaTutto.disabled = false;
        selezionaTutto.classList.toggle('vedi-schede');
        selezionaTutto.classList.toggle('vedi-schede-disatt');
        selezionaNulla.disabled = false;
        selezionaNulla.classList.toggle('vedi-schede');
        selezionaNulla.classList.toggle('vedi-schede-disatt');

        filtraViewSchede();
    }
    else {
        listaCheckboxSchede.forEach(cbx => {
            cbx.disabled = true;
        });
        selezionaTutto.disabled = true;
        selezionaTutto.classList.toggle('vedi-schede');
        selezionaTutto.classList.toggle('vedi-schede-disatt');
        selezionaNulla.disabled = true;
        selezionaNulla.classList.toggle('vedi-schede');
        selezionaNulla.classList.toggle('vedi-schede-disatt');
        filtraVediTutto();
    }
});

selezionaTutto.addEventListener('click', () => {
    // filtraVediTutto();
    spuntaTuttoNiente(true);
});
selezionaNulla.addEventListener('click', () => {
    // filtraVediNulla();
    spuntaTuttoNiente(false);
});

checkTipoScheda.addEventListener('change', () => {
    if ((!checkTipoScheda.checked) && (checkStatoCons.checked)) {
        checkStatoCons.checked = false;
    }
    filtraViewSchede();
});
selectTipoScheda.addEventListener('change', () => {
    if (checkTipoScheda.checked) {
        filtraViewSchede();
    }
});

checkSacroMonte.addEventListener('change', filtraViewSchede);
selectSacroMonte.addEventListener('change', () => {
    if (checkSacroMonte.checked) {
        filtraViewSchede();
    }
});

checkCappella.addEventListener('change', filtraViewSchede);
selectCappella.addEventListener('change', () => {
    if (checkCappella.checked) {
        filtraViewSchede();
    }
});

checkElemento.addEventListener('change', filtraViewSchede);
selectElemento.addEventListener('change', () => {
    if (checkElemento.checked) {
        filtraViewSchede();
    }
});

checkStatoCons.addEventListener('change', () => {
    selectTipoScheda.value = 'scheda controllo';
    if (!checkTipoScheda.checked) {
        checkTipoScheda.click();
    }
    filtraViewSchede();
});
selectStatoCons.addEventListener('change', () => {
    if (checkStatoCons.checked) {
        filtraViewSchede();
    }
});

checkFenomeno.addEventListener('change', filtraViewSchede);
selectFenomeno.addEventListener('change', () => {
    if (checkFenomeno.checked) {
        filtraViewSchede();
    }
});

checkData.addEventListener('change', filtraViewSchede);
inputDataDa.addEventListener('change', () => {
    if (checkData.checked) {
        filtraViewSchede();
    }
});
inputDataA.addEventListener('change', () => {
    if (checkData.checked) {
        filtraViewSchede();
    }
});

selectSacroMonte.addEventListener('change', () => {
    selectCappella.innerHTML = '';
    listaSigleNumericheCappelle.forEach(s => {
        if (s.località === selectSacroMonte.value) {
            const opz = document.createElement('option');
            opz.setAttribute('value', s.numero);
            opz.innerHTML = s.nome;
            selectCappella.appendChild(opz);
        }
    });
});

function creaStrutturaSchede() {
    const cardSchede = document.createElement('div');
    cardSchede.className = 'au-card m-b-30';
    // cardSchede.style.paddingLeft = '5px';
    // cardSchede.style.paddingRight = '15px';

    const tabellaSchede = document.createElement('table');
    // tabellaSchede.setAttribute('id', 'tabella-schede');
    tabellaSchede.className = 'schede tabella-schede';
    const captionSchede = document.createElement('caption');
    // captionSchede.setAttribute('id', 'caption-schede');
    captionSchede.className = 'schede caption-schede';
    captionSchede.addEventListener('click', async () => {
        const [idScheda, schedaTarget, stringaIdMain10ance] = await apriModelloDaScheda.bind(captionSchede)();
        mostraModuloSchedaControllo(idScheda, schedaTarget, stringaIdMain10ance);
    });
    // captionSchede.innerHTML = ``;

    tabellaSchede.appendChild(captionSchede);

    cardSchede.appendChild(tabellaSchede);

    // divContenitoreSchede.appendChild(tabellaSchede);
    divContenitoreSchede.appendChild(cardSchede);

    return [tabellaSchede, captionSchede];
}

async function compilaTabelleControllo() {
    const listaSchedeControlloComplete = await prendiSchedeControllo();
    listaSchedeControlloComplete.forEach(scheda => {
        const [tabellaSchede, captionSchede] = creaStrutturaSchede();
        tabellaSchede.setAttribute('id', `${scheda["Codice scheda controllo"]}`);
        captionSchede.innerHTML = `<b>SCHEDA CONTROLLO N. ${scheda["Codice scheda controllo"]}</b>`;
        captionSchede.classList.add('caption-schede-c');
        for (const [chiave, valore] of Object.entries(scheda)) {
            const trScheda = document.createElement('tr');
            trScheda.className = 'schede tr-schede-c';
            const tdChiave = document.createElement('td');
            tdChiave.innerHTML = `<b>${chiave}</b>`;
            tdChiave.style.width = '400px';
            tdChiave.className = 'schede td-schede-c';
            const tdValore = document.createElement('td');
            if ((!valore) || (valore === 'null')) {
                tdValore.innerHTML = `<i>Nessun valore</i>`;
            }
            else if (chiave === 'Elementi controllati') {
                const [tabDetails, detailsDiv] = creaDetailsElementi();
                detailsDiv.innerText = valore.join(', ');
                tdValore.appendChild(tabDetails);
            }
            else {
                tdValore.innerHTML = `${valore}`;
            }
            tdValore.className = 'schede td-schede-c';
            tdValore.setAttribute('id', `[${chiave.replaceAll(' ', '')}]{${scheda["Codice scheda controllo"]}}`);
            trScheda.appendChild(tdChiave);
            trScheda.appendChild(tdValore);
            tabellaSchede.appendChild(trScheda);
        }
        tabellaSchede.appendChild(document.createElement('br'));
    });
}

async function compilaTabelleManReg() {
    const listaSchedeManRegComplete = await prendiSchedeManReg();
    listaSchedeManRegComplete.forEach(scheda => {
        const [tabellaSchede, captionSchede] = creaStrutturaSchede();
        tabellaSchede.setAttribute('id', `${scheda["Codice scheda manutenzione regolare"]}`);
        captionSchede.innerHTML = `<b>SCHEDA MANUTENZIONE ORDINARIA N. ${scheda["Codice scheda manutenzione regolare"]}</b>`;
        captionSchede.classList.add('caption-schede-mr-mc-r');
        for (const [chiave, valore] of Object.entries(scheda)) {
            const trScheda = document.createElement('tr');
            trScheda.className = 'schede tr-schede-mr-mc-r';
            const tdChiave = document.createElement('td');
            tdChiave.innerHTML = `<b>${chiave}</b>`;
            tdChiave.style.width = '400px';
            tdChiave.className = 'schede td-schede-mr-mc-r';
            const tdValore = document.createElement('td');
            if ((!valore) || (valore === 'null')) {
                tdValore.innerHTML = `<i>Nessun valore</i>`;
            }
            else if (chiave === 'Elementi interessati') {
                const [tabDetails, detailsDiv] = creaDetailsElementi();
                detailsDiv.innerText = valore.join(', ');
                tdValore.appendChild(tabDetails);
            }
            else {
                tdValore.innerHTML = `${valore}`;
            }
            tdValore.className = 'schede td-schede-mr-mc-r';
            tdValore.setAttribute('id', `[${chiave.replaceAll(' ', '')}]{${scheda["Codice scheda manutenzione regolare"]}}`);
            trScheda.appendChild(tdChiave);
            trScheda.appendChild(tdValore);
            tabellaSchede.appendChild(trScheda);
        }
        tabellaSchede.appendChild(document.createElement('br'));
    });
}

async function compilaTabelleManCorr() {
    const listaSchedeManCorrComplete = await prendiSchedeManCorr();
    listaSchedeManCorrComplete.forEach(scheda => {
        const [tabellaSchede, captionSchede] = creaStrutturaSchede();
        tabellaSchede.setAttribute('id', `${scheda["Codice scheda manutenzione correttiva"]}`);
        captionSchede.innerHTML = `<b>SCHEDA MANUTENZIONE CORRETTIVA N. ${scheda["Codice scheda manutenzione correttiva"]}</b>`;
        captionSchede.classList.add('caption-schede-mr-mc-r');
        for (const [chiave, valore] of Object.entries(scheda)) {
            const trScheda = document.createElement('tr');
            trScheda.className = 'schede tr-schede-mr-mc-r';
            const tdChiave = document.createElement('td');
            tdChiave.innerHTML = `<b>${chiave}</b>`;
            tdChiave.style.width = '400px';
            tdChiave.className = 'schede td-schede-mr-mc-r';
            const tdValore = document.createElement('td');
            if ((!valore) || (valore === 'null')) {
                tdValore.innerHTML = `<i>Nessun valore</i>`;
            }
            else if (chiave === 'Elementi interessati') {
                const [tabDetails, detailsDiv] = creaDetailsElementi();
                detailsDiv.innerText = valore.join(', ');
                tdValore.appendChild(tabDetails);
            }
            else {
                tdValore.innerHTML = `${valore}`;
            }
            tdValore.className = 'schede td-schede-mr-mc-r';
            tdValore.setAttribute('id', `[${chiave.replaceAll(' ', '')}]{${scheda["Codice scheda manutenzione correttiva"]}}`);
            trScheda.appendChild(tdChiave);
            trScheda.appendChild(tdValore);
            tabellaSchede.appendChild(trScheda);
        }
        tabellaSchede.appendChild(document.createElement('br'));
    });
}

async function compilaTabelleRestauro() {
    const listaSchedeRestauroComplete = await prendiSchedeRestauro();
    listaSchedeRestauroComplete.forEach(scheda => {
        const [tabellaSchede, captionSchede] = creaStrutturaSchede();
        tabellaSchede.setAttribute('id', `${scheda["Codice scheda restauro"]}`);
        captionSchede.innerHTML = `<b>SCHEDA RESTAURO N. ${scheda["Codice scheda restauro"]}</b>`;
        captionSchede.classList.add('caption-schede-mr-mc-r');
        for (const [chiave, valore] of Object.entries(scheda)) {
            const trScheda = document.createElement('tr');
            trScheda.className = 'schede tr-schede-mr-mc-r';
            const tdChiave = document.createElement('td');
            tdChiave.innerHTML = `<b>${chiave}</b>`;
            tdChiave.style.width = '400px';
            tdChiave.className = 'schede td-schede-mr-mc-r';
            const tdValore = document.createElement('td');
            if ((!valore) || (valore === 'null')) {
                tdValore.innerHTML = `<i>Nessun valore</i>`;
            }
            else if (chiave === 'Elementi interessati') {
                const [tabDetails, detailsDiv] = creaDetailsElementi();
                detailsDiv.innerText = valore.join(', ');
                tdValore.appendChild(tabDetails);
            }
            else {
                tdValore.innerHTML = `${valore}`;
            }
            tdValore.className = 'schede td-schede-mr-mc-r';
            tdValore.setAttribute('id', `[${chiave.replaceAll(' ', '')}]{${scheda["Codice scheda restauro"]}}`);
            trScheda.appendChild(tdChiave);
            trScheda.appendChild(tdValore);
            tabellaSchede.appendChild(trScheda);
        }
        tabellaSchede.appendChild(document.createElement('br'));
    });
}

async function prendiUrn(jsonReq) {
    const risultato = await fetch('/o/DB_Servizio/LOD/UrnEdifici', {method: "GET", headers: {"content-type": "application/json", "sm": jsonReq.sm, "capp": jsonReq.capp}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function prendiSigleNumericheCappelle() {
    const risultato = await fetch('/t/DB_Servizio/MarkerEdif', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function prendiLOD3e4() {
    const risultato = await fetch('/o/DB_Servizio/LOD/3e4', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

function filtraSchedeDaID(idScheda) {
    const insiemeTabelle = document.querySelectorAll('.tabella-schede');
    const listaTabelle = [...insiemeTabelle];
    const listaCards = listaTabelle.map(card => (card.parentNode));
    listaCards.forEach(tab => {
        if (tab.firstElementChild.id === idScheda) {
            tab.style.display = 'block';
        }
        else {
            tab.style.display = 'none';
        }
    });
}

function filtraVediTutto() {
    const insiemeTabelle = document.querySelectorAll('.tabella-schede');
    const listaTabelle = [...insiemeTabelle];
    const listaCards = listaTabelle.map(card => (card.parentNode));
    listaCards.forEach(tab => {
        tab.style.display = 'block';
    });
}

function filtraVediNulla() {
    const insiemeTabelle = document.querySelectorAll('.tabella-schede');
    const listaTabelle = [...insiemeTabelle];
    const listaCards = listaTabelle.map(card => (card.parentNode));
    listaCards.forEach(tab => {
        tab.style.display = 'none';
    });
}

function spuntaTuttoNiente(tutto) {
    if (tutto) {
        listaCheckboxSchede.forEach(cbx => {
            if (cbx.checked) {
                return;
            }
            else {
                cbx.click();
            }
        });
    }
    else {
        listaCheckboxSchede.forEach(cbx => {
            if (cbx.checked) {
                cbx.click();
            }
            else {
                return;
            }
        });
    }
}

function filtraSchedeConManRest(filtro) {
    const insiemeTabelle = document.querySelectorAll('.tabella-schede');
    insiemeTabelle.forEach(tab => {
        const caption = tab.getElementsByTagName('caption')[0];
        if (caption.innerText.startsWith(filtro)) {
            tab.style.display = 'table';
        }
    });
}

async function apriModelloDaScheda() {
    const stringaCaption = this.innerText;
    const stringaPulita = stringaCaption.split('.')[1].replaceAll(' ', '');
    const tabellaCliccata = document.getElementById(stringaPulita);
    const tdTarget = tabellaCliccata.querySelectorAll('[id^="[id_main10ance"]')[0].children[0].children[1];
    const stringaIdMain10ance = tdTarget.innerText;
    const sacroMonteDaCercare = stringaIdMain10ance.split('|')[0];
    const cappellaDaCercare = stringaIdMain10ance.split('|')[1].split('-')[0];
    let jsonPerUrn = {};
    jsonPerUrn.sm = sacroMonteDaCercare;
    jsonPerUrn.capp = cappellaDaCercare;
    const urnRes = await prendiUrn(jsonPerUrn);
    const urn = await urnRes.urn;
    const conferma = confirm('Visualizzare gli elementi nel BIM Viewer?');
    if (conferma) {
        document.getElementById('apriTabBIM').click();
        launchViewer(urn, () => {
            cercaElementiDaScheda(stringaIdMain10ance);
        });
    }
    return [stringaPulita, tabellaCliccata, stringaIdMain10ance];
}

async function cercaElementiDaScheda(strID) {
    const listaID = strID.split(',');
    const listaElems = await Promise.all(listaID.map(async id => (await ricercaIdM10A(id))));
    viewer.isolate(listaElems);
    viewer.select(listaElems);
    viewer.fitToView();
}

async function popolaSelectSacriMonti() {
    const listaSigleSM = await prendiSigleSacriMonti();
    listaSigleSM.forEach(sgl => {
        const opz = document.createElement('option');
        opz.setAttribute('value', sgl.sigla);
        opz.innerHTML = sgl.nome;
        selectSacroMonte.appendChild(opz);
    });
}

async function popolaSelectElementi() {
    const listaElementi = await prendiLOD3e4();
    listaElementi.forEach(el => {
        const opz = document.createElement('option');
        opz.setAttribute('value', el.tabella);
        opz.innerHTML = el.alias;
        selectElemento.appendChild(opz);
    });
}

async function popolaSelectFenomeno() {
    const listaFenomeni = await leggiGlossDegradi();
    listaFenomeni.forEach(f => {
        const opz = document.createElement('option');
        opz.setAttribute('value', f.id_gloss);
        opz.innerHTML = f.id_gloss;
        selectFenomeno.appendChild(opz);
    });
}

async function popolaSelectStatoCons() {
    const listaStatiCons = await leggiEnum('st_cons');
    listaStatiCons.forEach(st => {
        const opz = document.createElement('option');
        opz.setAttribute('value', st.unnest);
        opz.innerHTML = st.unnest;
        selectStatoCons.appendChild(opz);
    });
}

function verificaFiltriSchede(tabella) {
    if (checkTipoScheda.checked) {
        const tipoSchedaTarget = selectTipoScheda.value.toUpperCase();
        const captionTarget = tabella.getElementsByTagName('caption')[0];
        if (!(captionTarget.innerText.startsWith(tipoSchedaTarget))) {
            return false;
        }
    }
    if (checkSacroMonte.checked) {
        const sacroMonteTarget = selectSacroMonte.value;
        let cellTarget;
        tabella.rows.forEach(r => {
            if (r.cells[0].innerText.startsWith('id_main10ance')) {
                cellTarget = r.cells[1].children[0].children[1].innerText.split('|')[0];
            }
        });
        if (!(sacroMonteTarget === cellTarget)) {
            return false;
        }
    }
    if (checkCappella.checked) {
        const cappellaTarget = selectCappella.value;
        let cellTarget;
        tabella.rows.forEach(r => {
            if (r.cells[0].innerText.startsWith('id_main10ance')) {
                let listaNumeriCapp = [];
                const listaIdM10a = r.cells[1].children[0].children[1].innerText.split(',');
                listaIdM10a.forEach(id => {
                    let listaCappelleDaId = id.split('|')[1].split('-');
                    listaNumeriCapp.push(...listaCappelleDaId);
                });
                cellTarget = [... new Set(listaNumeriCapp)];
            }
        });
        if (!(cellTarget.includes(cappellaTarget))) {
            return false;
        }
    }
    if (checkElemento.checked) {
        const elementoTarget = selectElemento.value;
        let cellTarget;
        tabella.rows.forEach(r => {
            if (r.cells[0].innerText.startsWith('id_main10ance')) {
                let listaElementi = [];
                const listaIdM10a = r.cells[1].children[0].children[1].innerText.split(',');
                listaIdM10a.forEach(id => {
                    let listaElementiDaId = id.split('|')[2].split('-');
                    listaElementi.push(...listaElementiDaId);
                });
                cellTarget = [... new Set(listaElementi)];
            }
        });
        if (!(cellTarget.includes(elementoTarget))) {
            return false;
        }
    }
    if (checkStatoCons.checked) {
        const statoConsTarget = selectStatoCons.value;
        let cellTarget;
        tabella.rows.forEach(r => {
            if (r.cells[0].innerText === 'Stato di conservazione') {
                cellTarget = r.cells[1].innerText;
            }
        });
        if (!(statoConsTarget === cellTarget)) {
            return false;
        }
    }
    if (checkFenomeno.checked) {
        const fenomenoTarget = selectFenomeno.value;
        let cellTarget;
        tabella.rows.forEach(r => {
            if ((r.cells[0].innerText === 'Nome fenomeno') || (r.cells[0].innerText === 'Fenomeno interessato')) {
                cellTarget = r.cells[1].innerText;
            }
        });
        if (!(fenomenoTarget === cellTarget)) {
            return false;
        }
    }
    if (checkData.checked) {
        const dataTargetDa = inputDataDa.value;
        const dataTargetA = inputDataA.value;
        const tipoScheda = tabella.getElementsByTagName('caption')[0].innerText;
        if (tipoScheda.startsWith('SCHEDA RESTAURO')) {
            let targetI;
            let targetF;
            tabella.rows.forEach(r => {
                if (r.cells[0].innerText === 'Anno inizio') {
                    targetI = r.cells[1].innerText;
                }
                if (r.cells[0].innerText === 'Anno fine') {
                    targetF = r.cells[1].innerText;
                }
            });
            const annoITarget = new Date(dataTargetDa).getFullYear();
            const annoFTarget = new Date(dataTargetA).getFullYear();
            if (!((annoITarget <= parseInt(targetI)) && (parseInt(targetF) <= annoFTarget))) {
                return false;
            }
        }
        else {
            let cellTarget;
            tabella.rows.forEach(r => {
                if ((r.cells[0].innerText === 'Data controllo') || (r.cells[0].innerText === 'Data intervento')) {
                    cellTarget = r.cells[1].innerText;
                }
            });
            if (!((confrontaDate(dataTargetDa, cellTarget)) && (confrontaDate(cellTarget, dataTargetA)))) {
                return false;
            }
        }
    }
    return true;
}

function filtraViewSchede() {
    const insiemeTabelle = document.querySelectorAll('.tabella-schede');
    insiemeTabelle.forEach(tab => {
        const verifica = verificaFiltriSchede(tab);
        if (verifica) {
            tab.parentNode.style.display = 'block';
        }
        else {
            tab.parentNode.style.display = 'none';
        }
    });
}

function creaDetailsElementi() {
    const det = document.createElement('details');
    const sum = document.createElement('summary');
    const divDet = document.createElement('div');
    sum.className = 'sommario-main10ance';
    sum.innerHTML = '<b>ESPANDI</b>';
    det.addEventListener('click', () => {
        if (det.open) {
            sum.innerHTML = '<b>ESPANDI</b>';
        }
        else {
            sum.innerHTML = '<b>CHIUDI</b>';
        }
    });
    det.appendChild(sum);
    det.appendChild(divDet);
    return [det, divDet];
}

async function compilaTabelleControlloProg() {
    const datiControllo = await recuperaDatiControlliProg();
    datiControllo.forEach(scheda => {
        const [tabellaSchede, captionSchede] = creaStrutturaSchede();
        tabellaSchede.setAttribute('id', `${scheda.id}`);
        captionSchede.innerHTML = `<b>SCHEDA DI RISCHIO N. ${scheda.id}</b>`;
        captionSchede.classList.add('caption-schede-c');
        for (const [chiave, valore] of Object.entries(scheda)) {
            const trScheda = document.createElement('tr');
            trScheda.className = 'schede tr-schede-c';
            const tdChiave = document.createElement('td');
            tdChiave.innerHTML = `<b>${chiave}</b>`;
            tdChiave.style.width = '400px';
            tdChiave.className = 'schede td-schede-c';
            const tdValore = document.createElement('td');
            if ((!valore) || (valore === 'null')) {
                tdValore.innerHTML = `<i>Nessun valore</i>`;
            }
            else if (chiave === 'id_main10ance') {
                const [tabDetails, detailsDiv] = creaDetailsElementi();
                detailsDiv.innerText = valore.join(', ');
                tdValore.appendChild(tabDetails);
            }
            else {
                tdValore.innerHTML = `${valore}`;
            }
            tdValore.className = 'schede td-schede-c';
            tdValore.setAttribute('id', `[${chiave.replaceAll(' ', '')}]{${scheda.id}}`);
            trScheda.appendChild(tdChiave);
            trScheda.appendChild(tdValore);
            tabellaSchede.appendChild(trScheda);
        }
        tabellaSchede.appendChild(document.createElement('br'));
    });
}

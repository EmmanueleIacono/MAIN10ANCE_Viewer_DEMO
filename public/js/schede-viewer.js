const tabContenitoreSchede = document.getElementById('tabSchede');
const divContenitoreSchede = document.getElementById('contenitore-schede');
const aggiornaSchedeStart = document.getElementById('refreshSchede');
const contenitoreFiltriSchede = document.getElementById('pannello-lat-schede-body');
const checkGenerale = document.getElementById('check-generale');
const visualizzaTutto = document.getElementById('vedi-schede-tutto');
const visualizzaNulla = document.getElementById('vedi-schede-nulla');
const checkControllo = document.getElementById('check-controllo');
const checkManReg = document.getElementById('check-man-reg');
const checkManCorr = document.getElementById('check-man-corr');
const checkRestauro = document.getElementById('check-restauro');
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
const checkMateriale = document.getElementById('check-materiale');
const selectMateriale = document.getElementById('select-materiale');
const checkData = document.getElementById('check-data');
const inputDataDa = document.getElementById('input-data-da');
const inputDataA = document.getElementById('input-data-a');

divContenitoreSchede.innerHTML = '';

// const tabellaSchede = creaStrutturaSchede();
// azioniPreliminari();
visualizzaSchedeStart();

function visualizzaSchedeStart() {
    divContenitoreSchede.innerHTML = '';
    compilaTabelleControllo();
    compilaTabelleManReg();
    compilaTabelleManCorr();
    compilaTabelleRestauro();
};

aggiornaSchedeStart.addEventListener('click', visualizzaSchedeStart);

checkGenerale.addEventListener('change', () => {
    const listaCheckbox = contenitoreFiltriSchede.getElementsByClassName('filtro-schede');
    const listaSelect = contenitoreFiltriSchede.getElementsByTagName('select');
    const listaInput = contenitoreFiltriSchede.getElementsByTagName('input');
    if (checkGenerale.checked) {
        listaCheckbox.forEach(cbx => {
            cbx.disabled = false;
        });
    }
    else {
        listaCheckbox.forEach(cbx => {
            cbx.disabled = true;
        });
        listaSelect.forEach(sl => {
            sl.disabled = true;
        });
        listaInput.forEach(inp => {
            if (inp.type === 'date') {
                inp.disabled = true;
            }
        });
        filtraVediTutto();
    }
});

visualizzaTutto.addEventListener('click', filtraVediTutto);
visualizzaNulla.addEventListener('click', filtraVediNulla);

checkSacroMonte.addEventListener('change', () => {
    if (checkSacroMonte.checked) {
        selectSacroMonte.disabled = false;
    }
    else {
        selectSacroMonte.disabled = true;
    }
});

checkCappella.addEventListener('change', () => {
    if (checkCappella.checked) {
        selectCappella.disabled = false;
    }
    else {
        selectCappella.disabled = true;
    }
});

checkElemento.addEventListener('change', () => {
    if (checkElemento.checked) {
        selectElemento.disabled = false;
    }
    else {
        selectElemento.disabled = true;
    }
});

checkStatoCons.addEventListener('change', () => {
    if (checkStatoCons.checked) {
        selectStatoCons.disabled = false;
    }
    else {
        selectStatoCons.disabled = true;
    }
});

checkFenomeno.addEventListener('change', () => {
    if (checkFenomeno.checked) {
        selectFenomeno.disabled = false;
    }
    else {
        selectFenomeno.disabled = true;
    }
});

checkMateriale.addEventListener('change', () => {
    if (checkMateriale.checked) {
        selectMateriale.disabled = false;
    }
    else {
        selectMateriale.disabled = true;
    }
});

checkData.addEventListener('change', () => {
    if (checkData.checked) {
        inputDataDa.disabled = false;
        inputDataA.disabled = false;
    }
    else {
        inputDataDa.disabled = true;
        inputDataA.disabled = true;
    }
});

// setInterval(() => {
//     // const insiemeTabelle = document.querySelectorAll('.tabella-schede');
//     // insiemeTabelle.forEach(tbl => {
//     //     tbl.style.display = 'none';
//     // });
//     // if (checkControllo.checked) {filtraSchedeConManRest('SCHEDA CONTROLLO');}
//     // if (checkManReg.checked) {filtraSchedeConManRest('SCHEDA MANUTENZIONE REGOLARE');}
//     // if (checkManCorr.checked) {filtraSchedeConManRest('SCHEDA MANUTENZIONE CORRETTIVA');}
//     // if (checkRestauro.checked) {filtraSchedeConManRest('SCHEDA RESTAURO');}
//     let listaChecked = [];
//     const listaCheckbox = contenitoreFiltriSchede.getElementsByClassName('filtro-schede');
//     listaCheckbox.forEach(cbx => {
//         if (cbx.checked) {
//             listaChecked.push(cbx);
//         }
//     if (listaChecked.length === 0) {
//         filtraVediTutto();
//     }
//     });
// }, 100);

// function azioniPreliminari() {
//     const titoloTabella = document.createElement('h4');
//     titoloTabella.setAttribute('id', 'tabella-titolo');
//     titoloTabella.innerHTML = '<b>SCHEDE</b>';

//     tabContenitoreSchede.appendChild(titoloTabella);
//     // tabContenitoreSchede.appendChild(document.createElement('br'));
// }

function creaStrutturaSchede() {
    const tabellaSchede = document.createElement('table');
    // tabellaSchede.setAttribute('id', 'tabella-schede');
    tabellaSchede.className = 'schede tabella-schede';
    const captionSchede = document.createElement('caption');
    // captionSchede.setAttribute('id', 'caption-schede');
    captionSchede.className = 'schede caption-schede';
    captionSchede.addEventListener('click', apriModelloDaScheda);
    // captionSchede.innerHTML = ``;

    tabellaSchede.appendChild(captionSchede);

    divContenitoreSchede.appendChild(tabellaSchede);

    return [tabellaSchede, captionSchede];
}

async function compilaTabelleControllo() {
    const listaSchedeControlloComplete = await prendiSchedeControllo();
    listaSchedeControlloComplete.forEach(scheda => {
        // console.log(scheda);
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
            tdValore.innerHTML = `${valore}`;
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
        // console.log(scheda);
        const [tabellaSchede, captionSchede] = creaStrutturaSchede();
        tabellaSchede.setAttribute('id', `${scheda["Codice scheda manutenzione regolare"]}`);
        captionSchede.innerHTML = `<b>SCHEDA MANUTENZIONE REGOLARE N. ${scheda["Codice scheda manutenzione regolare"]}</b>`;
        captionSchede.classList.add('caption-schede-mr-mc-r');
        for (const [chiave, valore] of Object.entries(scheda)) {
            const trScheda = document.createElement('tr');
            trScheda.className = 'schede tr-schede-mr-mc-r';
            const tdChiave = document.createElement('td');
            tdChiave.innerHTML = `<b>${chiave}</b>`;
            tdChiave.style.width = '400px';
            tdChiave.className = 'schede td-schede-mr-mc-r';
            const tdValore = document.createElement('td');
            tdValore.innerHTML = `${valore}`;
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
        // console.log(scheda);
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
            tdValore.innerHTML = `${valore}`;
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
        // console.log(scheda);
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
            tdValore.innerHTML = `${valore}`;
            tdValore.className = 'schede td-schede-mr-mc-r';
            tdValore.setAttribute('id', `[${chiave.replaceAll(' ', '')}]{${scheda["Codice scheda restauro"]}}`);
            trScheda.appendChild(tdChiave);
            trScheda.appendChild(tdValore);
            tabellaSchede.appendChild(trScheda);
        }
        tabellaSchede.appendChild(document.createElement('br'));
    });
}

async function prendiSchedeControllo() {
    const risultato = await fetch('/Main10ance_DB/tabellaDB/schede-controllo-2', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function prendiSchedeManReg() {
    const risultato = await fetch('/Main10ance_DB/tabellaDB/schede-manutenzione-regolare', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function prendiSchedeManCorr() {
    const risultato = await fetch('/Main10ance_DB/tabellaDB/schede-manutenzione-correttiva', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function prendiSchedeRestauro() {
    const risultato = await fetch('/Main10ance_DB/tabellaDB/schede-restauro', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function prendiUrn(jsonReq) {
    const risultato = await fetch('/DB_Servizio/LOD/UrnCappelle', {method: "GET", headers: {"content-type": "application/json", "sm": jsonReq.sm, "capp": jsonReq.capp}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

function filtraSchedeDaID(idScheda) {
    // compilaTabelleControllo();
    const insiemeTabelle = document.querySelectorAll('.tabella-schede');
    insiemeTabelle.forEach(tab => {
        // console.log(tab);
        if (tab.id === idScheda) {
            tab.style.display = 'table';
        }
        else {
            tab.style.display = 'none';
        }
    });
}

function filtraVediTutto() {
    const insiemeTabelle = document.querySelectorAll('.tabella-schede');
    const listaCheckbox = contenitoreFiltriSchede.getElementsByClassName('filtro-schede');
    insiemeTabelle.forEach(tab => {
        tab.style.display = 'table';
    });
    if (checkGenerale.checked) {
        checkGenerale.click();
    }
    listaCheckbox.forEach(cbx => {
        cbx.checked = false;
    });
}

function filtraVediNulla() {
    const insiemeTabelle = document.querySelectorAll('.tabella-schede');
    insiemeTabelle.forEach(tab => {
        tab.style.display = 'none';
    });
}

function filtraSchedeConManRest(filtro) {
    const insiemeTabelle = document.querySelectorAll('.tabella-schede');
    insiemeTabelle.forEach(tab => {
        const caption = tab.getElementsByTagName('caption')[0];
        if (caption.innerText.startsWith(filtro)) {
            tab.style.display = 'table';
        }
        // else {
        //     tab.style.display = 'none';
        // }
    });
}

async function apriModelloDaScheda() {
    const stringaCaption = this.innerText;
    const stringaPulita = stringaCaption.split('.')[1].replaceAll(' ', '');
    const tabellaCliccata = document.getElementById(stringaPulita);
    const tdTarget = tabellaCliccata.querySelectorAll('[id^="[Elementi"]')[0];
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
        console.log(urn);
        document.getElementById('apriTabBIM').click();
        launchViewer(urn, () => {
            cercaElementiDaScheda(stringaIdMain10ance);
        });
    }
}

function cercaElementiDaScheda(strID) {
    const listaID = strID.split(',');
    let listaElems = [];
    listaID.forEach(id => {
        viewer.search(id, el => {
            listaElems.push(el[0]);
            viewer.isolate(listaElems);
        }, () => {
            alert('Errore nella ricerca');
        }, ['id_main10ance']);
    });
}

const tabContenitoreSchede = document.getElementById('tabSchede');
const divContenitoreSchede = document.getElementById('contenitore-schede');
const contenitoreFiltriSchede = document.getElementById('pannello-lat-schede-body');
const checkGenerale = document.getElementById('check-generale');
const visualizzaTutto = document.getElementById('vedi-schede-tutto');
const visualizzaNulla = document.getElementById('vedi-schede-nulla');
const checkControllo = document.getElementById('check-controllo');
const checkManReg = document.getElementById('check-man-reg');
const checkManCorr = document.getElementById('check-man-corr');
const checkRestauro = document.getElementById('check-restauro');

divContenitoreSchede.innerHTML = '';

// const tabellaSchede = creaStrutturaSchede();
// azioniPreliminari();

(function () {
    divContenitoreSchede.innerHTML = '';
    compilaTabelleControllo();
    compilaTabelleManReg();
    compilaTabelleManCorr();
    compilaTabelleRestauro();
})();

checkGenerale.addEventListener('change', () => {
    const listaCheckbox = contenitoreFiltriSchede.getElementsByClassName('filtro-schede');
    if (checkGenerale.checked) {
        listaCheckbox.forEach(cbx => {
            cbx.disabled = false;
        });
    }
    else {
        listaCheckbox.forEach(cbx => {
            cbx.disabled = true;
        });
        filtraVediTutto();
    }
});

visualizzaTutto.addEventListener('click', filtraVediTutto);
visualizzaNulla.addEventListener('click', filtraVediNulla);

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
    // captionSchede.innerHTML = ``;

    tabellaSchede.appendChild(captionSchede);

    divContenitoreSchede.appendChild(tabellaSchede);

    return [tabellaSchede, captionSchede];
}

async function compilaTabelleControllo() {
    // divContenitoreSchede.innerHTML = '';

    const listaSchedeControlloComplete = await prendiSchedeControllo();
    listaSchedeControlloComplete.forEach(scheda => {
        // console.log(scheda);
        const [tabellaSchede, captionSchede] = creaStrutturaSchede();
        tabellaSchede.setAttribute('id', `${scheda["Codice scheda controllo"]}`);
        captionSchede.innerHTML = `<b>SCHEDA CONTROLLO N. ${scheda["Codice scheda controllo"]}</b>`;
        for (const [chiave, valore] of Object.entries(scheda)) {
            const trScheda = document.createElement('tr');
            trScheda.className = 'schede tr-schede';
            const tdChiave = document.createElement('td');
            tdChiave.innerHTML = `<b>${chiave}</b>`;
            tdChiave.style.width = '400px';
            tdChiave.className = 'schede td-schede';
            const tdValore = document.createElement('td');
            tdValore.innerHTML = `${valore}`;
            tdValore.className = 'schede td-schede';
            trScheda.appendChild(tdChiave);
            trScheda.appendChild(tdValore);
            tabellaSchede.appendChild(trScheda);
        }
        tabellaSchede.appendChild(document.createElement('br'));
    });
}

async function compilaTabelleManReg() {
    // divContenitoreSchede.innerHTML = '';

    const listaSchedeManRegComplete = await prendiSchedeManReg();
    listaSchedeManRegComplete.forEach(scheda => {
        // console.log(scheda);
        const [tabellaSchede, captionSchede] = creaStrutturaSchede();
        tabellaSchede.setAttribute('id', `${scheda["id_mn_reg"]}`);
        captionSchede.innerHTML = `<b>SCHEDA MANUTENZIONE REGOLARE N. ${scheda["id_mn_reg"]}</b>`;
        for (const [chiave, valore] of Object.entries(scheda)) {
            const trScheda = document.createElement('tr');
            trScheda.className = 'schede tr-schede';
            const tdChiave = document.createElement('td');
            tdChiave.innerHTML = `<b>${chiave}</b>`;
            tdChiave.style.width = '400px';
            tdChiave.className = 'schede td-schede';
            const tdValore = document.createElement('td');
            tdValore.innerHTML = `${valore}`;
            tdValore.className = 'schede td-schede';
            trScheda.appendChild(tdChiave);
            trScheda.appendChild(tdValore);
            tabellaSchede.appendChild(trScheda);
        }
        tabellaSchede.appendChild(document.createElement('br'));
    });
}

async function compilaTabelleManCorr() {
    // divContenitoreSchede.innerHTML = '';

    const listaSchedeManCorrComplete = await prendiSchedeManCorr();
    listaSchedeManCorrComplete.forEach(scheda => {
        // console.log(scheda);
        const [tabellaSchede, captionSchede] = creaStrutturaSchede();
        tabellaSchede.setAttribute('id', `${scheda["id_mn_gu"]}`);
        captionSchede.innerHTML = `<b>SCHEDA MANUTENZIONE CORRETTIVA N. ${scheda["id_mn_gu"]}</b>`;
        for (const [chiave, valore] of Object.entries(scheda)) {
            const trScheda = document.createElement('tr');
            trScheda.className = 'schede tr-schede';
            const tdChiave = document.createElement('td');
            tdChiave.innerHTML = `<b>${chiave}</b>`;
            tdChiave.style.width = '400px';
            tdChiave.className = 'schede td-schede';
            const tdValore = document.createElement('td');
            tdValore.innerHTML = `${valore}`;
            tdValore.className = 'schede td-schede';
            trScheda.appendChild(tdChiave);
            trScheda.appendChild(tdValore);
            tabellaSchede.appendChild(trScheda);
        }
        tabellaSchede.appendChild(document.createElement('br'));
    });
}

async function compilaTabelleRestauro() {
    // divContenitoreSchede.innerHTML = '';

    const listaSchedeRestauroComplete = await prendiSchedeRestauro();
    listaSchedeRestauroComplete.forEach(scheda => {
        // console.log(scheda);
        const [tabellaSchede, captionSchede] = creaStrutturaSchede();
        tabellaSchede.setAttribute('id', `${scheda["id_restaur"]}`);
        captionSchede.innerHTML = `<b>SCHEDA RESTAURO N. ${scheda["id_restaur"]}</b>`;
        for (const [chiave, valore] of Object.entries(scheda)) {
            const trScheda = document.createElement('tr');
            trScheda.className = 'schede tr-schede';
            const tdChiave = document.createElement('td');
            tdChiave.innerHTML = `<b>${chiave}</b>`;
            tdChiave.style.width = '400px';
            tdChiave.className = 'schede td-schede';
            const tdValore = document.createElement('td');
            tdValore.innerHTML = `${valore}`;
            tdValore.className = 'schede td-schede';
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
    insiemeTabelle.forEach(tab => {
        tab.style.display = 'table';
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

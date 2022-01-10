"use strict";

// const formDB = document.getElementById('formDB');

let viewer;
// let urnModelloCorrente;

////////// FUNZIONI UTILI E/O CONDIVISE TRA PIU' FILE JS //////////

// GENERAZIONE DI PALETTE DI COLORI
export function creaColori(nColori, hueStart, hueEnd, sat, lum) {
    const listaHue = intervalliHue(nColori, hueStart, hueEnd);
    const listaHex = listaHue.map((hue) => (hslToHex(hue, sat, lum)));
    return listaHex;
}

function intervalliHue(intervalli, hueMin, hueMax) {
    let intList = [];
    const distanza = (hueMax-hueMin)/(intervalli-1);
    for (let i = hueMin; i<=hueMax; i+=distanza) {
        const numeroInt = Math.round(i);
        intList.push(numeroInt);
    }
    return intList;
}

function hslToHex(h, s, l) { // copiata: non sono sicuro di COME funzioni, ma funziona
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// GENERAZIONE DI UN COLORE (HEX) RANDOM
export function generaColoreRandom() {
    return `#${(0x1000000+Math.random()*0xffffff).toString(16).substring(1,7)}`;
}

// GENERAZIONE DI UN NUMERO RANDOM TRA DUE ESTREMI
// function randomNum(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// GET PROPERTIES MA CHE RITORNA PROMISE CON QUELLO CHE INTERESSA
export function getProps(model, dbids, options) {
    return new Promise((resolve, reject) => {
        model.getBulkProperties(dbids, options, resolve, reject);
    });
}

// RITORNA UNA LISTA DI ID_MAIN10ANCE A PARTIRE DA UNA LISTA DI DBID DEL VIEWER
export async function getIdM10AFromSelezione(selezione) {
    const opz = {
        propFilter: ['id_main10ance'],
        ignoreHidden: true
    };
    const listaOggettiIdM10A = await getProps(viewer.model, selezione, opz);
    const listaIdM10A = listaOggettiIdM10A.map(ogg => (ogg.properties[0].displayValue));
    return listaIdM10A;
}

// RITORNA LA LISTA DEGLI ELEMENTI SELEZIONATI O ISOLATI
export function getElementiSelezionati() {
    let selezione = viewer.getSelection();
    let isolato = viewer.getIsolatedNodes();
    if (selezione.length === 0 && isolato.length === 0) {
        alert('Nessun elemento selezionato');
        return false;
    }
    else if (isolato.length !== 0 && selezione.length === 0) { // se ho solo elementi isolati, li seleziono
        viewer.select(isolato);
        selezione = viewer.getSelection();
    }
    else if (selezione.length !== 0 && isolato.length !== 0) { // se ho sia elementi selezionati che isolati, vince la selezione
        isolato = viewer.isolate(selezione);
        viewer.select(isolato);
    }
    return selezione;
}

// SVUOTA UN ELEMENTO DEL DOM
// function svuotaContenitore(domElem) {
//     while (domElem.firstChild) {
//         domElem.removeChild(domElem.firstChild);
//     }
// }

// VIEWER.SEARCH MA CHE RITORNA PROMISE CON DBID DELL'ELEMENTO CERCATO
export async function ricercaIdM10A(id) {
    const el = await promiseCercaId(id);
    return el[0];

    function promiseCercaId(id) {
        return new Promise((resolve, reject) => {
            viewer.search(id, resolve, reject, ['id_main10ance']);
        });
    }
}

// RITORNA BOOL IN BASE A QUALE DATA VIENE PRIMA
export function confrontaDate(data1, data2) {
    const msData1 = Date.parse(data1);
    const msData2 = Date.parse(data2);
    if (msData1<=msData2) {
        return true; // data1 viene prima di data2
    }
    else {
        return false; // data2 viene prima di data1
    }
}

// AGGIUNGE TOT MESI ALLA DATA INSERITA
export function aggiungiMesi(data, mesi) {
    const dataDiPartenza = new Date(Date.parse(data));
    const mesiDaAggiungere = parseInt(mesi);
    const dataFuturaFull = new Date(dataDiPartenza.setMonth(dataDiPartenza.getMonth()+mesiDaAggiungere));
    const dataFutura = dataFuturaFull.toISOString().split('T')[0];
    return dataFutura;
}

// AGGIUNGE TOT ANNI ALLA DATA INSERITA
export function aggiungiAnni(data, anni) {
    const dataDiPartenza = new Date(Date.parse(data));
    const anniDaAggiungere = parseInt(anni);
    const dataFuturaFull = new Date(dataDiPartenza.setFullYear(dataDiPartenza.getFullYear()+anniDaAggiungere));
    const dataFutura = dataFuturaFull.toISOString().split('T')[0];
    return dataFutura;
}

// CREA ID UNIVOCO (INTEGER) A PARTIRE DA DATA ATTUALE, CON FORMATO AAMMDDHHMMSSMsMsMs
export function dataInteger() {
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

// RESTITUISCE DATA CORDA (AAA-MM-DD) CORRENTE
export function dataCorta() {
    const dataFull = new Date();
    const dataStringa = dataFull.toISOString();
    const dataCorta = dataStringa.split('T')[0];
    return dataCorta;
}

// CREA UNA LISTA DI OPTION PER UN SELECT, E LO AGGIUNGE AD ESSO
// function creaListaOpzioni(listaOpzioni, targetSelect, parametroValue, parametroTesto, opzVuota) {
//     if (opzVuota) {
//         const opzioneVuota = document.createElement('option');
//         opzioneVuota.setAttribute('value', null);
//         opzioneVuota.innerHTML = '';
//         targetSelect.appendChild(opzioneVuota);
//     }
//     listaOpzioni.forEach(op => {
//         const opzioneSel = document.createElement('option');
//         opzioneSel.setAttribute('value', `${op[parametroValue]}`);
//         opzioneSel.innerHTML = `${op[parametroTesto]}`;
//         targetSelect.appendChild(opzioneSel);
//     });
// }

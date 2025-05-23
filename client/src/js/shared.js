"use strict";

import store from '../store/index';
import {resetColori} from './BIM';

////////// FUNZIONI UTILI E/O CONDIVISE TRA PIU' FILE JS //////////

// GENERAZIONE DI PALETTE DI COLORI
export function creaColori(nColori, hueStart = 0, hueEnd = 300, sat = 80, lum = 50) {
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

// RESTITUISCE DATA CORDA (AAAA-MM-DD) CORRENTE
export function dataCorta() {
    const dataFull = new Date();
    const dataStringa = dataFull.toISOString();
    const dataCorta = dataStringa.split('T')[0];
    return dataCorta;
}

export function aggiornaPlanner() {
    store.statePlanner.refreshPlanner = !store.statePlanner.refreshPlanner;
}

export function chiudiAttività() {
    store.stateBIM.schedeAttivitàVisibile = false;
    store.stateBIM.elementiDaSchedare = [];
    store.stateBIM.schedeAttivitàTipo = '';
    store.statePlanner.datiSchedaInCompilazione = {};
    resetColori();
}

export function verificaPercorso(percorso) {
    const listaSezioni = percorso.split('/');
    return !listaSezioni.some(sez => !sez);
}

export function trattaStringArray(sqlArrayString) {
    if (!sqlArrayString) {
        return []; // valori vuoti o nulli diventano lista vuota
    }

    // rimuovo graffe iniziale e finale
    const trimmedString = sqlArrayString.trim();
    if (!trimmedString.startsWith('{') || !trimmedString.endsWith('}')) {
        console.warn(`Unexpected format: "${sqlArrayString}". Returning as is.`);
        return sqlArrayString;
    }

    const content = trimmedString.slice(1, -1);

    // lista vuota
    if (!content.trim()) {
        return [];
    }

    // split su virgole, ma ignorando le virgole comprese tra virgolette ("")
    const elements = content.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);

    // elimino eventuali spazi bianchi (trim()) e rimuovo virgolette ("") esterne se presenti
    return elements.map(element => {
        const trimmedElement = element.trim();
        if (trimmedElement.startsWith('"') && trimmedElement.endsWith('"')) {
            return trimmedElement.slice(1, -1);
        }
        return trimmedElement;
    });
}

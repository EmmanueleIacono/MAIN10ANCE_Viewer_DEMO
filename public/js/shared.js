"use strict";

const formDB = document.getElementById('formDB');

let viewer;
let urnModelloCorrente;

////////// FUNZIONI UTILI E/O CONDIVISE TRA PIU' FILE JS //////////

// GENERAZIONE DI PALETTE DI COLORI

function creaColori(nColori, hueStart, hueEnd, sat, lum) {
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

// GENERAZIONE DI UN NUMERO RANDOM TRA DUE ESTREMI

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// GET PROPERTIES MA CHE RITORNA PROMISE CON QUELLO CHE INTERESSA

function getProps(model, dbids, options) {
    return new Promise((resolve, reject) => {
        model.getBulkProperties(dbids, options, resolve, reject);
    });
}

// RITORNA UNA LISTA DI ID_MAIN10ANCE A PARTIRE DA UNA LISTA DI DBID DEL VIEWER

async function getIdM10AFromSelezione(selezione) {
    const opz = {
        propFilter: ['id_main10ance'],
        ignoreHidden: true
    };
    const listaOggettiIdM10A = await getProps(viewer.model, selezione, opz);
    const listaIdM10A = listaOggettiIdM10A.map(ogg => (ogg.properties[0].displayValue));
    return listaIdM10A;
}

// RITORNA LA LISTA DEGLI ELEMENTI SELEZIONATI O ISOLATI

function getElementiSelezionati() {
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

function svuotaContenitore(domElem) {
    while (domElem.firstChild) {
        domElem.removeChild(domElem.firstChild);
    }
}

// VIEWER.SEARCH MA CHE RITORNA PROMISE CON DBID DELL'ELEMENTO CERCATO

async function ricercaIdM10A(id) {
    const el = await promiseCercaId(id);
    return el[0];

    function promiseCercaId(id) {
        return new Promise((resolve, reject) => {
            viewer.search(id, resolve, reject, ['id_main10ance']);
        });
    }
}

// RICHIESTE

async function prendiLOD(lod) {
    const risultato = await fetch('/o/DB_Servizio/LOD/TabelleLOD', {method: "GET", headers: {"content-type": "application/json", "lod": lod}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function getTabelleGIS() {
    const tabelleGIS = await fetch("/t/DB_Servizio/LOD/TabelleGIS", {method: "GET", headers: {"content-type": "application/json"} });
    const resp_tabelleGIS = await tabelleGIS.json();
    return resp_tabelleGIS;
}

async function prendiSchedeAnagrafica() {
    const risultato = await fetch('/o/Main10ance_DB/tabellaDB/schede-anagrafica', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function prendiSchedeControllo() {
    const risultato = await fetch('/o/Main10ance_DB/tabellaDB/schede-controllo-2', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function prendiSchedeManReg() {
    const risultato = await fetch('/o/Main10ance_DB/tabellaDB/schede-manutenzione-regolare', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function prendiSchedeManCorr() {
    const risultato = await fetch('/o/Main10ance_DB/tabellaDB/schede-manutenzione-correttiva', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function prendiSchedeRestauro() {
    const risultato = await fetch('/o/Main10ance_DB/tabellaDB/schede-restauro', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

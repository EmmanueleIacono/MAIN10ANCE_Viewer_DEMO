"use strict";

const selectSMProg = document.getElementById('select-sacro-monte-prog');
// const selectEdifProg = document.getElementById('select-edificio-prog');
const divEdifProg = document.getElementById('div-edificio-prog');
const selectClOggProg = document.getElementById('select-cl-ogg');
const tabellaAttivitàProg = document.getElementById('tabella-attività');

let listaSigleEdifici;
let listaFrasiDiRischio;

(() => {
    if ((localStorage.bim_vw_sets) && (localStorage.bim_vw_sets === '7-5')) {
        popolaSelectSMProg();
        popolaListaSigleEdifici();
        popolaSelectClOgg();
        popolaListaFrasiDiRischio();
    }
})();

selectSMProg.addEventListener('change', () => {
    divEdifProg.innerHTML = '';
    listaSigleEdifici.forEach(s => {
        if (s.sacro_monte === selectSMProg.value) {
            creaCheckbox(divEdifProg, s.edificio, s.edificio);
            divEdifProg.appendChild(document.createElement('br'));
            // const opz = document.createElement('option');
            // opz.setAttribute('value', s.edificio);
            // opz.innerHTML = s.edificio;
            // selectEdifProg.appendChild(opz);
        }
    });
});

selectClOggProg.addEventListener('change', () => {
    tabellaAttivitàProg.innerHTML = '';
    const listaFrasi = listaFrasiDiRischio.filter(fr => (fr.cl_ogg_fr === selectClOggProg.value));
    console.log(listaFrasi);
    const listaTitoli = ['Frase di rischio', 'Controllo', 'Manuntenzione regolare', 'Frequenza', 'Inizio ciclo'];
    const tHead = creaHeaderTab(listaTitoli);
    tabellaAttivitàProg.appendChild(tHead);
    listaFrasi.forEach(fr => {
        const row = document.createElement('tr');
        const tdFr = document.createElement('td');
        tdFr.innerText = fr.fr_risc;
        const tdCon = document.createElement('td');
        tdCon.innerText = fr.controllo;
        const tdMan = document.createElement('td');
        tdMan.innerText = fr.mn_reg;
        const tdFreq = document.createElement('td');
        const inpFreq = document.createElement('input');
        inpFreq.setAttribute('type', 'number');
        tdFreq.appendChild(inpFreq);
        const tdData = document.createElement('td');
        const inpData = document.createElement('input');
        inpData.setAttribute('type', 'date');
        tdData.appendChild(inpData);
        row.appendChild(tdFr);
        row.appendChild(tdCon);
        row.appendChild(tdMan);
        row.appendChild(tdFreq);
        row.appendChild(tdData);
        tabellaAttivitàProg.appendChild(row);
    });
});

async function popolaSelectSMProg() {
    const listaSigleSM = await prendiSigleSacriMonti();
    listaSigleSM.forEach(sgl => {
        const opz = document.createElement('option');
        opz.setAttribute('value', sgl.sigla);
        opz.innerHTML = sgl.nome;
        selectSMProg.appendChild(opz);
    });
}

async function popolaListaSigleEdifici() {
    listaSigleEdifici = await prendiSigleEdifici();
}

async function prendiSigleEdifici() {
    const risultato = await fetch('/g/DB_Servizio/sigle-edifici', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

function creaCheckbox(contenitore, label, value) {
    const cbx = document.createElement('input');
    cbx.setAttribute('type', 'checkbox');
    cbx.setAttribute('id', label);
    cbx.setAttribute('value', value);
    const lbl = document.createElement('label');
    lbl.setAttribute('for', label);
    lbl.innerHTML = `<b>${label}</b>`;
    contenitore.appendChild(cbx);
    contenitore.appendChild(lbl);
}

async function popolaSelectClOgg() {
    const listaClOgg = await leggiEnum('cl_ogg_fr');
    listaClOgg.forEach(sgl => {
        const opz = document.createElement('option');
        opz.setAttribute('value', sgl.unnest);
        opz.innerHTML = sgl.unnest;
        selectClOggProg.appendChild(opz);
    });
}

async function popolaListaFrasiDiRischio() {
    listaFrasiDiRischio = await prendiFrasiDiRischio();
}

async function prendiFrasiDiRischio() {
    const risultato = await fetch('/g/Main10ance_DB/frasi-rischio', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

function creaHeaderTab(listaTitoli) {
    const tHead = document.createElement('tr');
    listaTitoli.forEach(t => {
        const titolo = document.createElement('th');
        titolo.innerHTML = `<b>${t}</b>`;
        tHead.appendChild(titolo);
    });
    return tHead;
}

"use strict";

const selectSMProg = document.getElementById('select-sacro-monte-prog');
// const selectEdifProg = document.getElementById('select-edificio-prog');
const divEdifProg = document.getElementById('div-edificio-prog');
const selectClOggProg = document.getElementById('select-cl-ogg');
const tabellaAttivitàProg = document.getElementById('tabella-attività');
const bottoneProg = document.getElementById('bottone-prog');

let listaSigleEdifici;
let listaFrasiDiRischio;

(async () => {
    if ((localStorage.bim_vw_sets) && (localStorage.bim_vw_sets === '7-5')) {
        popolaSelectSMProg();
        popolaListaSigleEdifici();
        popolaSelectClOgg();
        popolaListaFrasiDiRischio();
        // const datiControllo = await recuperaDatiControlliProg();
        // creaEventiControlloProg(datiControllo);
    }
})();

selectSMProg.addEventListener('change', () => {
    divEdifProg.innerHTML = '';
    listaSigleEdifici.forEach(s => {
        if (s.sacro_monte === selectSMProg.value) {
            creaCheckbox(divEdifProg, s.edificio, s.edificio);
            divEdifProg.appendChild(document.createElement('br'));
        }
    });
});

selectClOggProg.addEventListener('change', () => {
    tabellaAttivitàProg.innerHTML = '';
    const listaFrasi = listaFrasiDiRischio.filter(fr => (fr.cl_ogg_fr === selectClOggProg.value));
    const listaTitoli = ['Frase di rischio', 'Controllo', 'Manuntenzione regolare', 'Frequenza', 'Inizio ciclo'];
    const tHead = creaHeaderTab(listaTitoli);
    tabellaAttivitàProg.appendChild(tHead);
    listaFrasi.forEach((fr, ind) => {
        const row = document.createElement('tr');
        row.setAttribute('id', `prog-frase-n-${ind}`);

        const tdFr = document.createElement('td');
        tdFr.classList.add('tooltip-prog');
        // tdFr.innerText = fr.fr_risc;
        tdFr.innerHTML = `<div class="tab-div">${fr.fr_risc ? fr.fr_risc : ''}</div>`;
        const spanFr = document.createElement('span');
        spanFr.classList.add('tooltip-prog-text');
        spanFr.innerText = fr.fr_risc;
        // tdFr.innerHTML = `<span class="tooltip-prog-text">${fr.fr_risc}</span>`;
        tdFr.appendChild(spanFr);

        const tdCon = document.createElement('td');
        tdCon.classList.add('tooltip-prog');
        // tdCon.innerText = fr.controllo;
        tdCon.innerHTML = `<div class="tab-div">${fr.controllo ? fr.controllo : ''}</div>`;
        const spanCon = document.createElement('span');
        spanCon.classList.add('tooltip-prog-text');
        spanCon.innerText = fr.controllo;
        // tdCon.innerHTML = `<span class="tooltip-prog-text">${fr.controllo}</span>`;
        tdCon.appendChild(spanCon);

        const tdMan = document.createElement('td');
        tdMan.classList.add('tooltip-prog');
        // tdMan.innerText = fr.mn_reg;
        tdMan.innerHTML = `<div class="tab-div">${fr.mn_reg ? fr.mn_reg : ''}</div>`;
        const spanMan = document.createElement('span');
        spanMan.classList.add('tooltip-prog-text');
        spanMan.innerText = fr.mn_reg;
        // tdMan.innerHTML = `<span class="tooltip-prog-text">${fr.mn_reg}</span>`;
        tdMan.appendChild(spanMan);

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

bottoneProg.addEventListener('click', async () => {
    const vincoliOK = verificaVincoliProg(); // non mi ricordo a cosa servisse...
    if (vincoliOK) {
        const eventi = await combinaElementiEdEventi();
        const vincoliEventiOK = verificaVincoliEventiProg(eventi);
        if (vincoliEventiOK) {
            const listaJsonReq = [];
            let contatoreProgressivi = 0;
            const idUnivoco = dataInteger();
            const dataIns = dataCorta();
            eventi.elementi.forEach(el => {
                eventi.frasi.forEach(fr => {
                    const jsonReq = {};
                    jsonReq.id_contr = idUnivoco+contatoreProgressivi;
                    contatoreProgressivi += 1;
                    jsonReq.cl_ogg = eventi.classe;
                    jsonReq.controllo = fr.controllo;
                    jsonReq.data_con = fr.data;
                    jsonReq.data_ins = dataIns;
                    jsonReq.id_main10ance = el.elementi;
                    jsonReq.rid_fr_risc = parseInt(fr.id);
                    jsonReq.frequenza = fr.frequenza;
                    if (fr.manutenzione) {
                        const jsonMan = {};
                        jsonReq.dati_manutenzione = jsonMan;
                        jsonMan.id_mn_reg = jsonReq.id_contr;
                        jsonMan.cl_ogg = jsonReq.cl_ogg;
                        jsonMan.azione = fr.manutenzione;
                        jsonMan.data_ese = fr.data;
                        jsonMan.data_ins = dataIns;
                        jsonMan.id_main10ance = el.elementi;
                    }
                    listaJsonReq.push(jsonReq);
                });
            });
            const resp = await registraControlli(listaJsonReq);
            if (resp) {
                alert('Programmazione andata a buon fine');
                // proseguo, faccio query eventi e schede
                const datiControllo = await recuperaDatiControlliProg();
                console.log(datiControllo);
            }
            else {
                alert('ATTENZIONE: Si è verificato un errore durante la registrazione dei dati');
            }
        }
        else {
            alert('ATTENZIONE: Informazioni non sufficienti');
        }
    }
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
    cbx.setAttribute('id', `check-edif-prog-${label}`);
    cbx.setAttribute('value', value);
    const lbl = document.createElement('label');
    lbl.setAttribute('for', `check-edif-prog-${label}`);
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

async function getInfoEventiProg() {
    const sm = selectSMProg.value;
    const listaCheckEdif = Array.from(document.querySelectorAll('[id^="check-edif-prog-"]'));
    const listaEdif = listaCheckEdif.filter(c => (c.checked));
    const listaValEdif = listaEdif.map(e => (e.value));
    const clOgg = selectClOggProg.value;
    const listaEntità = await getEntitàDaClOgg(clOgg);
    const listaRowsFrase = Array.from(document.querySelectorAll('[id^="prog-frase-n-"]'));
    const listaValFrasi = listaRowsFrase.map(r => {
        const oggFrase = {};
        oggFrase.frase = r.children[0].innerText;
        // qui sotto se non tolgo line breaks e whitespaces non mi trova il match tra la stringa in arrivo dal DB e quella nella tabella
        oggFrase.id = listaFrasiDiRischio.filter(f => (f.fr_risc.replace(/(\r\n|\n|\r)/gm, "").replace(/\s/g,'') === oggFrase.frase.replace(/(\r\n|\n|\r)/gm, "").replace(/\s/g,'')))[0].id_fr_risc;
        oggFrase.controllo = r.children[1].innerText;
        oggFrase.manutenzione = r.children[2].innerText;
        oggFrase.frequenza = r.children[3].children[0].value;
        oggFrase.data = r.children[4].children[0].value;
        return oggFrase;
    });
    return {sm, edifici: listaValEdif, classe: clOgg, entità: listaEntità, frasi: listaValFrasi};
}

async function aggiungiEventiProg() {
    const eventi = await getInfoEventiProg();
    eventi.frasi.forEach(fr => {
        eventi.edifici.forEach(async ed => {
            const listaId = await getElementiDaEntità(eventi.sm, ed, eventi.entità[0]);
            console.log(listaId);
            const dateEventi = calcolaDateEventi(fr.data, fr.frequenza);
            dateEventi.forEach(d => {
                const nuovoEventoProg = {
                    id: `C-${fr.id}-${ed}-${fr.data}`,
                    title: `Controllo programmato`,
                    start: d,
                    defaultAllDay: true,
                    extendedProps: {
                        località: eventi.sm,
                        edificio: ed,
                        classe: eventi.classe,
                        frase_di_rischio: fr.frase,
                        controllo: fr.controllo,
                        manutenzione_regolare: fr.manutenzione
                    },
                    backgroundColor: '#a8c956',
                    borderColor: '#c74646',
                    texcColor: '#fff'
                };
                calendarProg.addEvent(nuovoEventoProg);
            });
        });
    });
}

function calcolaDateEventi(dataInizio, frequenza) {
    const cicloManutenzione = 10;
    const dataFine = aggiungiAnni(dataInizio, cicloManutenzione);
    const listaDate = [];
    let dataVariabile = dataInizio;
    while (confrontaDate(dataVariabile, dataFine)) {
        listaDate.push(dataVariabile);
        dataVariabile = aggiungiMesi(dataVariabile, frequenza);
    }
    return listaDate;
}

async function getEntitàDaClOgg(cl_ogg) {
    try {
        const res = await fetch("/g/DB_Servizio/entita-oggetti", {method: "GET", headers: {"content-type": "application/json", "cl_ogg": cl_ogg} });
        const resJson = await res.json();
        const entità = resJson.map(r => (r.entità_db_m10a));
        return entità;
    }
    catch(e) {
        console.log('Errore nella richiesta al server');
        console.log(e);
    }
}

async function getElementiDaEntità(sm, edificio, entità) {
    const id = `${sm}|${edificio}|${entità}|`;
    try {
        const res = await fetch("/g/Main10ance_DB/lista-identificativi", {method: "GET", headers: {"content-type": "application/json", "entita": entità, "id_parziale": id} });
        const resJson = await res.json();
        const elementi = resJson.map(r => (r.id_main10ance));
        return elementi;
    }
    catch(e) {
        console.log('Errore nella richiesta al server');
        console.log(e);
    }
}

async function preparaSchedeContrDaProg() {
    const eventi = await getInfoEventiProg();
    const listaElementi = [];
    for await (const ed of eventi.edifici) {
        for await (const en of eventi.entità) {
            if (en === 'grata') {
                const numeri = ed.split('-');
                for await (const n of numeri) {
                    const idOgg = {};
                    idOgg.edificio = ed;
                    idOgg.entità = en;
                    idOgg.elementi = await getElementiDaEntità(eventi.sm, n, en);
                    listaElementi.push(idOgg);
                }
            }
            else {
                const idOgg = {};
                idOgg.edificio = ed;
                idOgg.entità = en;
                idOgg.elementi = await getElementiDaEntità(eventi.sm, ed, en);
                listaElementi.push(idOgg);
            }
        }
    }
    return [listaElementi, eventi];
}

async function combinaElementiEdEventi() {
    const [elementi, eventi] = await preparaSchedeContrDaProg();
    const listaEdifici = [... new Set(elementi.map(e => (e.edificio)))];
    const listaElems = [];
    listaEdifici.forEach(ed => {
        const oggNew = {};
        oggNew.edificio = ed;
        oggNew.elementi = [];
        listaElems.push(oggNew);
    });
    elementi.forEach(el => {
        listaElems.forEach(elm => {
            if (elm.edificio === el.edificio) {
                elm.elementi.push(...el.elementi);
            }
        });
    });
    eventi.elementi = listaElems;
    return eventi;
}

function verificaVincoliProg() {
    return true;
}

function verificaVincoliEventiProg(eventi) {
    if (eventi.edifici.length && eventi.elementi.length && eventi.entità.length && eventi.frasi.length) {
        const bool = eventi.frasi.every(fr => (fr.data && fr.frequenza));
        return bool;
    }
    else {
        return false;
    }
}

async function registraControlli(jsonReq) {
    try {
        const resp = await fetch(`/g/Main10ance_DB/programmazione/nuovi-controlli`, {method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify(jsonReq) });
        const respData = await resp.json();
        return respData;
    }
    catch(e) {
        console.log(e);
    }
}

function creaEventiControlloProg(datiProg, calendario) {
    datiProg.forEach(dt => {
        const dateEventi = calcolaDateEventi(dt.data_operazione, parseInt(dt.frequenza));
        dateEventi.forEach(d => {
            const nuovoEventoProg = {
                id: `C-${dt.id}`,
                title: `Attività programmata`,
                start: d,
                defaultAllDay: true,
                extendedProps: {
                    classe: dt.classe,
                    frase_di_rischio: dt.frase,
                    controllo: dt.controllo,
                    manutenzione_regolare: dt.manutenzione_regolare,
                    manutenzione_correttiva: dt.manutenzione_correttiva
                },
                backgroundColor: '#a8c956',
                borderColor: '#c74646',
                texcColor: '#fff'
            };
            calendario.addEvent(nuovoEventoProg);
        });
    });
}

function creaSchedeControlloProg(datiProg) {
    return;
}

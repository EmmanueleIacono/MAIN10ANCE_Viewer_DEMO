"use strict";

const contenitoreDB = document.getElementById('tabDatabase');
const contenitoreRisultatiDB = document.getElementById('risultatiDB');
const selectSM = document.getElementById('selectSM');
const selezioneCapp = document.getElementById('selectCappella');
const selezioneLOD3 = document.getElementById('selectLOD3');
const selezioneLOD4 = document.getElementById('selectLOD4');
const selezioneLOD5 = document.getElementById('selectLOD5');


(() => {
    if ((localStorage.bim_vw_sets) && (localStorage.bim_vw_sets === '7-5')) {
        prendiTabelle();
        prendiSacriMonti().then(() => {setNumCappelle();});
    }
})();

// GESTIONE RADIO LOD
setInterval(() => {
    if (document.getElementById('radioLOD3').checked) {
      // abilito select lod 3
      document.getElementById('selectLOD3').disabled = false;
      document.getElementById('selectLOD4').disabled = true;
      // document.getElementById('selectCappella').disabled = false;
      // document.getElementById('selectLOD5').disabled = false;
    }
    if (document.getElementById('radioLOD4').checked) {
      // abilito select lod 4
      document.getElementById('selectLOD4').disabled = false;
      document.getElementById('selectLOD3').disabled = true;
      // document.getElementById('selectCappella').disabled = false;
      // document.getElementById('selectLOD5').disabled = false;
    }
    if (document.getElementById('checkLOD5').checked) {
      document.getElementById('selectLOD5').disabled = false;
    }
    if (!(document.getElementById('checkLOD5').checked)) {
      document.getElementById('selectLOD5').disabled = true;
    }
  }, 100);

selectSM.addEventListener('change', setNumCappelle);

const applicaQuery = document.getElementById('applicaQuery');
applicaQuery.addEventListener('click', async () => {
    contenitoreRisultatiDB.innerHTML = '';
    const tipoOpera = ottieniOpera();
    const tipoAttività = ottieniAttività();
    if ((tipoOpera) || (tipoAttività === 'glossario')) {
        if (tipoAttività) {
            const tabellaRisultati = document.createElement('table');
            contenitoreRisultatiDB.appendChild(tabellaRisultati);
            const listaColonne = await costruisciIntestazione(tabellaRisultati, tipoAttività);
            costruisciTabella(tabellaRisultati, listaColonne, tipoAttività, true);
        }
        else {
            const tabellaRisultati = document.createElement('table');
            contenitoreRisultatiDB.appendChild(tabellaRisultati);
            const listaColonne = await costruisciIntestazione(tabellaRisultati, tipoOpera);
            costruisciTabella(tabellaRisultati, listaColonne, tipoOpera, false);
        }
    }
    else {
        alert('Informazioni insufficienti per procedere');
        return;
    }
});

const modificaDati = document.getElementById('modificaDati');
modificaDati.addEventListener('click', () => {
    const bodyTabellaDB = document.getElementById('bodyTabellaDB');
    if ((bodyTabellaDB.innerHTML === '') || (bodyTabellaDB.innerHTML === null)) {
        alert('Nessun dato modificabile');
    }
    else {
        alert('Modifica - Operazione temporaneamente disabilitata');
    }
});

setInterval(() => {
    if ((contenitoreRisultatiDB.innerHTML === '') || (contenitoreRisultatiDB.innerHTML === null)) {
        modificaDati.disabled = true;
    }
    else {
        modificaDati.disabled = false;
    }
}, 100);

const salvaDati = document.getElementById('salvaDati');

const creaDati = document.getElementById('creaDati');
creaDati.addEventListener('click', () => {
    alert('Aggiungi - Operazione temporaneamente disabilitata');
});

function ottieniOpera() {
    let qualeOpera;
    if(document.getElementById('radioLOD3').checked) {
        qualeOpera = selezioneLOD3.value;
      }
    else if(document.getElementById('radioLOD4').checked) {
        qualeOpera = selezioneLOD4.value;
      }
    else {
        qualeOpera = null;
    }
    return qualeOpera;
}

function ottieniAttività() {
    let qualeAttività;
    if(document.getElementById('checkLOD5').checked) {
        qualeAttività = selezioneLOD5.value;
      }
    else {
        qualeAttività = null;
    }
    return qualeAttività;
}

function setNumCappelle() {
    // const qualeSM = (selectSM.value).split('-')[0];
    const quanteCapp = (selectSM.value).split('-')[1];
    selezioneCapp.innerHTML = '';
    for (let n = 0; n <= quanteCapp; n++) {
        const opzioneCapp = document.createElement('option');
        opzioneCapp.setAttribute('value', `${n}`);
        opzioneCapp.innerHTML = `Cappella ${n}`;
        selezioneCapp.appendChild(opzioneCapp);
    }
}

async function costruisciTabella(tabella, colonne, opera, LOD5_Bool) {
    let jsonTabella = {};
    jsonTabella.tab = opera;
    const datiDB = await prendiDatiTabella(jsonTabella);
    const tBody = document.createElement('tbody');
    tBody.setAttribute('id', 'bodyTabellaDB');
    tabella.appendChild(tBody);
    datiDB.forEach(dato => {
        const qualeSM = (selectSM.value).split('-')[0];
        const qualeCapp = selezioneCapp.value;
        const qualeOpera = ottieniOpera();
        if (dato.id_main10ance) {
            if (LOD5_Bool) {
                let listaSM_DB = [];
                let listaCapp_DB = [];
                let listaOp_DB = [];
                (dato.id_main10ance).forEach(id => {
                    listaSM_DB.push(id.split('|')[0]);
                    listaCapp_DB.push(...(id.split('|')[1].split('-')));
                    listaOp_DB.push(id.split('|')[2]);
                });
                if ((listaSM_DB.includes(qualeSM)) && (listaCapp_DB.includes(qualeCapp)) && (listaOp_DB.includes(qualeOpera))) {
                    const riga = document.createElement('tr');
                    tBody.appendChild(riga);
                    colonne.forEach(col => {
                        const record = document.createElement('td');
                        record.innerHTML = dato[col];
                        riga.appendChild(record);
                    });
                }
            }
            else {
                const id_SM = (dato.id_main10ance).split('|')[0];
                const id_ListaCapp = (dato.id_main10ance).split('|')[1].split('-');
                const id_opera = (dato.id_main10ance).split('|')[2];
                if ((qualeSM === id_SM) && (id_ListaCapp.includes(qualeCapp)) && (qualeOpera === id_opera)) {
                    const riga = document.createElement('tr');
                    tBody.appendChild(riga);
                    colonne.forEach(col => {
                        const record = document.createElement('td');
                        record.innerHTML = dato[col];
                        riga.appendChild(record);
                    });
                }
            }
        }
        else {
            const riga = document.createElement('tr');
            tBody.appendChild(riga);
            colonne.forEach(col => {
                const record = document.createElement('td');
                record.innerHTML = dato[col];
                riga.appendChild(record);
            });
        }
    });
}

async function costruisciIntestazione(tabella, opera) {
    let jsonTabella = {};
    jsonTabella.tab = opera;
    const cols = await prendiColonne(jsonTabella);
    const tHead = document.createElement('thead');
    tabella.appendChild(tHead);
    const trHead = document.createElement('tr');
    tHead.appendChild(trHead);
    let listaCols = [];
    cols.forEach(c => {
        const nomeCol = c.column_name;
        listaCols.push(nomeCol);
        const th = document.createElement('th');
        th.innerHTML = nomeCol;
        trHead.appendChild(th);
    });
    return listaCols;
}

async function prendiTabelle() {
    try {
        const lodUtili = [3, 4, 5];
        lodUtili.forEach(async n => {
            const tabLOD = await prendiLOD(n);
            tabLOD.forEach(t => {
                const nomeTabella = t.tabella;
                const nomeEsteso = t.alias;
                const opzioneLOD = document.createElement('option');
                opzioneLOD.setAttribute('value', nomeTabella);
                opzioneLOD.innerHTML = nomeEsteso;
                document.getElementById(`selectLOD${n}`).appendChild(opzioneLOD);
            });
        });
    }
    catch(e) {
        console.log('Errore nella richiesta al server');
        console.log(e);
    }
}

async function prendiSacriMonti() {
    try {
        const risultato = await fetch(`/t/DB_Servizio/MarkerSM`, {method: "GET", headers: {"content-type": "application/json"}});
        const sacriMontiJson = await risultato.json();

        sacriMontiJson.forEach((smjson) => {
            const opzioneSM = document.createElement('option');
            opzioneSM.setAttribute('value', `${smjson.sigla}-${smjson.n_cappelle}`);
            opzioneSM.innerHTML = smjson.nome;
            selectSM.appendChild(opzioneSM);
        });
    }
    catch(e) {
        console.log('Errore nella richiesta al server');
        console.log(e);
    }
}

async function prendiColonne(jsonReq) {
    const risultato = await fetch('/o/Main10ance_DB/colonne', {method: "GET", headers: {"content-type": "application/json", "tab": jsonReq.tab}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function prendiDatiTabella(jsonReq) {
    let risultato;
    if (jsonReq.tab === 'glossario') {
        risultato = await fetch('/o/Main10ance_DB/tabellaDB/glossario', {method: "GET", headers: {"content-type": "application/json"}});
    }
    else {
        risultato = await fetch('/o/Main10ance_DB/tabellaDB', {method: "GET", headers: {"content-type": "application/json", "tab": jsonReq.tab}});
    }
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function prendiLOD(lod) {
    const risultato = await fetch('/o/DB_Servizio/LOD/TabelleLOD', {method: "GET", headers: {"content-type": "application/json", "lod": lod}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

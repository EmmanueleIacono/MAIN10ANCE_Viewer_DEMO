const contenitoreDB = document.getElementById('tabDatabase');
const contenitoreRisultatiDB = document.getElementById('risultatiDB');
const selectSM = document.getElementById('selectSM');
const selezioneCapp = document.getElementById('selectCappella');
const selezioneLOD3 = document.getElementById('selectLOD3');
const selezioneLOD4 = document.getElementById('selectLOD4');

const listaLOD5 = ['controllo_stato_di_conservazione_livello_di_urgenza', 'danno_alterazione_degrado', 'frase_di_rischio', 'glossario', 'manutenzione_correttiva_o_a_guasto', 'manutenzione_regolare', 'restauri'];
const listaLOD4 = ['arredo', 'dipinto_murale', 'pavimento_decorativo', 'quadro',  'statua'];
const listaLOD3 = ['apparato_decorativo', 'catena', 'finestra', 'grata', 'muro', 'pavimento', 'pilastro', 'porta', 'scala', 'tetto', 'trave', 'volta'];

// const listaComplessiSMV = ['1', '2-3-4', '5-6-7-8-9', '10', '11', '12', '13', '14', '15', '16-24', '17', '18', '19', '20-21-22-23', '25-26', '27-29-30-31-32-33-34-35', '28', '36', '37-38-39', '40-41-42-43-44', '45'];

selectSM.addEventListener('change', setNumCappelle);

const applicaQuery = document.getElementById('applicaQuery');
applicaQuery.addEventListener('click', async () => {
    contenitoreRisultatiDB.innerHTML = '';
    const tipoOpera = ottieniOpera();
    if (tipoOpera) {
        // console.log(tipoOpera);
        const tabellaRisultati = document.createElement('table');
        contenitoreRisultatiDB.appendChild(tabellaRisultati);
        const listaColonne = await costruisciIntestazione(tabellaRisultati, tipoOpera);
        costruisciTabella(tabellaRisultati, listaColonne, tipoOpera);
    }
    else {
        alert('Informazioni insufficienti per procedere');
        return;
    }
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

async function costruisciTabella(tabella, colonne, opera) {
    jsonTabella = {};
    jsonTabella.tab = opera;
    const datiDB = await prendiDatiTabella(jsonTabella);
    const tBody = document.createElement('tbody');
    tabella.appendChild(tBody);
    datiDB.forEach(dato => {
        const qualeSM = (selectSM.value).split('-')[0];
        const qualeCapp = selezioneCapp.value;
        const id_SM = (dato.id_main10ance).split('|')[0];
        const id_ListaCapp = (dato.id_main10ance).split('|')[1].split('-');
        if ((qualeSM === id_SM) && (id_ListaCapp.includes(qualeCapp))) {
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
    jsonTabella = {};
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
        const risultato = await fetch("/Main10ance_DB/tabelle", {method: "GET", headers: {"content-type": "application/json"} });
        const tabelle = await risultato.json();
        tabelle.forEach(t => {
            if (listaLOD5.includes(t.table_name)) {
                const opzioneLOD5 = document.createElement('option');
                opzioneLOD5.setAttribute('value', t.table_name);
                opzioneLOD5.innerHTML = `${t.table_name}`;
                document.getElementById('selectLOD5').appendChild(opzioneLOD5);
            }
            else if (listaLOD4.includes(t.table_name)) {
                const opzioneLOD4 = document.createElement('option');
                opzioneLOD4.setAttribute('value', t.table_name);
                opzioneLOD4.innerHTML = `${t.table_name}`;
                document.getElementById('selectLOD4').appendChild(opzioneLOD4);
            }
            else if (listaLOD3.includes(t.table_name)) {
                const opzioneLOD3 = document.createElement('option');
                opzioneLOD3.setAttribute('value', t.table_name);
                opzioneLOD3.innerHTML = `${t.table_name}`;
                document.getElementById('selectLOD3').appendChild(opzioneLOD3);
            }
            else {
                // console.log(t.table_name);
                console.log('vabbe');
            }
        });
    }
    catch(e) {
        console.log('Errore nella richiesta al server');
        console.log(e);
    }
}

async function prendiSacriMonti() {
    try {
        const risultato = await fetch(`/DB_Servizio/MarkerSM`, {method: "GET", headers: {"content-type": "application/json"}});
        const sacriMontiJson = await risultato.json();

        sacriMontiJson.forEach((smjson) => {
            // console.log('nome: '+smjson.nome);
            // console.log('sigla: '+smjson.sigla);
            const opzioneSM = document.createElement('option');
            // opzioneSM.setAttribute('value', smjson.sigla);
            // opzioneSM.setAttribute('id', `${smjson.sigla}-${smjson.n_cappelle}`);
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

prendiTabelle();
prendiSacriMonti().then(() => {setNumCappelle();});

async function prendiColonne(jsonReq) {
    const risultato = await fetch('/Main10ance_DB/colonne', {method: "GET", headers: {"content-type": "application/json", "tab": jsonReq.tab}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function prendiDatiTabella(jsonReq) {
    const risultato = await fetch('/Main10ance_DB/tabellaDB', {method: "GET", headers: {"content-type": "application/json", "tab": jsonReq.tab}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

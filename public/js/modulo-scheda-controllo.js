"use strict";

const moduloSchedaControllo = document.getElementById('modulo-scheda-controllo');

async function mostraModuloSchedaControllo(id, scheda, stringaIdM10a) {
    const listaEnumConservazione = await leggiEnum('st_cons');
    const listaEnumUrgenza = await leggiEnum('liv_urg');
    const listaEnumRacc = await leggiEnum('cl_racc');

    const frase = scheda.querySelectorAll('[id^="[frase"]')[0].innerText;
    const listaId = stringaIdM10a.split(', ');
    moduloSchedaControllo.dataset.idSchedaCont = id;
    moduloSchedaControllo.innerHTML = '';

    const titolo = document.createElement('h4');
    titolo.innerHTML = '<b>Report controllo e manutenzione</b>';

    const labelOperatore = document.createElement('label');
    labelOperatore.innerHTML = '<b>OPERATORE</b>';
    const testoOperatore = document.createElement('p');
    testoOperatore.setAttribute('id', 'mod-sc-cont-operatore');
    testoOperatore.innerText = localStorage.user_id;

    const labelFrase = document.createElement('label');
    labelFrase.innerHTML = `<b>FRASE DI RISCHIO</b>`;
    const testoFrase = document.createElement('p');
    testoFrase.setAttribute('id', 'mod-sc-cont-frase');
    testoFrase.innerText = frase;

    const labelData = document.createElement('label');
    labelData.innerHTML = `<b>DATA CONTROLLO</b>`;
    const inputData = document.createElement('input');
    inputData.setAttribute('type', 'date');
    inputData.setAttribute('id', 'mod-sc-cont-data');

    const labelStrum = document.createElement('label');
    labelStrum.innerHTML = `<b>STRUMENTAZIONE</b>`;
    const inputStrum = document.createElement('input');
    inputStrum.setAttribute('id', 'mod-sc-cont-strum');

    const labelDoc = document.createElement('label');
    labelDoc.innerHTML = `<b>DOCUMENTI</b>`;
    const inputDoc = document.createElement('input');
    inputDoc.setAttribute('id', 'mod-sc-cont-doc');

    const labelStCons = document.createElement('label');
    labelStCons.innerHTML = `<b>STATO DI CONSERVAZIONE</b>`;
    const selectStCons = document.createElement('select');
    selectStCons.setAttribute('id', 'mod-sc-cont-stcons');
    creaListaOpzioni(listaEnumConservazione, selectStCons, 'unnest', 'unnest', false);
    selectStCons.addEventListener('change', gestisciCU_CR);

    const labelLivUrg = document.createElement('label');
    labelLivUrg.innerHTML = `<b>LIVELLO DI URGENZA</b>`;
    const selectLivUrg = document.createElement('select');
    selectLivUrg.disabled = true;
    selectLivUrg.setAttribute('id', 'mod-sc-cont-livurg');
    creaListaOpzioni(listaEnumUrgenza, selectLivUrg, 'unnest', 'unnest', false);

    const labelClRacc = document.createElement('label');
    labelClRacc.innerHTML = `<b>CLASSE DI RACCOMANDAZIONE</b>`;
    const selectClRacc = document.createElement('select');
    selectClRacc.disabled = true;
    selectClRacc.setAttribute('id', 'mod-sc-cont-clracc');
    creaListaOpzioni(listaEnumRacc, selectClRacc, 'unnest', 'unnest', false);

    const labelNote = document.createElement('label');
    labelNote.innerHTML = `<b>NOTE</b>`;
    const inputNote = document.createElement('input');
    inputNote.setAttribute('id', 'mod-sc-cont-note');

    const tabellaModCont = document.createElement('table');
    tabellaModCont.setAttribute('id', 'mod-sc-cont-tabella');
    const listaSx = [];
    const listaDx = [];

    listaSx.push(labelOperatore);
    listaDx.push(testoOperatore);

    listaSx.push(labelFrase);
    listaDx.push(testoFrase);

    listaSx.push(labelData);
    listaDx.push(inputData);

    listaSx.push(labelStrum);
    listaDx.push(inputStrum);

    listaSx.push(labelDoc);
    listaDx.push(inputDoc);

    listaSx.push(labelStCons);
    listaDx.push(selectStCons);

    listaSx.push(labelLivUrg);
    listaDx.push(selectLivUrg);

    listaSx.push(labelClRacc);
    listaDx.push(selectClRacc);

    listaSx.push(labelNote);
    listaDx.push(inputNote);

    for (let i = 0; i<listaSx.length; i++) {
        const tr = document.createElement('tr');
        const tdSx = document.createElement('td');
        tdSx.appendChild(listaSx[i]);
        const tdDx = document.createElement('td');
        tdDx.appendChild(listaDx[i]);
        tr.appendChild(tdSx);
        tr.appendChild(tdDx);
        tabellaModCont.appendChild(tr);
    }

    const bott = document.createElement('button');
    bott.id = 'mod-sc-cont-bott';
    bott.style.margin = '10px';
    bott.innerText = 'SALVA';
    bott.className = 'dbBtn bottone-main10ance';
    bott.addEventListener('click', () => {proceduraDiRegistrazione.bind(moduloSchedaControllo)([...listaId]);});

    moduloSchedaControllo.appendChild(titolo);
    moduloSchedaControllo.appendChild(tabellaModCont);
    moduloSchedaControllo.appendChild(bott);
    // moduloSchedaControllo.appendChild(document.createElement('br'));
    // moduloSchedaControllo.appendChild(labelOperatore);
    // moduloSchedaControllo.appendChild(testoOperatore);
    // moduloSchedaControllo.appendChild(document.createElement('br'));
    // moduloSchedaControllo.appendChild(labelFrase);
    // moduloSchedaControllo.appendChild(testoFrase);
    // moduloSchedaControllo.appendChild(document.createElement('br'));
    // moduloSchedaControllo.appendChild(labelData);
    // moduloSchedaControllo.appendChild(inputData);
    // moduloSchedaControllo.appendChild(document.createElement('br'));
    // moduloSchedaControllo.appendChild(labelStrum);
    // moduloSchedaControllo.appendChild(inputStrum);
    // moduloSchedaControllo.appendChild(document.createElement('br'));
    // moduloSchedaControllo.appendChild(labelDoc);
    // moduloSchedaControllo.appendChild(inputDoc);
    // moduloSchedaControllo.appendChild(document.createElement('br'));
    // moduloSchedaControllo.appendChild(labelStCons);
    // moduloSchedaControllo.appendChild(inputStCons);
    // moduloSchedaControllo.appendChild(document.createElement('br'));
    // moduloSchedaControllo.appendChild(labelLivUrg);
    // moduloSchedaControllo.appendChild(inputLivUrg);
    // moduloSchedaControllo.appendChild(document.createElement('br'));
    // moduloSchedaControllo.appendChild(labelClRacc);
    // moduloSchedaControllo.appendChild(inputClRacc);
    // moduloSchedaControllo.appendChild(document.createElement('br'));
    // moduloSchedaControllo.appendChild(labelNote);
    // moduloSchedaControllo.appendChild(inputNote);
    // moduloSchedaControllo.appendChild(document.createElement('br'));

    moduloSchedaControllo.style.display = 'block';
}

function gestisciCU_CR() {
    const val = this.value;
    const CU = document.getElementById('mod-sc-cont-livurg');
    const CR = document.getElementById('mod-sc-cont-clracc');
    if (val !== 'cc 0 - nessun sintomo') {
        CU.disabled = false;
        CR.disabled = false;
    }
    else {
        CU.value = 'uc 0 - a lungo termine';
        CR.value = 'cr 0 - nessuna misura';
        CU.disabled = true;
        CR.disabled = true;
    }
}

async function proceduraDiRegistrazione(listaIdM10A) {
    const tabellaCont = this.children[1];
    const listaTr = Array.from(tabellaCont.children);
    const listaInput = listaTr.map(tr => (tr.children[1]));
    const listaChiaviValori = listaInput.map(inp => {
        const CV = {};
        CV.chiave = inp.firstChild.id;
        CV.valore = inp.firstChild.innerText;
        return CV;
    });
    console.log(listaChiaviValori);
    console.log(listaIdM10A);
    const idSchedaOrigine = parseInt(this.dataset.idSchedaCont);
    console.log(idSchedaOrigine);
    const elementiSelezionati = await getIdM10AFromSelezione(viewer.getSelection());
    console.log(elementiSelezionati);
    const numeroElementiRimasti = listaIdM10A.length - elementiSelezionati.length;
    console.log(numeroElementiRimasti);
    if (numeroElementiRimasti) {
        const parola = numeroElementiRimasti === 1 ? 'elemento rimasto' : 'elementi rimasti';
        alert(`Operazione andata a buon fine. ${numeroElementiRimasti} ${parola}, procedere.`);
        const listaIdElementiRimasti = listaIdM10A.filter(id => (!elementiSelezionati.includes(id)));
        console.log(listaIdElementiRimasti);
        const listaElementiRestanti = await Promise.all(listaIdElementiRimasti.map(async id => (await ricercaIdM10A(id))));
        viewer.select(listaElementiRestanti);
        viewer.isolate(listaElementiRestanti);
        viewer.fitToView();
    }
    else {
        alert('Operazione completata');
        viewer.isolate();
        viewer.clearSelection();
        moduloSchedaControllo.style.display = 'none';
    }
}

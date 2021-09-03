// import('./ForgeViewer.js');

const formDB = document.getElementById('formDB');

// QUI SOTTO CI SONO I VARI CONTROLLI CHE REGOLANO LE RICHIESTE AL SERVER

// REFRESH VIEWER
const bottoneRefrViewer = document.getElementById("refreshParams");
bottoneRefrViewer.addEventListener("click", () => {
    viewer.clearSelection();
    viewer.isolate();
    viewer.fitToView();
});

// INTERROGA MODELLO
const bottoneQuery = document.getElementById("queryDB");
bottoneQuery.addEventListener("click", ottieniDatiDB);

// MODIFICA DATABASE
const bottoneMod = document.getElementById("modificaDB");
bottoneMod.addEventListener("click", () => {
    if (formDB.hasChildNodes()) {
        alert('Modifica temporaneamente disabilitata.');
        // const moduli = $('[id^="form-"]');
        // let idElemento = parseInt($('[id^="idElemento-"]').text().replace(/ELEMENTO: /g,''));
        // let catElemento = $('[id^="categoriaElemento-"]').text().replace(/CATEGORIA: /g,'');
    
        // try {
        //     [...moduli].forEach((mod) => {
        //         let idPulito = (mod.id).match(/\-(.*)\-/).pop();
        //         jsonRequest = {};
        //         jsonRequest.id = idElemento;
        //         jsonRequest.categoria = catElemento;
        //         jsonRequest.parametro = idPulito;
        //         if (($(`#${mod.id}`).val()) !== "") {
        //             jsonRequest.valore = $(`#${mod.id}`).val();
        //         }
        //         else {
        //             jsonRequest.valore = null;
        //         }
        //         scriviParametroElemento(jsonRequest);
        //     });
        //     alert('Operazione di modifica avvenuta con successo');
        // }
        // catch(e) {
        //     console.log("Errore nella modifica dei parametri");
        //     console.log(e);
        // }
        // finally {
        //     ottieniDatiDB();
        // }
    }
    else {
        alert('Nessun elemento interrogato');
    }
});

// ANNULLA INTERROGAZIONE - RIPULISCI FORM
const bottoneCanc = document.getElementById("annullaDB");
bottoneCanc.addEventListener("click", () => {
    cancellaFormDB(formDB);
    viewer.clearSelection();
    viewer.isolate();
});

//FUNZIONI

async function ottieniDatiDB() {
    if (!viewer) {
        alert('Nessun modello selezionato');
    }
    else {
        const selezione = viewer.getSelection();
        const isolato = viewer.getIsolatedNodes();
        if ((selezione.length === 1) || (isolato.length === 1)) {
            selezione.forEach(async (s) => {
                viewer.getProperties(s, async (props) => {
                    let nome = props.name;
                    props.properties.forEach(p => {
                        if (p.displayName === "id_main10ance") {
                            let idMain10ance = p.displayValue;
                            let arrayInfo = idMain10ance.split('|');
                            let entità = arrayInfo[2];
                            jsonRequest = {};
                            jsonRequest.nome = nome;
                            jsonRequest.id = idMain10ance;
                            jsonRequest.categoria = entità;
                            leggiDBElemento(jsonRequest);
                        }
                    });
                }, (e) => {
                        console.log(`ATTENZIONE: ${e}`)
                    });
            });
        }
        else if ((selezione.length === 0) && (isolato.length === 0)) {
            alert('Nessun elemento selezionato');
        }
        else {
            alert('Selezionare un solo elemento per volta');
        }
        // viewer.clearSelection();
        viewer.isolate(selezione);
        viewer.fitToView(selezione);
    }
}

async function leggiDBElemento(jsonReq) {
    try {
        cancellaFormDB(formDB);

        // const risultato = await fetch(`/Main10ance_DB/BIMViewer`, {method: "GET", headers: {"content-type": "application/json", "categoria": jsonReq.categoria, "id": jsonReq.id} });
        
        const nomeElem = jsonReq.nome;
        const categoriaElem = jsonReq.categoria;
        const idElem = jsonReq.id;
        const titoloNome = document.createElement("h4");
        const titoloID = document.createElement("h5");
        const titoloCategoria = document.createElement("h5");
        titoloNome.setAttribute("id", `nomeElemento-${nomeElem}`);
        titoloID.setAttribute("id", `idElemento-${idElem}`);
        titoloCategoria.setAttribute("id", `categoriaElemento-${categoriaElem}`);
        titoloNome.innerHTML = `<b>${nomeElem}</b>`;
        titoloID.innerHTML = `<b>ELEMENTO: ${idElem}</b>`;
        titoloCategoria.innerHTML = `<b>ENTITÀ: ${categoriaElem}</b>`;
        formDB.appendChild(titoloNome);
        formDB.appendChild(titoloCategoria);
        formDB.appendChild(titoloID);
        const [detailsBIMLOD3, divDetailsBIMLOD3] = creaBloccoDetails('LOD 3');
        formDB.appendChild(detailsBIMLOD3);

        // const parametri = await risultato.json();
        const parametri = await cercaDatiDB(jsonReq.categoria, jsonReq.id);

        parametri.forEach(p => {
            const listaParametri = Object.entries(p);
            creaRisultatiTesto(listaParametri, idElem, divDetailsBIMLOD3);
        });
        detailsBIMLOD3.open = true;
        const [detailsBIMLOD4, divDetailsBIMLOD4] = creaBloccoDetails('LOD 4');
        formDB.appendChild(document.createElement('br'));
        formDB.appendChild(detailsBIMLOD4);
        const listaLOD4 = await leggiLOD(4);
        listaLOD4.forEach(ogg => {
            const detailsOpera = creaBloccoDetails(ogg.alias, ogg.tabella)[0];
            divDetailsBIMLOD4.appendChild(document.createElement('br'));
            divDetailsBIMLOD4.appendChild(detailsOpera);
        });
        const [detailsBIMLOD5, divDetailsBIMLOD5] = creaBloccoDetails('LOD 5');
        formDB.appendChild(document.createElement('br'));
        formDB.appendChild(detailsBIMLOD5);
        const listaLOD5 = await leggiLOD(5);
        listaLOD5.forEach(ogg => {
            const detailsOpera = creaBloccoDetails(ogg.alias, ogg.tabella)[0];
            divDetailsBIMLOD5.appendChild(document.createElement('br'));
            divDetailsBIMLOD5.appendChild(detailsOpera);
        });
    }
    catch(e) {
        console.log('Errore nella lettura dei valori');
        console.log(e);
    }
}

async function scriviParametroElemento(jsonReq) {
    try {
        const risultato = await fetch(`/Main10ance_DB/all`, {method: "PATCH", headers: {"content-type": "application/json"}, body: JSON.stringify(jsonReq) });
    }
    catch(e) {
        console.log('Errore nella modifica del database');
        console.log(e);
    }
}

function cancellaFormDB(form) {
    while (form.firstChild) {
        form.removeChild(form.firstChild);
    }
}

function creaRisultatiTesto(listaRisultati, idElem, detailsBIMLOD) {
    listaRisultati.forEach(r => {
        const nomeP = r[0];
        const valoreP = r[1];
        const idLabelFormDB = document.createElement("label");
        idLabelFormDB.setAttribute("id", `${nomeP}-${idElem}`);
        idLabelFormDB.innerHTML = `${nomeP}: `;
        const parametroFormDBLOD3 = document.createElement("div");
        parametroFormDBLOD3.setAttribute("id", `div-form-${nomeP}-${idElem}`);
        if (valoreP !== null) {
            parametroFormDBLOD3.innerHTML = `${valoreP}`;
        }
        else {
            parametroFormDBLOD3.innerHTML = `<i>Nessun valore</i>`;
        }
        const br = document.createElement("br");
        detailsBIMLOD.appendChild(idLabelFormDB);
        detailsBIMLOD.appendChild(parametroFormDBLOD3);
        detailsBIMLOD.appendChild(br);
    });
}

function creaRisultatiInput(listaRisultati, idElem, detailsBIMLOD) {
    listaRisultati.forEach(r => {
        const nomeP = r[0];
        const valoreP = r[1];
        const idLabelFormDB = document.createElement("label");
        idLabelFormDB.setAttribute("id", `${nomeP}-${idElem}`);
        idLabelFormDB.innerHTML = `${nomeP}: `;
        const parametroInputFormDB = document.createElement("input");
        parametroInputFormDB.setAttribute("id", `form-${nomeP}-${idElem}`);
        parametroInputFormDB.setAttribute("placeholder", `${valoreP}`);
        if (valoreP !== null) {
            parametroInputFormDB.setAttribute("value", `${valoreP}`);
        }
        else {
            parametroInputFormDB.setAttribute("value", "");
        }
        const br = document.createElement("br");
        detailsBIMLOD.appendChild(idLabelFormDB);
        detailsBIMLOD.appendChild(parametroInputFormDB);
        detailsBIMLOD.appendChild(br);
    });
}

async function leggiLOD(lod) {
    try {
        const risultato = await fetch('/DB_Servizio/LOD/TabelleLOD', {method: "GET", headers: {"content-type": "application/json", "lod": lod} });
        const livelliLOD = await risultato.json();
        return livelliLOD;
    }
    catch(e) {
        console.log('Errore nella lettura dei LOD');
        console.log(e);
    }
}

function creaBloccoDetails(intestazione, id) {
    id = id || intestazione;
    const detailsBIM = document.createElement('details');
    const summaryBIM = document.createElement('summary');
    const divBIM = document.createElement('div');
    summaryBIM.setAttribute('class', 'sommario-main10ance');
    summaryBIM.setAttribute('id', `summary-${id.replace(/ /g, '_')}`);
    summaryBIM.innerHTML = `<b>${intestazione}</b>`;
    divBIM.setAttribute('id', `detailsdiv-${id.replace(/ /g, '_')}`);
    detailsBIM.appendChild(summaryBIM);
    detailsBIM.appendChild(divBIM);

    summaryBIM.addEventListener('click', async () => {
        if (!divBIM.innerHTML) {
            const elementoTarget = $('[id^="idElemento-"]')[0];
            const id = elementoTarget.id.replace('idElemento-', '');
            const tabella = divBIM.id.replace('detailsdiv-','');
            const datiDB = await cercaDatiDB(tabella, id);
            if (datiDB) {
                datiDB.forEach(d => {
                    const listaDati = Object.entries(d);
                    // console.log(listaDati);
                    creaRisultatiInput(listaDati, id, divBIM);
                });
                // detailsBIM.open = true;
            }
        }
    });

    return [detailsBIM, divBIM];
}

async function cercaDatiDB(tabella, idMain10ance) {
    try {
        const risultato = await fetch(`/Main10ance_DB/BIMViewer`, {method: "GET", headers: {"content-type": "application/json", "categoria": tabella, "id": idMain10ance} });
        const datiDB = await risultato.json();
        console.log(datiDB);
        return datiDB;
    }
    catch(e) {
        console.log('Errore nella lettura dei valori');
        console.log(e);
    }
}

// PROVVISORIO -------------------------------------------
document.getElementById('apriTabBIM').click();
launchViewer('dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c2Fjcm8tbW9udGUtZ2hpZmZhL1NNR19QVkMucnZ0');

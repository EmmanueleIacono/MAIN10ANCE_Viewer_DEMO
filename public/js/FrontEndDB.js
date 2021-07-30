import('./ForgeViewer.js');

// const urlCorrente = window.location.href.toString().slice(0, -1);

let formDB = document.getElementById('formDB');

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
bottoneQuery.addEventListener("click", ottieniDatiDB); // per qualche motivo nell'addEventListener devo passare solo il nome della funzione, senza chiamarla aggiungendo ()...

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
        // if ((selezione.length === 1) || (isolato.length === 1)) {
        //     selezione.forEach(async (s) => {
        //         viewer.getProperties(s, async (props) => {
        //             let nome = props.name;
        //             let idSemplice = (nome).match(/\[(.*)\]/).pop();
        //             let parent = viewer.model.getData().instanceTree.getNodeParentId(s);
        //             viewer.getProperties(parent, (propsParent) => {
        //                 propsParent.properties.forEach((pP) => {
        //                     if (pP.displayName === "_RC") {
        //                         jsonRequest = {};
        //                         jsonRequest.nome = nome;
        //                         jsonRequest.id = idSemplice;
        //                         jsonRequest.categoria = pP.displayValue;
        //                         leggiDBElemento(jsonRequest);
        //                     }
        //                     });
        //             }, (e) => {
        //                 console.log(e)});
        //         }, (e) => {
        //                 console.log(`ATTENZIONE: ${e}`)
        //             });
        //     });
        // }
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

        // const risultato = await fetch(`${urlCorrente}/Main10ance_DB/all`, {method: "GET", headers: {"content-type": "application/json", "categoria": jsonReq.categoria, "id": jsonReq.id, "nome": jsonReq.nome}});
        // const risultato = await fetch(`/Main10ance_DB/all`, {method: "GET", headers: {"content-type": "application/json", "categoria": jsonReq.categoria, "id": jsonReq.id, "nome": jsonReq.nome}});
        const risultato = await fetch(`/Main10ance_DB/BIMViewer`, {method: "GET", headers: {"content-type": "application/json", "categoria": jsonReq.categoria, "id": jsonReq.id, "nome": jsonReq.nome}});
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
        const parametri = await risultato.json();
        const listaParametri = Object.entries(parametri);
        listaParametri.forEach((p) => {
            const nomeP = p[0];
            const valoreP = p[1];
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
            formDB.appendChild(idLabelFormDB);
            formDB.appendChild(parametroInputFormDB);
            formDB.appendChild(br);
        });
    }
    catch(e) {
        console.log('Errore nella lettura dei valori');
        console.log(e);
    }
}

async function scriviParametroElemento(jsonReq) {
    try {
        // const risultato = await fetch(`${urlCorrente}/Main10ance_DB/all`, {method: "PATCH", headers: {"content-type": "application/json"}, body: JSON.stringify(jsonReq) });
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

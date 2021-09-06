const bottoneAggiungi = document.getElementById('aggiungiDB');

bottoneAggiungi.addEventListener('click', () => {
    inizializzaModulo();
});

/////   FUNZIONI    /////

function inizializzaModulo() {
    cancellaFormDB(formDB);

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
                            // jsonRequest = {};
                            // jsonRequest.nome = nome;
                            // jsonRequest.id = idMain10ance;
                            // jsonRequest.categoria = entità;
                            preparaModulo(nome, idMain10ance);
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

function preparaModulo(nome, id) {
    const hNome = document.createElement('h4');
    hNome.setAttribute('id', `modulo-aggiungi-${nome}`);
    hNome.innerHTML = `<b>NOME ELEMENTO: ${nome}</b>`;
    const hId = document.createElement('h5');
    hId.setAttribute('id', `modulo-aggiungi-${id}`);
    hId.innerHTML = `<b>IDENTIFICATIVO ELEMENTO: ${id}</b>`;
    formDB.appendChild(hNome);
    formDB.appendChild(hId);
}

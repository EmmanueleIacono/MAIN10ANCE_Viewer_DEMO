"use strict";

const contenitoreRicerca = document.getElementById('contenitore-campo-ricerca');
const formDB = document.getElementById('formDB');

// QUI SOTTO CI SONO I VARI CONTROLLI CHE REGOLANO LE RICHIESTE AL SERVER

// REFRESH VIEWER
const bottoneRefrViewer = document.getElementById("refreshParams");
bottoneRefrViewer.addEventListener("click", () => {
    if (viewer) {
        viewer.clearSelection();
        viewer.isolate();
        viewer.fitToView();
    }
});

// BOTTONE RICERCA
const bottoneRicerca = document.getElementById('cercaID');
bottoneRicerca.addEventListener('click', () => {
    if (!viewer) {
        alert('Nessun modello selezionato');
        return;
    }
    if (!contenitoreRicerca.innerHTML) {
        const inputCerca = document.createElement('input');
        inputCerca.setAttribute('placeholder', 'id_main10ance');
        contenitoreRicerca.appendChild(inputCerca);
        inputCerca.addEventListener('keyup', () => {
            viewer.search(inputCerca.value, el => {
                viewer.select(el);
            }, () => {
                alert('Errore nella ricerca');
            }, ['id_main10ance']);
        });
    }
    else {
        contenitoreRicerca.innerHTML = '';
    }
});

// INTERROGA MODELLO
const bottoneQuery = document.getElementById("queryDB");
bottoneQuery.addEventListener("click", mostraSchedeElemento);

// ANNULLA INTERROGAZIONE - RIPULISCI FORM
const bottoneCanc = document.getElementById("annullaDB");
bottoneCanc.addEventListener("click", () => {
    svuotaContenitore(divDetailsSelezione);
    svuotaContenitore(formDB);
    detailsSelezione.style.display = 'none';
    if (viewer) {
        viewer.clearSelection();
        viewer.isolate();
    }
    nascondiBottoniSchede();
});

// FUNZIONI

function svuotaContenitore(domElem) {
    while (domElem.firstChild) {
        domElem.removeChild(domElem.firstChild);
    }
}

async function mostraSchedeElemento() {
    svuotaContenitore(divDetailsSelezione);
    detailsSelezione.style.display = 'none';
    svuotaContenitore(formDB);
    nascondiBottoniSchede();

    if (!viewer) {
        alert('Nessun modello selezionato');
    }
    else {
        let selezione = viewer.getSelection();
        let isolato = viewer.getIsolatedNodes();
        if (isolato.length !== 0) {
            viewer.select(isolato);
            selezione = viewer.getSelection();
        }
        if ((selezione.length === 1) || (isolato.length === 1)) {
            const schedaAnagrafica = await prendiSchedeAnagrafica();
            const schedeControllo = await prendiSchedeControllo();
            const schedeManReg = await prendiSchedeManReg();
            const schedeManCorr = await prendiSchedeManCorr();
            const schedeRestauro = await prendiSchedeRestauro();
            const [detailsSchedeAnagrafica, divSchedeAnagrafica] = creaDetailsPerSchede('Scheda anagrafica');
            const [detailsSchedeControllo, divSchedeControllo] = creaDetailsPerSchede('Schede di controllo');
            const [detailsSchedeManReg, divSchedeManReg] = creaDetailsPerSchede('Schede di manutenzione ordinaria');
            const [detailsSchedeManCorr, divSchedeManCorr] = creaDetailsPerSchede('Schede di manutenzione correttiva');
            const [detailsSchedeRestauro, divSchedeRestauro] = creaDetailsPerSchede('Schede di restauro');
            formDB.appendChild(detailsSchedeAnagrafica);
            formDB.appendChild(detailsSchedeControllo);
            formDB.appendChild(detailsSchedeManReg);
            formDB.appendChild(detailsSchedeManCorr);
            formDB.appendChild(detailsSchedeRestauro);

            selezione.forEach(async (s) => {
                viewer.getProperties(s, async (props) => {
                    props.properties.forEach(p => {
                        if (p.displayName === "id_main10ance") {
                            let idMain10ance = p.displayValue;
                            visualizzaSchedeElemento(divSchedeAnagrafica, schedaAnagrafica, 'Codice scheda anagrafica', 'Elemento schedato', idMain10ance, 'var(--gialloAnagraficaTrasparenza)');
                            visualizzaSchedeElemento(divSchedeControllo, schedeControllo, 'Codice scheda controllo', 'Elementi controllati', idMain10ance, 'var(--verdeMain10anceTrasparenza)');
                            visualizzaSchedeElemento(divSchedeManReg, schedeManReg, 'Codice scheda manutenzione regolare', 'Elementi interessati', idMain10ance, 'var(--bluInterregTrasparenza2)');
                            visualizzaSchedeElemento(divSchedeManCorr, schedeManCorr, 'Codice scheda manutenzione correttiva', 'Elementi interessati', idMain10ance, 'var(--bluInterregTrasparenza2)');
                            visualizzaSchedeElemento(divSchedeRestauro, schedeRestauro, 'Codice scheda restauro', 'Elementi interessati', idMain10ance, 'var(--bluInterregTrasparenza2)');
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
        viewer.isolate(selezione);
        viewer.fitToView(selezione);
    }
}

function creaDetailsPerSchede(nomeScheda) {
    const detailsBIM = document.createElement('details');
    const summaryBIM = document.createElement('summary');
    const divBIM = document.createElement('div');
    summaryBIM.setAttribute('class', 'sommario-main10ance');
    summaryBIM.innerHTML = `<b>${nomeScheda}</b>`;
    detailsBIM.appendChild(summaryBIM);
    detailsBIM.appendChild(divBIM);
    return [detailsBIM, divBIM];
}

function visualizzaSchedeElemento(divTipoScheda, listaSchede, chiaveIDScheda, chiaveIDMain10ance, idMain10ance, colore) {
    listaSchede.forEach(sc => {
        if (sc[chiaveIDMain10ance].includes(idMain10ance)) {
            const nomeScheda = `Scheda n. ${sc[chiaveIDScheda]}`;
            const [detailsScheda, divScheda] = creaDetailsPerSchede(nomeScheda);
            for (const [chiave, valore] of Object.entries(sc)) {
                const nomeChiave = document.createElement('p');
                nomeChiave.style.lineHeight = 1;
                nomeChiave.innerHTML = `<b>${chiave}:</b>`;
                const testoValore = document.createElement('p');
                testoValore.style.lineHeight = 1;
                testoValore.style.overflowWrap = 'break-word';
                if ((!valore) || (valore === 'null')) {
                    testoValore.innerHTML = `<i>Nessun valore</i>`;
                }
                else {
                    testoValore.innerHTML = `${valore}`;
                }
                divScheda.appendChild(nomeChiave);
                divScheda.appendChild(testoValore);
            }
            detailsScheda.style.paddingLeft = '20px';
            detailsScheda.style.backgroundColor = colore;
            divTipoScheda.appendChild(detailsScheda);
        }
    });
}

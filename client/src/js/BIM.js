"use strict";

import store from '../store/index';

export let viewer;

export function getModel(urn) {
    if ((urn !== null) && (urn !== '')) {
        store.methods.setTabAttivo('Tab1');
        if (urn !== store.stateBIM.urnModelloCorrente) {
            launchViewer(urn);
        }
        console.log(urn);
    }
    else {
        alert('Nessun modello presente per questo elemento');
    }
}

function launchViewer(urn, opzioniPostLoading) {
    const opzioniPost = opzioniPostLoading || undefined;

    const options = {
        env: 'AutodeskProduction',
        getAccessToken: getForgeToken,
        opz: opzioniPost
    }

    if (urn !== store.stateBIM.urnModelloCorrente) {
        store.stateBIM.modelPlaceholder = false;
        Autodesk.Viewing.Initializer(options, () => {
            viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), { extensions: ['Autodesk.DocumentBrowser', 'Autodesk.VisualClusters'] });
            if (options.opz) {
                viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, () => {
                    options.opz();
                });
            }
            viewer.start();
            const documentId = 'urn:' + urn;
            Autodesk.Viewing.Document.load(documentId, doc => {onDocumentLoadSuccess(doc, urn)}, onDocumentLoadFailure);
        });
    }
    else {
        if (options.opz) {
            options.opz();
        }
    }
}

function onDocumentLoadSuccess(doc, urn) {
    const viewables = doc.getRoot().getDefaultGeometry();
    viewer.loadDocumentNode(doc, viewables).then(i => {
        // documented loaded, any action?
        store.stateBIM.urnModelloCorrente = urn;
    });
}

function onDocumentLoadFailure(viewerErrorCode) {
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function getForgeToken(callback) {
    fetch('/api/forge/oauth/token').then(res => {
        res.json().then(data => {
            callback(data.access_token, data.expires_in);
        });
    });
}

export function resetVista() {
    if (viewer) {
        viewer.clearSelection();
        viewer.isolate();
        viewer.fitToView();
    }
}

export function cercaSelezionaId(id) {
    viewer.search(id, el => {
        viewer.select(el);
    }, () => {
        alert('Errore nella ricerca');
    }, ['id_main10ance']);
}

// GET PROPERTIES MA CHE RITORNA PROMISE CON QUELLO CHE INTERESSA
function getProps(model, dbids, options) {
    return new Promise((resolve, reject) => {
        model.getBulkProperties(dbids, options, resolve, reject);
    });
}

// RITORNA UNA LISTA DI ID_MAIN10ANCE A PARTIRE DA UNA LISTA DI DBID DEL VIEWER
export async function getIdM10AFromSelezione(selezione) {
    const opz = {
        propFilter: ['id_main10ance'],
        ignoreHidden: true
    };
    const listaOggettiIdM10A = await getProps(viewer.model, selezione, opz);
    const listaIdM10A = listaOggettiIdM10A.map(ogg => (ogg.properties[0].displayValue));
    return listaIdM10A;
}

// RITORNA LA LISTA DEGLI ELEMENTI SELEZIONATI O ISOLATI
export function getElementiSelezionati() {
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

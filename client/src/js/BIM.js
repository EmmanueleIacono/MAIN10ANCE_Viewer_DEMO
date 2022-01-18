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

export function launchViewer(urn, opzioniPostLoading) {
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

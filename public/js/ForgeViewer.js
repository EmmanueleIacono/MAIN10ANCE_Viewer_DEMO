"use strict";

function launchViewer(urn, opzioniPostLoading) {
  const opzioniPost = opzioniPostLoading || undefined;

  const options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken,
    opz: opzioniPost
  };

  Autodesk.Viewing.Initializer(options, () => {
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), { extensions: ['Autodesk.DocumentBrowser', 'Autodesk.VisualClusters'] });
    // QUESTO LISTENER QUA SOTTO PUO' TORNARE UTILE
    if (options.opz) {
      viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, () => {
        options.opz();
      });
    }
    viewer.start();
    const documentId = 'urn:' + urn;
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
  });
}

function onDocumentLoadSuccess(doc) {
  const viewables = doc.getRoot().getDefaultGeometry();
  viewer.loadDocumentNode(doc, viewables).then(i => {
    // documented loaded, any action?
    // if (opz) {
    //   opz();
    // }
    // viewer.fitToView();
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

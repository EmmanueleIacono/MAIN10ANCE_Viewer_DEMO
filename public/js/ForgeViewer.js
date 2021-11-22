"use strict";

let viewer;

function launchViewer(urn, opzioniPostLoading) {
  const opzioniPost = opzioniPostLoading || undefined;

  const options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken,
    opz: opzioniPost
  };

  Autodesk.Viewing.Initializer(options, () => {
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), { extensions: ['Autodesk.DocumentBrowser', 'Autodesk.VisualClusters'] });
    viewer.start();
    const documentId = 'urn:' + urn;
    let opzFunc = options.opz;
    Autodesk.Viewing.Document.load(documentId, (doc) => {
      onDocumentLoadSuccess(doc, opzFunc);
    }, onDocumentLoadFailure);
  });
}

function onDocumentLoadSuccess(doc, opz) {
  const viewables = doc.getRoot().getDefaultGeometry();
  viewer.loadDocumentNode(doc, viewables).then(i => {
    // documented loaded, any action?
    if (opz) {
      opz();
    }
    viewer.fitToView();
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

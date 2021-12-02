"use strict";

function launchViewer(urn, opzioniPostLoading) {
  const opzioniPost = opzioniPostLoading || undefined;

  const options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken,
    opz: opzioniPost
  };

  if (urn !== urnModelloCorrente) {
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
    urnModelloCorrente = urn;
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

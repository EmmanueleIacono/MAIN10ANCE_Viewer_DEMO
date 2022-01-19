"use strict";

$(document).ready(function () {
  prepareAppBucketTree();
  $('#refreshBuckets').click(function () {
    $('#appBuckets').jstree(true).refresh();
  });
});
  
function prepareAppBucketTree() {
  $('#appBuckets').jstree({
    'core': {
      'themes': { "icons": true },
      'data': {
        "url": '/api/forge/oss/buckets',
        "dataType": "json",
        'multiple': false,
        "data": function (node) {
          return { "id": node.id };
        }
      }
    },
    'types': {
      'default': {
        'icon': 'glyphicon glyphicon-question-sign'
      },
      '#': {
        'icon': 'glyphicon glyphicon-cloud'
      },
      'bucket': {
        'icon': 'glyphicon glyphicon-folder-open'
      },
      'object': {
        'icon': 'glyphicon glyphicon-file'
      }
    },
    "plugins": ["types",/* "state",*/ "sort", /*"contextmenu"*/],
  }).on('loaded.jstree', function () {
    // questo .bind() è di jQuery (!== JavaScript .bind()) e serve per associare un event handler al nodo
  }).bind("activate_node.jstree", function (evt, data) { // "activate_node.jstree" è un evento di jsTree tipo "click" su un nodo
    if (data != null && data.node != null && data.node.type == 'object') {
      var urn = data.node.id;
      if (urn !== urnModelloCorrente) {
        try {
          document.getElementById('apriTabBIM').click();
          launchViewer(urn);
        }
        catch {
          let messaggioDiErrore = 'Modello non disponibile.';
          $('#forgeViewer').html(messaggioDiErrore);
        }
      }
      else {
        alert('ATTENZIONE: Il modello selezionato è già visibile');
      }
    }
  });
}

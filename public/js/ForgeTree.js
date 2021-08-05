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
            // console.log(node); //voglio capire che cosa sono questi NODE
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
      // $('#appBuckets').jstree('open_all');
    }).bind("activate_node.jstree", function (evt, data) { // "activate_node.jstree" è l'evento tipo "click", che invoca una callback
      console.log(data); // voglio capire che cos'è DATA
      if (data != null && data.node != null && data.node.type == 'object') {
        $("#forgeViewer").empty();
        var urn = data.node.id;
        try {
          document.getElementById('apriTabBIM').click();
          launchViewer(urn);
        }
        catch {
          let messaggioDiErrore = 'Modello non disponibile.';
          $('#forgeViewer').html(messaggioDiErrore);
        }
      }
    });
  }

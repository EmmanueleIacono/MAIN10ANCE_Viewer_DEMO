<template>
<div id="appGIS-parent">
  <div id="appGIS">
    <div id="mappa">Mappa GIS</div>
  </div>
</div>
</template>

<script>
import {onMounted, inject, watch} from 'vue';
import {aggiungiLayer, creaMappa, rimuoviLayer, setVistaMappa, mappaGlb, creaMarkerSM, creaMarkerCapp} from '../js/GIS';
import L from 'leaflet';

export default {
  name: 'TabGISMappa',
  setup() {
    // DA FARE: IMPOSTARE MAPPA.INVALIDATESIZE(); SULLA MAPPA QUANDO RIATTIVO IL TAB GIS
    const store = inject('store');

    const posOrigine = [45.61422, 8.410177];

    onMounted(() => {
      creaMappa('mappa', posOrigine);

      const gruppoMarkerCappelle = L.layerGroup();
      const gruppoMarkerSacriMonti = L.layerGroup();

      watch(() => [store.stateGIS.markerSM, store.stateGIS.markerCapp], () => {
        if (store.stateGIS.markerSM) {
          store.stateGIS.markerSM.forEach(sm => {
            const markerSM = creaMarkerSM(sm);
            markerSM.addTo(gruppoMarkerSacriMonti);
          });
        }
        if (store.stateGIS.markerCapp) {
          store.stateGIS.markerCapp.forEach(capp => {
            const markerCapp = creaMarkerCapp(capp);
            markerCapp.addTo(gruppoMarkerCappelle);
          });
        }
      });

      setInterval(() => {
        const zoomComune = 17;
        if (mappaGlb.getZoom() < zoomComune) {
          aggiungiLayer(gruppoMarkerSacriMonti, mappaGlb);
          rimuoviLayer(gruppoMarkerCappelle, mappaGlb);
        }
        else if (mappaGlb.getZoom() > zoomComune) {
          aggiungiLayer(gruppoMarkerCappelle, mappaGlb);
          rimuoviLayer(gruppoMarkerSacriMonti, mappaGlb);
        }
        else {
          aggiungiLayer(gruppoMarkerSacriMonti, mappaGlb);
          aggiungiLayer(gruppoMarkerCappelle, mappaGlb);
        }
      }, 100);
    });

    function resetMap() {
      setVistaMappa(mappaGlb, posOrigine, 8);
    }

    return {
      store,
      resetMap,
    }
  }
}
</script>

<style scoped>
@import '~leaflet/dist/leaflet.css';

#appGIS, #appGIS-parent {
  height: 100%;
}
#mappa {
  height: inherit;
  position: static;
}
</style>

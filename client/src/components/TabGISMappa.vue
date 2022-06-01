<template>
<div id="appGIS-parent">
  <div id="appGIS">
    <div id="mappa">Mappa GIS</div>
  </div>
</div>
</template>

<script>
import {onMounted, inject, watch, onActivated} from 'vue';
import {aggiungiLayer, creaMappa, rimuoviLayer, setVistaMappa, mappaGlb, creaMarker, iconaSM, iconaCappelle} from '../js/GIS';
import L from 'leaflet';

export default {
  name: 'TabGISMappa',
  setup() {
    const store = inject('store');

    const posOrigine = [45.61422, 8.410177];

    onMounted(() => {
      creaMappa('mappa', posOrigine);

      const gruppoMarkerLocalità = L.layerGroup();
      const gruppoMarkerEdifici = L.layerGroup();

      mappaGlb.on('zoomend', () => {
        const zoomComune = 17;
        if (mappaGlb.getZoom() <= 5) {
          rimuoviLayer(gruppoMarkerLocalità, mappaGlb);
          rimuoviLayer(gruppoMarkerEdifici, mappaGlb);
        }
        else if (mappaGlb.getZoom() < zoomComune && mappaGlb.getZoom() > 5) {
          aggiungiLayer(gruppoMarkerLocalità, mappaGlb);
          rimuoviLayer(gruppoMarkerEdifici, mappaGlb);
        }
        else if (mappaGlb.getZoom() > zoomComune) {
          aggiungiLayer(gruppoMarkerEdifici, mappaGlb);
          rimuoviLayer(gruppoMarkerLocalità, mappaGlb);
        }
        else {
          aggiungiLayer(gruppoMarkerLocalità, mappaGlb);
          aggiungiLayer(gruppoMarkerEdifici, mappaGlb);
        }
      });

      aggiungiLayer(gruppoMarkerLocalità, mappaGlb);

      watch(() => [store.stateGIS.markerLoc, store.stateGIS.markerEdif], () => {
        if (store.stateGIS.markerLoc) {
          store.stateGIS.markerLoc.forEach(loc => {
            const markerSM = creaMarker(loc, iconaSM);
            markerSM.addTo(gruppoMarkerLocalità);
          });
        }
        if (store.stateGIS.markerEdif) {
          store.stateGIS.markerEdif.forEach(edif => {
            const markerCapp = creaMarker(edif, iconaCappelle);
            markerCapp.addTo(gruppoMarkerEdifici);
          });
        }
      });
    });

    onActivated(() => {
      setTimeout(() => {
        mappaGlb.invalidateSize();
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

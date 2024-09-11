<template>
<div id="appGIS-parent">
  <div id="appGIS">
    <div id="mappa">Mappa GIS</div>
  </div>
</div>
</template>

<script>
import {onMounted, inject, watch, onActivated} from 'vue';
import {aggiungiLayer, creaMappa, rimuoviLayer, setVistaMappa, mappaGlb, creaMarker, iconaSM, iconaCappelle, addLocPdiff, addMarkerAmbito, creaMarkerLocPdiff} from '../js/GIS';
import L from 'leaflet';
import 'leaflet.markercluster';

export default {
  name: 'TabGISMappa',
  setup(props, {emit}) {
    const store = inject('store');

    const posOrigine = [45.61422, 8.410177];

    onMounted(() => {
      creaMappa('mappa', posOrigine);

      const gruppoMarkerLocalità = L.layerGroup();
      const gruppoMarkerEdifici = L.layerGroup();
      // const gruppoMarkerLocPdiff = L.layerGroup();
      const clusterMarkerLocPdiff = L.markerClusterGroup(); // per opzioni, L.markerClusterGroup({...})

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

      mappaGlb.on('click', e => {
        const markerPdiff = addLocPdiff(e);
        const markerEdifAmbito = addMarkerAmbito(e);
        if (markerPdiff) {
          emit('newMarker', markerPdiff);
        }
        else if (markerEdifAmbito) {
          emit('newMarker', markerEdifAmbito);
        }
      });

      aggiungiLayer(gruppoMarkerLocalità, mappaGlb);
      // aggiungiLayer(gruppoMarkerLocPdiff, mappaGlb);
      aggiungiLayer(clusterMarkerLocPdiff, mappaGlb);

      watch(() => [store.stateGIS.markerLoc, store.stateGIS.markerEdif, store.stateGIS.markerLocPdiff], () => {
        if (store.stateGIS.markerLoc) {
          gruppoMarkerLocalità.clearLayers();
          store.stateGIS.markerLoc.forEach(loc => {
            const markerSM = creaMarker(loc, iconaSM);
            markerSM.addTo(gruppoMarkerLocalità);
          });
        }
        if (store.stateGIS.markerEdif) {
          gruppoMarkerEdifici.clearLayers();
          store.stateGIS.markerEdif.forEach(edif => {
            const markerCapp = creaMarker(edif, iconaCappelle);
            markerCapp.addTo(gruppoMarkerEdifici);
          });
        }
        if (store.stateGIS.markerLocPdiff) {
          // gruppoMarkerLocPdiff.clearLayers();
          clusterMarkerLocPdiff.clearLayers();
          store.stateGIS.markerLocPdiff.forEach(lpd => {
            const markerLocPdiff = creaMarkerLocPdiff(lpd);
            // markerLocPdiff.addTo(gruppoMarkerLocPdiff);
            markerLocPdiff.addTo(clusterMarkerLocPdiff);
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
      props,
      store,
      resetMap,
    }
  }
}
</script>

<style scoped>
@import '~leaflet/dist/leaflet.css';
@import '~leaflet.markercluster/dist/MarkerCluster.css';
@import '~leaflet.markercluster/dist/MarkerCluster.Default.css';

#appGIS, #appGIS-parent {
  height: 100%;
}
#mappa {
  height: inherit;
  position: static;
}
</style>

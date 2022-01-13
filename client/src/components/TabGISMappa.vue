<template>
<div id="appGIS-parent">
  <div id="appGIS">
    <div id="mappa">Mappa GIS</div>
  </div>
  <!-- <GISLayer v-for="(liv, key) in store.stateGIS.entitàGIS" :key="key" :livello="key" /> -->
</div>
</template>

<script>
import {onMounted, inject/*, watch*/} from 'vue';
import {aggiungiLayer, creaMappa, rimuoviLayer, setVistaMappa, mappaGlb} from '../js/GIS';
import L from 'leaflet';
// import GISLayer from './elementi/GISLayer.vue';

export default {
  name: 'TabGISMappa',
  // components: {
  //   GISLayer,
  // },
  setup() {
    const store = inject('store');
    const stateGIS = inject('stateGIS');

    // watch(() => stateGIS.mappaGIS, (newMappa) => {
    //   console.log(newMappa);
    // }, {
    //   immediate: true,
    //   deep: true
    // });

    const posOrigine = [45.61422, 8.410177];

    onMounted(() => {
      // stateGIS.mappaGIS = creaMappa('mappa', posOrigine);
      creaMappa('mappa', posOrigine);
      // console.log(mappaGlb);

      const gruppoMarkerCappelle = L.layerGroup();
      const gruppoMarkerSacriMonti = L.layerGroup();

      // setInterval(() => {
      //   const zoomComune = 17;
      //   if (stateGIS.mappaGIS.getZoom() < zoomComune) {
      //     aggiungiLayer(gruppoMarkerSacriMonti, stateGIS.mappaGIS);
      //     rimuoviLayer(gruppoMarkerCappelle, stateGIS.mappaGIS);
      //   }
      //   else if (stateGIS.mappaGIS.getZoom() > zoomComune) {
      //     aggiungiLayer(gruppoMarkerCappelle, stateGIS.mappaGIS);
      //     rimuoviLayer(gruppoMarkerSacriMonti, stateGIS.mappaGIS);
      //   }
      //   else {
      //     aggiungiLayer(gruppoMarkerSacriMonti, stateGIS.mappaGIS);
      //     aggiungiLayer(gruppoMarkerCappelle, stateGIS.mappaGIS);
      //   }
      // }, 100);
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

    // function resetMap() {
    //   setVistaMappa(stateGIS.mappaGIS, posOrigine, 8);
    // }
    function resetMap() {
      setVistaMappa(mappaGlb, posOrigine, 8);
    }

    return {
      store,
      stateGIS,
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

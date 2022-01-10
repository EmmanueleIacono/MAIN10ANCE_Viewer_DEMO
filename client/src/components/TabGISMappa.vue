<template>
<div id="appGIS-parent">
  <div id="appGIS">
    <div id="mappa">Qui mappa GIS</div>
  </div>
  <GISLayer v-for="(liv, key) in store.state.entitàGIS" :key="key" :livello="key" :mappa="store.state.mappaGIS" />
</div>
</template>

<script>
import {onMounted, inject, watch} from 'vue';
import L from 'leaflet';
import GISLayer from './elementi/GISLayer.vue';

export default {
  name: 'TabGISMappa',
  components: {
    GISLayer,
  },
  setup() {
    const store = inject('store');

    watch(() => store.state.tabelleGIS, (newLista) => {
      if (newLista) {
        console.log(newLista);
      }
    }, {
      immediate: true,
    });

    const posOrigine = [45.61422, 8.410177];

    onMounted(() => {
      store.methods.creaMappaGIS('mappa', posOrigine);

      const gruppoMarkerCappelle = L.layerGroup();
      const gruppoMarkerSacriMonti = L.layerGroup();

      setInterval(() => {
        const zoomComune = 17;
        if (store.state.mappaGIS.getZoom() < zoomComune) {
          store.methods.aggiungiLivello(gruppoMarkerSacriMonti);
          store.methods.rimuoviLivello(gruppoMarkerCappelle);
        }
        else if (store.state.mappaGIS.getZoom() > zoomComune) {
          store.methods.aggiungiLivello(gruppoMarkerCappelle);
          store.methods.rimuoviLivello(gruppoMarkerSacriMonti);
        }
        else {
          store.methods.aggiungiLivello(gruppoMarkerSacriMonti);
          store.methods.aggiungiLivello(gruppoMarkerCappelle);
        }
      }, 100);
    });

    function resetMap() {
      store.methods.setViewMappa(posOrigine, 8);
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

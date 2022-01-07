<template>
<div id="appGIS">
  <div id="mappa">Qui mappa GIS</div>
</div>
</template>

<script>
import {onMounted, inject, watch} from 'vue';
import L from 'leaflet';
import proj4 from 'proj4';
import 'proj4leaflet';

export default {
  name: 'TabGISMappa',
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
    let mappaGIS = undefined;
    proj4.defs("EPSG:32632","+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");

    onMounted(() => {
      mappaGIS = L.map('mappa').setView(posOrigine, 8);
      const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      const tiles = L.tileLayer(tileUrl, { attribution, "detectRetina": false, "maxNativeZoom": 20, "maxZoom": 19, "minZoom": 0, "noWrap": false, "opacity": 1, "subdomains": "abc", "tms": false});
      tiles.addTo(mappaGIS);

      const gruppoMarkerCappelle = L.layerGroup();
      const gruppoMarkerSacriMonti = L.layerGroup();

      setInterval(() => {
        const zoomComune = 17;
        if (mappaGIS.getZoom() < zoomComune) {
          mappaGIS.addLayer(gruppoMarkerSacriMonti);
          mappaGIS.removeLayer(gruppoMarkerCappelle);
        }
        else if (mappaGIS.getZoom() > zoomComune) {
          mappaGIS.addLayer(gruppoMarkerCappelle);
          mappaGIS.removeLayer(gruppoMarkerSacriMonti);
        }
        else {
          mappaGIS.addLayer(gruppoMarkerSacriMonti);
          mappaGIS.addLayer(gruppoMarkerCappelle);
        }
      }, 100);
    });

    function resetMap() {
      mappaGIS.setView(posOrigine, 8);
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

#appGIS {
  height: 100%;
}
#mappa {
  height: inherit;
  position: static;
}
</style>

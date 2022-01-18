<template>
<div>
  <MainPanel :colonna="'col-sm-9'">
    <MappaGIS ref="mappaRef" />
  </MainPanel>
  <Explorer :colonna="'col-sm-3'">
    <Details summary="NAVIGAZIONE">
      <button @click="chiamaResetMappa" class="selettoreSM-dropdown">
        <span class="glyphicon glyphicon-home" style="margin-right: 10px;"></span>HOME
      </button>
      <button v-for="(sm, ind) in store.stateGIS.markerSM" :key="ind" @click="setVistaMappa(sm.coord)" class="selettoreSM-dropdown">Sacro Monte di {{sm.nome}}</button>
    </Details>
    <br />
    <Details summary="LIVELLI GIS" @click="emettiLoadLivelli">
      <CheckboxGIS
        v-for="(liv, key) in store.stateGIS.entitàGIS"
        :key="key"
        :idUnivoco="key"
        :valore="key"
        :pronto="liv.ready"
        :nome="liv.alias"
        :colore="liv.colore"
        @creazioneLivello="creaLivello"
      />
    </Details>
  </Explorer>
</div>
</template>

<script>
import {ref, inject} from 'vue';
import MainPanel from './elementi/MainPanel.vue';
import Explorer from './elementi/Explorer.vue';
import MappaGIS from './TabGISMappa.vue';
import CheckboxGIS from './elementi/CheckboxGIS.vue';
import Details from './elementi/Details.vue';
import {mappaGlb, creaLivelloGIS} from '../js/GIS';

export default {
  name: 'TabGIS',
  components: {
    MainPanel,
    Explorer,
    MappaGIS,
    CheckboxGIS,
    Details,
  },
  setup(props, context) {
    const store = inject('store');
    const mappaRef = ref(null);
    const primoLoadLivelli = ref(false);

    function chiamaResetMappa() {
      mappaRef.value.resetMap();
    }

    function setVistaMappa(posizione) {
      mappaGlb.setView(posizione, 17);
    }

    function creaLivello(livId) {
      const liv = creaLivelloGIS(store.stateGIS.entitàGIS[livId]);
      const cbx = document.getElementById(`cbx-${livId}`);
      cbx.addEventListener('click', () => toggleLivello(liv, cbx));
    }

    function toggleLivello(livello, checkbox) {
      if (!checkbox.checked) {
        mappaGlb.removeLayer(livello);
      }
      else {
        mappaGlb.addLayer(livello);
      }
    }

    function emettiLoadLivelli() {
      if (!primoLoadLivelli.value) {
        context.emit('loadLivelli');
        primoLoadLivelli.value = true;
      }
    }

    return {
      props,
      store,
      mappaRef,
      chiamaResetMappa,
      setVistaMappa,
      creaLivello,
      emettiLoadLivelli,
    }
  }
}
</script>

<style scoped>
.selettoreSM-dropdown {
  cursor: pointer;
  position: relative;
  width: 100%;
  height: 40px;
  border: none;
  margin: 2px;
  background-color: var(--verdeMain10ance);
  color: var(--grigioMoltoScuro);
  font-weight: bold;
}

.selettoreSM-dropdown:hover {
  background-color: var(--verdeMain10anceTrasparenza);
}
</style>

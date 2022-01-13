<template>
<div>
  <MainPanel :colonna="'col-sm-9'">
    <MappaGIS ref="mappaRef" />
  </MainPanel>
  <Explorer :colonna="'col-sm-3'">
    <button @click="chiamaResetMappa" class="selettoreSM-dropdown">
      <span class="glyphicon glyphicon-home" style="margin-right: 10px;"></span>HOME
    </button>
    <!-- <button @click="stampaEnG">stampa mappa</button> -->
    <CheckboxGIS
      v-for="(liv, key) in store.stateGIS.entitàGIS"
      :key="key"
      :idUnivoco="key"
      :valore="key"
      :condizione="liv.ready"
      :nome="liv.alias"
      :colore="liv.colore"
    />
  </Explorer>
</div>
</template>

<script>
import {ref, reactive, provide, inject} from 'vue';
import MainPanel from './elementi/MainPanel.vue';
import Explorer from './elementi/Explorer.vue';
import MappaGIS from './TabGISMappa.vue';
import CheckboxGIS from './elementi/CheckboxGIS.vue';

export default {
  name: 'TabGIS',
  components: {
    MainPanel,
    Explorer,
    MappaGIS,
    CheckboxGIS,
  },
  setup() {
    const store = inject('store');
    const mappaRef = ref(null);
    const state = reactive({
      // mappaGIS: null,
      livelliGISAttivi: [],
    });
    provide('stateGIS', state);

    function chiamaResetMappa() {
      mappaRef.value.resetMap();
    }

    // function stampaEnG() {
    //   console.log(state.mappaGIS);
    // }

    return {
      store,
      state,
      mappaRef,
      chiamaResetMappa,
      // stampaEnG,
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

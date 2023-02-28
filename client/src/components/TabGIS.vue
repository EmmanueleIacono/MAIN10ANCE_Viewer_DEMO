<template>
<div>
  <MainPanel :colonna="'col-sm-9'">
    <MappaGIS ref="mappaRef" />
  </MainPanel>
  <Explorer :colonna="'col-sm-3'">
    <BtnBIM @click="addLocalMat" v-if="verificaDisplayAdd()" class="btn-gis" icona="glyphicon-plus" nome="addLocMateriale" title="Aggiungi località materiale" colore="verde" />
    <BtnBIM @click="confermaLocalMat" v-if="verificaDisplayConf()" class="btn-gis" icona="glyphicon-ok" nome="confLocMateriale" title="Conferma" colore="verde" />
    <BtnBIM @click="salvaLocalMat" v-if="verificaDisplaySalva()" class="btn-gis" icona="glyphicon-floppy-disk" nome="salvaLocMateriale" title="Salva" colore="verde" />
    <BtnBIM @click="annullaAddLocalMat" v-if="verificaDisplayAnnulla()" class="btn-gis" icona="glyphicon-remove" nome="annullaLocMateriale" title="Annulla" colore="verde" />
    <Details summary="NAVIGAZIONE">
      <button @click="chiamaResetMappa" class="selettoreSM-dropdown">
        <span class="glyphicon glyphicon-home" style="margin-right: 10px;"></span>HOME
      </button>
      <button v-for="(sm, ind) in store.stateGIS.markerLoc" :key="ind" @click="setVistaMappa(sm.coord)" class="selettoreSM-dropdown">{{sm.nome}}</button>
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
import {ref, inject, reactive} from 'vue';
import MainPanel from './elementi/MainPanel.vue';
import Explorer from './elementi/Explorer.vue';
import MappaGIS from './TabGISMappa.vue';
import CheckboxGIS from './elementi/CheckboxGIS.vue';
import Details from './elementi/Details.vue';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';
import {mappaGlb, creaLivelloGIS, rimuoviMarkerTemporaneo} from '../js/GIS';

export default {
  name: 'TabGIS',
  components: {
    MainPanel,
    Explorer,
    MappaGIS,
    CheckboxGIS,
    Details,
    BtnBIM,
  },
  setup(props, {emit}) {
    const store = inject('store');
    const mappaRef = ref(null);
    const primoLoadLivelli = ref(false);
    const state = reactive({
      nuovoMarker: null,
      nomeMarker: '',
      confirmMode: false,
    });

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
        emit('loadLivelli');
        primoLoadLivelli.value = true;
      }
    }

    async function addLocalMat() {
      const conferma = await store.methods.setConfirm('Vuoi aggiungere un nuovo marker a NOME LIVELLO?');
      if (conferma) {
        console.log('avvia procedimento');
        store.methods.setEditModeGIStrue();
      }
    }

    function confermaLocalMat() {
      console.log('conferma');
      store.methods.setEditModeGISfalse();
      state.confirmMode = true;
    }

    function salvaLocalMat() {
      console.log('salva');
      store.methods.setEditModeGISfalse();
      state.confirmMode = false;
      // quando salvo, id/sigla è LM_{$dataInteger()}
    }

    function annullaAddLocalMat() {
      console.log('annulla');
      store.methods.setEditModeGISfalse();
      rimuoviMarkerTemporaneo();
      state.confirmMode = false;
    }

    function verificaDisplayAdd() {
      return store.getters.getUsrVwList().includes('addLocMatGIS') && !store.stateGIS.editMode && !state.confirmMode;
    }

    function verificaDisplayConf() {
      return store.getters.getUsrVwList().includes('addLocMatGIS') && store.stateGIS.editMode && !state.confirmMode;
    }

    function verificaDisplaySalva() {
      return store.getters.getUsrVwList().includes('addLocMatGIS') && !store.stateGIS.editMode && state.confirmMode;
    }

    function verificaDisplayAnnulla() {
      return store.getters.getUsrVwList().includes('addLocMatGIS') && (!(!store.stateGIS.editMode && !state.confirmMode));
    }

    return {
      props,
      store,
      mappaRef,
      state,
      chiamaResetMappa,
      setVistaMappa,
      creaLivello,
      emettiLoadLivelli,
      addLocalMat,
      confermaLocalMat,
      salvaLocalMat,
      annullaAddLocalMat,
      verificaDisplayAdd,
      verificaDisplayConf,
      verificaDisplaySalva,
      verificaDisplayAnnulla,
    }
  }
}
</script>

<style scoped>
.btn-gis ~ .btn-gis {
  margin-left: .9rem;
}

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

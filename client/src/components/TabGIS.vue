<template>
<div>
  <MainPanel :colonna="'col-sm-9'">
    <MappaGIS ref="mappaRef" @newMarker="updateMarker" />
  </MainPanel>
  <Explorer :colonna="'col-sm-3'">
    <AddMarkerAmbito />
    <br />
    <BtnBIM @click="addLocPdiff" v-if="verificaDisplayAdd()" class="btn-gis" icona="glyphicon-plus" nome="addLocPdiff" title="Aggiungi località patrimonio diffuso" colore="verde" />
    <BtnBIM @click="confermaLocPdiff" v-if="verificaDisplayConf()" class="btn-gis" icona="glyphicon-ok" nome="confLocPdiff" title="Conferma" colore="verde" />
    <BtnBIM @click="salvaLocPdiff" v-if="verificaDisplaySalva()" class="btn-gis" icona="glyphicon-floppy-disk" nome="salvaLocPdiff" title="Salva" colore="verde" />
    <BtnBIM @click="annullaAddLocPdiff" v-if="verificaDisplayAnnulla()" class="btn-gis" icona="glyphicon-remove" nome="annullaLocPdiff" title="Annulla" colore="verde" />
    <br />
    <div v-if="verificaDisplaySalva()" id="campo-nome-marker">
      <label class="nome" for="select-provincia">Provincia:</label>
      <select class="valore" id="select-provincia" v-model="state.provinciaMarker">
        <option v-for="prov in province" :key="prov.sigla" :value="prov.sigla">{{prov.nome}}</option>
      </select>
      <br />
      <label class="nome" for="select-comune">Comune:</label>
      <select class="valore" id="select-comune" v-model="state.comuneMarker">
        <option v-for="cm in state.listaComuniFiltrata" :key="cm.codice" :value="cm.nome">{{cm.nome}}</option>
      </select>
      <br />
      <label class="nome" for="input-nome">Nome punto:</label>
      <input class="valore" id="input-nome" v-model="state.nomeMarker" placeholder="Nome punto" />
      <br />
      <br />
      <p><b>Nome:</b> {{state.provinciaMarker}}_{{state.comuneMarker}}_{{state.nomeMarker}}</p>
    </div>
    <br />
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
import {ref, inject, reactive, watch, provide, toRefs} from 'vue';
import AddMarkerAmbito from './TabGISAddMarkerAmbito.vue';
import MainPanel from './elementi/MainPanel.vue';
import Explorer from './elementi/Explorer.vue';
import MappaGIS from './TabGISMappa.vue';
import CheckboxGIS from './elementi/CheckboxGIS.vue';
import Details from './elementi/Details.vue';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';
import {mappaGlb, creaLivelloGIS, rimuoviMarkerTemporaneo} from '../js/GIS';
import {creaNuovoLocPdiff} from '../js/richieste';
import {dataInteger} from '../js/shared';
import province from '../assets/json/province-italia.json';
import comuni from '../assets/json/comuni.json';

export default {
  name: 'TabGIS',
  components: {
    AddMarkerAmbito,
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
      listaComuniFiltrata: [],
      nuovoMarker: null,
      coordMarker: null,
      provinciaMarker: '',
      comuneMarker: '',
      nomeMarker: '',
      confirmMode: false,
    });
    // console.log(province);
    // console.log(comuni);

    // prendo i refs solo di ciò che mi serve
    const { nuovoMarker, coordMarker } = toRefs(state);

    provide('nuovoMarker', nuovoMarker);
    provide('coordMarker', coordMarker);

    watch(() => state.provinciaMarker, async newVal => {
      const listaComuniFiltrata = comuni.filter(cm => cm.sigla === newVal);
      state.listaComuniFiltrata = listaComuniFiltrata;
      if (listaComuniFiltrata[0]) state.comuneMarker = listaComuniFiltrata[0].nome;
      else state.comuneMarker = '';
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

    async function addLocPdiff() {
      const conferma = await store.methods.setConfirm('Vuoi aggiungere un nuovo marker al livello "Patrimonio diffuso"?');
      if (conferma) {
        store.methods.setEditModeGIStrue();
      }
    }

    function confermaLocPdiff() {
      if (!state.nuovoMarker) {
        store.methods.setAlert('Impossibile continuare senza aver impostato un punto.');
        return;
      }
      store.methods.setEditModeGISfalse();
      state.confirmMode = true;
    }

    async function salvaLocPdiff() {
      if (!state.provinciaMarker || !state.comuneMarker || !state.nomeMarker) {
        store.methods.setAlert('Impossibile continuare senza aver impostato correttamente un nome.');
        return;
      }
      store.methods.setEditModeGISfalse();
      state.confirmMode = false;
      const markerJson = {
        coord: state.coordMarker,
        nome: `${state.provinciaMarker}_${state.comuneMarker}_${state.nomeMarker}`,
        id_marker: `LPD_${dataInteger()}`,
      };
      const res = await creaNuovoLocPdiff(markerJson);
      if (res) {
        store.methods.setAlert('Operazione andata a buon fine.');
        emit('updateMappa');
      }
      else store.methods.setAlert('Operazione non riuscita, riprovare.');
    }

    function annullaAddLocPdiff() {
      store.methods.setEditModeGISfalse();
      rimuoviMarkerTemporaneo();
      state.confirmMode = false;
      resetStateMarker();
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

    function updateMarker(markerJson) {
      state.nuovoMarker = markerJson.marker;
      state.coordMarker = markerJson.coord;
    }

    function resetStateMarker() {
      state.nuovoMarker = null;
      state.coordMarker = null;
      state.provinciaMarker = '';
      state.comuneMarker = '';
      state.nomeMarker = '';
    }

    return {
      props,
      store,
      mappaRef,
      state,
      province,
      comuni,
      chiamaResetMappa,
      setVistaMappa,
      creaLivello,
      emettiLoadLivelli,
      addLocPdiff,
      confermaLocPdiff,
      salvaLocPdiff,
      annullaAddLocPdiff,
      verificaDisplayAdd,
      verificaDisplayConf,
      verificaDisplaySalva,
      verificaDisplayAnnulla,
      updateMarker,
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

.valore {
  float: right;
}
</style>

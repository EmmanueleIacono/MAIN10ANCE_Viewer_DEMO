<template>
  <Details class="loading-wrapper" summary="FILTRI" :open="true">
    <LoadingScreen :caricamento="caricamento" />
    <input v-model="vediSchedeAttivi" type="checkbox" id="check-generale">
    <label for="check-generale">ATTIVA FILTRI</label>
    <br>
    <button @click="attivaTutto(true)" :class="vediSchedeAttivi ? 'vedi-schede' : 'vedi-schede-disatt'" :disabled="!vediSchedeAttivi">SELEZIONA TUTTO</button>
    <button @click="attivaTutto(false)" :class="vediSchedeAttivi ? 'vedi-schede' : 'vedi-schede-disatt'" :disabled="!vediSchedeAttivi">DESELEZIONA TUTTO</button>
    <br>
    <input v-model="cbxTipoScheda" :disabled="!vediSchedeAttivi" type="checkbox" id="check-tipo-scheda">
    <label for="check-tipo-scheda">Scheda</label>
    <select v-model="selectTipoScheda" id="select-tipo-scheda">
      <option value="scheda anagrafica">Scheda anagrafica</option>
      <option value="scheda controllo">Scheda controllo</option>
      <option value="scheda manutenzione ordinaria">Scheda manutenzione ordinaria</option>
      <option value="scheda manutenzione correttiva">Scheda manutenzione correttiva</option>
      <option value="scheda manutenzione straordinaria">Scheda manutenzione straordinaria</option>
      <option value="scheda restauro">Scheda restauro</option>
    </select>
    <br>
    <input v-model="cbxSacroMonte" :disabled="!vediSchedeAttivi" type="checkbox" id="check-sacro-monte">
    <label for="check-sacro-monte">Sacro Monte</label>
    <select v-model="selectSacroMonte" id="select-sacro-monte">
      <option v-for="sm in listaSigleSM" :key="sm.sigla" :value="sm.sigla">{{sm.nome}}</option>
    </select>
    <br>
    <input v-model="cbxCappella" :disabled="!vediSchedeAttivi" type="checkbox" id="check-cappella">
    <label for="check-cappella">Cappella</label>
    <select v-model="selectCappella" id="select-cappella">
      <option v-for="capp in listaNumCappFiltrata" :key="capp.numero" :value="capp.numero">{{capp.nome}}</option>
    </select>
    <br>
    <input v-model="cbxElemento" :disabled="!vediSchedeAttivi" type="checkbox" id="check-elemento">
    <label for="check-elemento">Elemento</label>
    <select v-model="selectElemento" id="select-elemento">
      <option v-for="el in listaElementi" :key="el.tabella" :value="el.tabella">{{el.alias}}</option>
    </select>
    <br>
    <input v-model="cbxStCons" :disabled="!vediSchedeAttivi" type="checkbox" id="check-stato-conservazione">
    <label for="check-stato-conservazione">Stato di conservazione</label>
    <select v-model="selectStCons" id="select-stato-conservazione">
      <option v-for="stCons in listaStCons" :key="stCons.unnest" :value="stCons.unnest">{{stCons.unnest}}</option>
    </select>
    <br>
    <input v-model="cbxFenomeno" :disabled="!vediSchedeAttivi" type="checkbox" id="check-fenomeno">
    <label for="check-fenomeno">Fenomeno</label>
    <select v-model="selectFenomeno" id="select-fenomeno">
      <option v-for="f in listaFenomeni" :key="f.id_gloss" :value="f.id_gloss">{{f.id_gloss}}</option>
    </select>
    <br>
    <input v-model="cbxData" :disabled="!vediSchedeAttivi" type="checkbox" id="check-data">
    <label for="check-data">Data</label>
    <label for="input-data-da">Da</label>
    <input v-model="selectDataDa" type="date" id="input-data-da">
    <label for="input-data-a">A</label>
    <input v-model="selectDataA" type="date" id="input-data-a">
    <br>
  </Details>
</template>

<script>
import {onMounted, reactive, toRefs, watch} from 'vue';
import {prendiSigleSacriMonti, leggiDBMarkerCapp, prendiLOD3e4, leggiEnum, leggiGlossDegradi} from '../js/richieste';
import Details from './elementi/Details.vue';
import LoadingScreen from './elementi/LoadingScreen.vue';

export default {
  name: 'TabPlannerFiltri',
  components: {
    Details,
    LoadingScreen,
  },
  setup() {
    const state = reactive({
      caricamento: true,
      vediSchedeAttivi: false,
      cbxTipoScheda: false,
      cbxSacroMonte: false,
      cbxCappella: false,
      cbxElemento: false,
      cbxStCons: false,
      cbxFenomeno: false,
      cbxData: false,
      selectTipoScheda: 'scheda controllo',
      selectSacroMonte: '',
      selectCappella: '',
      selectElemento: '',
      selectStCons: '',
      selectFenomeno: '',
      selectDataDa: '',
      selectDataA: '',
      listaSigleSM: [],
      listaNumCapp: [],
      listaNumCappFiltrata: [],
      listaElementi: [],
      listaStCons: [],
      listaFenomeni: [],
    });

    watch(() => state.selectSacroMonte, async newVal => {
      const listaNumCappFiltrata = state.listaNumCapp.filter(capp => capp.sacro_monte === newVal);
      state.listaNumCappFiltrata = listaNumCappFiltrata;
      if (listaNumCappFiltrata[0]) state.selectCappella = listaNumCappFiltrata[0].numero;
    });

    onMounted(async () => {
      state.caricamento = true;
      const listaSigleSM = await prendiSigleSacriMonti();
      const listaNumCapp = await leggiDBMarkerCapp();
      const listaElementi = await prendiLOD3e4();
      const listaStCons = await leggiEnum('st_cons');
      const listaFenomeni = await leggiGlossDegradi();
      state.listaSigleSM = listaSigleSM;
      state.listaNumCapp = listaNumCapp;
      state.listaElementi = listaElementi;
      state.listaStCons = listaStCons;
      state.listaFenomeni = listaFenomeni;
      state.selectSacroMonte = listaSigleSM[0].sigla;
      state.selectElemento = listaElementi[0].tabella;
      state.selectStCons = listaStCons[0].unnest;
      state.selectFenomeno = listaFenomeni[0].id_gloss;
      state.caricamento = false;
    });

    function attivaTutto(tutto) {
      state.cbxTipoScheda = tutto;
      state.cbxSacroMonte = tutto;
      state.cbxCappella = tutto;
      state.cbxElemento = tutto;
      state.cbxStCons = tutto;
      state.cbxFenomeno = tutto;
      state.cbxData = tutto;
    }

    return {
      ...toRefs(state),
      attivaTutto,
    }
  }
}
</script>

<style scoped>
button ~ button {
  margin-left: .4rem;
}
input[type=checkbox] {
  margin-right: .4rem;
}
input[type=date], select {
  margin-left: .4rem;
}
label[for=input-data-da], label[for=input-data-a] {
  margin-left: .4rem;
  font-weight: normal;
}
.vedi-schede-disatt {
  cursor: not-allowed;
  background-color: var(--grigioScuro);
  border: none;
  font-weight: bold;
}
.vedi-schede {
  cursor: pointer;
  background-color: var(--verdeMain10ance);
  border: none;
  font-weight: bold;
}
.vedi-schede:hover {
  background-color: var(--verdeMain10anceTrasparenza);
}
</style>

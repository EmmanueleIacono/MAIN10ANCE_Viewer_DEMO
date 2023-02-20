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
    <select v-model="selectTipoScheda">
      <option value="scheda controllo">Scheda di controllo</option>
      <option value="scheda manutenzione ordinaria">Scheda di manutenzione ordinaria</option>
      <option value="scheda manutenzione correttiva">Scheda di manutenzione correttiva</option>
      <option value="scheda manutenzione straordinaria">Scheda di manutenzione straordinaria</option>
      <option value="scheda restauro">Scheda di restauro</option>
      <option value="scheda diagnosi">Scheda di di diagnosi</option>
    </select>
    <br>
    <input v-model="cbxLocalità" :disabled="!vediSchedeAttivi" type="checkbox" id="check-località">
    <label for="check-località">Località</label>
    <select v-model="selectLocalità">
      <option v-for="loc in store.statePlanner.listaSigleLoc" :key="loc.sigla" :value="loc.sigla">{{loc.nome}}</option>
    </select>
    <br>
    <input v-model="cbxEdificio" :disabled="!vediSchedeAttivi" type="checkbox" id="check-edificio">
    <label for="check-edificio">Edificio</label>
    <select v-model="selectEdificio">
      <option v-for="edif in listaEdifFiltrata" :key="edif.numero" :value="edif.numero">{{edif.nome}}</option>
    </select>
    <br>
    <input v-model="cbxElemento" :disabled="!vediSchedeAttivi" type="checkbox" id="check-elemento">
    <label for="check-elemento">Elemento</label>
    <select v-model="selectElemento">
      <option v-for="el in store.statePlanner.listaElementi" :key="el.tabella" :value="el.tabella">{{el.alias}}</option>
    </select>
    <!-- <br>
    <input v-model="cbxStCons" :disabled="!vediSchedeAttivi" type="checkbox" id="check-stato-conservazione">
    <label for="check-stato-conservazione">Stato di conservazione</label>
    <select v-model="selectStCons">
      <option v-for="stCons in store.statePlanner.listaStCons" :key="stCons.unnest" :value="stCons.unnest">{{stCons.unnest}}</option>
    </select> -->
    <!-- <br>
    <input v-model="cbxFenomeno" :disabled="!vediSchedeAttivi" type="checkbox" id="check-fenomeno">
    <label for="check-fenomeno">Fenomeno</label>
    <select v-model="selectFenomeno">
      <option v-for="f in store.statePlanner.listaFenomeni" :key="f.id_gloss" :value="f.id_gloss">{{f.id_gloss}}</option>
    </select> -->
    <br>
    <input v-model="cbxData" :disabled="!vediSchedeAttivi" type="checkbox" id="check-data">
    <label for="check-data">Data</label>
    <label for="input-data-da">Da</label>
    <input v-model="selectDataDa" type="date">
    <label for="input-data-a">A</label>
    <input v-model="selectDataA" type="date">
    <br>
  </Details>
</template>

<script>
import {inject, onMounted, reactive, toRefs, watch} from 'vue';
// import {prendiSigleLocalità, leggiDBMarkerEdif, prendiLOD3e4, leggiEnum, leggiGlossDegradi} from '../js/richieste';
import Details from './elementi/Details.vue';
import LoadingScreen from './elementi/LoadingScreen.vue';

export default {
  name: 'TabPlannerFiltri',
  components: {
    Details,
    LoadingScreen,
  },
  setup() {
    const store = inject('store');
    const state = reactive({
      caricamento: false,
      vediSchedeAttivi: false,
      cbxTipoScheda: false,
      cbxLocalità: false,
      cbxEdificio: false,
      cbxElemento: false,
      cbxStCons: false,
      cbxFenomeno: false,
      cbxData: false,
      selectTipoScheda: 'scheda controllo',
      selectLocalità: '',
      selectEdificio: '',
      selectElemento: '',
      // selectStCons: '',
      // selectFenomeno: '',
      selectDataDa: '',
      selectDataA: '',
      // listaSigleLoc: [],
      // listaEdif: [],
      listaEdifFiltrata: [],
      // listaElementi: [],
      // listaStCons: [],
      // listaFenomeni: [],
    });

    watch(() => store.statePlanner.datiPlannerLoaded, newVal => {
      if (newVal) inizializzaSelect();
    });

    watch(() => state.selectLocalità, async newVal => {
      const listaEdifFiltrata = store.statePlanner.listaEdif.filter(ed => ed.località === newVal);
      state.listaEdifFiltrata = listaEdifFiltrata;
      if (listaEdifFiltrata[0]) state.selectEdificio = listaEdifFiltrata[0].numero;
    });

    onMounted(async () => {
      // state.caricamento = true;
      // const listaSigleLoc = await prendiSigleLocalità();
      // const listaEdif = await leggiDBMarkerEdif();
      // const listaElementi = await prendiLOD3e4();
      // const listaStCons = await leggiEnum('st_cons');
      // const listaFenomeni = await leggiGlossDegradi();
      // state.listaSigleLoc = listaSigleLoc;
      // state.listaEdif = listaEdif;
      // state.listaElementi = listaElementi;
      // state.listaStCons = listaStCons;
      // state.listaFenomeni = listaFenomeni;
      // state.selectLocalità = listaSigleLoc[0].sigla;
      // state.selectElemento = listaElementi[0].tabella;
      // state.selectStCons = listaStCons[0].unnest;
      // state.selectFenomeno = listaFenomeni[0].id_gloss;
      // state.caricamento = false;
    });

    function inizializzaSelect() {
      if (store.statePlanner.listaSigleLoc.length) state.selectLocalità = store.statePlanner.listaSigleLoc[0].sigla;
      if (store.statePlanner.listaElementi.length) state.selectElemento = store.statePlanner.listaElementi[0].tabella;
      // if (store.statePlanner.listaStCons.length) state.selectStCons = store.statePlanner.listaStCons[0].unnest;
      // if (store.statePlanner.listaFenomeni.length) state.selectFenomeno = store.statePlanner.listaFenomeni[0].id_gloss;
    }

    function attivaTutto(tutto) {
      state.cbxTipoScheda = tutto;
      state.cbxLocalità = tutto;
      state.cbxEdificio = tutto;
      state.cbxElemento = tutto;
      // state.cbxStCons = tutto;
      // state.cbxFenomeno = tutto;
      state.cbxData = tutto;
    }

    return {
      store,
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

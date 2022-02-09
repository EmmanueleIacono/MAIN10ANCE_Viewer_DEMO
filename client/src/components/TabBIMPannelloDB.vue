<template>
  <div class="pannelloDB" v-if="verificaDisplay()">
    <BtnBIM @click="homeFunc" class="btn-bim" icona="glyphicon-home" nome="refreshParams" title="Home" colore="verde" />
    <BtnBIM @click="toggleInputCerca" class="btn-bim" icona="glyphicon-search" nome="cercaID" title="Trova" colore="verde" />
    <BtnBIM @click="interroga" class="btn-bim" icona="glyphicon-list-alt" nome="queryDB" title="Interroga" colore="verde" />
    <BtnBIM @click="aggiungi" class="btn-bim" icona="glyphicon-plus" nome="aggiungiDB" title="Aggiungi o modifica" colore="verde" />
    <br />
    <div id="contenitore-campo-ricerca">
      <input v-if="state.campoRicercaVisibile" v-model="state.valoreInputRicerca" placeholder="id_main10ance" />
    </div>
    <Details v-if="state.mostraElementiSelezionati && store.stateBIM.elementiSelezionati" summary="Elementi selezionati">
      <h5 v-for="idSel in store.stateBIM.elementiSelezionati" :key="idSel"><b>{{idSel}}</b></h5>
    </Details>
    <br />
    <SchedeAttivita v-if="store.stateBIM.schedeAttivitàVisibile" />
    <SchedeDB ref="SchedeDBRef" />
    <SchedeModuli />
  </div>
</template>

<script>
import {inject, reactive, watch, ref} from 'vue';
import {resetVista, cercaSelezionaId, getElementiSelezionati, getIdM10AFromSelezione, focusVista} from '../js/BIM';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';
import Details from './elementi/Details.vue';
import SchedeDB from './TabBIMSchedeRisultati.vue';
import SchedeModuli from './TabBIMSchedeModuli.vue';
import SchedeAttivita from './TabBIMSchedeAttività.vue';

export default {
  name: 'TabBIMPannelloDB',
  components: {
    BtnBIM,
    Details,
    SchedeDB,
    SchedeModuli,
    SchedeAttivita,
  },
  setup() {
    const store = inject('store');
    const SchedeDBRef = ref(null);
    const state = reactive({
      campoRicercaVisibile: false,
      valoreInputRicerca: '',
      mostraElementiSelezionati: true,
    });

    watch(() => state.valoreInputRicerca, newVal => {
      cercaSelezionaId(newVal);
    });

    function verificaDisplay() {
      return store.getters.getUsrVwList().includes('idPannelloDB');
    }

    function homeFunc() {
      state.valoreInputRicerca = '';
      state.campoRicercaVisibile = false;
      store.stateBIM.elementiSelezionati = null;
      store.stateBIM.schedeRisultatiVisibile = false;
      store.stateBIM.schedeModuliVisibile = false;
      resetVista();
    }

    function toggleInputCerca() {
      if (!store.stateBIM.urnModelloCorrente) {
        store.methods.setAlert('Nessun modello selezionato');
        return;
      }
      state.valoreInputRicerca = '';
      state.campoRicercaVisibile = !state.campoRicercaVisibile;
    }

    async function interroga() {
      store.stateBIM.schedeModuliVisibile = false;
      const elementiPronti = await preparaElementi();
      if (elementiPronti) {
        if (store.stateBIM.elementiSelezionati.length === 1) {
          store.stateBIM.schedeRisultatiVisibile = true;
          SchedeDBRef.value.popolaSchede();
        }
        else if (store.stateBIM.elementiSelezionati.length > 1) {
          store.methods.setAlert('Selezionare un solo elemento per volta');
        }
      }
      else {
        store.stateBIM.schedeRisultatiVisibile = false;
      }
    }

    async function aggiungi() {
      store.stateBIM.schedeRisultatiVisibile = false;
      const elementiPronti = await preparaElementi();
      if (elementiPronti) {
        store.stateBIM.schedeModuliVisibile = true;
      }
      else {
        store.stateBIM.schedeModuliVisibile = false;
      }
    }

    async function preparaElementi() {
      state.valoreInputRicerca = '';
      state.campoRicercaVisibile = false;
      if (!store.stateBIM.urnModelloCorrente) {
        store.methods.setAlert('Nessun modello selezionato');
        return false;
      }
      const selezionati = getElementiSelezionati();
      if (selezionati) {
        const idSelezionati = await getIdM10AFromSelezione(selezionati);
        store.stateBIM.elementiSelezionati = idSelezionati;

        focusVista(selezionati);
        return true;
      }
      else {
        store.stateBIM.elementiSelezionati = null;
        return false;
      }
    }

    return {
      store,
      SchedeDBRef,
      state,
      verificaDisplay,
      homeFunc,
      toggleInputCerca,
      interroga,
      aggiungi,
    }
  }
}
</script>

<style scoped>
.btn-bim ~ .btn-bim {
  margin-left: .9rem;
}
.pannelloDB {
  padding: 10px;
}
</style>

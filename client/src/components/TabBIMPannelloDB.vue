<template>
  <div class="pannelloDB" v-if="verificaDisplay()">
    <BtnBIM @click="homeFunc" class="btn-bim" icona="glyphicon-home" nome="refreshParams" title="Home" />
    <BtnBIM @click="toggleInputCerca" class="btn-bim" icona="glyphicon-search" nome="cercaID" title="Trova" />
    <BtnBIM @click="interroga" class="btn-bim" icona="glyphicon-list-alt" nome="queryDB" title="Interroga e modifica" />
    <BtnBIM class="btn-bim" icona="glyphicon-plus" nome="aggiungiDB" title="Aggiungi" />
    <!-- <BtnBIM class="btn-bim" icona="glyphicon-floppy-disk" nome="modificaDB" title="Salva" /> -->
    <BtnBIM class="btn-bim" icona="glyphicon-erase" nome="annullaDB" title="Annulla" />
    <br />
    <div id="contenitore-campo-ricerca">
      <input v-if="state.campoRicercaVisibile" v-model="state.valoreInputRicerca" placeholder="id_main10ance" />
    </div>
    <Details v-if="state.mostraElementiSelezionati && store.stateBIM.elementiSelezionati" summary="Elementi selezionati">
      <h5 v-for="idSel in store.stateBIM.elementiSelezionati" :key="idSel"><b>{{idSel}}</b></h5>
    </Details>
    <SchedeDB />
    <SchedeModuli />
  </div>
</template>

<script>
import {inject, reactive, watch} from 'vue';
import {resetVista, cercaSelezionaId, getElementiSelezionati, getIdM10AFromSelezione} from '../js/BIM';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';
import Details from './elementi/Details.vue';
import SchedeDB from './TabBIMSchedeRisultati.vue';
import SchedeModuli from './TabBIMSchedeModuli.vue';

export default {
  name: 'TabBIMPannelloDB',
  components: {
    BtnBIM,
    Details,
    SchedeDB,
    SchedeModuli,
  },
  setup() {
    const store = inject('store');
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
      state.valoreInputRicerca = '';
      state.campoRicercaVisibile = false;
      if (!store.stateBIM.urnModelloCorrente) {
        store.methods.setAlert('Nessun modello selezionato');
        return;
      }
      const selezionati = getElementiSelezionati();
      if (selezionati) {
        const idSelezionati = await getIdM10AFromSelezione(selezionati);
        store.stateBIM.elementiSelezionati = idSelezionati;
      }
      else {
        store.stateBIM.elementiSelezionati = null;
      }
    }

    return {
      store,
      state,
      verificaDisplay,
      homeFunc,
      toggleInputCerca,
      interroga,
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

<template>
  <div class="pannelloDB" v-if="verificaDisplay()">
    <BtnBIM @click="homeFunc" class="btn-bim" icona="glyphicon-home" nome="refreshParams" title="Home" />
    <BtnBIM @click="toggleInputCerca" class="btn-bim" icona="glyphicon-search" nome="cercaID" title="Trova" />
    <BtnBIM class="btn-bim" icona="glyphicon-list-alt" nome="queryDB" title="Interroga e modifica" />
    <BtnBIM class="btn-bim" icona="glyphicon-plus" nome="aggiungiDB" title="Aggiungi" />
    <!-- <BtnBIM class="btn-bim" icona="glyphicon-floppy-disk" nome="modificaDB" title="Salva" /> -->
    <BtnBIM class="btn-bim" icona="glyphicon-erase" nome="annullaDB" title="Annulla" />
    <br />
    <div id="contenitore-campo-ricerca">
      <input v-if="state.campoRicercaVisibile" v-model="state.valoreInputRicerca" placeholder="id_main10ance" />
    </div>
  </div>
</template>

<script>
import {inject, reactive, watch} from 'vue';
import {resetVista, cercaSelezionaId} from '../js/BIM';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';

export default {
  name: 'TabBIMPannelloDB',
  components: {
    BtnBIM,
  },
  setup() {
    const store = inject('store');
    const state = reactive({
      campoRicercaVisibile: false,
      valoreInputRicerca: '',
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
      resetVista();
    }

    function toggleInputCerca() {
      if (!store.stateBIM.urnModelloCorrente) {
        alert('Nessun modello selezionato');
        return;
      }
      state.valoreInputRicerca = '';
      state.campoRicercaVisibile = !state.campoRicercaVisibile;
    }

    return {
      state,
      verificaDisplay,
      homeFunc,
      toggleInputCerca,
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

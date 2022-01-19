<template>
  <div class="pannelloDB" v-if="verificaDisplay()">
    <BtnBIM class="btn-bim" icona="glyphicon-home" nome="refreshParams" title="Home" />
    <BtnBIM class="btn-bim" icona="glyphicon-search" nome="cercaID" title="Trova" />
    <BtnBIM class="btn-bim" icona="glyphicon-list-alt" nome="queryDB" title="Interroga e modifica" />
    <BtnBIM class="btn-bim" icona="glyphicon-plus" nome="aggiungiDB" title="Aggiungi" />
    <!-- <BtnBIM class="btn-bim" icona="glyphicon-floppy-disk" nome="modificaDB" title="Salva" /> -->
    <BtnBIM class="btn-bim" icona="glyphicon-erase" nome="annullaDB" title="Annulla" />
    <br />
    <div id="contenitore-campo-ricerca"></div>
  </div>
</template>

<script>
import {inject} from 'vue';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';

export default {
  name: 'TabBIMPannelloDB',
  components: {
    BtnBIM,
  },
  setup() {
    const store = inject('store');

    function verificaDisplay() {
      return store.getters.getUsrVwList().includes('idPannelloDB');
    }

    return {
      verificaDisplay,
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

<template>
<div>
  <!-- DA QUALCHE PARTE IN QUESTO COMPONENT INSERIRE SCHEDA ANAGRAFICA STATUA -->
  <div class="scheda-anagrafica">
    <div class="div-titolo-bottoni">
      <div class="float-dx div-bottoni">
        <BtnBIM @click="chiudiScheda" icona="glyphicon-remove" nome="chiudiScAnagLOD4" title="Chiudi" colore="blu" />
      </div>
      <h4><b>SCHEDA ANAGRAFICA</b></h4>
    </div>
    <br />
    <div v-if="stateAnagrafica.schedaAnagrafica">
      <div v-for="(valore, chiave) in stateAnagrafica.schedaAnagrafica" :key="chiave" class="contenitore-colonne">
        <p class="colonna"><b>{{chiave}}:</b></p>
        <p v-if="valore || valore === 'null'" class="brk-w user-field colonna">{{valore}}</p>
        <p v-else class="user-field colonna"><i>Nessun valore</i></p>
      </div>
    </div>
    <div v-else>
      <p><i>Nessuna scheda presente</i></p>
    </div>
  </div>
</div>
</template>

<script>
import { inject } from 'vue';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';

export default {
  name: 'TabCollectionModuloAnagrafica',
  components: {
    BtnBIM,
  },
  setup() {
    const store = inject('store');
    const stateAnagrafica = inject('stateAnagrafica');

    function chiudiScheda() {
      stateAnagrafica.schedaAnagraficaVisibile = false;
      stateAnagrafica.schedaAnagrafica = null;
    }

    return {
      store,
      stateAnagrafica,
      chiudiScheda,
    }
  }
}
</script>

<style scoped>
.scheda-anagrafica {
  background-color: var(--bluInterregTrasparenza);
  font-size: 13px;
  padding: 30px 14px;
}
.float-dx {
  float: right;
}
.user-field {
  line-height: 100%;
  padding: 0px;
  text-align: right;
}
.div-titolo-bottoni {
  position: relative;
}
.div-bottoni {
  position: absolute;
  bottom: -1rem;
  right: 0;
}
.brk-w {
  overflow-wrap: break-word;
}
.contenitore-colonne {
  display: flex;
}
.colonna {
  flex: 50%;
}
</style>

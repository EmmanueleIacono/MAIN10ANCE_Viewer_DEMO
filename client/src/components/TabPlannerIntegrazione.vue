<template>
<Card>
  <Details summary="PROGRAMMAZIONE" :open="aperto" class="loading-wrapper">
    <LoadingScreen :caricamento="caricamento" />
    <div class="contenitore-scelta-attività">
      <button @click="tabIntegrazioneAttivo = 'AttPianificate'" class="verde">ATTIVITÀ CICLICHE</button>
      <button @click="tabIntegrazioneAttivo = 'AttSegnalate'" class="giallo">ATTIVITÀ DI RIALLINEAMENTO</button>
    </div>
    <div class="contenitore-ordinaper">
      <p><b>Ordina per: </b></p>
      <div v-if="tabIntegrazioneAttivo === 'AttPianificate'">
        <input v-model="ordinaPer" type="radio" name="ordina" id="data-prog" class="mr" value="data_prog">
        <label for="data-prog">Urgenza</label>
      </div>
      <div v-if="tabIntegrazioneAttivo === 'AttSegnalate'">
        <input v-model="ordinaPer" type="radio" name="ordina" id="liv-priorit" class="mr" value="liv_priorità">
        <label for="liv-priorit">Livello di priorità</label>
      </div>
      <div>
        <input v-model="ordinaPer" type="radio" name="ordina" id="data-ins" class="mr" value="id_att_prog">
        <label for="data-ins">Data di inserimento</label>
      </div>
      <div class="contenitore-bottone">
        <button @click="mostraTutteAttProg" v-if="store.statePlanner.datiProgrammazione.attCicliche.some(att => !att.visibile)" class="glyphicon glyphicon-list" title="Mostra tutto"></button>
      </div>
    </div>
    <AttCicliche @integrazioneOK="emettiRefresh" v-show="tabIntegrazioneAttivo === 'AttPianificate'" :att="store.statePlanner.datiProgrammazione.attCicliche" />
    <AttRiallineamento @integrazioneOK="emettiRefresh" v-show="tabIntegrazioneAttivo === 'AttSegnalate'" :att="store.statePlanner.datiProgrammazione.attRiallineamento" />
  </Details>
</Card>
</template>

<script>
import {onMounted, reactive, toRefs, watch, inject} from 'vue';
import {leggiAttProgPerIntegrazione} from '../js/richieste';
import Card from './elementi/Card.vue';
import Details from './elementi/Details.vue';
import AttCicliche from './TabPlannerIntegrazioneAttCicliche.vue';
import AttRiallineamento from './TabPlannerIntegrazioneAttRiallineamento.vue';
import LoadingScreen from './elementi/LoadingScreen.vue';

export default {
  name: 'TabPlannerIntergazione',
  components: {
    Card,
    Details,
    AttCicliche,
    AttRiallineamento,
    LoadingScreen,
  },
  setup(props, {emit}) {
    const store = inject('store');
    const state = reactive({
      aperto: false,
      caricamento: false,
      tabIntegrazioneAttivo: 'AttPianificate',
      ordinaPer: 'data_prog',
    });

    watch(() => state.tabIntegrazioneAttivo, newVal => {
      if (newVal === 'AttPianificate') state.ordinaPer = 'data_prog';
      else state.ordinaPer = 'liv_priorità';
    });

    watch(() => state.ordinaPer, newVal => {
      if (state.tabIntegrazioneAttivo === 'AttPianificate') ordinaAttivitàCicliche(newVal);
      else ordinaAttivitàRiallineamento(newVal);
    });

    onMounted(async () => {
      await popolaAttività();
    });

    async function popolaAttività() {
      state.caricamento = true;
      const attDaIntegrare = await leggiAttProgPerIntegrazione(true);
      const attCicliche = attDaIntegrare.filter(att => att.tipo_attività.includes('controllo') || att.tipo_attività.includes('manutenzione regolare')).filter(att => !!att.id_main10ance.length);
      const attRiallineamento = attDaIntegrare.filter(att => !att.tipo_attività.includes('controllo') && !att.tipo_attività.includes('manutenzione regolare'));
      store.statePlanner.datiProgrammazione.attCicliche = attCicliche;
      store.statePlanner.datiProgrammazione.attCicliche.forEach(att => att.visibile = true);
      store.statePlanner.datiProgrammazione.attRiallineamento = attRiallineamento;
      if (state.tabIntegrazioneAttivo === 'AttPianificate') ordinaAttivitàCicliche(state.ordinaPer);
      else ordinaAttivitàRiallineamento(state.ordinaPer);
      state.caricamento = false;
    }

    function ordinaAttivitàCicliche(param) {
      if (param === 'data_prog') store.statePlanner.datiProgrammazione.attCicliche.sort((a, b) => a[param].localeCompare(b[param]));
      else store.statePlanner.datiProgrammazione.attCicliche.sort((a, b) => b[param].localeCompare(a[param]));
    }

    function ordinaAttivitàRiallineamento(param) {
      if (param === 'liv_priorità') store.statePlanner.datiProgrammazione.attRiallineamento.sort((a, b) => parseInt(b[param]) - parseInt(a[param]));
      else store.statePlanner.datiProgrammazione.attRiallineamento.sort((a, b) => b[param].localeCompare(a[param]));
    }

    function emettiRefresh() {
      emit('integrazioneAggiornata');
    }

    function mostraTutteAttProg() {
      store.statePlanner.datiProgrammazione.attCicliche.forEach(att => att.visibile = true);
    }

    return {
      store,
      ...toRefs(state),
      popolaAttività,
      emettiRefresh,
      mostraTutteAttProg,
    }
  }
}
</script>

<style scoped>
.contenitore-scelta-attività {
  display: flex;
  justify-content: space-between;
}
.contenitore-scelta-attività button {
  border: none;
  color: var(--ghostWhite);
  padding: 5px;
  font-weight: bold;
  flex: 0 0 49.3%;
  margin: 10px 0;
}
button.verde {
  background-color: var(--verdeMain10ance);
}
button.verde:hover {
  background-color: var(--verdeMain10anceTrasparenza);
}
button.giallo {
  background-color: var(--gialloIntervento);
}
button.giallo:hover {
  background-color: var(--gialloInterventoTrasparenza);
}
.contenitore-ordinaper {
  display: flex;
}
.contenitore-ordinaper div {
  margin-left: 20px;
}
.contenitore-ordinaper button {
  float: right;
}
.contenitore-bottone {
  display: flex;
  margin-left: auto;
}
.contenitore-bottone button {
  border: none;
  background-color: transparent;
  font-size: large;
}
.mr {
  margin-right: 5px;
}
</style>

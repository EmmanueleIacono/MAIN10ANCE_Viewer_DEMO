<template>
<Card>
  <Details summary="PROGRAMMAZIONE" :open="false" class="loading-wrapper">
    <LoadingScreen :caricamento="caricamento" />
    <div class="contenitore-scelta-attività">
      <button @click="tabIntegrazioneAttivo = 'AttPianificate'" class="verde">ATTIVITÀ CICLICHE</button>
      <button @click="tabIntegrazioneAttivo = 'AttSegnalate'" class="giallo">ATTIVITÀ DI RIALLINEAMENTO</button>
    </div>
    <div class="contenitore-ordinaper">
      <p><b>Ordina per: </b></p>
      <div v-if="tabIntegrazioneAttivo === 'AttPianificate'">
        <input v-model="ordinaPer" type="radio" name="ordina" id="data-prog" class="mr" value="data_prog">
        <label for="data-prog">Data pianificata</label>
      </div>
      <div v-if="tabIntegrazioneAttivo === 'AttSegnalate'">
        <input v-model="ordinaPer" type="radio" name="ordina" id="liv-priorit" class="mr" value="liv_priorità">
        <label for="liv-priorit">Livello di priorità</label>
      </div>
      <div>
        <input v-model="ordinaPer" type="radio" name="ordina" id="data-ins" class="mr" value="id_att_prog">
        <label for="data-ins">Data di inserimento</label>
      </div>
    </div>
    <AttCicliche @integrazioneOK="emettiRefresh" v-show="tabIntegrazioneAttivo === 'AttPianificate'" :att="attCicliche" />
    <AttRiallineamento v-show="tabIntegrazioneAttivo === 'AttSegnalate'" :att="attRiallineamento" />
  </Details>
</Card>
</template>

<script>
import {onMounted, reactive, toRefs, watch} from 'vue';
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
    const state = reactive({
      caricamento: false,
      tabIntegrazioneAttivo: 'AttPianificate',
      ordinaPer: 'data_prog',
      attCicliche: [],
      attRiallineamento: [],
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
      const attCicliche = attDaIntegrare.filter(att => att.tipo_attività.includes('controllo') || att.tipo_attività.includes('manutenzione regolare'));
      const attRiallineamento = attDaIntegrare.filter(att => !att.tipo_attività.includes('controllo') && !att.tipo_attività.includes('manutenzione regolare'));
      state.attCicliche = attCicliche;
      state.attRiallineamento = attRiallineamento;
      ordinaAttivitàCicliche(state.ordinaPer);
      state.caricamento = false;
    }

    ///////////////////// IMPORTANTE: DA RIVEDERE BENE IL MODO IN CUI FUNZIONANO QUESTI SORT PER LE ATTIVITA' /////////////////
    function ordinaAttivitàCicliche(param) {
      // if (param === 'data_prog') {
      //   state.attRiallineamento.sort((a, b) => Date.parse(a[param]) - Date.parse(b[param]));
      // }
      // else state.attCicliche.sort((a, b) => a[param].localeCompare(b[param]));
      state.attCicliche.sort((a, b) => a[param].localeCompare(b[param]));
    }

    function ordinaAttivitàRiallineamento(param) {
      if (param === 'liv_priorità') {
        state.attRiallineamento.sort((a, b) => parseInt(b[param]) - parseInt(a[param]));
      }
      else state.attRiallineamento.sort((a, b) => a[param].localeCompare(b[param]));
      // else state.attRiallineamento.sort((a, b) => Date.parse(a[param]) - Date.parse(b[param]));
    }

    function emettiRefresh() {
      emit('integrazioneAggiornata');
    }

    return {
      ...toRefs(state),
      popolaAttività,
      emettiRefresh,
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
.mr {
  margin-right: 5px;
}
</style>

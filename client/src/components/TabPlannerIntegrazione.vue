<template>
<Card>
  <Details summary="INTEGRAZIONE" :open="true" class="loading-wrapper">
    <LoadingScreen :caricamento="caricamento" />
    <div class="contenitore-scelta-attività">
      <button @click="tabIntegrazioneAttivo = 'AttPianificate'" class="verde">ATTIVITÀ PIANIFICATE</button>
      <button @click="tabIntegrazioneAttivo = 'AttSegnalate'" class="blu">ATTIVITÀ SEGNALATE</button>
    </div>
    <AttPianificate v-show="tabIntegrazioneAttivo === 'AttPianificate'" :attività="attPianificate" />
    <AttSegnalate v-show="tabIntegrazioneAttivo === 'AttSegnalate'" :attività="attSegnalate" />
  </Details>
</Card>
</template>

<script>
import {onMounted, reactive, toRefs} from 'vue';
import {leggiAttProgPerIntegrazione} from '../js/richieste';
import Card from './elementi/Card.vue';
import Details from './elementi/Details.vue';
import AttPianificate from './TabPlannerIntegrazioneAttPianificate.vue';
import AttSegnalate from './TabPlannerIntegrazioneAttSegnalate.vue';
import LoadingScreen from './elementi/LoadingScreen.vue';

export default {
  name: 'TabPlannerIntergazione',
  components: {
    Card,
    Details,
    AttPianificate,
    AttSegnalate,
    LoadingScreen,
  },
  setup() {
    const state = reactive({
      caricamento: false,
      tabIntegrazioneAttivo: 'AttPianificate',
      attPianificate: [],
      attSegnalate: [],
    });

    onMounted(async () => {
      state.caricamento = true;
      const attDaIntegrare = await leggiAttProgPerIntegrazione(true);
      const attPianificate = attDaIntegrare.filter(att => att.tipo_attività.includes('controllo') || att.tipo_attività.includes('manutenzione regolare'));
      const attSegnalate = attDaIntegrare.filter(att => !att.tipo_attività.includes('controllo') && !att.tipo_attività.includes('manutenzione regolare'));
      state.attPianificate = attPianificate.sort((a, b) => a.data_ins.localeCompare(b.data_ins));
      state.attSegnalate = attSegnalate.sort((a, b) => a.data_ins.localeCompare(b.data_ins));
      state.caricamento = false;
    });

    return {
      ...toRefs(state),
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
button.blu {
  background-color: var(--bluInterreg);
}
button.blu:hover {
  background-color: var(--bluInterregTrasparenza);
}
</style>

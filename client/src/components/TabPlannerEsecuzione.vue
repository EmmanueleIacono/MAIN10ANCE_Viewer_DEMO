<template>
<Card>
  <Details summary="ESECUZIONE" :open="true" class="loading-wrapper">
    <LoadingScreen :caricamento="caricamento" />
    <div v-if="attIntegrateContr.length || attIntegrateManReg.length">
      <SchedaEsecuzione v-for="att in attIntegrateContr" :key="att['Codice scheda controllo']" :dati="att" :tipo="'controllo'" />
      <SchedaEsecuzione v-for="att in attIntegrateManReg" :key="att['Codice scheda manutenzione regolare']" :dati="att" :tipo="'manutenzione regolare'" />
      <SchedaEsecuzione v-for="att in attIntegrateManCorr" :key="att['Codice scheda manutenzione correttiva']" :dati="att" :tipo="'manutenzione correttiva'" />
    </div>
    <div v-else>
      Nessuna attività da eseguire
    </div>
  </Details>
</Card>
</template>

<script>
import {reactive, toRefs, onMounted} from 'vue';
import {prendiSchedeControllo, prendiSchedeManReg, prendiSchedeManCorr} from '../js/richieste';
import Card from './elementi/Card.vue';
import Details from './elementi/Details.vue';
import LoadingScreen from './elementi/LoadingScreen.vue';
import SchedaEsecuzione from './elementi/SchedaEsecuzione.vue';

export default {
  name: 'TabPlannerEsecuzione',
  components: {
    Card,
    Details,
    LoadingScreen,
    SchedaEsecuzione,
  },
  setup() {
    const state = reactive({
      caricamento: false,
      attIntegrateContr: [],
      attIntegrateManReg: [],
      attIntegrateManCorr: [],
    });

    onMounted(async () => {
      await popolaSchede();
      console.log(state.attIntegrateManCorr);
    });

    async function popolaSchede() {
      state.caricamento = true;
      const attIntegrateContr = await prendiSchedeControllo();
      const attIntegrateManReg = await prendiSchedeManReg();
      const attIntegrateManCorr = await prendiSchedeManCorr();
      state.attIntegrateContr = attIntegrateContr;
      state.attIntegrateManReg = attIntegrateManReg;
      state.attIntegrateManCorr = attIntegrateManCorr;
      state.caricamento = false;
    }

    return {
      ...toRefs(state),
      popolaSchede,
    }
  }
}
</script>

<style scoped>
</style>

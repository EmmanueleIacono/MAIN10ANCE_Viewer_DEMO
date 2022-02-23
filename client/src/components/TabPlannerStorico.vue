<template>
<Card>
  <Details summary="STORICO" :open="false" class="loading-wrapper">
    <LoadingScreen :caricamento="caricamento" />
    <div v-if="attStoricoContr.length || attStoricoManReg.length || attStoricoManCorr.length">
      <SchedaStorico v-for="att in attStoricoContr" :key="att['Codice scheda controllo']" :dati="att" :tipo="'controllo'" />
      <SchedaStorico v-for="att in attStoricoManReg" :key="att['Codice scheda manutenzione regolare']" :dati="att" :tipo="'manutenzione regolare'" />
      <SchedaStorico v-for="att in attStoricoManCorr" :key="att['Codice scheda manutenzione correttiva']" :dati="att" :tipo="'manutenzione correttiva'" />
    </div>
    <div v-else>Nessuna attività eseguita</div>
  </Details>
</Card>
</template>

<script>
import {onMounted, reactive, toRefs} from 'vue';
import {prendiSchedeStoricoControllo, prendiSchedeStoricoManReg, prendiSchedeStoricoManCorr} from '../js/richieste';
import Card from './elementi/Card.vue';
import Details from './elementi/Details.vue';
import LoadingScreen from './elementi/LoadingScreen.vue';
import SchedaStorico from './elementi/SchedaStorico.vue';

export default {
  name: 'TabPlannerStorico',
  components: {
    Card,
    Details,
    LoadingScreen,
    SchedaStorico,
  },
  setup() {
    const state = reactive({
      caricamento: false,
      attStoricoContr: [],
      attStoricoManReg: [],
      attStoricoManCorr: [],
    });

    onMounted(async () => {
      await popolaSchedeStorico();
    });

    async function popolaSchedeStorico() {
      state.caricamento = true;
      const attStoricoContr = await prendiSchedeStoricoControllo();
      const attStoricoManReg = await prendiSchedeStoricoManReg();
      const attStoricoManCorr = await prendiSchedeStoricoManCorr();
      state.attStoricoContr = attStoricoContr;
      state.attStoricoManReg = attStoricoManReg;
      state.attStoricoManCorr = attStoricoManCorr;
      state.caricamento = false;
    }

    return {
      ...toRefs(state),
    }
  }
}
</script>

<style scoped>
</style>

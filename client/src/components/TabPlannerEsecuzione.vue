<template>
<Card>
  <Details summary="ESECUZIONE" :open="true" class="loading-wrapper">
    <LoadingScreen :caricamento="caricamento" />
    <div v-if="attIntegrateContr.length">
      <SchedaEsecuzione v-for="att in attIntegrateContr" :key="att.id_att_prog" :dati="att" :tipo="'controllo'" />
      <SchedaEsecuzione v-for="att in attIntegrateManReg" :key="att.id_att_prog" :dati="att" :tipo="'manutenzione regolare'" />
    </div>
    <div v-else>
      Nessuna attività da eseguire
    </div>
  </Details>
</Card>
</template>

<script>
import {reactive, toRefs, onMounted} from 'vue';
import {prendiSchedeControllo, prendiSchedeManReg} from '../js/richieste';
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
    });

    onMounted(async () => {
      await popolaSchede();
    });

    async function popolaSchede() {
      state.caricamento = true;
      const attIntegrateContr = await prendiSchedeControllo();
      const attIntegrateManReg = await prendiSchedeManReg();
      state.attIntegrateContr = attIntegrateContr;
      state.attIntegrateManReg = attIntegrateManReg;
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

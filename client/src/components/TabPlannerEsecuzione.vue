<template>
<Card>
  <Details summary="ESECUZIONE" :open="aperto" class="loading-wrapper">
    <div v-if="store.statePlanner.schedeEsecuzioneFiltrate['controllo'].length || store.statePlanner.schedeEsecuzioneFiltrate['manutenzione regolare'].length || store.statePlanner.schedeEsecuzioneFiltrate['manutenzione correttiva'].length">
      <SchedaEsecuzione v-for="att in store.statePlanner.schedeEsecuzioneFiltrate['controllo']" :key="att['Codice scheda controllo']" :dati="att" :tipo="'controllo'" />
      <SchedaEsecuzione v-for="att in store.statePlanner.schedeEsecuzioneFiltrate['manutenzione regolare']" :key="att['Codice scheda manutenzione regolare']" :dati="att" :tipo="'manutenzione regolare'" />
      <SchedaEsecuzione v-for="att in store.statePlanner.schedeStoricoFiltrate['manutenzione correttiva']" :key="att['Codice scheda manutenzione correttiva']" :dati="att" :tipo="'manutenzione correttiva'" />
    </div>
    <div v-else>Nessuna attività da eseguire</div>
  </Details>
</Card>
</template>

<script>
import {inject, reactive, toRefs} from 'vue';
import Card from './elementi/Card.vue';
import Details from './elementi/Details.vue';
import SchedaEsecuzione from './elementi/SchedaEsecuzione.vue';

export default {
  name: 'TabPlannerEsecuzione',
  components: {
    Card,
    Details,
    SchedaEsecuzione,
  },
  setup() {
    const store = inject('store');
    const state = reactive({
      aperto: false,
    });

    return {
      store,
      ...toRefs(state),
    }
  }
}
</script>

<style scoped>
</style>

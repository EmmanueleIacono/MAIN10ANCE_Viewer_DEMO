<template>
<Card>
  <Details summary="STORICO" :open="false" class="loading-wrapper">
    <div v-if="store.statePlanner.schedeStoricoFiltrate['controllo'].length || store.statePlanner.schedeStoricoFiltrate['manutenzione regolare'].length || store.statePlanner.schedeStoricoFiltrate['manutenzione correttiva'].length">
      <SchedaStorico v-for="att in store.statePlanner.schedeStoricoFiltrate['controllo']" :key="att['Codice scheda controllo']" :dati="att" :tipo="'controllo'" />
      <SchedaStorico v-for="att in store.statePlanner.schedeStoricoFiltrate['manutenzione regolare']" :key="att['Codice scheda manutenzione regolare']" :dati="att" :tipo="'manutenzione regolare'" />
      <SchedaStorico v-for="att in store.statePlanner.schedeStoricoFiltrate['manutenzione correttiva']" :key="att['Codice scheda manutenzione correttiva']" :dati="att" :tipo="'manutenzione correttiva'" />
    </div>
    <div v-else>Nessuna attività eseguita</div>
  </Details>
</Card>
</template>

<script>
import {inject} from 'vue';
import Card from './elementi/Card.vue';
import Details from './elementi/Details.vue';
import SchedaStorico from './elementi/SchedaStorico.vue';

export default {
  name: 'TabPlannerStorico',
  components: {
    Card,
    Details,
    SchedaStorico,
  },
  setup() {
    const store = inject('store');

    return {
      store,
    }
  }
}
</script>

<style scoped>
</style>

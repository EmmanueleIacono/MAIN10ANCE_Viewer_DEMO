<template>
<Card>
  <Details summary="INTEGRAZIONE" :open="true">
    <div class="contenitore-scelta-attività">
      <button @click="tabIntegrazioneAttivo = 'AttPianificate'" class="verde">ATTIVITÀ PIANIFICATE</button>
      <button @click="tabIntegrazioneAttivo = 'AttSegnalate'" class="blu">ATTIVITÀ SEGNALATE</button>
    </div>
    <component :is="tabIntegrazioneAttivo" />
  </Details>
</Card>
</template>

<script>
import {reactive, toRefs} from 'vue';
import Card from './elementi/Card.vue';
import Details from './elementi/Details.vue';
import AttPianificate from './TabPlannerIntegrazioneAttPianificate.vue';
import AttSegnalate from './TabPlannerIntegrazioneAttSegnalate.vue';

export default {
  name: 'TabPlannerIntergazione',
  components: {
    Card,
    Details,
    AttPianificate,
    AttSegnalate,
  },
  setup() {
    const state = reactive({
      tabIntegrazioneAttivo: 'AttPianificate',
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

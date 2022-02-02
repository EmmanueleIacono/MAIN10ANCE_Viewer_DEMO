<template> 
  <div class="sfondo-verde">
    <div v-if="attività.length">
      <SchedaInt v-for="(att, ind) in attività" :key="ind" :pianificate="true" :attività="att" />
    </div>
    <div v-else>Nessuna attività da integrare</div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import SchedaInt from './elementi/SchedaIntegrazioneAttività.vue';

export default {
  name: 'TabPlannerIntergazioneAttPianificate',
  components: {
    SchedaInt,
  },
  props: {
    attività: Array,
  },
  setup() {
    const state = reactive({});

    return {
      ...toRefs(state),
    }
  }
}
</script>

<style scoped>
.sfondo-verde {
  background-color: var(--verdeMain10anceTrasparenza2);
}
</style>

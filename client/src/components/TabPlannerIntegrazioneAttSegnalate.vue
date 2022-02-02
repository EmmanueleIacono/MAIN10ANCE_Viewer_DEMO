<template>
  <div class="sfondo-blu">
    <div v-if="attività.length">
      <SchedaInt v-for="(att, ind) in attività" :key="ind" :pianificate="false" :attività="att" />
    </div>
    <div v-else>Nessuna attività da integrare</div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import SchedaInt from './elementi/SchedaIntegrazioneAttività.vue';

export default {
  name: 'TabPlannerIntergazioneAttSegnalate',
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
.sfondo-blu {
  background-color: var(--bluInterregTrasparenza2);
}
</style>

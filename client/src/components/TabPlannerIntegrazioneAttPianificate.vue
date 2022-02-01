<template>
<div class="loading-wrapper">  
  <LoadingScreen :caricamento="caricamento" />
  <div class="sfondo-verde">
    attività pianificate
  </div>
</div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import LoadingScreen from './elementi/LoadingScreen.vue';

export default {
  name: 'TabPlannerIntergazioneAttPianificate',
  components: {
    LoadingScreen,
  },
  setup() {
    const state = reactive({
      caricamento: false,
    });

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

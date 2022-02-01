<template>
<div class="loading-wrapper">  
  <LoadingScreen :caricamento="caricamento" />
  <div class="sfondo-blu">
    attività segnalate
  </div>
</div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import LoadingScreen from './elementi/LoadingScreen.vue';

export default {
  name: 'TabPlannerIntergazioneAttSegnalate',
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
.sfondo-blu {
  background-color: var(--bluInterregTrasparenza2);
}
</style>

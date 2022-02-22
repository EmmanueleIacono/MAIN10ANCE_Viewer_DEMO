<template>
<Card>
  <Details summary="STORICO" :open="false" class="loading-wrapper">
    <LoadingScreen :caricamento="caricamento" />
    qui dentro storico
  </Details>
</Card>
</template>

<script>
import {reactive, toRefs} from 'vue';
import Card from './elementi/Card.vue';
import Details from './elementi/Details.vue';
import LoadingScreen from './elementi/LoadingScreen.vue';

export default {
  name: 'TabPlannerStorico',
  components: {
    Card,
    Details,
    LoadingScreen,
  },
  setup() {
    const state = reactive({
      caricamento: false,
      attStorico: [],
    });

    return {
      ...toRefs(state),
    }
  }
}
</script>

<style scoped>
</style>

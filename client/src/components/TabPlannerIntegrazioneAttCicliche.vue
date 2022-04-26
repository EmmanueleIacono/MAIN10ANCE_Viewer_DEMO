<template> 
  <!-- <div class="sfondo-verde"> -->
  <div>
    <div v-if="att.length">
      <SchedaInt @integrazioneCompletata="emettiOkInt" v-for="a in att" :key="a.id_att_prog" :pianificate="true" :att="a" />
    </div>
    <div v-else>Nessuna attività da integrare</div>
  </div>
</template>

<script>
import SchedaInt from './elementi/SchedaIntegrazioneAttività.vue';

export default {
  name: 'TabPlannerIntergazioneAttCicliche',
  components: {
    SchedaInt,
  },
  props: {
    att: Array,
  },
  setup(props, {emit}) {
    function emettiOkInt() {
      emit('IntegrazioneOK');
    }

    return {
      emettiOkInt,
    }
  }
}
</script>

<style scoped>
.sfondo-verde {
  background-color: var(--verdeMain10anceTrasparenza2);
}
</style>

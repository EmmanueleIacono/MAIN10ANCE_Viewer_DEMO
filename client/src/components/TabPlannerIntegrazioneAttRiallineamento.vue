<template>
  <div>
    <div v-if="att.length">
      <SchedaInt @integrazioneCompletata="emettiOkInt" v-for="a in att" :key="a.id_att_prog" :pianificate="false" :att="a" />
    </div>
    <div v-else>Nessuna attività da integrare</div>
  </div>
</template>

<script>
import SchedaInt from './elementi/SchedaIntegrazioneAttività.vue';

export default {
  name: 'TabPlannerIntergazioneAttRiallineamento',
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
.sfondo-giallo {
  background-color: var(--gialloInterventoTrasparenza2);
}
</style>

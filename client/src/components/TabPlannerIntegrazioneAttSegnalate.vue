<template>
  <div class="sfondo-giallo">
    <div v-if="att.length">
      <SchedaInt v-for="a in att" :key="a.id_att_prog" :pianificate="false" :att="a" />
    </div>
    <div v-else>Nessuna attività da integrare</div>
  </div>
</template>

<script>
import SchedaInt from './elementi/SchedaIntegrazioneAttività.vue';

export default {
  name: 'TabPlannerIntergazioneAttSegnalate',
  components: {
    SchedaInt,
  },
  props: {
    att: Array,
  },
}
</script>

<style scoped>
.sfondo-giallo {
  background-color: var(--gialloInterventoTrasparenza2);
}
</style>

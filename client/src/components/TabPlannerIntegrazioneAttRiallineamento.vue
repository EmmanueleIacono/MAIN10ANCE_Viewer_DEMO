<template>
  <div>
    <div v-if="att.length">
      <SchedaInt @integrazioneCompletata="emettiOkInt" v-for="a in att" :key="a.id_att_prog" :pianificate="false" :att="a" />
    </div>
    <div v-else>Nessuna attività da integrare</div>
  </div>
</template>

<script setup>
import SchedaInt from './elementi/SchedaIntegrazioneAttività.vue';

defineProps({
  att: Array,
});

const emit = defineEmits(['IntegrazioneOK']);

function emettiOkInt() {
  emit('IntegrazioneOK');
}
</script>

<style scoped>
.sfondo-giallo {
  background-color: var(--gialloInterventoTrasparenza2);
}
</style>

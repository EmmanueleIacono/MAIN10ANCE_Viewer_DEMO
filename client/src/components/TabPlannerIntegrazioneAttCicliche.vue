<template> 
  <div>
    <div v-if="att.length">
      <div v-for="a in att" :key="a.id_att_prog">
        <SchedaInt @integrazioneCompletata="emettiOkInt" v-if="a.visibile" :pianificate="true" :att="a" />
      </div>
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
.sfondo-verde {
  background-color: var(--verdeMain10anceTrasparenza2);
}
</style>

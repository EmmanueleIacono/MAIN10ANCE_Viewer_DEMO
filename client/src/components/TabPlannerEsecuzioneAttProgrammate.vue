<template>
  <div>
    <div v-if="att.length">
      qui dentro tante schede
    </div>
    <div v-else>Nessuna attività programmata</div>
  </div>
</template>

<script>
export default {
  name: 'TabPlannerEsecuzioneAttProgrammate',
  // components: {
  //   SchedaEsec,
  // },
  props: {
    att: Array,
  },
}
</script>

<style scoped>
</style>

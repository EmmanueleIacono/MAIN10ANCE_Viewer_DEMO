<template>
  <div>
    <div v-if="store.stateBIM.schedeAttivitàTipo === 'controllo'">modulo per controllo</div>
    <div v-if="store.stateBIM.schedeAttivitàTipo === 'manutenzione regolare'">modulo per manutenzione regolare</div>
    <div v-if="store.stateBIM.schedeAttivitàTipo === 'manutenzione correttiva'">modulo per manutenzione correttiva</div>
    <div v-if="store.stateBIM.schedeAttivitàTipo === 'manutenzione straordinaria'">modulo per manutenzione straordinaria</div>
    <div v-if="store.stateBIM.schedeAttivitàTipo === 'restauro'">modulo per restauro</div>
    <div v-if="store.stateBIM.schedeAttivitàTipo === 'diagnostica'">modulo per diagnostica</div>
  </div>
</template>

<script>
import {inject} from 'vue';

export default {
  name: 'TabBIMSchedeAttività',
  setup() {
    const store = inject('store');

    return {
      store,
    }
  }
}
</script>

<style scoped>
</style>

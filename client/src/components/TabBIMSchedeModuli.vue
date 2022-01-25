<template>
  <div v-if="store.stateBIM.schedeModuliVisibile" id="contenitore-controllo-intervento">
    <SchedaAnagrafica />
  </div>
</template>

<script>
import {inject, onUpdated} from 'vue';
import SchedaAnagrafica from './TabBIMModuloAnagrafica.vue';

export default {
  name: 'SchedeModuli',
  components: {
    SchedaAnagrafica,
  },
  setup() {
    const store = inject('store');

    onUpdated(() => {
      if (store.stateBIM.schedeModuliVisibile) {
        console.log('modulo pronto');
      }
    });

    return {
      store,
    }
  }
}
</script>

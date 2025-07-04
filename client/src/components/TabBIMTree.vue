<template>
<div id="appBuckets" class="tree-parent">
  <TreeNode @cambiaIdCliccato="cambiaId" v-for="nodo in state.nodi" :key="nodo.id" :node="nodo" class="tree-node" />
</div>
</template>

<script>
import {reactive, onMounted, provide, ref, inject, watch} from 'vue';
import {getObjects} from '../js/richieste';
import TreeNode from './elementi/TreeNodeBIM.vue';

export default {
  name: 'TabBIMTree',
  components: {
    TreeNode,
  },
  setup() {
    const store = inject('store');
    const idCliccato = ref(null);
    provide('idCliccato', idCliccato);
    const state = reactive({
      nodi: [],
    });

    watch(() => store.state.userSettings.user_id, async () => await impostaNodi());

    onMounted( async () => {
      impostaNodi();
    });

    function cambiaId(id) {
      idCliccato.value = id;
    }

    async function impostaNodi() {
      const bkts = store.getters.getBkts();
      const nodi = await getObjects();
      const nodiFiltrati = nodi.filter(nodo => bkts.includes(nodo.id));
      state.nodi = store.state.userSettings.user_id ? nodiFiltrati : nodi;
      state.nodi.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
    }

    return {
      state,
      cambiaId,
    }
  }
}
</script>

<style scoped>
#appBuckets {
  width: 100%;
  height: 100%;
}
.tree-parent {
  margin-top: 4px;
}
.tree-node {
  margin-left: 10px;
}
</style>

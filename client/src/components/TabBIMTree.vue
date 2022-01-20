<template>
<div id="appBuckets" class="tree-parent">
  <TreeNode @cambiaIdCliccato="cambiaId" v-for="nodo in state.nodi" :key="nodo.id" :node="nodo" class="tree-node" />
</div>
</template>

<script>
import {reactive, onMounted, provide, ref} from 'vue';
import {getObjects} from '../js/richieste';
import TreeNode from './elementi/TreeNode.vue';

export default {
  name: 'TabBIMTree',
  components: {
    TreeNode,
  },
  setup() {
    const idCliccato = ref(null);
    provide('idCliccato', idCliccato);
    const state = reactive({
      nodi: [],
    });

    onMounted( async () => {
      state.nodi = await getObjects();
    });

    function cambiaId(id) {
      idCliccato.value = id;
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

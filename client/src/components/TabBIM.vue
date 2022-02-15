<template>
<div>
  <div :class="`col-sm-${store.getters.getBimVwSets()[0]} fill`">
    <div id="forgeViewer">
      <div v-if="store.stateBIM.modelPlaceholder" id="contenitore-bim-viewer-placeholder">
        <img src="@/assets/img/sacro-monte-varese-c.jpg" id="bim-viewer-placeholder">
      </div>
    </div>
  </div>
  <Explorer :colonna="`col-sm-${store.getters.getBimVwSets()[1]}`">
    <Details summary="SELEZIONE MODELLI">
      <Tree />
    </Details>
    <PannelloDB />
  </Explorer>
</div>
</template>

<script>
import {inject} from 'vue';
import Explorer from './elementi/Explorer.vue';
import Details from './elementi/Details.vue';
import PannelloDB from './TabBIMPannelloDB.vue';
import Tree from './TabBIMTree.vue';

export default {
  name: 'TabBIM',
  components: {
    Explorer,
    Details,
    PannelloDB,
    Tree,
  },
  setup() {
    const store = inject('store');


    return {
      store,
    }
  }
}
</script>

<style scoped>
#forgeViewer {
  width: 100%;
  height: 100%;
}

#contenitore-bim-viewer-placeholder {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px;
}

#bim-viewer-placeholder {
  width: 100%;
  opacity: 15%;
}
</style>

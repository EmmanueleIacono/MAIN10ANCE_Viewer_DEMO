<template>
<div>
  <MainPanel :class="`col-sm-${store.getters.getBimVwSets()[0]} fill`"><br>
    <DownloadImage />
  </MainPanel>
  <Explorer :colonna="`col-sm-${store.getters.getBimVwSets()[1]}`">
    <Details summary="SELEZIONA LOCALITÀ">
      <!-- <Tree /> -->
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
// import Tree from './TabBIMTree.vue';
import MainPanel from './elementi/MainPanel.vue';
import DownloadImage from './TabCollectionDownloadImage.vue'

export default {
  name: 'TabCollection',
  components: {
    Explorer,
    Details,
    PannelloDB,
    // Tree,
    DownloadImage,
    MainPanel,
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
</style>

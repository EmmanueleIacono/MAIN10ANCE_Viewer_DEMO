<template>
<div>
  <MainPanel :class="`col-sm-${store.getters.getBimVwSets()[0]} fill`"><br>
    <DownloadImage />
  </MainPanel>
  <Explorer :colonna="`col-sm-${store.getters.getBimVwSets()[1]}`">
    Artifact Viewer Explorer - WIP
  </Explorer>
</div>
</template>

<script>
import {inject} from 'vue';
import Explorer from './elementi/Explorer.vue';
import MainPanel from './elementi/MainPanel.vue';
import DownloadImage from './TabCollectionDownloadImage.vue'

export default {
  name: 'TabCollection',
  components: {
    Explorer,
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

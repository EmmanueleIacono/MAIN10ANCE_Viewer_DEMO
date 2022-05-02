<template>
<div v-if="store.getters.getUsrVwList().includes('apriTabDashboard')">
  <MainPanel :colonna="'col-sm-7'">
    <div class="contenitore-dashboard">
      <Overview />
      <TaskProgress />
      <ElementiEdilizi />
      <ElementiGIS />
      <GraficiDettaglio />
      <GestioneUtenti />
    </div>
  </MainPanel>
  <Explorer :colonna="'col-sm-5'">
    Dashboard Explorer - WIP
  </Explorer>
</div>
</template>

<script>
import {inject} from 'vue';
import MainPanel from './elementi/MainPanel.vue';
import Explorer from './elementi/Explorer.vue';
import Overview from './TabDashboardOverview.vue';
import TaskProgress from './TabDashboardTaskProgress.vue';
import ElementiEdilizi from './TabDashboardElementiEdilizi.vue';
import ElementiGIS from './TabDashboardElementiGIS.vue';
import GraficiDettaglio from './TabDashboardGraficiDettaglio.vue';
import GestioneUtenti from './TabDashboardGestioneUtenti.vue';

export default {
  name: 'TabDashboard',
  components: {
    MainPanel,
    Explorer,
    Overview,
    TaskProgress,
    ElementiEdilizi,
    ElementiGIS,
    GraficiDettaglio,
    GestioneUtenti,
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
.contenitore-dashboard {
  height: 100%;
  overflow: auto;
  padding: 2%;
}
</style>

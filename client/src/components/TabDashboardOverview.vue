<template>
<div class="row loading-wrapper" id="Overview">
  <LoadingScreen :caricamento="caricamento" />
  <OverviewItem :data="utentiData" :labels="utentiLabels" :infoContenuto="'utenti'" :icona="'zmdi-account-o'" :gradiente="'overview-item--c1'" />
  <OverviewItem :data="modelliData" :labels="modelliLabels" :infoContenuto="'modelli'" :icona="'zmdi-home'" :gradiente="'overview-item--c2'" />
  <OverviewItem :data="oggettiData" :labels="oggettiLabels" :infoContenuto="'oggetti'" :icona="'zmdi-info'" :gradiente="'overview-item--c3'" />
  <OverviewItem :infoContenuto="'attività'" :icona="'zmdi-calendar-note'" :gradiente="'overview-item--c4'" />
</div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue';
import {conteggioModelli, conteggioRuoli, conteggioOggetti} from '../js/richieste';
import OverviewItem from './elementi/OverviewItem.vue';
import LoadingScreen from './elementi/LoadingScreen.vue';

export default {
  name: 'TabDashboardOverview',
  components: {
    OverviewItem,
    LoadingScreen,
  },
  setup() {
    const state = reactive({
      caricamento: false,
      utentiData: [],
      utentiLabels: [],
      modelliData: [],
      modelliLabels: [],
      oggettiData: [],
      oggettiLabels: [],
      attivitàData: [],
      attivitàLabels: [],
    });

    onMounted(async () => {
      state.caricamento = true;
      const [utentiData, utentiLabels] = await conteggioRuoli();
      const [modelliData, modelliLabels] = await conteggioModelli();
      const [oggettiBIM, oggettiGIS] = await conteggioOggetti();
      state.utentiData = utentiData.map(usr => parseInt(usr));
      state.utentiLabels = utentiLabels;
      state.modelliData = modelliData.map(modl => parseInt(modl));
      state.modelliLabels = modelliLabels;
      state.oggettiData = [parseInt(oggettiBIM), parseInt(oggettiGIS)];
      state.oggettiLabels = ['BIM', 'GIS'];
      state.caricamento = false;
    });

    return {
      ...toRefs(state),
    }
  }
}
</script>

<style scoped>
</style>

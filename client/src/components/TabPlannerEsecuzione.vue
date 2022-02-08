<template>
<Card>
  <Details summary="ESECUZIONE" :open="true" class="loading-wrapper">
    <LoadingScreen :caricamento="caricamento" />
    <div v-if="attIntegrateContr.length">
      <SchedaEsecuzione v-for="att in attIntegrateContr" :key="att.id_att_prog" :dati="att" :caption="'Attività di controllo'" />
    </div>
    <div v-else>
      Nessuna attività da eseguire
    </div>
  </Details>
  <!-- <h4>
    <span id="refreshSchede" class="glyphicon glyphicon-refresh"></span>
    <b>SCHEDE</b>
  </h4> -->
  <!-- <div id="contenitore-schede">
    QUI SCHEDE
  </div> -->
</Card>
</template>

<script>
import {reactive, toRefs, onMounted} from 'vue';
// import {leggiAttProgPerIntegrazione} from '../js/richieste';
import {prendiSchedeControllo} from '../js/richieste';
import Card from './elementi/Card.vue';
import Details from './elementi/Details.vue';
import LoadingScreen from './elementi/LoadingScreen.vue';
import SchedaEsecuzione from './elementi/SchedaEsecuzione.vue';

export default {
  name: 'TabPlannerEsecuzione',
  components: {
    Card,
    Details,
    LoadingScreen,
    SchedaEsecuzione,
  },
  setup() {
    const state = reactive({
      caricamento: false,
      attIntegrateContr: [],
    });

    onMounted(async () => {
      await popolaSchede();
    });

    async function popolaSchede() {
      state.caricamento = true;
      // const attIntegrateContr = await leggiAttProgPerIntegrazione(false);
      const attIntegrateContr = await prendiSchedeControllo();
      state.attIntegrateContr = attIntegrateContr;
      state.caricamento = false;
    }

    return {
      ...toRefs(state),
    }
  }
}
</script>

<style scoped>
/* #refreshSchede {
  cursor: pointer;
  margin-right: 5px;
} */
/* #contenitore-schede {
  height: 90%;
  overflow: auto;
  padding-left: 5px;
  padding-right: 15px;
} */
</style>

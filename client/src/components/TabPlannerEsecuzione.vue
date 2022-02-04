<template>
<Card>
  <Details summary="ESECUZIONE" :open="true" class="loading-wrapper">
    <LoadingScreen :caricamento="caricamento" />
    <div class="contenitore-scelta-attività">
      <button @click="tabEsecuzioneAttivo = 'AttProgrammate'" class="blu">ATTIVITÀ PROGRAMMATE</button>
      <button @click="tabEsecuzioneAttivo = 'AttEseguite'" class="blu">ATTIVITÀ ESEGUITE</button>
    </div>
    <AttProgrammate v-show="tabEsecuzioneAttivo === 'AttProgrammate'" :att="attProgrammate" />
    <AttEseguite v-show="tabEsecuzioneAttivo === 'AttEseguite'" :att="attEseguite" />
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
import {leggiAttProgPerIntegrazione} from '../js/richieste';
import Card from './elementi/Card.vue';
import Details from './elementi/Details.vue';
import LoadingScreen from './elementi/LoadingScreen.vue';
import AttProgrammate from './TabPlannerEsecuzioneAttProgrammate.vue';
import AttEseguite from './TabPlannerEsecuzioneAttEseguite.vue';

export default {
  name: 'TabPlannerEsecuzione',
  components: {
    Card,
    Details,
    LoadingScreen,
    AttProgrammate,
    AttEseguite,
  },
  setup() {
    const state = reactive({
      caricamento: false,
      tabEsecuzioneAttivo: 'AttProgrammate',
      // ordinaPer: 'data_prog',
      attProgrammate: [],
      attEseguite: [],
    });

    onMounted(async () => {
      await popolaSchede();
    });

    async function popolaSchede() {
      state.caricamento = true;
      const attIntegrate = await leggiAttProgPerIntegrazione(false);
      console.log(attIntegrate);
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
.contenitore-scelta-attività {
  display: flex;
  justify-content: space-between;
}
.contenitore-scelta-attività button {
  border: none;
  color: var(--ghostWhite);
  padding: 5px;
  font-weight: bold;
  flex: 0 0 49.3%;
  margin: 10px 0;
}
button.verde {
  background-color: var(--verdeMain10ance);
}
button.verde:hover {
  background-color: var(--verdeMain10anceTrasparenza);
}
button.blu {
  background-color: var(--bluInterreg);
}
button.blu:hover {
  background-color: var(--bluInterregTrasparenza);
}
</style>

<template>
<Card>
  <Details summary="INTEGRAZIONE" :open="true" class="loading-wrapper">
    <LoadingScreen :caricamento="caricamento" />
    <div class="contenitore-scelta-attività">
      <button @click="tabIntegrazioneAttivo = 'AttPianificate'" class="verde">ATTIVITÀ PIANIFICATE</button>
      <button @click="tabIntegrazioneAttivo = 'AttSegnalate'" class="blu">ATTIVITÀ SEGNALATE</button>
    </div>
    <div class="contenitore-ordinaper">
      <p><b>Ordina per: </b></p>
      <div>
        <input v-model="ordinaPer" type="radio" name="ordina" id="data-prog" class="mr" value="data_prog">
        <label for="data-prog">Data programmata</label>
      </div>
      <div>
        <input v-model="ordinaPer" type="radio" name="ordina" id="data-ins" class="mr" value="id_att_prog">
        <label for="data-ins">Data di inserimento</label>
      </div>
    </div>
    <AttPianificate v-show="tabIntegrazioneAttivo === 'AttPianificate'" :attività="attPianificate" />
    <AttSegnalate v-show="tabIntegrazioneAttivo === 'AttSegnalate'" :attività="attSegnalate" />
  </Details>
</Card>
</template>

<script>
import {onMounted, reactive, toRefs, watch} from 'vue';
import {leggiAttProgPerIntegrazione} from '../js/richieste';
import Card from './elementi/Card.vue';
import Details from './elementi/Details.vue';
import AttPianificate from './TabPlannerIntegrazioneAttPianificate.vue';
import AttSegnalate from './TabPlannerIntegrazioneAttSegnalate.vue';
import LoadingScreen from './elementi/LoadingScreen.vue';

export default {
  name: 'TabPlannerIntergazione',
  components: {
    Card,
    Details,
    AttPianificate,
    AttSegnalate,
    LoadingScreen,
  },
  setup() {
    const state = reactive({
      caricamento: false,
      tabIntegrazioneAttivo: 'AttPianificate',
      ordinaPer: 'data_prog',
      attPianificate: [],
      attSegnalate: [],
    });

    watch(() => state.ordinaPer, newVal => {
      ordinaAttività(newVal);
    });

    onMounted(async () => {
      await popolaAttività();
    });

    async function popolaAttività() {
      state.caricamento = true;
      const attDaIntegrare = await leggiAttProgPerIntegrazione(true);
      const attPianificate = attDaIntegrare.filter(att => att.tipo_attività.includes('controllo') || att.tipo_attività.includes('manutenzione regolare'));
      const attSegnalate = attDaIntegrare.filter(att => !att.tipo_attività.includes('controllo') && !att.tipo_attività.includes('manutenzione regolare'));
      state.attPianificate = attPianificate;
      state.attSegnalate = attSegnalate;
      ordinaAttività(state.ordinaPer);
      state.caricamento = false;
    }

    function ordinaAttività(param) {
      state.attPianificate.sort((a, b) => a[param].localeCompare(b[param]));
      state.attSegnalate.sort((a, b) => a[param].localeCompare(b[param]));
    }

    return {
      ...toRefs(state),
      popolaAttività,
    }
  }
}
</script>

<style scoped>
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
.contenitore-ordinaper {
  display: flex;
  justify-content: space-between;
  width: 60%;
}
.mr {
  margin-right: 5px;
}
</style>

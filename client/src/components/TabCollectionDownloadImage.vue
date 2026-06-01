<template>
<div>
  <Card>
    <Details summary="IMMAGINI" :open="true">
      <br>
      <div class="col-lg-12 loading-wrapper">
        <LoadingScreen :caricamento="state.caricamento" />
        <div v-if="stateGalleria.listaImmagini.length" class="image-grid">
          <div v-for="(url) in stateGalleria.listaImmagini" :key="url.percorso" class="thumb-wrapper">
            <img @click="isSelected(url.percorso)" :src="url.object" :class="state.percorsiSelezionati.includes(url.percorso) ? 'bordo-verde' : ''" />
            <div class="thumb-caption">{{ url.info ? (url.info.Codice + ' - ' + (url.info.Nome || 'N/A')) : '' }}</div>
          </div>
        </div>
        <div v-else><i>Nessuna immagine presente a questo percorso</i></div>
      </div>
    </Details>
  </Card>
</div>
</template>

<script setup>
import {reactive, watch, inject} from 'vue';
import { getListaImmagini, downloadImmagini, getInfoImmagine } from '../js/richieste';
import {verificaPercorso} from '../js/shared';
import LoadingScreen from './elementi/LoadingScreen.vue';
import Details from './elementi/Details.vue';
import Card from './elementi/Card.vue';

defineExpose({
  deselectImage,
  aggiornaFilePaths,
  getPercorsiSelezionati,
});

const props = defineProps({
  percorsoCartella: String,
});

const emit = defineEmits(['nuovaSelezione']);

const state = reactive({
  caricamento: false,
  filePaths: [],
  percorsiSelezionati: [],
});
const stateGalleria = inject('stateGalleria');
const stateAnagrafica = inject('stateAnagrafica');
const stateArtifact = inject('stateArtifact');

watch(() => props.percorsoCartella, async newpath => {
  if (verificaPercorso(props.percorsoCartella)) {
    const filePaths = await getListaImmagini(newpath);
    aggiornaFilePaths(filePaths);
  }
  else {
    aggiornaFilePaths([]);
  }
});

watch(() => state.filePaths, async newFilePaths => {
  stateGalleria.listaImmagini.forEach(img => URL.revokeObjectURL(img.object));
  stateGalleria.listaImmagini = [];
  if (verificaPercorso(props.percorsoCartella)) {
    state.caricamento = true;
    stateArtifact.caricamento = true;

    await Promise.all(newFilePaths.map(async path => {
      const fileImmagine = await downloadImmagini(path);
      const infoImmagine = await getInfoImmagine(path, stateArtifact.selectElemento);

      if (fileImmagine.errMsg) {
        console.log(fileImmagine.errMsg);
        state.caricamento = false;
        stateArtifact.caricamento = false;
        return;
      }

      stateGalleria.listaImmagini.push({ object: URL.createObjectURL(fileImmagine), percorso: path, info: infoImmagine[0] });
    }));
  
    state.caricamento = false;
    stateArtifact.caricamento = false;
  }
});

watch(() => state.percorsiSelezionati, async newPercorsi => {
  emit('nuovaSelezione', newPercorsi);
}, {deep: true});

function isSelected(percorsoFile) {
  if (!state.percorsiSelezionati.includes(percorsoFile)) state.percorsiSelezionati.push(percorsoFile);
  else state.percorsiSelezionati.splice(state.percorsiSelezionati.indexOf(percorsoFile), 1);

  if (stateAnagrafica.moduloAnagraficaVisibile && state.percorsiSelezionati.length !== 1) stateAnagrafica.moduloAnagraficaVisibile = false;
}

function deselectImage() {
  state.percorsiSelezionati = [];
}

function aggiornaFilePaths(listaFilePaths) {
  deselectImage();
  state.filePaths = listaFilePaths;
}

function getPercorsiSelezionati() {
  return state.percorsiSelezionati;
}
</script>

<style scoped>
.image-grid {
  display: grid;
  padding-top: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  grid-gap: 2rem;
}
.thumb-wrapper {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.thumb-wrapper img {
  width: 100%;
  height: 20rem;
  object-fit: cover;
  border-radius: 0.75rem;
  cursor: pointer;
}
.thumb-wrapper img:hover {
  opacity: 0.7;
}
.thumb-caption {
  margin-top: 0.5rem;
  text-align: center;
  font-weight: 600;
}
.bordo-verde {
  border: 1rem solid var(--verdeMain10ance);
}
</style>

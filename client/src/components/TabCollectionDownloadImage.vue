<template>
<div>
  <Card>
    <Details summary="IMMAGINI" :open="true">
      <br>
      <div class="col-lg-12 loading-wrapper">
        <LoadingScreen :caricamento="caricamento" />
        <div v-if="stateGalleria.listaImmagini.length" class="image-grid">
          <img @click="isSelected(url.percorso)" v-for="(url) in stateGalleria.listaImmagini" :key="url.percorso" :src="url.object" :class="percorsiSelezionati.includes(url.percorso) ? 'bordo-verde' : ''">
        </div>
        <div v-else><i>Nessuna immagine presente a questo percorso</i></div>
      </div>
    </Details>
  </Card>
</div>
</template>

<script>
import {reactive, watch, toRefs, inject} from 'vue';
import { getListaImmagini, downloadImmagini, getInfoImmagine } from '../js/richieste';
import {verificaPercorso} from '../js/shared';
import LoadingScreen from './elementi/LoadingScreen.vue';
import Details from './elementi/Details.vue';
import Card from './elementi/Card.vue';

export default {
  name: 'TabCollectionDownloadImage',
  components: {
    LoadingScreen,
    Details,
    Card,
  },
  props: {
    percorsoCartella: String,
  },
  setup(props, {emit}) {
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
      stateGalleria.listaImmagini.forEach(url => URL.revokeObjectURL(url));
      stateGalleria.listaImmagini = [];
      if (verificaPercorso(props.percorsoCartella)) {
        state.caricamento = true;

        await Promise.all(newFilePaths.map(async path => {
          const fileImmagine = await downloadImmagini(path);
          const infoImmagine = await getInfoImmagine(path, stateArtifact.selectElemento);

          if (fileImmagine.errMsg) {
            console.log(fileImmagine.errMsg);
            state.caricamento = false;
            return;
          }

          stateGalleria.listaImmagini.push({ object: URL.createObjectURL(fileImmagine), percorso: path, info: infoImmagine[0] });
        }));
  
        state.caricamento = false;
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

    return {
      ...toRefs(state),
      stateGalleria,
      isSelected,
      deselectImage,
      downloadImmagini,
      aggiornaFilePaths,
      getPercorsiSelezionati,
    }
  }
}
</script>

<style scoped>
.image-grid {
  display: grid;
  padding-top: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  grid-gap: 2rem;
}
.image-grid > img {
  width: 100%;
  height: 20rem;
  object-fit: cover;
  border-radius: 0.75rem;
}
.image-grid > img:hover {
  opacity: 70%;
}
.bordo-verde {
  border: 1rem solid var(--verdeMain10ance);
}
</style>

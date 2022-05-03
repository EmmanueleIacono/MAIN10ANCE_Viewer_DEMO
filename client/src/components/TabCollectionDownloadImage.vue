<template>
<div>
  <Card>
    <Details summary="GALLERIA" :open="true">
      <br>
      <div class="col-lg-12 loading-wrapper">
        <LoadingScreen :caricamento="caricamento" />
        <div v-if="urls.length" class="image-grid">
          <img :src="url.object" @click="isSelected(url.percorso)" v-for="(url) in urls" :key="url.percorso" :class="percorsiSelezionati.includes(url.percorso) ? 'bordo-verde' : ''">
        </div>
        <br>
        <div class="flt-dx">
          <button @click="deleteImage" title="Elimina gli elementi selezionati" class="btn"><i class="zmdi zmdi-delete"></i></button>
          <button title="Aggiungi file in questa cartella" class="btn"><i class="zmdi zmdi-camera" style="margin-right:10px;"></i>
            <label htmlFor="singleUp"><span>Carica file</span></label>
          </button>
          <br>
          <input @change="showPreview" style="visibility: hidden; position: fixed" type="file" id="singleUp" accept="image/*" />
        </div>
      </div>
    </Details>
  </Card>
  <!-- <Card v-if="previewImage">
    <Details summary="NUOVA IMMAGINE" :open="true">
      <br>
      <div class="col-lg-6" >
        <img v-if="previewImage" :src="previewImage" alt="anteprima" class="anteprima">
      </div><br>
      <div class="col-lg-6">
        <div class="flt-dx">
          <button @click="cancel" title="Annulla inserimento" class="btn"><i class="zmdi zmdi-close"></i></button>
          <button v-if="filePaths" @click="uploadImage" title="Salva un file in questa cartella" id="single" class="btn"><i class="zmdi zmdi-floppy" style="margin-right:10px;"></i>
            <label htmlFor="single"><span>Salva file</span></label>
          </button>
        </div>
      </div>
    </Details>
  </Card> -->
</div>
</template>

<script>
import {reactive, watch, toRefs} from 'vue';
import { getListaImmagini, downloadImmagini } from '../js/richieste';
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
  setup(props) {
    const state = reactive({
      caricamento: false,
      filePaths: [],
      urls: [],
      percorsiSelezionati: [],
      selectFiles: [],
      // filePath: '',
    });

    watch(() => props.percorsoCartella, async newpath => {
      console.log(props.percorsoCartella);
      if (verificaPercorso(props.percorsoCartella)) {
        const filePaths = await getListaImmagini(newpath);
        state.filePaths = filePaths;
      }
    });

    watch(() => state.filePaths, async newFilePaths => {
      state.urls.forEach(url => URL.revokeObjectURL(url));
      state.urls = [];
      state.caricamento = true;

      await Promise.all(newFilePaths.map(async path => {
        const fileImmagine = await downloadImmagini(path);

        if (fileImmagine.errMsg) {
          console.log(fileImmagine.errMsg);
          state.caricamento = false;
          return;
        }

        state.urls.push({ object: URL.createObjectURL(fileImmagine), percorso: path });
      }));

      console.log(state.urls);

      state.caricamento = false;
    });

    function isSelected(percorsoFile) {
      console.log(percorsoFile);
      if (!state.percorsiSelezionati.includes(percorsoFile)) state.percorsiSelezionati.push(percorsoFile);
      else state.percorsiSelezionati.splice(state.percorsiSelezionati.indexOf(percorsoFile), 1);
    }

    function deselectImage() {
      state.percorsiSelezionati = [];
    }

    // function cancel() {
    //   state.previewImage = null;
    // }

    function verificaPercorso(percorso) {
      const listaSezioni = percorso.split('/');
      return !listaSezioni.some(sez => !sez);
    }

    return {
      ...toRefs(state),
      isSelected,
      deselectImage,
      // cancel,
      downloadImmagini,
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
.flt-dx {
  float: right;
}
.btn {
  margin-left: 1rem;
  background-color: gray;
  border: none;
  color: white;
  cursor: pointer;
}
.btn:hover {
  background-color: var(--verdeMain10ance);
}
.btn label {
  cursor: pointer;
}
</style>

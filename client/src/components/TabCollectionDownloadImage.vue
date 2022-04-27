<template>
<div>
  <Card>
    <Details summary="GALLERIA" :open="true">
      <br>
      <div class="col-lg-12 loading-wrapper">
        <CreaPercorso :stateUD="'stateDownload'"/>
        <LoadingScreen :caricamento="caricamento" />
        <div v-if="urls.length" class="image-grid">
          <img :src="url.object" @click="isSelected(url.percorso)" v-for="(url) in urls" :key="url.percorso" :class="percorsiSelezionati.includes(url.percorso) ? 'bordo-verde' : ''">
        </div>
        <br>
        <!-- <div v-if="dataCompleted" class="flt-dx">
          <button @click="deselectImage" title="Deseleziona tutto" class="btn"><i class="zmdi zmdi-close"></i></button>
          <button @click="deleteImage" title="Elimina gli elementi selezionati" class="btn"><i class="zmdi zmdi-delete"></i></button>
          <button title="Aggiungi file in questa cartella" class="btn"><i class="zmdi zmdi-camera" style="margin-right:10px;"></i>
            <label htmlFor="singleUp"><span>Carica file</span></label>
          </button>
          <br>
          <input @change="showPreview" style="visibility: hidden; position: fixed" type="file" id="singleUp" accept="image/*" />
        </div> -->
      </div>
    </Details>
  </Card>
  <Card v-if="previewImage">
    <Details summary="NUOVA IMMAGINE" :open="true">
      <br>
      <div class="col-lg-6" >
        <img v-if="previewImage" :src="previewImage" alt="anteprima" class="anteprima">
      </div><br>
      <div class="col-lg-6">
        <div class="contenitore">
          <label for="id_main10ance" class="colonna1">id_main10ance:</label>
          <p id="id_main10ance" class="colonna2"><b>{{id_main10ance}}</b></p>
        </div>
        <div class="contenitore">
          <label for="nome" class="colonna1">Nome</label>
          <input id="nome" class="colonna2">
        </div>
        <div class="contenitore">
          <label for="artista" class="colonna1">Artista</label>
          <input id="artista" class="colonna2">
        </div>
        <div class="contenitore">
          <label for="datazione" class="colonna1">Datazione</label>
          <input id="datazione" class="colonna2">
        </div>
        <div class="contenitore">
          <label for="dimensioni" class="colonna1">Dimensioni</label>
          <input id="dimensioni" class="colonna2"> 
        </div>
        <div class="contenitore">
          <label for="note" class="colonna1">Note</label>
          <textarea id="commenti" class="colonna2"></textarea>
        </div>
        <br>
        <div class="flt-dx">
          <button @click="cancel" title="Annulla inserimento" class="btn"><i class="zmdi zmdi-close"></i></button>
          <button v-if="ImagesUrl" @click="uploadImage" title="Salva un file in questa cartella" id="single" class="btn"><i class="zmdi zmdi-floppy" style="margin-right:10px;"></i>
            <label htmlFor="single"><span>Salva file</span></label>
          </button>
        </div>
      </div>
    </Details>
  </Card>
</div>
</template>

<script>
import {reactive, provide, computed, watch, toRefs} from 'vue';
import { dataInteger } from '../js/shared';
import { getListaImmagini, downloadImmagini/*creaRecordLOD4*/ } from '../js/richieste';
import LoadingScreen from './elementi/LoadingScreen.vue';
import CreaPercorso from './TabCollectionPercorso.vue';
import Details from './elementi/Details.vue';
import Card from './elementi/Card.vue';

export default {
  name: 'TabCollectionDownloadImage',
  components: {
    LoadingScreen,
    CreaPercorso,
    Details,
    Card,
  },
  setup() {
    const state = reactive({
      caricamento: false,
      selectLocalità: '',
      selectEdificio: '',
      selectElemento: '',
      listaSigleLoc: [],
      listaEdif: [],
      listaEdifFiltrata: [],
      listaElementi: [],
      id_main10ance: '',
      ImagesUrl: [],
      urls: [],
      percorsiSelezionati: [],
      selectFiles: [],
      previewImage: null,
      file: null,
      filePath: '',
    });

    provide('stateDownload', state);

    const folderPath = computed(() => `${state.selectLocalità}/${state.selectEdificio}/${state.selectElemento}`);
    const dataCompleted = computed(() => !!state.selectLocalità && !!state.selectEdificio && !!state.selectElemento);
    const id_main10ance = computed(() => `${state.selectLocalità}|${state.selectEdificio}|${state.selectElemento}|${dataInteger()}`);

    watch(() => folderPath.value, async newpath => {
      if (!state.selectLocalità || !state.selectEdificio || !state.selectElemento) return;
      const filePaths = await getListaImmagini(newpath);
      state.ImagesUrl = filePaths;
      state.previewImage = null;
    });

    watch(() => state.ImagesUrl, async newImgUrls => {
      state.urls.forEach(url => URL.revokeObjectURL(url));
      state.urls = [];
      state.caricamento = true;

      await Promise.all(newImgUrls.map(async url => {
        const fileImmagine = await downloadImmagini(url);

        if (fileImmagine.errMsg) {
          console.log(fileImmagine.errMsg);
          state.caricamento = false;
          return;
        }

        state.urls.push({ object: URL.createObjectURL(fileImmagine), percorso: url });
      }));

      console.log(state.urls);

      state.caricamento = false;
    });

    function showPreview(event) {
      if (dataCompleted.value) {
        const file = event.target.files[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${dataInteger()}.${fileExt}`;
        const filePath = `${folderPath.value}/${fileName}`;

        state.previewImage = URL.createObjectURL(file);

        state.file = file;
        state.filePath = filePath;
        console.log(state.filePath);
      }
    }

    // async function uploadImage() {
    //   if(!state.previewImage) return;
    //   try {
    //     const {error} = await supabase.storage.from("sacri-monti").upload(state.filePath, state.file);
    //     if (error) throw error;
    //     else {
    //       await listImage(folderPath.value);
    //       state.previewImage = null;
    //     }
    //   }
    //   catch (error) {
    //     alert(error.message);
    //   }
    // }

    function isSelected(percorsoFile) {
      console.log(percorsoFile);
      if (!state.percorsiSelezionati.includes(percorsoFile)) state.percorsiSelezionati.push(percorsoFile);
      else state.percorsiSelezionati.splice(state.percorsiSelezionati.indexOf(percorsoFile), 1);
    }

    // async function deleteImage() {
    //   const {error} = await supabase.storage.from('sacri-monti').remove(state.percorsiSelezionati);
    //   if (error) throw error;
    //   else {
    //     await listImage(folderPath.value);
    //   }
    // }

    function deselectImage() {
      state.percorsiSelezionati = [];
    }

    function cancel() {
      state.previewImage = null;
    }

    // creaRecordLOD4([id_main10ance.value]);

    return {
      ...toRefs(state),
      dataCompleted,
      id_main10ance,
      showPreview,
      // uploadImage,
      isSelected,
      deselectImage,
      // deleteImage,
      cancel,
      downloadImmagini,
    }
  }
}
</script>

<style scoped>
#contenitore-detail-viewer {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px;
}
#bim-viewer-placeholder {
  width: 100%;
  opacity: 15%;
}
.image-grid {
  display: grid;
  padding-top: 3rem;
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
label {
  margin-bottom: 0;
}
#annulla {
  margin-left: 10px;
}
.contenitore {
  display: flex;
  margin-bottom: 10px;
}
.contenitore p {
  align-self: center;
}
.colonna1 {
  flex: .5;
}
.colonna2 {
  flex: .5;
  line-height: 100%;
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
.bordo-verde {
  border: 1rem solid var(--verdeMain10ance);
}
.anteprima {
  width: 100%;
  border-radius: 5px;
}
</style>

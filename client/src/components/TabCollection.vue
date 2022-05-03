<template>
<div>
  <MainPanel :class="`col-sm-${store.getters.getBimVwSets()[0]} fill`"><br>
    <DownloadImage ref="downloadRef" :percorsoCartella="folderPath" />
  </MainPanel>
  <Explorer :colonna="`col-sm-${store.getters.getBimVwSets()[1]}`">
    <Details summary="SELEZIONE IMMAGINI">
      <div class="wrapper-crea-percorso">
        <CreaPercorso :stateUD="'stateDownload'"/>
      </div>
    </Details>
    <div class="wrapper-bottoni">
      <div class="pannello-galleria btn-img">
        <BtnBIM icona="glyphicon-picture" nome="img-galleria" title="Galleria" colore="verde" />
        <BtnBIM @click="deseleziona" class="btn-img-plus" icona="glyphicon-remove" nome="img-deleseziona" title="Deseleziona tutto" colore="verde" />
      </div>
      <div v-if="verificaDisplay()" class="pannello-upload btn-img">
        <div class="input-wrapper">
          <BtnBIM icona="glyphicon-camera" nome="img-upload" title="Carica immagine" colore="verde" />
          <label htmlFor="imgUp" title="Carica immagine"></label>
          <input @change="mostraAnteprima" type="file" id="imgUp" accept="image/*" />
        </div>
      </div>
      <BtnBIM v-if="verificaDisplay()" class="btn-img-plus" icona="glyphicon-trash" nome="img-elimina" title="Elimina selezionati" colore="verde" />
      <BtnBIM v-if="verificaDisplay()" class="btn-img-plus" icona="glyphicon-list-alt" nome="img-interroga" title="Interroga" colore="verde" />
      <BtnBIM v-if="verificaDisplay()" class="btn-img-plus" icona="glyphicon-plus" nome="img-anagrafica" title="Aggiungi o modifica dati" colore="verde" />
    </div>
    <div class="explorer-body">
      <UploadImage v-if="datiCaricamento.anteprimaImg" :source="datiCaricamento.anteprimaImg" :stateUD="'stateUpload'" />
    </div>
  </Explorer>
</div>
</template>

<script>
import {inject, reactive, toRefs, provide, computed, ref} from 'vue';
import {dataInteger} from '../js/shared';
import Explorer from './elementi/Explorer.vue';
import Details from './elementi/Details.vue';
import MainPanel from './elementi/MainPanel.vue';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';
import DownloadImage from './TabCollectionDownloadImage.vue';
import UploadImage from './TabCollectionUploadImage.vue';
import CreaPercorso from './TabCollectionPercorso.vue';

export default {
  name: 'TabCollection',
  components: {
    Explorer,
    Details,
    DownloadImage,
    MainPanel,
    BtnBIM,
    UploadImage,
    CreaPercorso,
  },
  setup() {
    const store = inject('store');
    const downloadRef = ref(null);
    const state = reactive({
      datiNavigazione: {
        caricamento: false,
        selectLocalità: '',
        selectEdificio: '',
        selectElemento: '',
        listaSigleLoc: [],
        listaEdif: [],
        listaEdifFiltrata: [],
        listaElementi: [],
      },
      datiCaricamento: {
        anteprimaImg: null,
        file: null,
      }
    });
    provide('stateDownload', state.datiNavigazione);
    provide('stateUpload', {
      selectLocalità: state.datiNavigazione.selectLocalità,
      selectEdificio: state.datiNavigazione.selectEdificio,
      selectElemento: state.datiNavigazione.selectElemento,
    });

    const folderPath = computed(() => `${state.datiNavigazione.selectLocalità}/${state.datiNavigazione.selectEdificio}/${state.datiNavigazione.selectElemento}`);

    function mostraAnteprima(event) {
      console.log('anteprima cambiata');
      const file = event.target.files[0];
      console.log(file);
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${dataInteger()}.${fileExt}`;

        state.datiCaricamento.anteprimaImg = URL.createObjectURL(file);
        state.datiCaricamento.file = file;
        console.log('vecchio nome: ', file.name);
        console.log('nuovo nome: ', fileName);
      }
      else {
        cancellaAnteprima();
      }
    }

    function cancellaAnteprima() {
      URL.revokeObjectURL(state.datiCaricamento.anteprimaImg);
      state.datiCaricamento.anteprimaImg = null;
      state.datiCaricamento.file = null;
    }

    function verificaDisplay() {
      return store.getters.getUsrVwList().includes('galleryMod');
    }

    function deseleziona() {
      downloadRef.value.deselectImage();
    }

    return {
      store,
      downloadRef,
      ...toRefs(state),
      folderPath,
      mostraAnteprima,
      verificaDisplay,
      deseleziona,
    }
  }
}
</script>

<style scoped>
.btn-img ~ .btn-img {
  margin-left: .4rem;
}
.btn-img-plus {
  margin-left: .9rem;
}
.wrapper-crea-percorso {
  margin: 15px;
}
.wrapper-bottoni {
  display: inline-flex;
  padding: 10px;
}
.input-wrapper {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: fit-content;
}
.input-wrapper label {
  position: absolute;
  height: 30px;
  width: 30px;
  cursor: pointer;
}
input {
  display: none;
}
.explorer-body {
  margin: 5px;
  padding: 10px;
  overflow: auto;
}
</style>

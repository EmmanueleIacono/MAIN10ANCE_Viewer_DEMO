<template>
<div>
  <MainPanel :class="`col-sm-${store.getters.getBimVwSets()[0]} fill`"><br>
    <DownloadImage ref="downloadRef" :percorsoCartella="percorsoCartella" />
    <Galleria v-if="datiGalleria.galleriaVisibile" />
  </MainPanel>
  <Explorer :colonna="`col-sm-${store.getters.getBimVwSets()[1]}`">
    <Details summary="SELEZIONE IMMAGINI">
      <div class="wrapper-crea-percorso">
        <CreaPercorso />
      </div>
    </Details>
    <div class="wrapper-bottoni">
      <div class="pannello-galleria btn-img">
        <BtnBIM @click="mostraGalleria" icona="glyphicon-picture" nome="img-galleria" title="Galleria" colore="verde" />
        <BtnBIM @click="deseleziona" class="btn-img-plus" icona="glyphicon-remove" nome="img-deleseziona" title="Deseleziona tutto" colore="verde" />
      </div>
      <div v-if="verificaDisplay()" class="pannello-upload btn-img">
        <div class="input-wrapper">
          <BtnBIM @click="cliccaLabel" icona="glyphicon-camera" nome="img-upload" title="Carica immagine" colore="verde" />
          <label ref="labelRef" htmlFor="imgUp" title="Carica immagine"></label>
          <input @change="mostraAnteprima" ref="inputRef" type="file" id="imgUp" accept="image/*" />
        </div>
      </div>
      <BtnBIM @click="eliminaImmagine" v-if="verificaDisplay()" class="btn-img-plus" icona="glyphicon-trash" nome="img-elimina" title="Elimina selezionati" colore="verde" />
      <BtnBIM @click="interrogaImmagine" v-if="verificaDisplay()" class="btn-img-plus" icona="glyphicon-list-alt" nome="img-interroga" title="Interroga" colore="verde" />
      <BtnBIM @click="anagraficaImmagine" v-if="verificaDisplay()" class="btn-img-plus" icona="glyphicon-plus" nome="img-anagrafica" title="Aggiungi o modifica dati" colore="verde" />
    </div>
    <div class="explorer-body">
      <button @click="stampadatiul">stampa dati upload</button>
      <UploadImage @annullaCaricamentoImmagine="cancellaAnteprima" @salvaCaricamentoImmagine="salvaImmagine" v-if="datiCaricamento.anteprimaImg" :source="datiCaricamento.anteprimaImg" :percorso="percorsoCartella" :id_main10ance="id_main10ance" />
    </div>
  </Explorer>
</div>
</template>

<script>
import {inject, reactive, toRefs, provide, computed, ref} from 'vue';
import {dataInteger, verificaPercorso} from '../js/shared';
import {creaRecordLOD4} from '../js/richieste';
import Explorer from './elementi/Explorer.vue';
import Details from './elementi/Details.vue';
import MainPanel from './elementi/MainPanel.vue';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';
import DownloadImage from './TabCollectionDownloadImage.vue';
import UploadImage from './TabCollectionUploadImage.vue';
import CreaPercorso from './TabCollectionPercorso.vue';
import Galleria from './TabCollectionGallery.vue';

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
    Galleria,
  },
  setup() {
    const store = inject('store');
    const downloadRef = ref(null);
    const inputRef = ref(null);
    const labelRef = ref(null);
    const state = reactive({
      datiGalleria: {
        galleriaVisibile: false,
        listaImmagini: [],
      },
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
        idImmagine: '',
      }
    });
    provide('stateArtifact', state.datiNavigazione);
    provide('stateGalleria', state.datiGalleria);

    const percorsoCartella = computed(() => `${state.datiNavigazione.selectLocalità}/${state.datiNavigazione.selectEdificio}/${state.datiNavigazione.selectElemento}`);
    const id_main10ance = computed(() => `${state.datiNavigazione.selectLocalità}|${state.datiNavigazione.selectEdificio}|${state.datiNavigazione.selectElemento}|${state.datiCaricamento.idImmagine}`);

    function mostraGalleria() {
      state.datiGalleria.galleriaVisibile = !state.datiGalleria.galleriaVisibile;
    }

    function cliccaLabel() {
      labelRef.value.click();
    }

    function mostraAnteprima(event) {
      const file = event.target.files[0];
      if (file) {
        const idImmagine = dataInteger();
        state.datiCaricamento.idImmagine = idImmagine;
        state.datiCaricamento.anteprimaImg = URL.createObjectURL(file);
        const nuovoNomeImmagine = `${state.datiCaricamento.idImmagine}__${file.name}`;
        const nuovoFile = new File([file], nuovoNomeImmagine, {type: file.type});
        state.datiCaricamento.file = nuovoFile;
        console.log(state.datiCaricamento);
        console.log('percorso cartella: ', percorsoCartella.value);
        console.log('nuovo nome file: ', nuovoNomeImmagine);
      }
      else {
        cancellaAnteprima();
      }
    }

    function cancellaAnteprima() {
      URL.revokeObjectURL(state.datiCaricamento.anteprimaImg);
      const dt = new DataTransfer();
      inputRef.value.files = dt.files;
      state.datiCaricamento.anteprimaImg = null;
      state.datiCaricamento.file = null;
      state.datiCaricamento.idImmagine = '';
    }

    function verificaDisplay() {
      return store.getters.getUsrVwList().includes('galleryMod');
    }

    function deseleziona() {
      downloadRef.value.deselectImage();
    }

    async function eliminaImmagine() {
      alert('elimina immagine');
      // const {error} = await supabase.storage.from('sacri-monti').remove(state.percorsiSelezionati);
      // if (error) throw error;
      // else {
      //   await listImage(percorsoCartella.value);
      // }
    }

    async function salvaImmagine(dati) {
      if (verificaPercorso(percorsoCartella.value)) {
        console.log('si può salvare');
        console.log(dati);
        console.log(percorsoCartella.value);
        console.log(state.datiCaricamento);
        const datiCompleti = {...dati, id_immagine: state.datiCaricamento.idImmagine, id_main10ance: id_main10ance.value, percorso: percorsoCartella.value};
        console.log(datiCompleti);
        const fd = new FormData();
        fd.append('file', state.datiCaricamento.file);
        fd.append('dati', JSON.stringify(datiCompleti));

        const risultato = await creaRecordLOD4(fd);
        console.log(risultato);
        /*
        METODO DA USARE:
        let photo = document.getElementById("image-file").files[0];
        let user = { name:'john', age:34 };
        let formData = new FormData();

        formData.append("photo", photo);
        formData.append("user", JSON.stringify(user));

        fetch('/upload/image', {method: "POST", body: formData});
        */
      }
      else {
        store.methods.setAlert('Percorso non valido, impossibile continuare');
      }
      // if(!state.previewImage) return;
      // try {
      //   const {error} = await supabase.storage.from("sacri-monti").upload(state.filePath, state.file);
      //   if (error) throw error;
      //   else {
      //     await listImage(percorsoCartella.value);
      //     state.previewImage = null;
      //   }
      // }
      // catch (error) {
      //   alert(error.message);
      // }
    }

    // creaRecordLOD4([id_main10ance.value]);

    async function interrogaImmagine() {
      alert('interroga immagine');
    }

    async function anagraficaImmagine() {
      alert('anagrafica immagine');
    }

    function stampadatiul() {
      console.log(state.datiCaricamento);
      console.log('percorso cartella: ', percorsoCartella.value);
      // console.log('nuovo nome file: ', nuovoNomeImmagine.value);
    }

    return {
      store,
      downloadRef,
      inputRef,
      labelRef,
      ...toRefs(state),
      percorsoCartella,
      id_main10ance,
      cliccaLabel,
      mostraGalleria,
      mostraAnteprima,
      cancellaAnteprima,
      verificaDisplay,
      deseleziona,
      eliminaImmagine,
      salvaImmagine,
      interrogaImmagine,
      anagraficaImmagine,
      stampadatiul,
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
  display: none;
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

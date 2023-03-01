<template>
<div>
  <MainPanel :class="`col-sm-${store.getters.getBimVwSets()[0]} fill`"><br>
    <DownloadImage @nuovaSelezione="aggiornaSelezione" ref="downloadRef" :percorsoCartella="percorsoCartella" />
    <Galleria v-if="datiGalleria.galleriaVisibile" />
  </MainPanel>
  <Explorer :colonna="`col-sm-${store.getters.getBimVwSets()[1]}`">
    <Details summary="SELEZIONE IMMAGINI" :open="true">
      <div class="wrapper-crea-percorso">
        <CreaPercorso />
      </div>
    </Details>
    <div class="wrapper-bottoni">
      <div class="pannello-galleria btn-img">
        <BtnBIM @click="mostraGalleria" icona="glyphicon-picture" nome="img-galleria" title="Galleria" colore="verde" />
        <BtnBIM @click="deseleziona" class="btn-img-plus" icona="glyphicon-remove" nome="img-deleseziona" title="Deseleziona tutto" colore="verde" />
      </div>
      <div v-if="verificaDisplay('galleryMod')" class="pannello-upload btn-img">
        <div class="input-wrapper">
          <BtnBIM @click="cliccaLabel" icona="glyphicon-camera" nome="img-upload" title="Carica immagine" colore="verde" />
          <label ref="labelRef" htmlFor="imgUp" title="Carica immagine"></label>
          <input @change="mostraAnteprima" ref="inputRef" type="file" id="imgUp" accept="image/*" />
        </div>
      </div>
      <BtnBIM @click="eliminaImmagine" v-if="verificaDisplay('galleryMod')" class="btn-img-plus" icona="glyphicon-trash" nome="img-elimina" title="Elimina selezionati" colore="verde" />
      <BtnBIM @click="interrogaImmagine" v-if="verificaDisplay('galleryDati')" class="btn-img-plus" icona="glyphicon-list-alt" nome="img-interroga" title="Interroga" colore="verde" />
      <BtnBIM @click="anagraficaImmagine" v-if="verificaDisplay('galleryDati')" class="btn-img-plus" icona="glyphicon-plus" nome="img-anagrafica" title="Aggiungi o modifica dati" colore="verde" />
    </div>
    <div class="explorer-body">
      <div class="col-lg-12 loading-wrapper">
        <LoadingScreen :caricamento="datiNavigazione.caricamento" />
        <UploadImage @annullaCaricamentoImmagine="cancellaAnteprima" @salvaCaricamentoImmagine="salvaImmagine" v-if="datiCaricamento.anteprimaImg" :source="datiCaricamento.anteprimaImg" :percorso="percorsoCartella" :id_main10ance="id_main10ance" />
        <ModuloAnagrafica ref="anagraficaRef" v-if="datiAnagrafica.moduloAnagraficaVisibile" />
        <SchedaAnagrafica ref="scAnagraficaRef" v-if="datiAnagrafica.schedaAnagraficaVisibile" />
        </div>
    </div>
  </Explorer>
</div>
</template>

<script>
import {inject, reactive, toRefs, provide, computed, ref} from 'vue';
import {dataInteger, verificaPercorso, dataCorta} from '../js/shared';
import {getListaImmagini} from '../js/richieste';
import {creaRecordLOD4, eliminaRecordLOD4, getAnagraficaArtifactViewer} from '../js/richieste';
import Explorer from './elementi/Explorer.vue';
import Details from './elementi/Details.vue';
import MainPanel from './elementi/MainPanel.vue';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';
import DownloadImage from './TabCollectionDownloadImage.vue';
import UploadImage from './TabCollectionUploadImage.vue';
import CreaPercorso from './TabCollectionPercorso.vue';
import Galleria from './TabCollectionGallery.vue';
import ModuloAnagrafica from './TabCollectionModuloAnagrafica.vue';
import SchedaAnagrafica from './TabCollectionSchedaAnagrafica.vue';
import LoadingScreen from './elementi/LoadingScreen.vue';

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
    ModuloAnagrafica,
    SchedaAnagrafica,
    LoadingScreen,
  },
  setup() {
    const store = inject('store');
    const downloadRef = ref(null);
    const inputRef = ref(null);
    const labelRef = ref(null);
    const anagraficaRef = ref(null);
    const scAnagraficaRef = ref(null);
    const state = reactive({
      datiGalleria: {
        galleriaVisibile: false,
        listaImmagini: [],
        idImgSelezionate: [],
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
      },
      datiAnagrafica: {
        moduloAnagraficaVisibile: false,
        schedaAnagraficaVisibile: false,
        schedaAnagrafica: null,
      }
    });
    provide('stateArtifact', state.datiNavigazione);
    provide('stateGalleria', state.datiGalleria);
    provide('stateAnagrafica', state.datiAnagrafica);

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

    function verificaDisplay(sezione) {
      return store.getters.getUsrVwList().includes(sezione);
    }

    function deseleziona() {
      downloadRef.value.deselectImage();
      if (anagraficaRef.value) anagraficaRef.value.chiudiScheda();
      if (scAnagraficaRef.value) scAnagraficaRef.value.chiudiScheda();
    }

    async function eliminaImmagine() {
      const daEliminare = downloadRef.value.getPercorsiSelezionati();
      if (!daEliminare.length) {
        store.methods.setAlert('Nessun elemento selezionato');
        return;
      }
      const confermaProcedere = await store.methods.setConfirm("Sei sicuro di voler eliminare gli elementi selezionati? L'operazione è irreversibile.");
      if (!confermaProcedere) return;
      const jsonReq = {};
      jsonReq.immagini = [...daEliminare];
      jsonReq.entità = state.datiNavigazione.selectElemento;
      store.methods.toggleLoaderGlobale();
      const risultato = await eliminaRecordLOD4(jsonReq);
      if (risultato.success) {
        store.methods.setAlert('Operazione andata a buon fine');
        const filePaths = await getListaImmagini(percorsoCartella.value);
        downloadRef.value.aggiornaFilePaths(filePaths);
      }
      else {
        store.methods.setAlert('Operazione fallita, riprovare');
      }
      store.methods.toggleLoaderGlobale();
    }

    async function salvaImmagine(dati) {
      if (verificaPercorso(percorsoCartella.value)) {
        const datiCompleti = {
          ...dati,
          id_immagine: state.datiCaricamento.idImmagine,
          id_main10ance: id_main10ance.value,
          percorso: percorsoCartella.value,
          entità: state.datiNavigazione.selectElemento,
          data_ins: dataCorta(),
        };
        const fd = new FormData();
        fd.append('file', state.datiCaricamento.file);
        fd.append('dati', JSON.stringify(datiCompleti));

        store.methods.toggleLoaderGlobale();
        const risultato = await creaRecordLOD4(fd);
        if (risultato.success) {
          store.methods.setAlert('Operazione andata a buon fine');
          cancellaAnteprima();
          const filePaths = await getListaImmagini(percorsoCartella.value);
          downloadRef.value.aggiornaFilePaths(filePaths);
        }
        else {
          store.methods.setAlert('Operazione fallita, riprovare');
        }
      }
      else {
        store.methods.setAlert('Percorso non valido, impossibile continuare');
      }
      store.methods.toggleLoaderGlobale();
    }

    async function interrogaImmagine() {
      const daInterrogare = downloadRef.value.getPercorsiSelezionati();
      if (!daInterrogare.length) {
        store.methods.setAlert('Nessun elemento selezionato');
        return;
      }
      else if (daInterrogare.length !== 1) {
        store.methods.setAlert('Selezionare un solo elemento per volta');
        return;
      }
      else {
        state.datiNavigazione.caricamento = true;
        const idMain10ance = state.datiGalleria.idImgSelezionate[0];
        const categoria = state.datiNavigazione.selectElemento;
        const jsonReq = {
          id: idMain10ance,
          categoria: categoria
        };
        console.log(jsonReq);
        const datiAnagrafica = await getAnagraficaArtifactViewer(jsonReq);
        console.log(datiAnagrafica);
        state.datiAnagrafica.schedaAnagrafica = datiAnagrafica[0];
        state.datiAnagrafica.moduloAnagraficaVisibile = false;
        state.datiAnagrafica.schedaAnagraficaVisibile = true;
        state.datiNavigazione.caricamento = false;
      }
    }

    async function anagraficaImmagine() {
      const immaginiSelezionate = downloadRef.value.getPercorsiSelezionati();
      if (!immaginiSelezionate.length) {
        store.methods.setAlert('Nessun elemento selezionato');
        return;
      }
      else if (immaginiSelezionate.length !== 1) {
        store.methods.setAlert('Selezionare un solo elemento per volta');
        return;
      }
      else {
        state.datiAnagrafica.schedaAnagraficaVisibile = false;
        state.datiAnagrafica.moduloAnagraficaVisibile = true;
      }
    }

    function aggiornaSelezione(nuovaSelezione) {
      const imgSelezionate = state.datiGalleria.listaImmagini.filter(img => nuovaSelezione.includes(img.percorso));
      const idImgSelezionate = imgSelezionate.map(img => img.info.id_main10ance);
      state.datiGalleria.idImgSelezionate = idImgSelezionate;
    }

    return {
      store,
      downloadRef,
      inputRef,
      labelRef,
      anagraficaRef,
      scAnagraficaRef,
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
      aggiornaSelezione,
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

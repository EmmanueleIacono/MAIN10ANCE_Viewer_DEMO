<template>
<div>
  <MainPanel :class="`col-sm-${store.getters.getBimVwSets()[0]} fill`"><br>
    <DownloadImage @nuovaSelezione="aggiornaSelezione" ref="downloadRef" :percorsoCartella="percorsoCartella" />
    <Galleria v-if="datiGalleria.galleriaVisibile" />
  </MainPanel>
  <Explorer :colonna="`col-sm-${store.getters.getBimVwSets()[1]}`">
    <Details summary="SELEZIONE IMMAGINI" :open="true">
      <div class="wrapper-crea-percorso loading-wrapper">
        <LoadingScreen :caricamento="datiNavigazione.caricamento" />
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
      <BtnBIM @click="segnalazioneImmagine" v-if="verificaDisplay('galleryDati')" class="btn-img-plus" icona="glyphicon-alert" nome="img-segnalazione" title="Segnalazione" colore="verde" />
    </div>
    <div class="explorer-body">
      <div class="col-lg-12 loading-wrapper">
        <LoadingScreen :caricamento="datiNavigazione.caricamento" />
        <UploadImage
          @annullaCaricamentoImmagine="cancellaAnteprima"
          @salvaCaricamentoImmagine="salvaImmagine"
          v-if="datiCaricamento.anteprimaImg"
          :source="datiCaricamento.anteprimaImg"
          :percorso="percorsoCartella"
        />
        <ModuloAnagrafica ref="anagraficaRef" v-if="datiAnagrafica.moduloAnagraficaVisibile" />
        <ModuloSegnalazione ref="segnalazioneRef" v-if="datiSegnalazione.moduloSegnalazioneVisibile" />
        <SchedaAnagrafica ref="scAnagraficaRef" v-if="datiAnagrafica.schedaAnagraficaVisibile" />
        <br />
        <SchedaSegnalazione ref="scSegnalazioneRef" v-if="datiSegnalazione.schedaSegnalazioneVisibile" />
        </div>
    </div>
  </Explorer>
</div>
</template>

<script>
import {inject, reactive, toRefs, provide, computed, ref} from 'vue';
import {dataInteger, verificaPercorso, dataCorta} from '../js/shared';
import {getListaImmagini} from '../js/richieste';
import {creaRecordLOD4, eliminaRecordLOD4, getAnagraficaArtifactViewer, getSegnalazioneArtifactViewer} from '../js/richieste';
import Explorer from './elementi/Explorer.vue';
import Details from './elementi/Details.vue';
import MainPanel from './elementi/MainPanel.vue';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';
import DownloadImage from './TabCollectionDownloadImage.vue';
import UploadImage from './TabCollectionUploadImage.vue';
import CreaPercorso from './TabCollectionPercorso.vue';
import Galleria from './TabCollectionGallery.vue';
import ModuloAnagrafica from './TabCollectionModuloAnagrafica.vue';
import ModuloSegnalazione from './TabCollectionModuloSegnalazione.vue';
import SchedaAnagrafica from './TabCollectionSchedaAnagrafica.vue';
import SchedaSegnalazione from './TabCollectionSchedaSegnalazione.vue';
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
    ModuloSegnalazione,
    SchedaAnagrafica,
    SchedaSegnalazione,
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
      },
      datiSegnalazione: {
        moduloSegnalazioneVisibile: false,
        schedaSegnalazioneVisibile: false,
        schedaSegnalazione: null,
      },
      datiModuloAnagrafica: {
        descrizione_sistema: '',
        descrizione_subsistema: '',
        tecnica_costruttiva: '',
        dimensioni: '',
        materiale: '',
        epoca: '',
        ispezionabilità: '',
        fonti: '',
        definizione: '',
        autore: '',
        descrizione: '',
        tecniche: '',
        documenti: '',
        iter_autorizzativo: '',
        data: '',
        docs: [], // lista nomi documenti
        id_anagr: null,
        data_registrazione: null,
        data_ultima_mod: null,
        autore_scheda: null,
        autore_ultima_mod: null,
      },
      datiModuloAnagraficaStatua: {
        nome_statua: '',
        descrizione_statua: '',
        tecnica_esecuzione: '',
        dimensioni: '',
        materiale_statua: '',
        materiale_annotazioni: '',
        materiale_armatura: '', // enum
        materiale_supporto: '', // enum
        lamina_metallica: false, // bool
        pellicola_pittorica: '',
        strato_di_preparazione: '',
        elementi_accessori: '', // enum
        monili: '', // enum
        elementi_di_ancoraggio_a_parete: false,
        elementi_di_ancoraggio_a_pavimento: false,
        elementi_di_ancoraggio_annotazioni: '',
        epoca: '',
        fonti: '',
        autore: '',
        accessibilità: false, // bool
        note: '',
        docs: [], // lista nomi documenti
        id_anagr: null,
        data_registrazione: null,
        data_ultima_mod: null,
        autore_scheda: null,
        autore_ultima_mod: null,
      },
      datiModuloSegnalazione: {
        meteo: '',
        temperatura: '',
        condizioni_sett_precedente: '',
        descrizione: '',
        intervento_urgenza: '',
        id_segnalazione: null,
        data_registrazione: null,
        data_ultima_mod: null,
        autore_scheda: null,
        autore_ultima_mod: null,
      },
      datiDocumenti: {
        docs: [], // lista nomi documenti
      },
      datiUtility: {
        schedaPreesistente: false,
      },
    });
    provide('stateArtifact', state.datiNavigazione);
    provide('stateGalleria', state.datiGalleria);
    provide('stateAnagrafica', state.datiAnagrafica);
    provide('stateSegnalazione', state.datiSegnalazione);
    provide('stateModuloAnagrafica', state.datiModuloAnagrafica);
    provide('stateModuloAnagraficaStatua', state.datiModuloAnagraficaStatua);
    provide('stateDocumenti', state.datiDocumenti);
    provide('stateModuloSegnalazione', state.datiModuloSegnalazione);

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
        // QUI SE MANUFATTO O DETTAGLIO, SERVE MODIFICA DATI COMPLETI
        const datiCompleti = {
          ...dati,
          id_immagine: state.datiCaricamento.idImmagine,
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
        const datiSegnalazione = await getSegnalazioneArtifactViewer(jsonReq);
        console.log(datiAnagrafica);
        console.log(datiSegnalazione);
        state.datiAnagrafica.schedaAnagrafica = datiAnagrafica[0];
        state.datiSegnalazione.schedaSegnalazione = datiSegnalazione[0];
        state.datiAnagrafica.moduloAnagraficaVisibile = false;
        state.datiSegnalazione.moduloSegnalazioneVisibile = false;
        state.datiAnagrafica.schedaAnagraficaVisibile = true;
        state.datiSegnalazione.schedaSegnalazioneVisibile = true;
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
        state.datiNavigazione.caricamento = true;
        state.datiAnagrafica.schedaAnagrafica = null;
        const idMain10ance = state.datiGalleria.idImgSelezionate[0];
        const categoria = state.datiNavigazione.selectElemento;
        const jsonReq = {
          id: idMain10ance,
          categoria: categoria
        };
        console.log(jsonReq);
        const datiAnagrafica = await getAnagraficaArtifactViewer(jsonReq);
        console.log(datiAnagrafica);
        state.datiAnagrafica.schedaAnagraficaVisibile = false;
        state.datiSegnalazione.schedaSegnalazioneVisibile = false;
        state.datiSegnalazione.moduloSegnalazioneVisibile = false;
        state.datiAnagrafica.moduloAnagraficaVisibile = true;
        if (datiAnagrafica.length) {
          console.log('ci sono dei dati');
          // QUI IMPOSTARE DATI ANAGRAFICA
          switch (categoria) {
            case 'manufatto':
              // dati Manufatto
              state.datiAnagrafica.schedaAnagrafica = datiAnagrafica[0];
              console.log('state anagrafica: ', state.datiAnagrafica.schedaAnagrafica);
              state.datiModuloAnagrafica.definizione = state.datiAnagrafica.schedaAnagrafica['Definizione'];
              state.datiModuloAnagrafica.epoca = state.datiAnagrafica.schedaAnagrafica['Epoca'];
              state.datiModuloAnagrafica.autore = state.datiAnagrafica.schedaAnagrafica['Autore'];
              state.datiModuloAnagrafica.descrizione = state.datiAnagrafica.schedaAnagrafica['Descrizione'];
              state.datiModuloAnagrafica.materiale = state.datiAnagrafica.schedaAnagrafica['Materiale/i'];
              state.datiModuloAnagrafica.tecniche = state.datiAnagrafica.schedaAnagrafica['Tecniche'];
              state.datiModuloAnagrafica.documenti = state.datiAnagrafica.schedaAnagrafica['Documenti'];
              state.datiModuloAnagrafica.iter_autorizzativo = state.datiAnagrafica.schedaAnagrafica['Iter autorizzativo'];
              break;

            case 'dettaglio':
              // dati Dettaglio
              state.datiAnagrafica.schedaAnagrafica = datiAnagrafica[0];
              console.log('state anagrafica: ', state.datiAnagrafica.schedaAnagrafica);
              state.datiModuloAnagrafica.definizione = state.datiAnagrafica.schedaAnagrafica['Definizione'];
              state.datiModuloAnagrafica.descrizione = state.datiAnagrafica.schedaAnagrafica['Descrizione'];
              state.datiModuloAnagrafica.materiale = state.datiAnagrafica.schedaAnagrafica['Materiale/i'];
              state.datiModuloAnagrafica.tecniche = state.datiAnagrafica.schedaAnagrafica['Tecniche'];
              state.datiModuloAnagrafica.epoca = state.datiAnagrafica.schedaAnagrafica['Epoca'];
              state.datiModuloAnagrafica.documenti = state.datiAnagrafica.schedaAnagrafica['Documenti'];
              state.datiModuloAnagrafica.autore = state.datiAnagrafica.schedaAnagrafica['Autore'];
              state.datiModuloAnagrafica.data = state.datiAnagrafica.schedaAnagrafica['Data'];
              break;

            case 'statua':
              state.datiAnagrafica.schedaAnagrafica = datiAnagrafica[0];
              console.log('state anagrafica statua: ', state.datiAnagrafica.schedaAnagrafica);
              state.datiModuloAnagraficaStatua.nome_statua = state.datiAnagrafica.schedaAnagrafica['Nome statua'];
              state.datiModuloAnagraficaStatua.descrizione_statua = state.datiAnagrafica.schedaAnagrafica['Descrizione statua'];
              state.datiModuloAnagraficaStatua.tecnica_esecuzione = state.datiAnagrafica.schedaAnagrafica['Tecnica di esecuzione'];
              state.datiModuloAnagraficaStatua.dimensioni = state.datiAnagrafica.schedaAnagrafica['Dimensioni'];
              state.datiModuloAnagraficaStatua.materiale_statua = state.datiAnagrafica.schedaAnagrafica['Materiale statua']
              state.datiModuloAnagraficaStatua.materiale_annotazioni = state.datiAnagrafica.schedaAnagrafica['Materiale annotazioni'];
              state.datiModuloAnagraficaStatua.materiale_armatura = state.datiAnagrafica.schedaAnagrafica['Materiale armatura'];
              state.datiModuloAnagraficaStatua.materiale_supporto = state.datiAnagrafica.schedaAnagrafica['Materiale supporto'];
              state.datiModuloAnagraficaStatua.lamina_metallica = state.datiAnagrafica.schedaAnagrafica['Lamina metallica'];
              state.datiModuloAnagraficaStatua.pellicola_pittorica = state.datiAnagrafica.schedaAnagrafica['Pellicola pittorica'];
              state.datiModuloAnagraficaStatua.strato_di_preparazione = state.datiAnagrafica.schedaAnagrafica['Strato di preparazione'];
              state.datiModuloAnagraficaStatua.elementi_accessori = state.datiAnagrafica.schedaAnagrafica['Elementi accessori'];
              state.datiModuloAnagraficaStatua.monili = state.datiAnagrafica.schedaAnagrafica['Monili'];
              state.datiModuloAnagraficaStatua.elementi_di_ancoraggio_a_parete = state.datiAnagrafica.schedaAnagrafica['Elementi di ancoraggio a parete'];
              state.datiModuloAnagraficaStatua.elementi_di_ancoraggio_a_pavimento = state.datiAnagrafica.schedaAnagrafica['Elementi di ancoraggio a pavimento'];
              state.datiModuloAnagraficaStatua.elementi_di_ancoraggio_annotazioni = state.datiAnagrafica.schedaAnagrafica['Elementi di ancoraggio annotazioni'];
              state.datiModuloAnagraficaStatua.epoca = state.datiAnagrafica.schedaAnagrafica['Epoca'];
              state.datiModuloAnagraficaStatua.fonti = state.datiAnagrafica.schedaAnagrafica['Fonti'];
              state.datiModuloAnagraficaStatua.autore = state.datiAnagrafica.schedaAnagrafica['Autore'];
              state.datiModuloAnagraficaStatua.accessibilità = state.datiAnagrafica.schedaAnagrafica['Accessibilità'];
              state.datiModuloAnagraficaStatua.note = state.datiAnagrafica.schedaAnagrafica['Note'];
              state.datiDocumenti.docs = state.datiAnagrafica.schedaAnagrafica['Documenti'];
              break;
          
            default:
              // dati LOD4
              state.datiAnagrafica.schedaAnagrafica = datiAnagrafica[0];
              console.log('state anagrafica: ', state.datiAnagrafica.schedaAnagrafica);
              state.datiModuloAnagrafica.descrizione_sistema = state.datiAnagrafica.schedaAnagrafica['Descrizione sistema'];
              state.datiModuloAnagrafica.descrizione_subsistema = state.datiAnagrafica.schedaAnagrafica['Descrizione subsistema'];
              state.datiModuloAnagrafica.tecnica_costruttiva = state.datiAnagrafica.schedaAnagrafica['Tecnica costruttiva'];
              state.datiModuloAnagrafica.dimensioni = state.datiAnagrafica.schedaAnagrafica['Dimensioni'];
              state.datiModuloAnagrafica.materiale = state.datiAnagrafica.schedaAnagrafica['Materiale/i'];
              state.datiModuloAnagrafica.epoca = state.datiAnagrafica.schedaAnagrafica['Epoca'];
              state.datiModuloAnagrafica.ispezionabilità = state.datiAnagrafica.schedaAnagrafica['Ispezionabilità'];
              state.datiModuloAnagrafica.fonti = state.datiAnagrafica.schedaAnagrafica['Fonti'];
              break;
          }
        }
        else {
          console.log('non ci sono dati');
        }
        state.datiNavigazione.caricamento = false;
      }
    }

    async function segnalazioneImmagine() {
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
        state.datiNavigazione.caricamento = true;
        state.datiSegnalazione.schedaSegnalazione = null;
        const idMain10ance = state.datiGalleria.idImgSelezionate[0];
        const categoria = state.datiNavigazione.selectElemento;
        const jsonReq = {
          id: idMain10ance,
          categoria: categoria
        };
        console.log(jsonReq);
        // const datiAnagrafica = await getAnagraficaArtifactViewer(jsonReq);
        const datiSegnalazione = await getSegnalazioneArtifactViewer(jsonReq);
        console.log(datiSegnalazione);
        state.datiAnagrafica.schedaAnagraficaVisibile = false;
        state.datiAnagrafica.moduloAnagraficaVisibile = false;
        state.datiSegnalazione.schedaSegnalazioneVisibile = false;
        state.datiSegnalazione.moduloSegnalazioneVisibile = true;
        if (datiSegnalazione.length) {
          console.log('ci sono dei dati');
          // QUI IMPOSTARE DATI SEGNALAZIONE
          state.datiSegnalazione.schedaSegnalazione = datiSegnalazione[0];
          console.log('state segnalazione: ', state.datiSegnalazione.schedaSegnalazione);
          state.datiModuloSegnalazione.meteo = state.datiSegnalazione.schedaSegnalazione['Meteo'];
          state.datiModuloSegnalazione.temperatura = state.datiSegnalazione.schedaSegnalazione['Temperatura'];
          state.datiModuloSegnalazione.condizioni_sett_precedente = state.datiSegnalazione.schedaSegnalazione['Condizioni sett. precedente'];
          state.datiModuloSegnalazione.descrizione = state.datiSegnalazione.schedaSegnalazione['Descrizione'];
          state.datiModuloSegnalazione.intervento_urgenza = state.datiSegnalazione.schedaSegnalazione['Intervento di urgenza'];
        }
        else {
          console.log('non ci sono dati');
        }
        state.datiNavigazione.caricamento = false;
      }
    }

    function aggiornaSelezione(nuovaSelezione) {
      // deseleziona(); // QUESTA DA' PROBLEMI MA SERVE RISOLVERE IN QUALCHE MODO
      const imgSelezionate = state.datiGalleria.listaImmagini.filter(img => nuovaSelezione.includes(img.percorso));
      const idImgSelezionate = imgSelezionate.map(img => img.info.id_main10ance);
      state.datiGalleria.idImgSelezionate = idImgSelezionate;
      // PER SICUREZZA, RESET STATE MODULO ANAGRAFICA
      if (anagraficaRef.value) anagraficaRef.value.resetState();
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
      segnalazioneImmagine,
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

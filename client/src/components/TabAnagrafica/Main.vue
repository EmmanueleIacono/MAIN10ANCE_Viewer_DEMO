<template>
  <div>
    <MainPanel>
      <div class="main-card-wrapper">
        <Card>
          <Details summary="ELEMENTI" :open="true">
            <div class="gallery-wrapper loading-wrapper">
              <LoadingScreen :caricamento="state_anagrafica.galleria.caricamento" />
              <div v-if="state_anagrafica.galleria.immagini.length" class="image-grid">
                <div v-for="img in state_anagrafica.galleria.immagini" :key="img.record.uuid || img.record.immagine" class="thumb-wrapper">
                  <img
                    @click="toggleSelezione(img)"
                    :src="img.object"
                    :alt="img.record.id"
                    :class="{ 'bordo-verde': immagineSelezionata?.record.uuid === img.record.uuid }"
                  >
                  <div class="thumb-caption">
                    <b>{{ img.record.id }}</b>
                    <span v-if="img.record.annotazioni"> - {{ img.record.annotazioni }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="empty-gallery"><i>Nessuna immagine presente a questo percorso</i></div>
            </div>
  
            <div v-if="immagineSelezionata" class="selected-preview">
              <img :src="immagineSelezionata.object" :alt="immagineSelezionata.record.id">
              <div class="selected-info">
                <h4>{{ immagineSelezionata.record.id }}</h4>
                <p v-if="immagineSelezionata.record.annotazioni">{{ immagineSelezionata.record.annotazioni }}</p>
                <dl>
                  <template v-if="immagineSelezionata.record.autore">
                    <dt>Autore</dt>
                    <dd>{{ immagineSelezionata.record.autore }}</dd>
                  </template>
                  <template v-if="immagineSelezionata.record.datazione">
                    <dt>Datazione</dt>
                    <dd>{{ immagineSelezionata.record.datazione }}</dd>
                  </template>
                  <template v-if="immagineSelezionata.record.dimensioni">
                    <dt>Dimensioni</dt>
                    <dd>{{ immagineSelezionata.record.dimensioni }}</dd>
                  </template>
                  <dt>Località</dt>
                  <dd>{{ nomeLocalita(immagineSelezionata.record.localita) }}</dd>
                  <dt>Edificio</dt>
                  <dd>{{ nomeEdificio(immagineSelezionata.record.edificio) }}</dd>
                  <dt>Classificazione</dt>
                  <dd>{{ classificazioneElemento(immagineSelezionata.record) }}</dd>
                  <dt>Inserimento</dt>
                  <dd>{{ immagineSelezionata.record.autore_ins || 'N/D' }} - {{ immagineSelezionata.record.data_ins || 'N/D' }}</dd>
                <dt>Ultima modifica</dt>
                <dd>{{ immagineSelezionata.record.autore_ultima_mod || 'N/D' }} - {{ immagineSelezionata.record.data_ultima_mod || 'N/D' }}</dd>
              </dl>
              <div v-if="isDipintoMuraleSelezionato" class="selected-actions">
                <span v-if="caricamentoSchedaDipintiMurali" class="scheda-status">Recupero scheda...</span>
                <span v-else-if="schedaDipintiMurali" class="scheda-status">Scheda compilata disponibile</span>
                <BtnBIM
                  @click="toggleSchedaDipintiMurali"
                  :icona="schedaDipintiMurali ? 'glyphicon-list-alt' : 'glyphicon-plus'"
                  nome="sc-dipinti-murali"
                  :title="schedaDipintiMurali ? 'Consulta scheda anagrafica Dipinti murali' : 'Compila scheda anagrafica Dipinti murali'"
                  colore="verde"
                />
              </div>
            </div>
          </div>

          <SchedaDipintiMurali
            v-if="schedaDipintiMuraliVisibile && immagineSelezionata"
            :elemento="immagineSelezionata"
            :meta="metaSchedaDipintiMurali"
            :scheda="schedaDipintiMurali"
            @chiudi="schedaDipintiMuraliVisibile = false"
            @salvata="ricaricaSchedaDipintiMurali"
          />
        </Details>
      </Card>
      </div>
    </MainPanel>

    <Explorer>
      <Details summary="RICERCA" :open="true">
        <div class="search-fields">
        <label class="nome" for="check-localita">Località</label>
        <select id="check-localita" class="valore" v-model="state_anagrafica.selezione.select_loc">
          <option :value="null"></option>
          <option v-for="loc in state_globale.lista_localita" :key="loc.sigla" :value="loc.sigla">{{ loc.nome }}</option>
        </select>

        <template v-if="state_anagrafica.selezione.select_loc">
          <br>
          <label class="nome" for="check-edif">Edifici</label>
          <select id="check-edif" class="valore" v-model="state_anagrafica.selezione.select_edif">
            <option :value="null"></option>
            <option v-for="ed in state_anagrafica.selezione.lista_edif_filtrata" :key="ed.edificio" :value="ed.edificio">{{ ed.edif_nome_menu }}</option>
          </select>
        </template>

        <br>
        <label class="nome" for="check-liv-1">Classificazione liv. 1</label>
        <select id="check-liv-1" class="valore" v-model="state_anagrafica.selezione.select_def_liv_1">
          <option :value="null"></option>
          <option v-for="def in state_globale.gerarchia_classi_elementi" :key="def.id" :value="def.id">{{ def.nome }}</option>
        </select>

        <template v-if="state_anagrafica.selezione.select_def_liv_1">
          <br>
          <label class="nome" for="check-liv-2">Classificazione liv. 2</label>
          <select id="check-liv-2" class="valore" v-model="state_anagrafica.selezione.select_def_liv_2">
            <option :value="null"></option>
            <option v-for="def in opzioni_livello_2" :key="def.id" :value="def.id">{{ def.nome }}</option>
          </select>
        </template>

        <template v-if="state_anagrafica.selezione.select_def_liv_2">
          <br>
          <label class="nome" for="check-liv-3">Classificazione liv. 3</label>
          <select id="check-liv-3" class="valore" v-model="state_anagrafica.selezione.select_def_liv_3">
            <option :value="null"></option>
            <option v-for="def in opzioni_livello_3" :key="def.id" :value="def.id">{{ def.nome }}</option>
          </select>
        </template>

        <template v-if="state_anagrafica.selezione.select_def_liv_3">
          <br>
          <label class="nome" for="check-liv-4">Classificazione liv. 4</label>
          <select id="check-liv-4" class="valore" v-model="state_anagrafica.selezione.select_def_liv_4">
            <option :value="null"></option>
            <option v-for="def in opzioni_livello_4" :key="def.id" :value="def.id">{{ def.nome }}</option>
          </select>
        </template>
        </div>
      </Details>

      <div class="explorer-body">
        <div class="loading-wrapper">
          <LoadingScreen :caricamento="state_anagrafica.galleria.caricamento" />
          <div class="wrapper-bottoni">
            <div class="input-wrapper">
              <BtnBIM @click="cliccaInput" icona="glyphicon-plus" nome="img-upload" title="Aggiungi elemento" colore="verde" />
              <input @change="mostraAnteprima" ref="inputAnagraficaRef" type="file" accept="image/*" />
            </div>
          </div>
          <UploadImmagine
            @annullaCaricamento="cancellaAnteprima"
            @salvaCaricamento="salvaImmagine"
            v-if="state_anagrafica.caricamento.anteprima_img"
            :source="state_anagrafica.caricamento.anteprima_img"
            :percorso="percorsoCartella"
          />
        </div>
      </div>
    </Explorer>
  </div>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, ref, watch } from "vue";
import { dataCorta, dataInteger, filtraOpzioniLivelli, verificaPercorso } from "../../js/shared";
import { cercaElementiAnagrafica, creaElementoAnagrafica, downloadImmagini, leggiSchedaAnagrafica } from "../../js/richieste";
import MainPanel from '../elementi/MainPanel.vue';
import Explorer from '../elementi/Explorer.vue';
import Details from '../elementi/Details.vue';
import Card from '../elementi/Card.vue';
import LoadingScreen from '../elementi/LoadingScreen.vue';
import BtnBIM from '../elementi/BottoneBIMExplorer.vue';
import UploadImmagine from "./UploadImmagine.vue";
import SchedaDipintiMurali from "./SchedaDipintiMurali.vue";

const store = inject('store');
const store_globale = inject('store_globale');
const store_anagrafica = inject('store_anagrafica');
const state_globale = store_globale.state_globale;
const state_anagrafica = store_anagrafica.state_anagrafica;
const methods_anagrafica = store_anagrafica.methods_anagrafica;

const inputAnagraficaRef = ref(null);
const immagineSelezionata = ref(null);
const schedaDipintiMuraliVisibile = ref(false);
const schedaDipintiMurali = ref(null);
const caricamentoSchedaDipintiMurali = ref(false);
let ricercaCounter = 0;
let schedaCounter = 0;

const opzioni_livello_2 = computed(() => filtraOpzioniLivelli(
  state_globale.gerarchia_classi_elementi,
  siglaLivelloSelezionato(state_globale.gerarchia_classi_elementi, state_anagrafica.selezione.select_def_liv_1),
  "livello_2"
));

const opzioni_livello_3 = computed(() => filtraOpzioniLivelli(
  opzioni_livello_2.value,
  siglaLivelloSelezionato(opzioni_livello_2.value, state_anagrafica.selezione.select_def_liv_2),
  "livello_3"
));

const opzioni_livello_4 = computed(() => filtraOpzioniLivelli(
  opzioni_livello_3.value,
  siglaLivelloSelezionato(opzioni_livello_3.value, state_anagrafica.selezione.select_def_liv_3),
  "livello_4"
));

const filtriRicerca = computed(() => ({
  localita: state_anagrafica.selezione.select_loc,
  edificio: state_anagrafica.selezione.select_edif,
  livello_1: state_anagrafica.selezione.select_def_liv_1,
  livello_2: state_anagrafica.selezione.select_def_liv_2,
  livello_3: state_anagrafica.selezione.select_def_liv_3,
  livello_4: state_anagrafica.selezione.select_def_liv_4,
}));

const ricercaPronta = computed(() => !!(
  filtriRicerca.value.localita
  && filtriRicerca.value.edificio
  && filtriRicerca.value.livello_1
));

const percorsoCartella = computed(() => {
  const parti = [
    state_anagrafica.selezione.select_loc,
    state_anagrafica.selezione.select_edif,
    'elementi',
  ];
  return parti.filter(Boolean).join('/');
});

const isDipintoMuraleSelezionato = computed(() => isDipintoMurale(immagineSelezionata.value?.record));

const metaSchedaDipintiMurali = computed(() => ({
  localita: immagineSelezionata.value ? nomeLocalita(immagineSelezionata.value.record.localita) : 'N/D',
  edificio: immagineSelezionata.value ? nomeEdificio(immagineSelezionata.value.record.edificio) : 'N/D',
}));

const tabellaSchedaAnagraficaSelezionata = computed(() => {
  if (isDipintoMuraleSelezionato.value) return 'scheda_anagrafica_dipinti_murali';
  return null;
});

watch(() => state_anagrafica.selezione.select_loc, () => {
  filtraListaEdif();
  state_anagrafica.selezione.select_edif = null;
  aggiornaGalleria();
});

watch(() => state_anagrafica.selezione.select_def_liv_1, () => {
  state_anagrafica.selezione.select_def_liv_2 = null;
  state_anagrafica.selezione.select_def_liv_3 = null;
  state_anagrafica.selezione.select_def_liv_4 = null;
  aggiornaGalleria();
});

watch(() => state_anagrafica.selezione.select_def_liv_2, () => {
  state_anagrafica.selezione.select_def_liv_3 = null;
  state_anagrafica.selezione.select_def_liv_4 = null;
  aggiornaGalleria();
});

watch(() => state_anagrafica.selezione.select_def_liv_3, () => {
  state_anagrafica.selezione.select_def_liv_4 = null;
  aggiornaGalleria();
});

watch(() => [
  state_anagrafica.selezione.select_edif,
  state_anagrafica.selezione.select_def_liv_4,
], aggiornaGalleria);

onBeforeUnmount(() => {
  methods_anagrafica.reset_state_galleria();
});

function siglaLivelloSelezionato(lista, id) {
  return lista.find(def => def.id === id)?.sigla || null;
}

function cliccaInput() {
  if (!ricercaPronta.value || !verificaPercorso(percorsoCartella.value)) {
    store.methods.setAlert('Selezionare localita, edificio e classificazione liv. 1 prima di caricare un elemento.');
    return;
  }
  inputAnagraficaRef.value.click();
}

function toggleSelezione(img) {
  if (immagineSelezionata.value?.record.uuid === img.record.uuid) {
    immagineSelezionata.value = null;
    schedaDipintiMuraliVisibile.value = false;
    schedaDipintiMurali.value = null;
    return;
  }
  immagineSelezionata.value = img;
  schedaDipintiMuraliVisibile.value = false;
  schedaDipintiMurali.value = null;
  if (isDipintoMurale(img.record)) {
    ricaricaSchedaDipintiMurali();
  }
}

function isDipintoMurale(record) {
  if (!record) return false;
  const codiciDipintiMurali = ['700.000.000.000', '600.200.100.000'];
  return [
    record.livello_1,
    record.livello_2,
    record.livello_3,
    record.livello_4,
  ].some(livello => codiciDipintiMurali.includes(livello));
}

function toggleSchedaDipintiMurali() {
  schedaDipintiMuraliVisibile.value = !schedaDipintiMuraliVisibile.value;
  if (schedaDipintiMuraliVisibile.value && !schedaDipintiMurali.value) {
    ricaricaSchedaDipintiMurali();
  }
}

async function ricaricaSchedaDipintiMurali() {
  const record = immagineSelezionata.value?.record;
  const tabella = tabellaSchedaAnagraficaSelezionata.value;
  if (!record?.id_main10ance || !tabella) return;

  const richiestaId = ++schedaCounter;
  caricamentoSchedaDipintiMurali.value = true;
  try {
    const scheda = await leggiSchedaAnagrafica(tabella, record.id_main10ance, record.uuid);
    if (richiestaId !== schedaCounter) return;
    schedaDipintiMurali.value = scheda;
  }
  catch(e) {
    if (richiestaId === schedaCounter) schedaDipintiMurali.value = null;
  }
  finally {
    if (richiestaId === schedaCounter) caricamentoSchedaDipintiMurali.value = false;
  }
}

function nomeLocalita(sigla) {
  return state_globale.lista_localita.find(loc => loc.sigla === sigla)?.nome || sigla || 'N/D';
}

function nomeEdificio(edificio) {
  return state_anagrafica.selezione.lista_edif_filtrata.find(ed => ed.edificio === edificio)?.edif_nome_menu || edificio || 'N/D';
}

function classificazioneElemento(record) {
  return [
    nomeLivello(state_globale.gerarchia_classi_elementi, record.livello_1),
    nomeLivello(opzioni_livello_2.value, record.livello_2),
    nomeLivello(opzioni_livello_3.value, record.livello_3),
    nomeLivello(opzioni_livello_4.value, record.livello_4),
  ].filter(Boolean).join(' / ') || 'N/D';
}

function nomeLivello(lista, id) {
  return lista.find(def => def.id === id)?.nome || id || null;
}

function mostraAnteprima(event) {
  const file = event.target.files[0];
  if (file) {
    const id_img = dataInteger();
    state_anagrafica.caricamento.id_img = id_img;
    state_anagrafica.caricamento.anteprima_img = URL.createObjectURL(file);
    const nuovoNomeImmagine = `${id_img}__${file.name}`;
    state_anagrafica.caricamento.file = new File([file], nuovoNomeImmagine, {type: file.type});
  }
  else {
    cancellaAnteprima();
  }
}

function cancellaAnteprima() {
  if (state_anagrafica.caricamento.anteprima_img) {
    URL.revokeObjectURL(state_anagrafica.caricamento.anteprima_img);
  }
  const dt = new DataTransfer();
  inputAnagraficaRef.value.files = dt.files;
  methods_anagrafica.reset_state_anagrafica();
}

async function salvaImmagine(dati) {
  if (!dati.id) {
    store.methods.setAlert('Compilare il campo ID prima di salvare.');
    return;
  }

  const fd = new FormData();
  fd.append('file', state_anagrafica.caricamento.file);
  fd.append('dati', JSON.stringify({
    ...dati,
    ...filtriRicerca.value,
    data: dataCorta(),
  }));

  store.methods.toggleLoaderGlobale();
  const risultato = await creaElementoAnagrafica(fd);
  store.methods.toggleLoaderGlobale();

  if (risultato.success) {
    store.methods.setAlert('Operazione andata a buon fine');
    cancellaAnteprima();
    await aggiornaGalleria();
  }
  else {
    store.methods.setAlert('Operazione fallita, riprovare');
  }
}

function filtraListaEdif() {
  const lista_edif = state_globale.lista_edifici;
  state_anagrafica.selezione.lista_edif_filtrata = lista_edif
    .filter(edif => edif.localita === state_anagrafica.selezione.select_loc);
}

async function aggiornaGalleria() {
  const ricercaId = ++ricercaCounter;
  immagineSelezionata.value = null;
  schedaDipintiMuraliVisibile.value = false;
  schedaDipintiMurali.value = null;
  methods_anagrafica.reset_state_galleria();
  if (!ricercaPronta.value) return;

  state_anagrafica.galleria.caricamento = true;
  const elementi = await cercaElementiAnagrafica(filtriRicerca.value);
  if (ricercaId !== ricercaCounter) return;
  state_anagrafica.galleria.elementi = elementi;

  await Promise.all(elementi.map(async elemento => {
    if (!elemento.immagine) return;
    const fileImmagine = await downloadImmagini(elemento.immagine);
    if (ricercaId !== ricercaCounter) return;
    if (fileImmagine?.errMsg) return;
    state_anagrafica.galleria.immagini.push({
      object: URL.createObjectURL(fileImmagine),
      record: elemento,
    });
  }));

  if (ricercaId !== ricercaCounter) return;
  state_anagrafica.galleria.caricamento = false;
}
</script>

<style scoped>
.gallery-wrapper {
  min-height: 20rem;
  padding: 1.5rem;
}

.main-card-wrapper {
  padding-top: 2rem;
}

.search-fields {
  padding-top: 1.6rem;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: 1.5rem;
}

.thumb-wrapper {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.thumb-wrapper img {
  width: 100%;
  height: 18rem;
  object-fit: cover;
  border-radius: .6rem;
  cursor: pointer;
  border: 1rem solid transparent;
}

.thumb-wrapper img:hover {
  opacity: .7;
}

.bordo-verde {
  border-color: var(--verdeMain10ance) !important;
}

.thumb-caption {
  margin-top: .6rem;
  text-align: center;
  font-weight: 600;
}

.empty-gallery {
  padding: 2rem 0;
}

.selected-preview {
  display: grid;
  grid-template-columns: minmax(18rem, 32rem) 1fr;
  gap: 2rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(0, 0, 0, .1);
}

.selected-preview img {
  width: 100%;
  max-height: 34rem;
  object-fit: cover;
  border-radius: .6rem;
}

.selected-info h4 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.selected-info dl {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: .6rem 1.2rem;
  margin: 1.2rem 0 0;
}

.selected-info dt {
  font-weight: 700;
}

.selected-info dd {
  margin: 0;
}

.selected-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-top: 1.2rem;
}

.scheda-status {
  font-size: 12px;
  font-weight: 700;
}

.wrapper-bottoni {
  display: inline-flex;
}

.explorer-body {
  padding: 10px;
  overflow: auto;
}

.nome {
  padding-left: 15px;
}

.valore {
  float: right;
}

.input-wrapper input {
  display: none;
}
</style>

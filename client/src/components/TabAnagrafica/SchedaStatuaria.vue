<template>
  <div
    ref="schedaRef"
    class="scheda-anagrafica statuaria-form loading-wrapper"
    :class="{'readonly-mode': solaLettura}"
    @keydown.capture="bloccaModificaSolaLettura"
    @beforeinput.capture="bloccaModificaSolaLettura"
  >
    <LoadingScreen :caricamento="caricamentoOpzioni" />

    <div class="div-titolo-bottoni">
      <div class="float-dx div-bottoni">
        <BtnBIM v-if="solaLettura" @click="entraModalitaModifica" icona="glyphicon-pencil" nome="modificaScStat" title="Modifica scheda" colore="blu" />
        <BtnBIM v-if="modalitaModifica" @click="salvaScheda" icona="glyphicon-floppy-disk" nome="salvaScStat" title="Salva" colore="blu" />
        <BtnBIM v-if="modalitaModifica" @click="resetForm" icona="glyphicon-erase" nome="resetScStat" title="Cancella tutti i campi" colore="blu" />
        <BtnBIM @click="$emit('chiudi')" icona="glyphicon-remove" nome="chiudiScStat" title="Chiudi" colore="blu" />
      </div>
      <h4><b>SCHEDA ANAGRAFICA STATUARIA</b></h4>
      <p v-if="scheda" class="scheda-status">
        Ultima scheda salvata: {{ formattaDataScheda(scheda.data_ultima_mod || scheda.data_registrazione) }} -
        {{ scheda.autore_ultima_mod || scheda.autore_scheda || 'N/D' }}
      </p>
    </div>

    <SchedaAnagraficaSezione titolo="OGGETTO" :modalita-modifica="modalitaModifica" prima>
      <tr><th>Soggetto</th><td><input v-model="form.nome_statua"></td></tr>
      <tr><th>Codice</th><td><input v-model="form.codice_statua"></td></tr>
      <tr>
        <th>
          Altri codici
          <p class="nota-compilazione">Indicare eventuali codici non univoci presenti nell'archivio storico o cartaceo, con riferimento al documento e alla data.</p>
        </th>
        <td><textarea v-model="form.codici_altro"></textarea></td>
      </tr>
      <tr><th>Dimensioni</th><td><input v-model="form.dimensioni"></td></tr>
      <tr><th>Descrizione statua</th><td><textarea v-model="form.descrizione_statua"></textarea></td></tr>
    </SchedaAnagraficaSezione>

    <SchedaAnagraficaSezione titolo="ANCORAGGI" :modalita-modifica="modalitaModifica">
      <tr><th>A parete</th><td><input type="checkbox" v-model="form.elementi_di_ancoraggio_a_parete"></td></tr>
      <tr v-if="form.elementi_di_ancoraggio_a_parete"><th>Materiale</th><td><select v-model="form.materiale_ancoraggio_parete"><option value=""></option><option v-for="v in opzioni.materiale_ancoraggio_parete" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr v-if="form.elementi_di_ancoraggio_a_parete"><th>Annotazioni</th><td><textarea v-model="form.ancoraggio_parete_annotazioni"></textarea></td></tr>

      <tr><th>A pavimento</th><td><input type="checkbox" v-model="form.elementi_di_ancoraggio_a_pavimento"></td></tr>
      <tr v-if="form.elementi_di_ancoraggio_a_pavimento"><th>Materiale</th><td><select v-model="form.materiale_ancoraggio_pavimento"><option value=""></option><option v-for="v in opzioni.materiale_ancoraggio_pavimento" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr v-if="form.elementi_di_ancoraggio_a_pavimento"><th>Annotazioni</th><td><textarea v-model="form.ancoraggio_pavimento_annotazioni"></textarea></td></tr>

      <tr><th>A soffitto</th><td><input type="checkbox" v-model="form.elementi_di_ancoraggio_a_soffitto"></td></tr>
      <tr v-if="form.elementi_di_ancoraggio_a_soffitto"><th>Materiale</th><td><select v-model="form.materiale_ancoraggio_soffitto"><option value=""></option><option v-for="v in opzioni.materiale_ancoraggio_soffitto" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr v-if="form.elementi_di_ancoraggio_a_soffitto"><th>Annotazioni</th><td><textarea v-model="form.ancoraggio_soffitto_annotazioni"></textarea></td></tr>
    </SchedaAnagraficaSezione>

    <SchedaAnagraficaSezione titolo="TECNICA DI ESECUZIONE" :modalita-modifica="modalitaModifica">
      <tr><th>Tecnica di esecuzione</th><td><input v-model="form.tecnica_esecuzione"></td></tr>
    </SchedaAnagraficaSezione>

    <SchedaAnagraficaSezione titolo="MATERIALI" :modalita-modifica="modalitaModifica">
      <tr><th>Statua</th><td><select v-model="form.materiale_statua"><option value=""></option><option v-for="v in opzioni.materiale_statua" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr><th>Annotazioni</th><td><textarea v-model="form.materiale_annotazioni"></textarea></td></tr>
      <tr>
        <th>Armatura</th>
        <td>
          <div v-for="v in opzioni.materiali_armatura" :key="v" class="checkbox-option">
            <input :id="`stat-arm-${idCampo(v)}`" type="checkbox" :value="v" v-model="form.materiali_armatura">
            <label :for="`stat-arm-${idCampo(v)}`">{{ v }}</label>
          </div>
        </td>
      </tr>
      <tr><th>Supporto</th><td><select v-model="form.materiale_supporto" @change="resetPellicola"><option value=""></option><option v-for="v in opzioni.materiale_supporto" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr><th>Strato di preparazione</th><td><input v-model="form.strato_di_preparazione"></td></tr>
      <tr>
        <th>Pellicola pittorica</th>
        <td>
          <select v-if="opzioniPellicola.length" v-model="valorePellicolaCorrente">
            <option value=""></option>
            <option v-for="v in opzioniPellicola" :key="v" :value="v">{{ v }}</option>
          </select>
          <textarea v-else v-model="form.pellicola_pittorica_tecnica_e_mat.altro"></textarea>
        </td>
      </tr>
      <tr><th>Lamina metallica</th><td><input type="checkbox" v-model="form.lamina_metallica"></td></tr>
    </SchedaAnagraficaSezione>

    <SchedaAnagraficaSezione titolo="ELEMENTI ACCESSORI / MONILI" :modalita-modifica="modalitaModifica">
      <tr>
        <th>
          Elementi accessori / monili
          <p class="nota-compilazione">Selezionare tutti gli elementi presenti; per ciascuno e possibile specificare il materiale.</p>
        </th>
        <td>
          <div v-for="v in opzioni.elementi_accessori_monili" :key="v" class="checkbox-option">
            <input :id="`stat-acc-${idCampo(v)}`" type="checkbox" :value="v" v-model="form.elementi_accessori_monili">
            <label :for="`stat-acc-${idCampo(v)}`">{{ v }}</label>
          </div>
        </td>
      </tr>
      <tr v-for="(elementoAccessorio, index) in form.elementi_accessori_monili" :key="elementoAccessorio">
        <th>{{ elementoAccessorio }} - materiale</th>
        <td><select v-model="form.materiale_elementi_accessori_monili[index]"><option value=""></option><option v-for="v in opzioni.materiale_elementi_accessori_monili" :key="v" :value="v">{{ v }}</option></select></td>
      </tr>
      <tr><th>Annotazioni</th><td><textarea v-model="form.elementi_accessori_monili_annotazioni"></textarea></td></tr>
    </SchedaAnagraficaSezione>

    <SchedaAnagraficaSezione titolo="DOCUMENTAZIONE GENERALE" :modalita-modifica="modalitaModifica">
      <tr><th>Epoca</th><td><input v-model="form.epoca"></td></tr>
      <tr><th>Fonti</th><td><textarea v-model="form.fonti"></textarea></td></tr>
      <tr><th>Autore</th><td><input v-model="form.autore"></td></tr>
      <tr>
        <th>
          Accessibilita
          <p class="nota-compilazione">Il bene si considera accessibile se ad altezza uomo o raggiungibile con piccoli trabattelli o scale.</p>
        </th>
        <td><input type="checkbox" v-model="form.accessibilita"></td>
      </tr>
      <tr><th>Note</th><td><textarea v-model="form.note"></textarea></td></tr>
      <tr>
        <th>Documenti associati</th>
        <td>
          <DocumentiSchedaAnagrafica
            :documenti-salvati="documentiSalvati"
            :files="form.documenti"
            :sola-lettura="solaLettura"
            @update:files="form.documenti = $event"
          />
        </td>
      </tr>
    </SchedaAnagraficaSezione>
  </div>
</template>

<script setup>
import {computed, inject, nextTick, onMounted, reactive, ref, watch} from 'vue';
import {dataCorta, dataInteger, trattaStringArray} from '../../js/shared';
import {compilaScheda, leggiEnumServizio, leggiVistaDB} from '../../js/richieste';
import BtnBIM from '../elementi/BottoneBIMExplorer.vue';
import LoadingScreen from '../elementi/LoadingScreen.vue';
import DocumentiSchedaAnagrafica from './DocumentiSchedaAnagrafica.vue';
import SchedaAnagraficaSezione from './SchedaAnagraficaSezione.vue';

const props = defineProps({
  elemento: {
    type: Object,
    required: true,
  },
  scheda: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['chiudi', 'salvata']);
const store = inject('store');
const oggi = dataCorta();
const schedaRef = ref(null);
const modalitaModifica = ref(!props.scheda);
const caricamentoOpzioni = ref(false);

const opzioni = reactive({
  materiale_statua: [],
  materiali_armatura: [],
  materiale_supporto: [],
  elementi_accessori_monili: [],
  materiale_elementi_accessori_monili: [],
  materiale_ancoraggio_parete: [],
  materiale_ancoraggio_pavimento: [],
  materiale_ancoraggio_soffitto: [],
  pellicola: {},
});

const form = reactive(creaFormBase());
const scheda = computed(() => props.scheda);
const solaLettura = computed(() => !!props.scheda && !modalitaModifica.value);
const documentiSalvati = computed(() => Array.isArray(props.scheda?.docs) ? props.scheda.docs : []);
const chiaveSupportoPellicola = computed(() => ({
  legno: 'su_legno',
  gesso: 'su_gesso',
  terracotta: 'su_terracotta',
}[form.materiale_supporto] || 'altro'));
const opzioniPellicola = computed(() => opzioni.pellicola[chiaveSupportoPellicola.value] || []);
const valorePellicolaCorrente = computed({
  get: () => form.pellicola_pittorica_tecnica_e_mat[chiaveSupportoPellicola.value] || '',
  set: value => {
    form.pellicola_pittorica_tecnica_e_mat[chiaveSupportoPellicola.value] = value;
  },
});

watch(() => [props.elemento.record.uuid, props.scheda?.id_anagr], async () => {
  resetForm();
  modalitaModifica.value = !props.scheda;
  await nextTick();
  aggiornaCampiVuotiSolaLettura();
});

watch(solaLettura, async () => {
  await nextTick();
  aggiornaCampiVuotiSolaLettura();
});

watch(() => [...form.elementi_accessori_monili], (nuovi, precedenti = []) => {
  if (nuovi.length === form.materiale_elementi_accessori_monili.length) return;
  const materialiPrecedenti = new Map(
    precedenti.map((elemento, index) => [elemento, form.materiale_elementi_accessori_monili[index]])
  );
  form.materiale_elementi_accessori_monili = nuovi.map(elemento => materialiPrecedenti.get(elemento) || '');
});

onMounted(async () => {
  await caricaOpzioni();
  await nextTick();
  aggiornaCampiVuotiSolaLettura();
});

function creaFormBase() {
  const record = props.elemento.record;
  return {
    nome_statua: valoreScheda('nome_statua', record.nome || record.id || ''),
    codice_statua: valoreScheda('codice_statua', record.codice || record.id || ''),
    codici_altro: valoreScheda('codici_altro'),
    dimensioni: valoreScheda('dimensioni', record.dimensioni || ''),
    descrizione_statua: valoreScheda('descrizione_statua', record.annotazioni || ''),
    tecnica_esecuzione: valoreScheda('tecnica_esecuzione'),
    materiale_statua: valoreScheda('materiale_statua'),
    materiale_annotazioni: valoreScheda('materiale_annotazioni'),
    materiali_armatura: valoreArrayScheda('materiali_armatura'),
    materiale_supporto: valoreScheda('materiale_supporto'),
    strato_di_preparazione: valoreScheda('strato_di_preparazione'),
    pellicola_pittorica_tecnica_e_mat: valorePellicolaScheda(),
    lamina_metallica: valoreScheda('lamina_metallica', false),
    elementi_accessori_monili: valoreArrayScheda('elementi_accessori_monili'),
    materiale_elementi_accessori_monili: valoreArrayScheda('materiale_elementi_accessori_monili'),
    elementi_accessori_monili_annotazioni: valoreScheda('elementi_accessori_monili_annotazioni'),
    elementi_di_ancoraggio_a_parete: valoreScheda('elementi_di_ancoraggio_a_parete', false),
    materiale_ancoraggio_parete: valoreScheda('materiale_ancoraggio_parete'),
    ancoraggio_parete_annotazioni: valoreScheda('ancoraggio_parete_annotazioni'),
    elementi_di_ancoraggio_a_pavimento: valoreScheda('elementi_di_ancoraggio_a_pavimento', false),
    materiale_ancoraggio_pavimento: valoreScheda('materiale_ancoraggio_pavimento'),
    ancoraggio_pavimento_annotazioni: valoreScheda('ancoraggio_pavimento_annotazioni'),
    elementi_di_ancoraggio_a_soffitto: valoreScheda('elementi_di_ancoraggio_a_soffitto', false),
    materiale_ancoraggio_soffitto: valoreScheda('materiale_ancoraggio_soffitto'),
    ancoraggio_soffitto_annotazioni: valoreScheda('ancoraggio_soffitto_annotazioni'),
    epoca: valoreScheda('epoca', record.datazione || ''),
    fonti: valoreScheda('fonti'),
    autore: valoreScheda('autore', record.autore || ''),
    accessibilita: valoreSchedaAccessibilita(),
    note: valoreScheda('note', record.commenti || ''),
    documenti: [],
  };
}

function resetForm() {
  Object.assign(form, creaFormBase());
}

function resetPellicola() {
  form.pellicola_pittorica_tecnica_e_mat = creaPellicolaVuota();
}

function entraModalitaModifica() {
  modalitaModifica.value = true;
}

function bloccaModificaSolaLettura(event) {
  if (!solaLettura.value) return;
  if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target?.tagName)) return;
  event.preventDefault();
}

function aggiornaCampiVuotiSolaLettura() {
  if (!schedaRef.value) return;
  schedaRef.value.querySelectorAll('.form-table td').forEach(cella => {
    delete cella.dataset.emptyField;
    if (!solaLettura.value) return;
    const controllo = cella.querySelector('input:not([type=checkbox]):not([type=file]), textarea, select');
    if (controllo && String(controllo.value ?? '').trim() === '') cella.dataset.emptyField = 'true';
  });
}

async function caricaOpzioni() {
  caricamentoOpzioni.value = true;
  try {
    const [
      materialeStatua,
      materialiArmatura,
      materialeSupporto,
      elementiAccessori,
      materialiAccessori,
      ancoraggioParete,
      ancoraggioPavimento,
      ancoraggioSoffitto,
      pellicola,
    ] = await Promise.all([
      leggiEnumServizio('stat_mat'),
      leggiEnumServizio('stat_arm_mat'),
      leggiEnumServizio('stat_supp_mat'),
      leggiEnumServizio('stat_el_acc_monil'),
      leggiEnumServizio('stat_el_acc_monil_mat'),
      leggiEnumServizio('stat_anc_par_mat'),
      leggiEnumServizio('stat_anc_pav_mat'),
      leggiEnumServizio('stat_anc_sof_mat'),
      leggiVistaDB('vw_stat_pell_pitt_valori', true),
    ]);

    opzioni.materiale_statua = valoriEnum(materialeStatua);
    opzioni.materiali_armatura = valoriEnum(materialiArmatura);
    opzioni.materiale_supporto = valoriEnum(materialeSupporto);
    opzioni.elementi_accessori_monili = valoriEnum(elementiAccessori);
    opzioni.materiale_elementi_accessori_monili = valoriEnum(materialiAccessori);
    opzioni.materiale_ancoraggio_parete = valoriEnum(ancoraggioParete);
    opzioni.materiale_ancoraggio_pavimento = valoriEnum(ancoraggioPavimento);
    opzioni.materiale_ancoraggio_soffitto = valoriEnum(ancoraggioSoffitto);
    (pellicola || []).forEach(tipo => {
      opzioni.pellicola[tipo.tecnica] = normalizzaArray(tipo.valori);
    });
  }
  catch {
    store.methods.setAlert('Impossibile recuperare alcune opzioni della scheda statuaria.');
  }
  finally {
    caricamentoOpzioni.value = false;
  }
}

async function salvaScheda() {
  const record = props.elemento.record;
  if (!record.id_main10ance || !form.nome_statua || !form.codice_statua) {
    store.methods.setAlert('Elemento selezionato incompleto: soggetto e codice sono obbligatori.');
    return;
  }

  const identificativoCartella = record.uuid || normalizzaNomeFile(record.id_main10ance);
  const cartellaDocumenti = `${identificativoCartella}/${Date.now()}`;
  const nuoviDocs = form.documenti.map(file => `${cartellaDocumenti}/${normalizzaNomeFile(file.name)}`);
  const docs = [...documentiSalvati.value, ...nuoviDocs];
  const fd = new FormData();
  form.documenti.forEach((file, index) => {
    fd.append(`file_${documentiSalvati.value.length + index}`, file, normalizzaNomeFile(file.name));
  });
  fd.append('dati', JSON.stringify([creaOggettoScheda(docs)]));

  let risposta;
  store.methods.toggleLoaderGlobale();
  try {
    risposta = await compilaScheda(fd);
  }
  finally {
    store.methods.toggleLoaderGlobale();
  }

  if (risposta?.success) {
    store.methods.setAlert('Scheda anagrafica Statuaria salvata correttamente.');
    emit('salvata');
    emit('chiudi');
  }
  else {
    store.methods.setAlert('Operazione non riuscita.');
  }
}

function creaOggettoScheda(docs) {
  const record = props.elemento.record;
  const campi = {
    id_anagr: dataInteger(),
    id_main10ance: record.id_main10ance,
    data_registrazione: oggi,
    autore_scheda: store.state.userSettings.user_id,
    data_ultima_mod: oggi,
    autore_ultima_mod: store.state.userSettings.user_id,
    validata: false,
    nome_statua: form.nome_statua,
    codice_statua: form.codice_statua,
    codici_altro: form.codici_altro,
    dimensioni: form.dimensioni,
    descrizione_statua: form.descrizione_statua,
    tecnica_esecuzione: form.tecnica_esecuzione,
    materiale_statua: form.materiale_statua,
    materiale_annotazioni: form.materiale_annotazioni,
    materiali_armatura: form.materiali_armatura,
    materiale_supporto: form.materiale_supporto,
    strato_di_preparazione: form.strato_di_preparazione,
    pellicola_pittorica_tecnica_e_mat: form.pellicola_pittorica_tecnica_e_mat,
    lamina_metallica: form.lamina_metallica,
    elementi_accessori_monili: form.elementi_accessori_monili,
    materiale_elementi_accessori_monili: form.materiale_elementi_accessori_monili,
    elementi_accessori_monili_annotazioni: form.elementi_accessori_monili_annotazioni,
    elementi_di_ancoraggio_a_parete: form.elementi_di_ancoraggio_a_parete,
    materiale_ancoraggio_parete: form.materiale_ancoraggio_parete,
    ancoraggio_parete_annotazioni: form.ancoraggio_parete_annotazioni,
    elementi_di_ancoraggio_a_pavimento: form.elementi_di_ancoraggio_a_pavimento,
    materiale_ancoraggio_pavimento: form.materiale_ancoraggio_pavimento,
    ancoraggio_pavimento_annotazioni: form.ancoraggio_pavimento_annotazioni,
    elementi_di_ancoraggio_a_soffitto: form.elementi_di_ancoraggio_a_soffitto,
    materiale_ancoraggio_soffitto: form.materiale_ancoraggio_soffitto,
    ancoraggio_soffitto_annotazioni: form.ancoraggio_soffitto_annotazioni,
    epoca: form.epoca,
    fonti: form.fonti,
    autore: form.autore,
    'accessibilità': form.accessibilita,
    note: form.note,
    docs,
  };

  const entries = Object.entries(campi).filter(([, value]) => valoreDaSalvare(value));
  return {
    tabella: 'scheda_anagrafica_statua',
    colonne: entries.map(([key]) => key),
    valori: entries.map(([, value]) => value),
  };
}

function valoreScheda(chiave, fallback = '') {
  const value = props.scheda?.[chiave];
  return value === null || value === undefined ? fallback : value;
}

function valoreArrayScheda(chiave) {
  return normalizzaArray(props.scheda?.[chiave]);
}

function valoreSchedaAccessibilita() {
  return valoreScheda('accessibilità', valoreScheda('accessibilita', false));
}

function valorePellicolaScheda() {
  const value = props.scheda?.pellicola_pittorica_tecnica_e_mat;
  if (value && typeof value === 'object') return {...creaPellicolaVuota(), ...value};
  if (typeof value === 'string') {
    const valori = parseCompositePostgres(value);
    return {
      su_legno: valori[0] || '',
      su_gesso: valori[1] || '',
      su_terracotta: valori[2] || '',
      altro: valori[3] || '',
    };
  }
  return creaPellicolaVuota();
}

function creaPellicolaVuota() {
  return {su_legno: '', su_gesso: '', su_terracotta: '', altro: ''};
}

function parseCompositePostgres(value) {
  const contenuto = value.trim().replace(/^\(|\)$/g, '');
  const valori = [];
  let corrente = '';
  let traVirgolette = false;

  for (let i = 0; i < contenuto.length; i++) {
    const carattere = contenuto[i];
    if (carattere === '"' && contenuto[i + 1] === '"' && traVirgolette) {
      corrente += '"';
      i++;
    }
    else if (carattere === '"') {
      traVirgolette = !traVirgolette;
    }
    else if (carattere === ',' && !traVirgolette) {
      valori.push(corrente);
      corrente = '';
    }
    else {
      corrente += carattere;
    }
  }
  valori.push(corrente);
  return valori;
}

function valoriEnum(lista) {
  return (lista || []).map(item => item.unnest).filter(Boolean);
}

function normalizzaArray(value) {
  if (Array.isArray(value)) return [...value];
  if (typeof value === 'string') {
    const parsed = trattaStringArray(value);
    return Array.isArray(parsed) ? parsed : [];
  }
  return [];
}

function valoreDaSalvare(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim() !== '';
  return true;
}

function normalizzaNomeFile(nomeFile) {
  return String(nomeFile || '').trim().replaceAll(/\s/g, '_').replaceAll(/(\/|\\)/g, '-').replaceAll(/(\?|!)/g, '');
}

function formattaDataScheda(data) {
  if (!data) return 'N/D';
  return String(data).split('T')[0];
}

function idCampo(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
</script>

<style scoped>
.scheda-anagrafica {
  position: relative;
  padding: 30px 14px;
  margin-top: 2rem;
  background-color: var(--bluInterregTrasparenza);
  font-size: 13px;
}

.float-dx {
  float: right;
}

.div-titolo-bottoni {
  margin-bottom: 1.5rem;
}

.div-bottoni {
  display: inline-flex;
  gap: .6rem;
}

.scheda-status {
  margin: .4rem 0 0;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}

.nota-compilazione {
  margin: .4rem 0 0;
  font-size: 11px;
  font-style: italic;
  font-weight: 400;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: .6rem;
  margin-bottom: .35rem;
}

.checkbox-option label {
  margin: 0;
  font-weight: 400;
}

textarea {
  min-height: 3.2rem;
  resize: vertical;
}

input, textarea {
  float: right;
  padding: 1px;
  border: 0;
  line-height: 100%;
}

select, textarea, input:not([type=checkbox]):not([type=file]) {
  width: 100%;
}

.readonly-mode input:not([type=checkbox]):not([type=file]),
.readonly-mode textarea,
.readonly-mode select {
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  box-shadow: none;
  color: inherit;
  resize: none;
  appearance: none;
  pointer-events: none;
}

.readonly-mode input[type=checkbox] {
  pointer-events: none;
  accent-color: var(--bluMain10ance);
}

.readonly-mode input,
.readonly-mode textarea,
.readonly-mode select {
  opacity: 1;
}

.readonly-mode textarea {
  min-height: 1.4rem;
}

.readonly-mode :deep(td[data-empty-field="true"]) input:not([type=checkbox]):not([type=file]),
.readonly-mode :deep(td[data-empty-field="true"]) textarea,
.readonly-mode :deep(td[data-empty-field="true"]) select {
  display: none;
}

.readonly-mode :deep(td[data-empty-field="true"])::after {
  content: "Nessun valore";
  display: block;
  font-style: italic;
  text-align: right;
  opacity: .7;
}
</style>

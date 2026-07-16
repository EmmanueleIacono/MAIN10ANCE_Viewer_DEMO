<template>
  <div class="scheda-anagrafica dipinti-murali-form">
    <div class="div-titolo-bottoni">
      <div class="float-dx div-bottoni">
        <BtnBIM @click="salvaScheda" icona="glyphicon-floppy-disk" nome="salvaScDipMur" title="Salva" colore="blu" />
        <BtnBIM @click="resetForm" icona="glyphicon-erase" nome="resetScDipMur" title="Cancella tutti i campi" colore="blu" />
        <BtnBIM @click="$emit('chiudi')" icona="glyphicon-remove" nome="chiudiScDipMur" title="Annulla" colore="blu" />
      </div>
      <h4><b>SCHEDA ANAGRAFICA DIPINTI MURALI</b></h4>
    </div>

    <table v-if="false" class="form-table">
      <tbody>
      <tr class="section-title-row"><td colspan="2"><b>METADATI</b></td></tr>
      <tr><th>Compilatore</th><td><p class="user-field">{{ store.state.userSettings.user_id || 'N/D' }}</p></td></tr>
      <tr><th>Data compilazione / aggiornamento</th><td><p class="user-field">{{ oggi }}</p></td></tr>
      <tr><th>Località</th><td><p class="user-field">{{ meta.localita }}</p></td></tr>
      <tr><th>Edificio</th><td><p class="user-field">{{ meta.edificio }}</p></td></tr>
      <tr><th>Unita</th><td><p class="user-field">{{ form.unita || 'N/D' }}</p></td></tr>
      <tr><th>Ref. sistema composto</th><td><input v-model="form.sist_composto"></td></tr>
      <tr><th>Codice</th><td><p class="user-field">{{ elemento.record.id }}</p></td></tr>
      </tbody>
    </table>

    <table class="form-table first-section">
      <tbody>
      <tr class="section-title-row"><td colspan="2"><b>OGGETTO</b></td></tr>
      <tr><th>Soggetto</th><td><input v-model="form.descrizione_dipinto"></td></tr>
      <tr><th>Autore</th><td><input v-model="form.autore"></td></tr>
      <tr><th>Datazione</th><td><input v-model="form.datazione"></td></tr>
      <tr><th>Dimensioni</th><td><input v-model="form.dimensioni"></td></tr>
      <tr><th>Note</th><td><textarea v-model="form.note"></textarea></td></tr>
      </tbody>
    </table>

    <table class="form-table">
      <tbody>
      <tr class="section-title-row"><td colspan="2"><b>COLLOCAZIONE</b></td></tr>
      <tr><th>Interno</th><td><input type="checkbox" v-model="form.collocazione_is_interno"></td></tr>
      <tr v-if="form.collocazione_is_interno"><th>Parete interna</th><td><input v-model="form.appartiene_a_parete_int"></td></tr>
      <tr><th>Esterno</th><td><input type="checkbox" v-model="form.collocazione_is_esterno"></td></tr>
      <tr v-if="form.collocazione_is_esterno"><th>Parete esterna</th><td><input v-model="form.appartiene_a_parete_ext"></td></tr>
      <tr><th>Volta</th><td><input v-model="form.appartiene_a_volta"></td></tr>
      <tr><th>Presenza elementi di protezione</th><td><input type="checkbox" v-model="form.has_elementi_di_protezione"></td></tr>
      <tr><th>Annotazioni</th><td><textarea v-model="form.collocazione_annotazioni"></textarea></td></tr>
      </tbody>
    </table>

    <table class="form-table">
      <tbody>
      <tr class="section-title-row"><td colspan="2"><b>ICONOGRAFIA E TECNICA</b></td></tr>
      <tr><th>Dipinto isolato</th><td><input type="checkbox" v-model="form.is_isolato" @change="impostaIsolato"></td></tr>
      <tr><th>Parte di un ciclo</th><td><input type="checkbox" v-model="form.is_parte_di_un_ciclo" @change="impostaParteDiCiclo"></td></tr>
      <tr><th>Annotazioni isolato/ciclo</th><td><textarea v-model="form.isolato_o_ciclo_annotazioni"></textarea></td></tr>
      <tr><th>Iconografia del ciclo</th><td><textarea v-model="form.descrizione_iconografia_ciclo"></textarea></td></tr>
      <tr><th>Estensione ciclo (mq)</th><td><input type="number" step="0.01" v-model="form.estensione_ciclo"></td></tr>
      <tr><th>Annotazioni estensione</th><td><textarea v-model="form.estensione_annotazioni"></textarea></td></tr>
      <tr><th>Codice scena</th><td><input v-model="form.scena_cod"></td></tr>
      <tr><th>Iconografia della scena</th><td><textarea v-model="form.descrizione_iconografia_scena"></textarea></td></tr>
      <tr><th>Codice soggetto / porzione</th><td><input v-model="form.soggetto_cod"></td></tr>
      <tr><th>Descrizione soggetto / porzione</th><td><textarea v-model="form.descrizione_porzione_soggetto"></textarea></td></tr>
      <tr><th>Tecnica</th><td><select v-model="form.tecnica"><option value=""></option><option v-for="v in opzioni.tecnica" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr><th>Descrizione tecnica</th><td><textarea v-model="form.tecnica_descrizione_annot"></textarea></td></tr>
      <tr><th>Cronologia</th><td><textarea v-model="form.cronologia"></textarea></td></tr>
      <tr><th>Presenza intercapedine / contromuro</th><td><input type="checkbox" v-model="form.has_intercapedine"></td></tr>
      <tr v-if="form.has_intercapedine"><th>Descrizione intercapedine</th><td><textarea v-model="form.intercapedine_descrizione"></textarea></td></tr>
      </tbody>
    </table>

    <table class="form-table">
      <tbody>
      <tr class="section-title-row"><td colspan="2"><b>SUPPORTO E STRATI PREPARATORI</b></td></tr>
      <tr><th>Supporto</th><td><select v-model="form.supporto"><option value=""></option><option v-for="v in opzioni.supporto" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr><th>Descrizione supporto</th><td><textarea v-model="form.supporto_descrizione"></textarea></td></tr>
      <tr><th>Armatura</th><td><div v-for="v in opzioni.armatura" :key="v"><input :id="`arm-${v}`" type="checkbox" :value="v" v-model="form.armatura"><label :for="`arm-${v}`">{{ v }}</label></div></td></tr>
      <tr><th>Descrizione armatura</th><td><textarea v-model="form.armatura_str_prep_dip_descrizione"></textarea></td></tr>
      <tr><th>Rinzaffo</th><td><input v-model="form.rinzaffo_str_prep_dip"></td></tr>
      <tr><th>Descrizione rinzaffo</th><td><textarea v-model="form.rinzaffo_str_prep_dip_descrizione"></textarea></td></tr>
      <tr><th>Arriccio</th><td><input v-model="form.arriccio_str_prep_dip"></td></tr>
      <tr><th>Descrizione arriccio</th><td><textarea v-model="form.arriccio_str_prep_dip_descrizione"></textarea></td></tr>
      <tr><th>Intonaco</th><td><input v-model="form.intonaco_str_prep_dip"></td></tr>
      <tr><th>Descrizione intonaco</th><td><textarea v-model="form.intonaco_str_prep_dip_descrizione"></textarea></td></tr>
      <tr><th>Intonachino</th><td><input v-model="form.intonachino_str_prep_dip"></td></tr>
      <tr><th>Descrizione intonachino</th><td><textarea v-model="form.intonachino_str_prep_dip_descrizione"></textarea></td></tr>
      <tr><th>Strato di preparazione</th><td><select v-model="form.strato_di_preparazione_dip"><option value=""></option><option v-for="v in opzioni.stratoPrep" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr><th>Descrizione strato di preparazione</th><td><textarea v-model="form.strato_di_preparazione_dip_descrizione"></textarea></td></tr>
      <tr><th>Imprimitura</th><td><input v-model="form.imprimitura_str_prep_dip"></td></tr>
      <tr><th>Descrizione imprimitura</th><td><textarea v-model="form.imprimitura_str_prep_dip_descrizione"></textarea></td></tr>
      <tr><th>Segni di lavorazione</th><td><input v-model="form.segni_lavorazione_str_prep_dip"></td></tr>
      <tr><th>Descrizione segni di lavorazione</th><td><textarea v-model="form.segni_lavorazione_str_prep_dip_descrizione"></textarea></td></tr>
      <tr><th>Segni trasposizione disegno</th><td><select v-model="form.segni_trasp_dis_str_prep_dip"><option value=""></option><option v-for="v in opzioni.segniTraspStrPrep" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr><th>Descrizione segni trasposizione</th><td><textarea v-model="form.segni_trasp_dis_str_prep_dip_descrizione"></textarea></td></tr>
      <tr><th>Elementi a rilievo</th><td><select v-model="form.elementi_rilievo_str_prep_dip"><option value=""></option><option v-for="v in opzioni.elementiRilievo" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr><th>Descrizione elementi a rilievo</th><td><textarea v-model="form.elementi_rilievo_str_prep_dip_descrizione"></textarea></td></tr>
      <tr><th>Elementi inseriti</th><td><select v-model="form.elementi_inseriti_str_prep_dip"><option value=""></option><option v-for="v in opzioni.elementiInseriti" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr><th>Descrizione elementi inseriti</th><td><textarea v-model="form.elementi_inseriti_str_prep_dip_descrizione"></textarea></td></tr>
      </tbody>
    </table>

    <table class="form-table">
      <tbody>
      <tr class="section-title-row"><td colspan="2"><b>PELLICOLA PITTORICA</b></td></tr>
      <tr><th>Segni di trasposizione del disegno</th><td><select v-model="form.segni_trasp_dis_pell_pitt_dip"><option value=""></option><option v-for="v in opzioni.segniTraspPell" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr><th>Descrizione segni</th><td><textarea v-model="form.segni_trasp_dis_pell_pitt_dip_descrizione"></textarea></td></tr>
      <tr><th>Disegno preparatorio</th><td><textarea v-model="form.disegno_preparatorio_pell_pitt_dip"></textarea></td></tr>
      <tr><th>Preparazione</th><td><textarea v-model="form.preparazione_pell_pitt_dip"></textarea></td></tr>
      <tr><th>Pellicola pittorica originale</th><td><select v-model="form.pell_pitt_originale_dip"><option value=""></option><option v-for="v in opzioni.pellOriginale" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr v-if="form.pell_pitt_originale_dip === 'a secco'"><th>Materiale a secco</th><td><select v-model="form.pell_pitt_originale_dip_secco"><option value=""></option><option v-for="v in opzioni.pellSecco" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr><th>Descrizione pellicola originale</th><td><textarea v-model="form.pell_pitt_originale_dip_descrizione"></textarea></td></tr>
      <tr><th>Lamine metalliche</th><td><select v-model="form.lamine_metalliche_pell_pitt_dip"><option value=""></option><option v-for="v in opzioni.lamineMat" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr v-if="form.lamine_metalliche_pell_pitt_dip === 'doratura'"><th>Tecnica doratura</th><td><select v-model="form.lamine_metalliche_pell_pitt_dip_doratura"><option value=""></option><option v-for="v in opzioni.doratura" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr><th>Descrizione lamine</th><td><textarea v-model="form.lamine_metalliche_pell_pitt_dip_descrizione"></textarea></td></tr>
      <tr><th>Altro</th><td><input type="checkbox" v-model="form.pell_pitt_dip_altro"></td></tr>
      <tr v-if="form.pell_pitt_dip_altro"><th>Specificare altro</th><td><textarea v-model="form.pell_pitt_dip_altro_specificare"></textarea></td></tr>
      <tr><th>Annotazioni</th><td><textarea v-model="form.pell_pitt_dip_annotazioni"></textarea></td></tr>
      </tbody>
    </table>

    <table class="form-table">
      <tbody>
      <tr class="section-title-row"><td colspan="2"><b>ELEMENTI ACCESSORI, SEGNI PARTICOLARI E INTERVENTI SUCCESSIVI</b></td></tr>
      <tr><th>Elementi applicati</th><td><select v-model="form.el_accessori_applicati_dip"><option value=""></option><option v-for="v in opzioni.elApplicati" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr><th>Altro elementi applicati</th><td><input type="checkbox" v-model="form.el_accessori_applicati_dip_altro"></td></tr>
      <tr v-if="form.el_accessori_applicati_dip_altro"><th>Specificare altro</th><td><textarea v-model="form.el_accessori_applicati_dip_altro_specificare"></textarea></td></tr>
      <tr><th>Descrizione elementi applicati</th><td><textarea v-model="form.el_accessori_applicati_dip_descrizione"></textarea></td></tr>
      <tr><th>Segni particolari</th><td><select v-model="form.segni_particolari_dip"><option value=""></option><option v-for="v in opzioni.segniParticolari" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr><th>Descrizione iscrizioni</th><td><textarea v-model="form.segni_particolari_dip_iscrizioni_descrizione"></textarea></td></tr>
      <tr><th>Descrizione graffiti</th><td><textarea v-model="form.segni_particolari_dip_graffiti_descrizione"></textarea></td></tr>
      <tr><th>Descrizione altro</th><td><textarea v-model="form.segni_particolari_dip_altro_descrizione"></textarea></td></tr>
      <tr><th>Presenza interventi successivi</th><td><input type="checkbox" v-model="form.has_interventi_successivi_dip"></td></tr>
      <tr v-if="form.has_interventi_successivi_dip"><th>Descrizione interventi</th><td><textarea v-model="form.interventi_successivi_dip_descrizione"></textarea></td></tr>
      <tr v-if="form.has_interventi_successivi_dip"><th>Tecniche interventi</th><td><textarea v-model="form.interventi_successivi_dip_tecniche"></textarea></td></tr>
      <tr v-if="form.has_interventi_successivi_dip"><th>Materiali interventi</th><td><textarea v-model="form.interventi_successivi_dip_mat"></textarea></td></tr>
      <tr v-if="form.has_interventi_successivi_dip"><th>Supporti / strati preparatori</th><td><select v-model="form.interventi_successivi_dip_supp_strati_prep"><option value=""></option><option v-for="v in opzioni.intSuccSupp" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr v-if="form.interventi_successivi_dip_supp_strati_prep === 'stuccature'"><th>Materiale stuccature</th><td><select v-model="form.interventi_successivi_dip_supp_strati_prep_stuccature"><option value=""></option><option v-for="v in opzioni.stuccatureMat" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr v-if="form.interventi_successivi_dip_supp_strati_prep === 'stuccature'"><th>Annotazioni stuccature</th><td><textarea v-model="form.interventi_successivi_dip_supp_strati_prep_stuccature_annotazioni"></textarea></td></tr>
      <tr v-if="form.interventi_successivi_dip_supp_strati_prep === 'messa in sicurezza'"><th>Tipo messa in sicurezza</th><td><select v-model="form.interventi_successivi_dip_supp_strati_prep_messa_sicu"><option value=""></option><option v-for="v in opzioni.messaSicurezza" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr v-if="form.interventi_successivi_dip_supp_strati_prep === 'messa in sicurezza'"><th>Annotazioni messa in sicurezza</th><td><textarea v-model="form.interventi_successivi_dip_supp_strati_prep_messa_sicu_annotazioni"></textarea></td></tr>
      <tr v-if="form.has_interventi_successivi_dip"><th>Pellicola pittorica</th><td><select v-model="form.interventi_successivi_dip_pell_pitt"><option value=""></option><option v-for="v in opzioni.intSuccPell" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr v-if="form.interventi_successivi_dip_pell_pitt === 'fissativi/ravvivanti'"><th>Tipo fissativi</th><td><select v-model="form.interventi_successivi_dip_pell_pitt_fissativi"><option value=""></option><option v-for="v in opzioni.fissativi" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr v-if="form.interventi_successivi_dip_pell_pitt === 'fissativi/ravvivanti'"><th>Annotazioni fissativi</th><td><textarea v-model="form.interventi_successivi_dip_pell_pitt_fissativi_annotazioni"></textarea></td></tr>
      <tr v-if="form.interventi_successivi_dip_pell_pitt === 'dorature'"><th>Tipo dorature</th><td><select v-model="form.interventi_successivi_dip_pell_pitt_dorature"><option value=""></option><option v-for="v in opzioni.doratureSucc" :key="v" :value="v">{{ v }}</option></select></td></tr>
      <tr v-if="form.interventi_successivi_dip_pell_pitt === 'dorature'"><th>Annotazioni dorature</th><td><textarea v-model="form.interventi_successivi_dip_pell_pitt_dorature_annotazioni"></textarea></td></tr>
      </tbody>
    </table>

    <table class="form-table">
      <tbody>
      <tr class="section-title-row"><td colspan="2"><b>DOCUMENTAZIONE GENERALE</b></td></tr>
      <tr><th>Epoca</th><td><input v-model="form.epoca"></td></tr>
      <tr><th>Fonti</th><td><textarea v-model="form.fonti"></textarea></td></tr>
      <tr><th>Accessibilità</th><td><input type="checkbox" v-model="form.accessibilita"></td></tr>
      <tr><th>Documenti</th><td><input type="file" multiple @change="gestisciDocumenti"></td></tr>
      <tr v-if="nomiDocumenti.length"><th>Documenti selezionati</th><td><p class="user-field">{{ nomiDocumenti.join(', ') }}</p></td></tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import {computed, inject, reactive} from 'vue';
import {dataCorta} from '../../js/shared';
import {compilaScheda} from '../../js/richieste';
import BtnBIM from '../elementi/BottoneBIMExplorer.vue';

const props = defineProps({
  elemento: {
    type: Object,
    required: true,
  },
  meta: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['chiudi']);

const store = inject('store');
const oggi = dataCorta();

const opzioni = {
  tecnica: ['affresco', 'a secco'],
  supporto: ['laterizio', 'pietra a secco', 'pietra legata a calce', 'incannucciato', 'altro'],
  armatura: ['elementi metallici', 'fibre vegetali', 'altro'],
  stratoPrep: ['gesso', 'colla', 'altro'],
  segniTraspStrPrep: ['sinopia', 'incisioni', 'altro'],
  elementiRilievo: ['stucco', 'malta', 'altro'],
  elementiInseriti: ['cera', 'legno', 'metalli', 'altro'],
  segniTraspPell: ['battitura a filo', 'spolvero', 'altro'],
  pellOriginale: ['affresco', 'a secco'],
  pellSecco: ['tempera', 'olio', 'calce', 'altro'],
  lamineMat: ['doratura', 'argento', 'stagno', 'altro'],
  doratura: ['a foglia', 'a conchiglia', 'missione'],
  elApplicati: ['cera', 'legno', 'metalli', 'altro'],
  segniParticolari: ['iscrizioni', 'graffiti', 'altro'],
  intSuccSupp: ['tamponature', 'integrazioni', 'stuccature', 'messa in sicurezza'],
  stuccatureMat: ['malta', 'cemento', 'altro'],
  messaSicurezza: ['velinature', 'puntelli'],
  intSuccPell: ['ridipinture', 'fissativi/ravvivanti', 'dorature', 'altro'],
  fissativi: ['strati oleosi resinosi', 'cere', 'altro'],
  doratureSucc: ['doratura a foglia', 'porporine', 'altro'],
};

const baseForm = () => ({
  unita: '',
  sist_composto: '',
  descrizione_dipinto: props.elemento.record.nome || props.elemento.record.id || '',
  autore: props.elemento.record.autore || '',
  datazione: props.elemento.record.datazione || '',
  dimensioni: props.elemento.record.dimensioni || '',
  note: props.elemento.record.annotazioni || '',
  collocazione_is_interno: true,
  appartiene_a_parete_int: '',
  collocazione_is_esterno: false,
  appartiene_a_parete_ext: '',
  appartiene_a_volta: '',
  has_elementi_di_protezione: false,
  collocazione_annotazioni: '',
  is_isolato: true,
  is_parte_di_un_ciclo: false,
  isolato_o_ciclo_annotazioni: '',
  descrizione_iconografia_ciclo: '',
  estensione_ciclo: null,
  estensione_annotazioni: '',
  scena_cod: '',
  descrizione_iconografia_scena: '',
  soggetto_cod: '',
  descrizione_porzione_soggetto: '',
  tecnica: '',
  tecnica_descrizione_annot: '',
  cronologia: '',
  has_intercapedine: false,
  intercapedine_descrizione: '',
  supporto: '',
  supporto_descrizione: '',
  armatura: [],
  armatura_str_prep_dip_descrizione: '',
  rinzaffo_str_prep_dip: '',
  rinzaffo_str_prep_dip_descrizione: '',
  arriccio_str_prep_dip: '',
  arriccio_str_prep_dip_descrizione: '',
  intonaco_str_prep_dip: '',
  intonaco_str_prep_dip_descrizione: '',
  intonachino_str_prep_dip: '',
  intonachino_str_prep_dip_descrizione: '',
  strato_di_preparazione_dip: '',
  strato_di_preparazione_dip_descrizione: '',
  imprimitura_str_prep_dip: '',
  imprimitura_str_prep_dip_descrizione: '',
  segni_lavorazione_str_prep_dip: '',
  segni_lavorazione_str_prep_dip_descrizione: '',
  segni_trasp_dis_str_prep_dip: '',
  segni_trasp_dis_str_prep_dip_descrizione: '',
  elementi_rilievo_str_prep_dip: '',
  elementi_rilievo_str_prep_dip_descrizione: '',
  elementi_inseriti_str_prep_dip: '',
  elementi_inseriti_str_prep_dip_descrizione: '',
  segni_trasp_dis_pell_pitt_dip: '',
  segni_trasp_dis_pell_pitt_dip_descrizione: '',
  disegno_preparatorio_pell_pitt_dip: '',
  preparazione_pell_pitt_dip: '',
  pell_pitt_originale_dip: '',
  pell_pitt_originale_dip_secco: '',
  pell_pitt_originale_dip_descrizione: '',
  lamine_metalliche_pell_pitt_dip: '',
  lamine_metalliche_pell_pitt_dip_doratura: '',
  lamine_metalliche_pell_pitt_dip_descrizione: '',
  pell_pitt_dip_altro: false,
  pell_pitt_dip_altro_specificare: '',
  pell_pitt_dip_annotazioni: '',
  el_accessori_applicati_dip: '',
  el_accessori_applicati_dip_altro: false,
  el_accessori_applicati_dip_altro_specificare: '',
  el_accessori_applicati_dip_descrizione: '',
  segni_particolari_dip: '',
  segni_particolari_dip_iscrizioni_descrizione: '',
  segni_particolari_dip_graffiti_descrizione: '',
  segni_particolari_dip_altro_descrizione: '',
  has_interventi_successivi_dip: false,
  interventi_successivi_dip_descrizione: '',
  interventi_successivi_dip_tecniche: '',
  interventi_successivi_dip_mat: '',
  interventi_successivi_dip_supp_strati_prep: '',
  interventi_successivi_dip_supp_strati_prep_stuccature: '',
  interventi_successivi_dip_supp_strati_prep_stuccature_annotazioni: '',
  interventi_successivi_dip_supp_strati_prep_messa_sicu: '',
  interventi_successivi_dip_supp_strati_prep_messa_sicu_annotazioni: '',
  interventi_successivi_dip_pell_pitt: '',
  interventi_successivi_dip_pell_pitt_fissativi: '',
  interventi_successivi_dip_pell_pitt_fissativi_annotazioni: '',
  interventi_successivi_dip_pell_pitt_dorature: '',
  interventi_successivi_dip_pell_pitt_dorature_annotazioni: '',
  epoca: '',
  fonti: '',
  accessibilita: false,
  documenti: [],
});

const form = reactive(baseForm());

const elemento = computed(() => props.elemento);
const meta = computed(() => props.meta);
const nomiDocumenti = computed(() => form.documenti.map(file => file.name));

function resetForm() {
  Object.assign(form, baseForm());
}

async function salvaScheda() {
  const record = props.elemento.record;
  if (!record.uuid || !record.id_main10ance) {
    store.methods.setAlert('Elemento selezionato incompleto: impossibile salvare la scheda.');
    return;
  }

  const cartellaDocumenti = `${record.uuid}/${Date.now()}`;
  const docs = form.documenti.map(file => `${cartellaDocumenti}/${normalizzaNomeFile(file.name)}`);
  const richiesta = [creaOggettoScheda(docs)];
  const fd = new FormData();
  form.documenti.forEach((file, idx) => {
    fd.append(`file_${idx}`, file, normalizzaNomeFile(file.name));
  });
  fd.append('dati', JSON.stringify(richiesta));

  store.methods.toggleLoaderGlobale();
  const resp = await compilaScheda(fd);
  store.methods.toggleLoaderGlobale();

  if (resp?.success) {
    store.methods.setAlert('Scheda anagrafica Dipinti murali salvata correttamente.');
    emit('chiudi');
  }
  else {
    store.methods.setAlert('Operazione non riuscita.');
  }
}

function impostaIsolato() {
  if (form.is_isolato) form.is_parte_di_un_ciclo = false;
  else form.is_parte_di_un_ciclo = true;
}

function impostaParteDiCiclo() {
  if (form.is_parte_di_un_ciclo) form.is_isolato = false;
  else form.is_isolato = true;
}

function gestisciDocumenti(evt) {
  form.documenti = [...evt.target.files];
}

function creaOggettoScheda(docs) {
  const record = props.elemento.record;
  const metadati = {
    uuid_elemento: record.uuid,
    id_main10ance: record.id_main10ance,
    livello_1: record.livello_1,
    livello_2: record.livello_2,
    livello_3: record.livello_3,
    livello_4: record.livello_4,
    data_registrazione: oggi,
    autore_scheda: store.state.userSettings.user_id,
    data_ultima_mod: oggi,
    autore_ultima_mod: store.state.userSettings.user_id,
    validata: false,
    docs,
  };

  const campi = {
    ...metadati,
    unita: form.unita,
    sist_composto: form.sist_composto,
    descrizione_dipinto: form.descrizione_dipinto,
    autore: form.autore,
    datazione: form.datazione,
    dimensioni: form.dimensioni,
    note: form.note,
    collocazione_is_interno: form.collocazione_is_interno,
    appartiene_a_parete_int: form.appartiene_a_parete_int,
    collocazione_is_esterno: form.collocazione_is_esterno,
    appartiene_a_parete_ext: form.appartiene_a_parete_ext,
    appartiene_a_volta: form.appartiene_a_volta,
    has_elementi_di_protezione: form.has_elementi_di_protezione,
    collocazione_note: form.collocazione_annotazioni,
    is_isolato: form.is_isolato,
    is_parte_di_un_ciclo: form.is_parte_di_un_ciclo,
    isolato_o_ciclo_note: form.isolato_o_ciclo_annotazioni,
    descrizione_iconografia_ciclo: form.descrizione_iconografia_ciclo,
    estensione_ciclo: form.estensione_ciclo,
    estensione_note: form.estensione_annotazioni,
    scena_cod: form.scena_cod,
    descrizione_iconografia_scena: form.descrizione_iconografia_scena,
    soggetto_cod: form.soggetto_cod,
    descrizione_porzione_soggetto: form.descrizione_porzione_soggetto,
    tecnica: form.tecnica,
    tecnica_descrizione_annot: form.tecnica_descrizione_annot,
    cronologia: form.cronologia,
    has_intercapedine: form.has_intercapedine,
    intercapedine_descrizione: form.intercapedine_descrizione,
    supporto: form.supporto,
    supporto_descrizione: form.supporto_descrizione,
    armatura: form.armatura,
    armatura_str_prep_dip_descrizione: form.armatura_str_prep_dip_descrizione,
    rinzaffo_str_prep_dip: form.rinzaffo_str_prep_dip,
    rinzaffo_str_prep_dip_descrizione: form.rinzaffo_str_prep_dip_descrizione,
    arriccio_str_prep_dip: form.arriccio_str_prep_dip,
    arriccio_str_prep_dip_descrizione: form.arriccio_str_prep_dip_descrizione,
    intonaco_str_prep_dip: form.intonaco_str_prep_dip,
    intonaco_str_prep_dip_descrizione: form.intonaco_str_prep_dip_descrizione,
    intonachino_str_prep_dip: form.intonachino_str_prep_dip,
    intonachino_str_prep_dip_descrizione: form.intonachino_str_prep_dip_descrizione,
    strato_di_preparazione_dip: form.strato_di_preparazione_dip,
    strato_di_preparazione_dip_descrizione: form.strato_di_preparazione_dip_descrizione,
    imprimitura_str_prep_dip: form.imprimitura_str_prep_dip,
    imprimitura_str_prep_dip_descrizione: form.imprimitura_str_prep_dip_descrizione,
    segni_lavorazione_str_prep_dip: form.segni_lavorazione_str_prep_dip,
    segni_lavorazione_str_prep_dip_descrizione: form.segni_lavorazione_str_prep_dip_descrizione,
    segni_trasp_dis_str_prep_dip: form.segni_trasp_dis_str_prep_dip,
    segni_trasp_dis_str_prep_dip_descrizione: form.segni_trasp_dis_str_prep_dip_descrizione,
    elementi_rilievo_str_prep_dip: form.elementi_rilievo_str_prep_dip,
    elementi_rilievo_str_prep_dip_descrizione: form.elementi_rilievo_str_prep_dip_descrizione,
    elementi_inseriti_str_prep_dip: form.elementi_inseriti_str_prep_dip,
    elementi_inseriti_str_prep_dip_descrizione: form.elementi_inseriti_str_prep_dip_descrizione,
    segni_trasp_dis_pell_pitt_dip: form.segni_trasp_dis_pell_pitt_dip,
    segni_trasp_dis_pell_pitt_dip_descrizione: form.segni_trasp_dis_pell_pitt_dip_descrizione,
    disegno_preparatorio_pell_pitt_dip: form.disegno_preparatorio_pell_pitt_dip,
    preparazione_pell_pitt_dip: form.preparazione_pell_pitt_dip,
    pell_pitt_originale_dip: form.pell_pitt_originale_dip,
    pell_pitt_originale_dip_secco: form.pell_pitt_originale_dip_secco,
    pell_pitt_originale_dip_descrizione: form.pell_pitt_originale_dip_descrizione,
    lamine_metalliche_pell_pitt_dip: form.lamine_metalliche_pell_pitt_dip,
    lamine_metalliche_pell_pitt_dip_doratura: form.lamine_metalliche_pell_pitt_dip_doratura,
    lamine_metalliche_pell_pitt_dip_descrizione: form.lamine_metalliche_pell_pitt_dip_descrizione,
    pell_pitt_dip_altro: form.pell_pitt_dip_altro,
    pell_pitt_dip_altro_specificare: form.pell_pitt_dip_altro_specificare,
    pell_pitt_dip_note: form.pell_pitt_dip_annotazioni,
    el_accessori_applicati_dip: form.el_accessori_applicati_dip,
    el_accessori_applicati_dip_altro: form.el_accessori_applicati_dip_altro,
    el_accessori_applicati_dip_altro_specificare: form.el_accessori_applicati_dip_altro_specificare,
    el_accessori_applicati_dip_descrizione: form.el_accessori_applicati_dip_descrizione,
    segni_particolari_dip: form.segni_particolari_dip,
    segni_particolari_dip_iscrizioni_descrizione: form.segni_particolari_dip_iscrizioni_descrizione,
    segni_particolari_dip_graffiti_descrizione: form.segni_particolari_dip_graffiti_descrizione,
    segni_particolari_dip_altro_descrizione: form.segni_particolari_dip_altro_descrizione,
    has_interventi_successivi_dip: form.has_interventi_successivi_dip,
    interventi_successivi_dip_descrizione: form.interventi_successivi_dip_descrizione,
    interventi_successivi_dip_tecniche: form.interventi_successivi_dip_tecniche,
    interventi_successivi_dip_mat: form.interventi_successivi_dip_mat,
    interventi_successivi_dip_supp_strati_prep: form.interventi_successivi_dip_supp_strati_prep,
    interventi_successivi_dip_supp_strati_prep_stuccature: form.interventi_successivi_dip_supp_strati_prep_stuccature,
    interventi_successivi_dip_supp_strati_prep_stuccature_note: form.interventi_successivi_dip_supp_strati_prep_stuccature_annotazioni,
    interventi_successivi_dip_supp_strati_prep_messa_sicu: form.interventi_successivi_dip_supp_strati_prep_messa_sicu,
    interventi_successivi_dip_supp_strati_prep_messa_sicu_note: form.interventi_successivi_dip_supp_strati_prep_messa_sicu_annotazioni,
    interventi_successivi_dip_pell_pitt: form.interventi_successivi_dip_pell_pitt,
    interventi_successivi_dip_pell_pitt_fissativi: form.interventi_successivi_dip_pell_pitt_fissativi,
    interventi_successivi_dip_pell_pitt_fissativi_note: form.interventi_successivi_dip_pell_pitt_fissativi_annotazioni,
    interventi_successivi_dip_pell_pitt_dorature: form.interventi_successivi_dip_pell_pitt_dorature,
    interventi_successivi_dip_pell_pitt_dorature_note: form.interventi_successivi_dip_pell_pitt_dorature_annotazioni,
    epoca: form.epoca,
    fonti: form.fonti,
    accessibilita: form.accessibilita,
  };

  const entries = Object.entries(campi).filter(([, value]) => valoreDaSalvare(value));
  return {
    tabella: 'scheda_anagrafica_dipinti_murali',
    colonne: entries.map(([key]) => key),
    valori: entries.map(([, value]) => value),
  };
}

function valoreDaSalvare(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim() !== '';
  return true;
}

function normalizzaNomeFile(nomeFile) {
  return nomeFile.trim().replaceAll(/\s/g, '_').replaceAll(/(\/|\\)/g, '-').replaceAll(/(\?|!)/g, '');
}
</script>

<style scoped>
textarea {
  resize: vertical;
  min-height: 3.2rem;
}

input, textarea {
  float: right;
  line-height: 100%;
  padding: 1px;
  border: 0;
}

select, textarea, input:not([type=checkbox]):not([type=file]) {
  width: 100%;
}

.scheda-anagrafica {
  background-color: var(--bluInterregTrasparenza);
  font-size: 13px;
  padding: 30px 14px;
  margin-top: 2rem;
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

.user-field {
  line-height: 100%;
  padding: 0;
  text-align: right;
}

.form-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  margin-bottom: 1.2rem;
}

.form-table:not(.first-section) .section-title-row td {
  border-top: 1px solid #808080;
}

.form-table th {
  width: 38%;
  vertical-align: top;
  background-color: transparent;
}

.section-title-row td {
  padding: 1.2rem 0 .4rem;
  color: inherit;
  text-align: center;
  vertical-align: middle;
}
</style>

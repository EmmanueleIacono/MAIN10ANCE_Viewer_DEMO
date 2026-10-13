<template>
  <div
    ref="schedaRef"
    class="scheda-anagrafica dipinti-murali-form"
    :class="{'readonly-mode': solaLettura}"
    @click="gestisciClickScheda"
    @keydown.capture="bloccaModificaSolaLettura"
    @beforeinput.capture="bloccaModificaSolaLettura"
  >
    <div class="div-titolo-bottoni">
      <div class="float-dx div-bottoni">
        <BtnBIM v-if="solaLettura" @click="entraModalitaModifica" icona="glyphicon-pencil" nome="modificaScDipMur" title="Modifica scheda" colore="blu" />
        <BtnBIM v-if="modalitaModifica" @click="salvaScheda" icona="glyphicon-floppy-disk" nome="salvaScDipMur" title="Salva" colore="blu" />
        <BtnBIM v-if="modalitaModifica" @click="resetForm" icona="glyphicon-erase" nome="resetScDipMur" title="Cancella tutti i campi" colore="blu" />
        <BtnBIM @click="$emit('chiudi')" icona="glyphicon-remove" nome="chiudiScDipMur" title="Chiudi" colore="blu" />
      </div>
      <h4><b>SCHEDA ANAGRAFICA DIPINTI MURALI</b></h4>
      <p v-if="scheda" class="scheda-status">
        Ultima scheda salvata: {{ formattaDataScheda(scheda.data_ultima_mod || scheda.data_registrazione) }} -
        {{ scheda.autore_ultima_mod || scheda.autore_scheda || 'N/D' }}
      </p>
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
      <tr v-if="documentiSalvati.length">
        <th>Documenti associati</th>
        <td>
          <ul class="documenti-associati">
            <li v-for="doc in documentiSalvati" :key="doc">
              <button type="button" class="documento-link" @click="apriAnteprimaDocumento(doc)">
                {{ nomeDocumento(doc) }}
              </button>
            </li>
          </ul>
        </td>
      </tr>
      <tr v-if="modalitaModifica"><th>Documenti</th><td><input type="file" multiple @change="gestisciDocumenti"></td></tr>
      <tr v-if="modalitaModifica && nomiDocumenti.length"><th>Nuovi documenti selezionati</th><td><p class="user-field">{{ nomiDocumenti.join(', ') }}</p></td></tr>
      </tbody>
    </table>

    <div v-if="previewDocumento.visibile" class="documento-dialog-backdrop" @click.self="chiudiAnteprimaDocumento">
      <div class="documento-dialog">
        <div class="documento-dialog-header">
          <h4>{{ previewDocumento.nome }}</h4>
          <button type="button" class="documento-close" title="Chiudi" @click="chiudiAnteprimaDocumento">
            <span class="glyphicon glyphicon-remove"></span>
          </button>
        </div>

        <div class="documento-preview">
          <p v-if="previewDocumento.caricamento">Caricamento anteprima...</p>
          <p v-else-if="previewDocumento.errore">{{ previewDocumento.errore }}</p>
          <img v-else-if="previewDocumento.tipo === 'immagine'" :src="previewDocumento.url" :alt="previewDocumento.nome">
          <iframe v-else-if="previewDocumento.tipo === 'pdf'" :src="previewDocumento.url" :title="previewDocumento.nome"></iframe>
          <pre v-else-if="previewDocumento.tipo === 'testo'">{{ previewDocumento.testo }}</pre>
          <p v-else>Anteprima non disponibile</p>
        </div>

        <div class="documento-dialog-actions">
          <button type="button" class="documento-download" :disabled="!previewDocumento.url" @click="scaricaDocumentoPreview">
            <span class="glyphicon glyphicon-download-alt"></span>
            Download
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, inject, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch} from 'vue';
import {dataCorta} from '../../js/shared';
import {compilaScheda, downloadDocumentiSchede} from '../../js/richieste';
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
  scheda: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['chiudi', 'salvata']);

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

const baseForm = () => {
  const record = props.elemento.record;

  return {
    unita: valoreScheda('unita'),
    sist_composto: valoreScheda('sist_composto'),
    descrizione_dipinto: valoreScheda('descrizione_dipinto', record.nome || record.id || ''),
    autore: valoreScheda('autore', record.autore || ''),
    datazione: valoreScheda('datazione', record.datazione || ''),
    dimensioni: valoreScheda('dimensioni', record.dimensioni || ''),
    note: valoreScheda('note', record.annotazioni || ''),
    collocazione_is_interno: valoreScheda('collocazione_is_interno', true),
    appartiene_a_parete_int: valoreScheda('appartiene_a_parete_int'),
    collocazione_is_esterno: valoreScheda('collocazione_is_esterno', false),
    appartiene_a_parete_ext: valoreScheda('appartiene_a_parete_ext'),
    appartiene_a_volta: valoreScheda('appartiene_a_volta'),
    has_elementi_di_protezione: valoreScheda('has_elementi_di_protezione', false),
    collocazione_annotazioni: valoreScheda('collocazione_note'),
    is_isolato: valoreScheda('is_isolato', true),
    is_parte_di_un_ciclo: valoreScheda('is_parte_di_un_ciclo', false),
    isolato_o_ciclo_annotazioni: valoreScheda('isolato_o_ciclo_note'),
    descrizione_iconografia_ciclo: valoreScheda('descrizione_iconografia_ciclo'),
    estensione_ciclo: valoreScheda('estensione_ciclo', null),
    estensione_annotazioni: valoreScheda('estensione_note'),
    scena_cod: valoreScheda('scena_cod'),
    descrizione_iconografia_scena: valoreScheda('descrizione_iconografia_scena'),
    soggetto_cod: valoreScheda('soggetto_cod'),
    descrizione_porzione_soggetto: valoreScheda('descrizione_porzione_soggetto'),
    tecnica: valoreScheda('tecnica'),
    tecnica_descrizione_annot: valoreScheda('tecnica_descrizione_annot'),
    cronologia: valoreScheda('cronologia'),
    has_intercapedine: valoreScheda('has_intercapedine', false),
    intercapedine_descrizione: valoreScheda('intercapedine_descrizione'),
    supporto: valoreScheda('supporto'),
    supporto_descrizione: valoreScheda('supporto_descrizione'),
    armatura: valoreArrayScheda('armatura'),
    armatura_str_prep_dip_descrizione: valoreScheda('armatura_str_prep_dip_descrizione'),
    rinzaffo_str_prep_dip: valoreScheda('rinzaffo_str_prep_dip'),
    rinzaffo_str_prep_dip_descrizione: valoreScheda('rinzaffo_str_prep_dip_descrizione'),
    arriccio_str_prep_dip: valoreScheda('arriccio_str_prep_dip'),
    arriccio_str_prep_dip_descrizione: valoreScheda('arriccio_str_prep_dip_descrizione'),
    intonaco_str_prep_dip: valoreScheda('intonaco_str_prep_dip'),
    intonaco_str_prep_dip_descrizione: valoreScheda('intonaco_str_prep_dip_descrizione'),
    intonachino_str_prep_dip: valoreScheda('intonachino_str_prep_dip'),
    intonachino_str_prep_dip_descrizione: valoreScheda('intonachino_str_prep_dip_descrizione'),
    strato_di_preparazione_dip: valoreScheda('strato_di_preparazione_dip'),
    strato_di_preparazione_dip_descrizione: valoreScheda('strato_di_preparazione_dip_descrizione'),
    imprimitura_str_prep_dip: valoreScheda('imprimitura_str_prep_dip'),
    imprimitura_str_prep_dip_descrizione: valoreScheda('imprimitura_str_prep_dip_descrizione'),
    segni_lavorazione_str_prep_dip: valoreScheda('segni_lavorazione_str_prep_dip'),
    segni_lavorazione_str_prep_dip_descrizione: valoreScheda('segni_lavorazione_str_prep_dip_descrizione'),
    segni_trasp_dis_str_prep_dip: valoreScheda('segni_trasp_dis_str_prep_dip'),
    segni_trasp_dis_str_prep_dip_descrizione: valoreScheda('segni_trasp_dis_str_prep_dip_descrizione'),
    elementi_rilievo_str_prep_dip: valoreScheda('elementi_rilievo_str_prep_dip'),
    elementi_rilievo_str_prep_dip_descrizione: valoreScheda('elementi_rilievo_str_prep_dip_descrizione'),
    elementi_inseriti_str_prep_dip: valoreScheda('elementi_inseriti_str_prep_dip'),
    elementi_inseriti_str_prep_dip_descrizione: valoreScheda('elementi_inseriti_str_prep_dip_descrizione'),
    segni_trasp_dis_pell_pitt_dip: valoreScheda('segni_trasp_dis_pell_pitt_dip'),
    segni_trasp_dis_pell_pitt_dip_descrizione: valoreScheda('segni_trasp_dis_pell_pitt_dip_descrizione'),
    disegno_preparatorio_pell_pitt_dip: valoreScheda('disegno_preparatorio_pell_pitt_dip'),
    preparazione_pell_pitt_dip: valoreScheda('preparazione_pell_pitt_dip'),
    pell_pitt_originale_dip: valoreScheda('pell_pitt_originale_dip'),
    pell_pitt_originale_dip_secco: valoreScheda('pell_pitt_originale_dip_secco'),
    pell_pitt_originale_dip_descrizione: valoreScheda('pell_pitt_originale_dip_descrizione'),
    lamine_metalliche_pell_pitt_dip: valoreScheda('lamine_metalliche_pell_pitt_dip'),
    lamine_metalliche_pell_pitt_dip_doratura: valoreScheda('lamine_metalliche_pell_pitt_dip_doratura'),
    lamine_metalliche_pell_pitt_dip_descrizione: valoreScheda('lamine_metalliche_pell_pitt_dip_descrizione'),
    pell_pitt_dip_altro: valoreScheda('pell_pitt_dip_altro', false),
    pell_pitt_dip_altro_specificare: valoreScheda('pell_pitt_dip_altro_specificare'),
    pell_pitt_dip_annotazioni: valoreScheda('pell_pitt_dip_note'),
    el_accessori_applicati_dip: valoreScheda('el_accessori_applicati_dip'),
    el_accessori_applicati_dip_altro: valoreScheda('el_accessori_applicati_dip_altro', false),
    el_accessori_applicati_dip_altro_specificare: valoreScheda('el_accessori_applicati_dip_altro_specificare'),
    el_accessori_applicati_dip_descrizione: valoreScheda('el_accessori_applicati_dip_descrizione'),
    segni_particolari_dip: valoreScheda('segni_particolari_dip'),
    segni_particolari_dip_iscrizioni_descrizione: valoreScheda('segni_particolari_dip_iscrizioni_descrizione'),
    segni_particolari_dip_graffiti_descrizione: valoreScheda('segni_particolari_dip_graffiti_descrizione'),
    segni_particolari_dip_altro_descrizione: valoreScheda('segni_particolari_dip_altro_descrizione'),
    has_interventi_successivi_dip: valoreScheda('has_interventi_successivi_dip', false),
    interventi_successivi_dip_descrizione: valoreScheda('interventi_successivi_dip_descrizione'),
    interventi_successivi_dip_tecniche: valoreScheda('interventi_successivi_dip_tecniche'),
    interventi_successivi_dip_mat: valoreScheda('interventi_successivi_dip_mat'),
    interventi_successivi_dip_supp_strati_prep: valoreScheda('interventi_successivi_dip_supp_strati_prep'),
    interventi_successivi_dip_supp_strati_prep_stuccature: valoreScheda('interventi_successivi_dip_supp_strati_prep_stuccature'),
    interventi_successivi_dip_supp_strati_prep_stuccature_annotazioni: valoreScheda('interventi_successivi_dip_supp_strati_prep_stuccature_note'),
    interventi_successivi_dip_supp_strati_prep_messa_sicu: valoreScheda('interventi_successivi_dip_supp_strati_prep_messa_sicu'),
    interventi_successivi_dip_supp_strati_prep_messa_sicu_annotazioni: valoreScheda('interventi_successivi_dip_supp_strati_prep_messa_sicu_note'),
    interventi_successivi_dip_pell_pitt: valoreScheda('interventi_successivi_dip_pell_pitt'),
    interventi_successivi_dip_pell_pitt_fissativi: valoreScheda('interventi_successivi_dip_pell_pitt_fissativi'),
    interventi_successivi_dip_pell_pitt_fissativi_annotazioni: valoreScheda('interventi_successivi_dip_pell_pitt_fissativi_note'),
    interventi_successivi_dip_pell_pitt_dorature: valoreScheda('interventi_successivi_dip_pell_pitt_dorature'),
    interventi_successivi_dip_pell_pitt_dorature_annotazioni: valoreScheda('interventi_successivi_dip_pell_pitt_dorature_note'),
    epoca: valoreScheda('epoca'),
    fonti: valoreScheda('fonti'),
    accessibilita: valoreScheda('accessibilita', false),
    documenti: [],
  };
};

const form = reactive(baseForm());
const schedaRef = ref(null);
const modalitaModifica = ref(!props.scheda);
const sezioniAperte = reactive(new Set());
const previewDocumento = reactive({
  visibile: false,
  caricamento: false,
  path: '',
  nome: '',
  url: '',
  tipo: '',
  testo: '',
  errore: '',
});

const elemento = computed(() => props.elemento);
const meta = computed(() => props.meta);
const scheda = computed(() => props.scheda);
const solaLettura = computed(() => !!props.scheda && !modalitaModifica.value);
const documentiSalvati = computed(() => Array.isArray(props.scheda?.docs) ? props.scheda.docs : []);
const nomiDocumenti = computed(() => form.documenti.map(file => file.name));

watch(() => [props.elemento.record.uuid, props.scheda?.id_anagr], async () => {
  resetForm();
  modalitaModifica.value = !props.scheda;
  await nextTick();
  inizializzaSezioniDefault();
  aggiornaCampiVuotiSolaLettura();
});

watch(solaLettura, async () => {
  await nextTick();
  inizializzaSezioniDefault();
  aggiornaCampiVuotiSolaLettura();
});

onMounted(async () => {
  await nextTick();
  inizializzaSezioniDefault();
  aggiornaCampiVuotiSolaLettura();
});

onBeforeUnmount(() => {
  chiudiAnteprimaDocumento();
});

function resetForm() {
  Object.assign(form, baseForm());
}

async function entraModalitaModifica() {
  modalitaModifica.value = true;
  await nextTick();
  inizializzaSezioniDefault();
}

function bloccaModificaSolaLettura(event) {
  if (!solaLettura.value) return;
  if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target?.tagName)) return;
  event.preventDefault();
}

function gestisciClickScheda(event) {
  const titleRow = event.target.closest('.section-title-row');
  if (!titleRow || !schedaRef.value?.contains(titleRow)) return;
  const table = titleRow.closest('.form-table');
  if (!table) return;

  const sectionId = idSezioneTabella(table);
  if (sezioniAperte.has(sectionId)) sezioniAperte.delete(sectionId);
  else sezioniAperte.add(sectionId);
  aggiornaSezioniCompatte();
}

function aggiornaCampiVuotiSolaLettura() {
  if (!schedaRef.value) return;
  const celle = schedaRef.value.querySelectorAll('.form-table td');
  celle.forEach(cella => {
    delete cella.dataset.emptyField;
    if (!solaLettura.value) return;
    const controllo = cella.querySelector('input:not([type=checkbox]):not([type=file]), textarea, select');
    if (!controllo) return;
    if (String(controllo.value ?? '').trim() === '') {
      cella.dataset.emptyField = 'true';
    }
  });
}

function aggiornaSezioniCompatte() {
  if (!schedaRef.value) return;
  const tables = [...schedaRef.value.querySelectorAll('.form-table')];
  tables.forEach(table => {
    if (!table.querySelector('.section-title-row')) return;
    const sectionId = idSezioneTabella(table);
    const aperta = sezioniAperte.has(sectionId);
    table.classList.toggle('section-collapsed', !aperta);
    table.classList.toggle('section-open', aperta);
    table.querySelector('.section-title-row')?.setAttribute('title', aperta ? 'Clicca per chiudere la sezione' : 'Clicca per aprire la sezione');
  });
}

function inizializzaSezioniDefault() {
  sezioniAperte.clear();
  if (modalitaModifica.value) {
    listaTabelleSezione().forEach(table => sezioniAperte.add(idSezioneTabella(table)));
  }
  aggiornaSezioniCompatte();
}

function listaTabelleSezione() {
  if (!schedaRef.value) return [];
  return [...schedaRef.value.querySelectorAll('.form-table')]
    .filter(table => table.querySelector('.section-title-row'));
}

function idSezioneTabella(table) {
  const titolo = table.querySelector('.section-title-row')?.textContent || '';
  return titolo.trim().toLowerCase().replace(/\s+/g, '-');
}

async function salvaScheda() {
  const record = props.elemento.record;
  if (!record.uuid || !record.id_main10ance) {
    store.methods.setAlert('Elemento selezionato incompleto: impossibile salvare la scheda.');
    return;
  }

  const cartellaDocumenti = `${record.uuid}/${Date.now()}`;
  const nuoviDocs = form.documenti.map(file => `${cartellaDocumenti}/${normalizzaNomeFile(file.name)}`);
  const docs = [...documentiSalvati.value, ...nuoviDocs];
  const richiesta = [creaOggettoScheda(docs)];
  const fd = new FormData();
  form.documenti.forEach((file, idx) => {
    fd.append(`file_${documentiSalvati.value.length + idx}`, file, normalizzaNomeFile(file.name));
  });
  fd.append('dati', JSON.stringify(richiesta));

  store.methods.toggleLoaderGlobale();
  const resp = await compilaScheda(fd);
  store.methods.toggleLoaderGlobale();

  if (resp?.success) {
    store.methods.setAlert('Scheda anagrafica Dipinti murali salvata correttamente.');
    emit('salvata');
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

function valoreScheda(chiave, fallback = '') {
  const value = props.scheda?.[chiave];
  if (value === null || value === undefined) return fallback;
  return value;
}

function valoreArrayScheda(chiave) {
  const value = props.scheda?.[chiave];
  return Array.isArray(value) ? [...value] : [];
}

function formattaDataScheda(data) {
  if (!data) return 'N/D';
  return String(data).split('T')[0];
}

async function apriAnteprimaDocumento(path) {
  chiudiAnteprimaDocumento();
  previewDocumento.visibile = true;
  previewDocumento.caricamento = true;
  previewDocumento.path = path;
  previewDocumento.nome = nomeDocumento(path);

  try {
    const blob = await downloadDocumentiSchede(path);
    if (blob?.errMsg) throw new Error(blob.errMsg);

    previewDocumento.url = URL.createObjectURL(blob);
    previewDocumento.tipo = tipoAnteprimaDocumento(blob, path);
    if (previewDocumento.tipo === 'testo') {
      previewDocumento.testo = await blob.text();
    }
  }
  catch(e) {
    previewDocumento.errore = 'Documento non disponibile';
  }
  finally {
    previewDocumento.caricamento = false;
  }
}

function chiudiAnteprimaDocumento() {
  if (previewDocumento.url) URL.revokeObjectURL(previewDocumento.url);
  previewDocumento.visibile = false;
  previewDocumento.caricamento = false;
  previewDocumento.path = '';
  previewDocumento.nome = '';
  previewDocumento.url = '';
  previewDocumento.tipo = '';
  previewDocumento.testo = '';
  previewDocumento.errore = '';
}

function scaricaDocumentoPreview() {
  if (!previewDocumento.url) return;
  const link = document.createElement('a');
  link.href = previewDocumento.url;
  link.download = previewDocumento.nome;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function nomeDocumento(path) {
  return String(path || '').split(/[/\\]/).filter(Boolean).pop() || 'documento';
}

function tipoAnteprimaDocumento(blob, path) {
  const mime = blob.type || '';
  const estensione = nomeDocumento(path).split('.').pop()?.toLowerCase();
  if (mime.startsWith('image/')) return 'immagine';
  if (mime === 'application/pdf' || estensione === 'pdf') return 'pdf';
  if (mime.startsWith('text/') || ['txt', 'csv', 'json', 'xml', 'md'].includes(estensione)) return 'testo';
  return 'non-disponibile';
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

.readonly-mode td[data-empty-field="true"] input:not([type=checkbox]):not([type=file]),
.readonly-mode td[data-empty-field="true"] textarea,
.readonly-mode td[data-empty-field="true"] select {
  display: none;
}

.readonly-mode td[data-empty-field="true"]::after {
  content: "Nessun valore";
  display: block;
  font-style: italic;
  text-align: right;
  opacity: .7;
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

.scheda-status {
  margin: .4rem 0 0;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
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

.documenti-associati {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: .4rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.documento-link {
  padding: 0;
  border: 0;
  background: transparent;
  color: #0b5cad;
  font-weight: 700;
  text-align: right;
  cursor: pointer;
}

.documento-link:hover,
.documento-link:focus {
  text-decoration: underline;
}

.documento-dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(0, 0, 0, .45);
}

.documento-dialog {
  width: min(92vw, 900px);
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #777;
  box-shadow: 0 1.2rem 3rem rgba(0, 0, 0, .35);
}

.documento-dialog-header,
.documento-dialog-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.2rem;
  background: var(--bluInterregTrasparenza);
}

.documento-dialog-header h4 {
  margin: 0;
  font-weight: 700;
  word-break: break-word;
}

.documento-close,
.documento-download {
  border: 0;
  background: var(--bluMain10ance);
  color: #000;
  font-weight: 700;
  cursor: pointer;
}

.documento-close {
  width: 3.4rem;
  height: 3.4rem;
}

.documento-download {
  display: inline-flex;
  align-items: center;
  gap: .6rem;
  padding: .8rem 1.2rem;
}

.documento-download:disabled {
  opacity: .45;
  cursor: not-allowed;
}

.documento-preview {
  min-height: 24rem;
  overflow: auto;
  padding: 1.2rem;
  text-align: center;
}

.documento-preview img {
  max-width: 100%;
  max-height: 62vh;
  object-fit: contain;
}

.documento-preview iframe {
  width: 100%;
  height: 62vh;
  border: 0;
}

.documento-preview pre {
  margin: 0;
  text-align: left;
  white-space: pre-wrap;
  word-break: break-word;
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

.section-title-row {
  cursor: pointer;
  user-select: none;
}

.section-title-row td {
  position: relative;
  transition: background-color .15s ease, color .15s ease, box-shadow .15s ease;
}

.section-title-row:hover td,
.section-title-row:focus-within td {
  background-color: rgba(26, 91, 167, .12);
  box-shadow: inset 0 0 0 1px rgba(26, 91, 167, .28);
}

.section-title-row td::before {
  content: ">";
  position: absolute;
  left: .8rem;
  top: 50%;
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(26, 91, 167, .45);
  background: rgba(255, 255, 255, .36);
  color: var(--bluMain10ance);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  transform: translateY(-50%);
  transition: background-color .15s ease, color .15s ease, transform .15s ease;
}

.section-open .section-title-row td::before {
  content: "v";
}

.section-title-row:hover td::before,
.section-title-row:focus-within td::before {
  background: var(--bluMain10ance);
  color: #fff;
}

.section-title-row td::after {
  content: "Apri sezione";
  position: absolute;
  right: .8rem;
  top: 50%;
  padding: .25rem .7rem;
  border: 1px solid rgba(26, 91, 167, .25);
  background: rgba(255, 255, 255, .42);
  color: var(--bluMain10ance);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.2;
  transform: translateY(-50%);
  opacity: .9;
}

.section-open .section-title-row td::after {
  content: "Chiudi sezione";
}

.section-title-row:hover td::after,
.section-title-row:focus-within td::after {
  border-color: rgba(26, 91, 167, .5);
  background: #fff;
  text-decoration: underline;
}

.form-table.section-collapsed tbody tr:not(.section-title-row) {
  display: none;
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
  padding-left: 3.4rem;
  padding-right: 11rem;
}
</style>

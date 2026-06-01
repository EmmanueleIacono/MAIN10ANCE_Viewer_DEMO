<template>
<div>
  <div class="scheda-anagrafica">
    <div class="div-titolo-bottoni">
      <div class="float-dx div-bottoni">
        <BtnBIM @click="salvaScheda" icona="glyphicon-floppy-disk" nome="salvaScSegnLOD4" title="Salva" colore="blu" />
        <BtnBIM @click="resetState" icona="glyphicon-erase" nome="annullaDBLOD4" title="Cancella tutti i campi" colore="blu" />
        <BtnBIM @click="chiudiScheda" icona="glyphicon-remove" nome="chiudiScSegnLOD4" title="Annulla" colore="blu" />
      </div>
      <h4><b>SCHEDA DI SEGNALAZIONE</b></h4>
    </div>
    <br />
    <label><b>OPERATORE</b></label>
    <p class="user-field float-dx">{{store.state.userSettings.user_id}}</p>
    <br />
    <div>
      <label><b>DATA</b></label>
      <p class="user-field float-dx">{{dataCorta()}}</p>
      <br />
      <br />
      <SchemaForm
        :fields="segnalazioneFields"
        :model="stateModuloSegnalazione"
        :disabled="schedaRegistrata"
        @update-field="setSchemaField"
      />
    </div>
  </div>
</div>
</template>

<script setup>
import { inject, computed, ref } from 'vue';
import {dataCorta, dataInteger} from '../js/shared';
import {compilaScheda} from '../js/richieste';
import {SEGNALAZIONE_FIELDS, isSchemaEmpty, resetSchemaState} from '../js/formSchemas';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';
import SchemaForm from './elementi/SchemaForm.vue';

const store = inject('store');
const stateSegnalazione = inject('stateSegnalazione');
const stateGalleria = inject('stateGalleria');
const stateModuloSegnalazione = inject('stateModuloSegnalazione');
const schedaRegistrata = ref(false);
const segnalazioneFields = SEGNALAZIONE_FIELDS;

const schedaVuota = computed(() => isSchemaEmpty(segnalazioneFields, stateModuloSegnalazione));

async function salvaScheda() {
  console.log('salva scheda');
  if (stateGalleria.idImgSelezionate) {
    if (schedaVuota.value) {
      store.methods.setAlert('Non è possibile salvare una scheda vuota');
      return;
    }
    impostaMetadati();
    const jsonReq = impostaOggetti(Object.entries(stateModuloSegnalazione), stateGalleria.idImgSelezionate);
    console.log(jsonReq);
    const resp = await compilaScheda(jsonReq);
    if (resp.success) {
      store.methods.setAlert('Operazione andata a buon fine');
      chiudiScheda();
    }
    else {
      store.methods.setAlert('Operazione non riuscita');
    }
  }
  else {
    store.methods.setAlert('Nessun ID associato alla scheda. Selezionare un elemento e riprovare.');
    chiudiScheda();
  }
}

function chiudiScheda() {
  stateSegnalazione.moduloSegnalazioneVisibile = false;
  resetState();
}

function resetState() { // QUESTA MAGARI SI PUÒ SPOSTARE SU TABCOLLECTION
  resetSchemaState(segnalazioneFields, stateModuloSegnalazione);
  stateModuloSegnalazione.id_segnalazione = null;
  stateModuloSegnalazione.data_registrazione = null;
  stateModuloSegnalazione.data_ultima_mod = null;
  stateModuloSegnalazione.autore_scheda = null;
  stateModuloSegnalazione.autore_ultima_mod = null;
  schedaRegistrata.value = false;
}

function impostaMetadati() {
  stateModuloSegnalazione.id_segnalazione = dataInteger();
  stateModuloSegnalazione.data_registrazione = dataCorta();
  stateModuloSegnalazione.data_ultima_mod = dataCorta();
  stateModuloSegnalazione.autore_scheda = store.state.userSettings.user_id;
  stateModuloSegnalazione.autore_ultima_mod = store.state.userSettings.user_id;
}

function impostaOggetti(stateArray, idMain10ance) {
  const listaOgg = [];
  idMain10ance.forEach((id, ind) => {
    const ogg = {
      tabella: 'segnalazione',
      colonne: [],
      valori: [],
    };
    stateArray.forEach(stateVal => {
      console.log(stateVal);
      if (stateVal[1]) {
        ogg.colonne.push(stateVal[0]);
        ogg.valori.push(stateVal[1]);
      }
    });
    ogg.valori[ogg.colonne.indexOf('id_segnalazione')] += ind;
    ogg.colonne.push('id_main10ance');
    ogg.valori.push(id);
    listaOgg.push(ogg);
  });

  return listaOgg;
}

function setSchemaField(key, value) {
  stateModuloSegnalazione[key] = value;
}
</script>

<style scoped>
textarea {
  resize: vertical;
}
input, textarea {
  float: right;
  line-height: 100%;
  padding: 1px;
  border: 0;
}
.scheda-anagrafica {
  background-color: var(--bluInterregTrasparenza);
  font-size: 13px;
  padding: 30px 14px;
}
.float-dx {
  float: right;
}
.user-field {
  line-height: 100%;
  padding: 0px;
  text-align: right;
}
.div-titolo-bottoni {
  position: relative;
}
.div-bottoni {
  position: absolute;
  bottom: -1rem;
  right: 0;
}
</style>

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
      <p><b>Condizioni ambientali:</b></p>
      <label><b>METEO</b></label>
      <input v-model="meteo" :disabled="schedaRegistrata">
      <br />
      <label><b>TEMPERATURA</b></label>
      <input v-model="temperatura" :disabled="schedaRegistrata">
      <br />
      <label><b>SETTIMANA PRECEDENTE</b></label>
      <input v-model="condizioni_sett_precedente" :disabled="schedaRegistrata">
      <br />
      <br />
      <label><b>DESCRIZIONE</b></label>
      <textarea v-model="descrizione" :disabled="schedaRegistrata" style="height: 20px;"></textarea>
      <br />
      <label><b>INTERVENTO URGENTE</b></label>
      <textarea v-model="intervento_urgenza" :disabled="schedaRegistrata" style="height: 20px;"></textarea>
      <br />
    </div>
  </div>
</div>
</template>

<script>
import { inject, toRefs, computed, ref } from 'vue';
import {dataCorta, dataInteger} from '../js/shared';
import {compilaScheda} from '../js/richieste';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';

export default {
  name: 'TabCollectionModuloSegnalazione',
  components: {
    BtnBIM,
  },
  setup() {
    const store = inject('store');
    const stateSegnalazione = inject('stateSegnalazione');
    const stateGalleria = inject('stateGalleria');
    const stateModuloSegnalazione = inject('stateModuloSegnalazione');
    const schedaRegistrata = ref(false);

    const schedaVuota = computed(() => {
      return !(stateModuloSegnalazione.meteo || stateModuloSegnalazione.temperatura || stateModuloSegnalazione.condizioni_sett_precedente || stateModuloSegnalazione.descrizione || stateModuloSegnalazione.intervento_urgenza);
    });

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
      stateModuloSegnalazione.meteo = '';
      stateModuloSegnalazione.temperatura = '';
      stateModuloSegnalazione.condizioni_sett_precedente = '';
      stateModuloSegnalazione.descrizione = '';
      stateModuloSegnalazione.intervento_urgenza = '';
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

    return {
      store,
      schedaRegistrata,
      ...toRefs(stateModuloSegnalazione),
      salvaScheda,
      resetState,
      chiudiScheda,
      dataCorta,
    }
  }
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

<template>
<div>
  <div class="scheda-anagrafica">
    <div class="div-titolo-bottoni">
      <div class="float-dx div-bottoni">
        <BtnBIM @click="salvaScheda" icona="glyphicon-floppy-disk" nome="salvaScAnagLOD4" title="Salva" colore="blu" />
        <BtnBIM @click="resetState" icona="glyphicon-erase" nome="annullaDBLOD4" title="Cancella tutti i campi" colore="blu" />
        <BtnBIM @click="chiudiScheda" icona="glyphicon-remove" nome="chiudiScAnagLOD4" title="Annulla" colore="blu" />
      </div>
      <h4><b>SCHEDA ANAGRAFICA</b></h4>
    </div>
    <br />
    <label><b>OPERATORE</b></label>
    <p class="user-field float-dx">{{store.state.userSettings.user_id}}</p>
    <br />
    <label><b>DESCRIZIONE SISTEMA</b></label>
    <textarea v-model="descrizione_sistema" :disabled="schedaRegistrata" style="height: 20px;"></textarea>
    <br />
    <label><b>DESCRIZIONE SUBSISTEMA</b></label>
    <textarea v-model="descrizione_subsistema" :disabled="schedaRegistrata" style="height: 20px;"></textarea>
    <br />
    <label><b>TECNICA COSTRUTTIVA</b></label>
    <input v-model="tecnica_costruttiva" :disabled="schedaRegistrata">
    <br />
    <label><b>DIMENSIONI</b></label>
    <input v-model="dimensioni" :disabled="schedaRegistrata">
    <br />
    <label><b>MATERIALE/I</b></label>
    <input v-model="materiale" :disabled="schedaRegistrata">
    <br />
    <label><b>EPOCA</b></label>
    <input v-model="epoca" :disabled="schedaRegistrata">
    <br />
    <label><b>ISPEZIONABILITÀ</b></label>
    <input v-model="ispezionabilità" :disabled="schedaRegistrata">
    <br />
    <label><b>FONTI</b></label>
    <input v-model="fonti" :disabled="schedaRegistrata">
    <br />
  </div>
</div>
</template>

<script>
import { inject, toRefs, computed, ref } from 'vue';
import {dataCorta, dataInteger} from '../js/shared';
import {compilaScheda} from '../js/richieste';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';

export default {
  name: 'TabCollectionModuloAnagrafica',
  components: {
    BtnBIM,
  },
  setup() {
    const store = inject('store');
    const stateAnagrafica = inject('stateAnagrafica');
    const stateGalleria = inject('stateGalleria');
    const stateModuloAnagrafica = inject('stateModuloAnagrafica');
    const schedaRegistrata = ref(false);

    const schedaVuota = computed(() => {
      return !(stateModuloAnagrafica.descrizione_sistema || stateModuloAnagrafica.descrizione_subsistema || stateModuloAnagrafica.tecnica_costruttiva || stateModuloAnagrafica.dimensioni || stateModuloAnagrafica.materiale || stateModuloAnagrafica.epoca || stateModuloAnagrafica.ispezionabilità || stateModuloAnagrafica.fonti);
    });

    async function salvaScheda() {
      console.log('salva scheda');
      if (stateGalleria.idImgSelezionate) {
        if (schedaVuota.value) {
          store.methods.setAlert('Non è possibile salvare una scheda vuota');
          return;
        }
        impostaMetadati();
        const jsonReq = impostaOggetti(Object.entries(stateModuloAnagrafica), stateGalleria.idImgSelezionate);
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
      stateAnagrafica.moduloAnagraficaVisibile = false;
      resetState();
    }

    function resetState() { // QUESTA MAGARI SI PUÒ SPOSTARE SU TABCOLLECTION
      stateModuloAnagrafica.descrizione_sistema = '';
      stateModuloAnagrafica.descrizione_subsistema = '';
      stateModuloAnagrafica.tecnica_costruttiva = '';
      stateModuloAnagrafica.dimensioni = '';
      stateModuloAnagrafica.materiale = '';
      stateModuloAnagrafica.epoca = '';
      stateModuloAnagrafica.ispezionabilità = '';
      stateModuloAnagrafica.fonti = '';
      stateModuloAnagrafica.id_anagr = null;
      stateModuloAnagrafica.data_registrazione = null;
      stateModuloAnagrafica.data_ultima_mod = null;
      stateModuloAnagrafica.autore_scheda = null;
      stateModuloAnagrafica.autore_ultima_mod = null;
      schedaRegistrata.value = false;
    }

    function impostaMetadati() {
      stateModuloAnagrafica.id_anagr = dataInteger();
      stateModuloAnagrafica.data_registrazione = dataCorta();
      stateModuloAnagrafica.data_ultima_mod = dataCorta();
      stateModuloAnagrafica.autore_scheda = store.state.userSettings.user_id;
      stateModuloAnagrafica.autore_ultima_mod = store.state.userSettings.user_id;
    }

    function impostaOggetti(stateArray, idMain10ance) {
      const listaOgg = [];
      idMain10ance.forEach((id, ind) => {
        const ogg = {
          tabella: 'scheda_anagrafica',
          colonne: [],
          valori: [],
        };
        stateArray.forEach(stateVal => {
          if (stateVal[1]) {
            ogg.colonne.push(stateVal[0]);
            ogg.valori.push(stateVal[1]);
          }
        });
        ogg.valori[ogg.colonne.indexOf('id_anagr')] += ind;
        ogg.colonne.push('id_main10ance');
        ogg.valori.push(id);
        listaOgg.push(ogg);
      });

      return listaOgg;
    }

    return {
      store,
      schedaRegistrata,
      ...toRefs(stateModuloAnagrafica),
      salvaScheda,
      resetState,
      chiudiScheda,
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

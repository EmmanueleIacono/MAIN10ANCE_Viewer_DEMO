<template>
  <div class="scheda-anagrafica">
    <div class="div-titolo-bottoni">
      <div class="float-dx div-bottoni">
        <BtnBIM @click="salvaScheda" icona="glyphicon-floppy-disk" nome="salvaScAnag" title="Salva" colore="giallo" />
        <BtnBIM @click="chiudiScheda" icona="glyphicon-remove" nome="chiudiScAnag" title="Salva" colore="giallo" />
      </div>
      <h4><b>SCHEDA ANAGRAFICA</b></h4>
    </div>
    <br />
    <label><b>OPERATORE</b></label>
    <p class="user-field float-dx">{{store.state.userSettings.user_id}}</p>
    <br />
    <label><b>DESCRIZIONE SISTEMA</b></label>
    <textarea v-model="descrizione_sistema" style="height: 20px;"></textarea>
    <br />
    <label><b>DESCRIZIONE SUBSISTEMA</b></label>
    <textarea v-model="descrizione_subsistema" style="height: 20px;"></textarea>
    <br />
    <label><b>TECNICA COSTRUTTIVA</b></label>
    <input v-model="tecnica_costruttiva">
    <br />
    <label><b>DIMENSIONI</b></label>
    <input v-model="dimensioni">
    <br />
    <label><b>MATERIALE/I</b></label>
    <input v-model="materiale">
    <br />
    <label><b>EPOCA</b></label>
    <input v-model="epoca">
    <br />
    <label><b>ISPEZIONABILITÀ</b></label>
    <input v-model="ispezionabilità">
    <br />
    <label><b>FONTI</b></label>
    <input v-model="fonti">
    <br />
  </div>
</template>

<script>
import { inject, reactive, toRefs } from 'vue';
import {dataCorta, dataInteger} from '../js/shared';
import {compilaScheda} from '../js/richieste';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';

export default {
  name: 'TabBIMModuloAnagrafica',
  components: {
    BtnBIM,
  },
  setup() {
    const store = inject('store');
    const state = reactive({
      descrizione_sistema: '',
      descrizione_subsistema: '',
      tecnica_costruttiva: '',
      dimensioni: '',
      materiale: '',
      epoca: '',
      ispezionabilità: '',
      fonti: '',
      id_anagr: null,
      data_registrazione: null,
      data_ultima_mod: null,
      autore_scheda: null,
      autore_ultima_mod: null,
    });

    async function salvaScheda() {
      if (store.stateBIM.elementiSelezionati) {
        impostaMetadati();
        const jsonReq = impostaOggetti(Object.entries(state), store.stateBIM.elementiSelezionati);
        const resp = await compilaScheda(jsonReq);
        console.log(resp);
      }
      else {
        store.methods.setAlert('Nessun ID associato alla scheda. Selezionare un elemento e riprovare.');
        chiudiScheda();
      }
    }

    function chiudiScheda() {
      store.stateBIM.schedeModuliVisibile = false;
      resetState();
    }

    function resetState() {
      state.descrizione_sistema = '';
      state.descrizione_subsistema = '';
      state.tecnica_costruttiva = '';
      state.dimensioni = '';
      state.materiale = '';
      state.epoca = '';
      state.ispezionabilità = '';
      state.fonti = '';
      state.id_anagr = null;
      state.data_registrazione = null;
      state.data_ultima_mod = null;
      state.autore_scheda = null;
      state.autore_ultima_mod = null;
    }

    function impostaMetadati() {
      state.id_anagr = dataInteger();
      state.data_registrazione = dataCorta();
      state.data_ultima_mod = dataCorta();
      state.autore_scheda = store.state.userSettings.user_id;
      state.autore_ultima_mod = store.state.userSettings.user_id;
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
      ...toRefs(state),
      salvaScheda,
      chiudiScheda,
    }
  }
}
</script>

<style scoped>
input, textarea {
  float: right;
  line-height: 100%;
  padding: 1px;
  border: 0;
}
.scheda-anagrafica {
  background-color: var(--gialloAnagraficaTrasparenza);
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

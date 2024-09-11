<template>
<BtnBIM @click="addMarkerAmbito" v-if="verificaDisplayAdd()" class="btn-gis" icona="glyphicon-plus" nome="addMarkerAmbito" title="Aggiungi località al tuo ambito" colore="blu" />
<!-- ^ in alternativa il BtnBIM per add si poteva fare usando icona glyphicon-map-marker -->
<BtnBIM @click="confermaMarkerAmbito" v-if="verificaDisplayConf()" class="btn-gis" icona="glyphicon-ok" nome="confMarkerAmbito" title="Conferma" colore="blu" />
<BtnBIM @click="salvaMarkerAmbito" v-if="verificaDisplaySalva()" class="btn-gis" icona="glyphicon-floppy-disk" nome="salvaMarkerAmbito" title="Salva" colore="blu" />
<BtnBIM @click="annullaAddMarkerAmbito" v-if="verificaDisplayAnnulla()" class="btn-gis" icona="glyphicon-remove" nome="annullaMarkerAmbito" title="Annulla" colore="blu" />
<div v-if="verificaDisplaySalva()" id="campo-dati-marker">
  <!-- PER ORA NON FUNZIONANTE, MA SE IMPLEMENTATO QUESTO, IMPLEMENTARE ANCHE SELETTORE LOC PER QUANDO INSERISCO EDIF -->
  <label class="nome" for="select-tabella">Tipologia marker:</label>
  <select class="valore" id="select-tabella" v-model="tabella">
    <option value="dati_località">Località</option>
    <option value="dati_edifici">Edificio</option>
  </select>
  <br />
  <div v-if="tabella === 'dati_località'">
    <label class="nome" for="input-loc-nome">Nome:</label>
    <input class="valore" id="input-loc-nome" v-model="datiLocalità.nome" placeholder="Nome" />
    <br />
    <label class="nome" for="input-sigla">Sigla:</label>
    <input class="valore" id="input-sigla" v-model="datiLocalità.sigla" placeholder="Sigla" />
    <br />
  </div>
  <div v-if="tabella === 'dati_edifici'">
    <label class="nome" for="input-nome">Nome:</label>
    <input class="valore" id="input-nome" v-model="datiEdificio.nome" placeholder="Nome" />
    <br />
    <label class="nome" for="input-sigla">Sigla:</label>
    <input class="valore" id="input-sigla" v-model="datiEdificio.sigla" placeholder="Sigla" />
    <br />
    <label class="nome" for="input-descrizione">Descrizione:</label>
    <input class="valore" id="input-descrizione" v-model="datiEdificio.descrizione" placeholder="Descrizione" />
    <br />
    <label class="nome" for="input-numero">Numero:</label>
    <input class="valore" id="input-numero" type="number" v-model="datiEdificio.numero" min="0" step="1">
    <br />
    <label class="nome" for="input-edificio">Edificio:</label>
    <input class="valore" id="input-edificio" v-model="datiEdificio.edificio" placeholder="Edificio" />
    <br />
    <label class="nome" for="input-nome_menu">Nome per menu:</label>
    <input class="valore" id="input-nome_menu" v-model="datiEdificio.edif_nome_menu" placeholder="Nome menu" />
    <br />
  </div>
</div>
</template>
<script>
import { inject, reactive, toRefs } from 'vue';
import {/*mappaGlb, creaLivelloGIS,*/ rimuoviMarkerTemporaneo} from '../js/GIS';
import {creaNuovoMarkerAmbito} from '../js/richieste';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';

export default {
  name: 'TabGISAddMarkerAmbito',
  components: {
    BtnBIM,
  },

  setup(props, {emit}) {
    const store = inject('store');
    const nuovoMarker = inject('nuovoMarker');
    const coordMarker = inject('coordMarker');
    const state = reactive({
      // nuovoMarker: null,
      // coordMarker: null,
      datiLocalità: {
        nome: '',
        sigla: '',
        // capire come aggiungere edifici associati da interfaccia, se necessario // 18/06/2024: FORSE NON NECESSARIO, MAI USATI
      },
      datiEdificio: {
        località: '',
        nome: '', // se un solo edificio, potrebbe essere uguale a "edif_nome_menu"
        sigla: '',
        descrizione: '',
        numero: 0,
        edificio: '',
        edif_nome_menu: '',
      },
      tabella: 'dati_edifici',
      confirmModeMkAmbito: false,
    });

    async function addMarkerAmbito() {
      const conferma = await store.methods.setConfirm(`Vuoi aggiungere un nuovo marker all'ambito "${store.getters.getUsrInfoAmbito().ambito_full_name}"?`);
      if (conferma) {
        store.methods.setEditModeMkAmbitoGIStrue();
      }
    }

    function confermaMarkerAmbito() {
      if (!nuovoMarker.value) {
        store.methods.setAlert('Impossibile continuare senza aver impostato un punto.');
        return;
      }
      console.log(coordMarker.value.lat);
      console.log(coordMarker.value.lng);
      store.methods.setEditModeMkAmbitoGISfalse();
      state.confirmModeMkAmbito = true;
    }

    async function salvaMarkerAmbito() {
      if (
        (!isDatiEdificioValidi() && state.tabella === "dati_edifici") ||
        (!isDatiLocalitàValidi() && state.tabella === "dati_località")
      ) {
        store.methods.setAlert('Impossibile continuare senza aver impostato correttamente tutti i dati.');
        return;
      }
      store.methods.setEditModeGISfalse();
      state.confirmMode = false;
      const markerJson = {
        tabella: state.tabella,
        coord: coordMarker.value,
        nome: state.datiEdificio.nome,
        sigla: state.datiEdificio.sigla,
        descrizione: state.datiEdificio.descrizione,
        numero: state.datiEdificio.numero,
        edificio: state.datiEdificio.edificio,
        edif_nome_menu: state.datiEdificio.edif_nome_menu,
        ambito: store.getters.getUsrInfoAmbito().ambito
      };
      console.log(markerJson);
      const res = await creaNuovoMarkerAmbito(markerJson);
      if (res) {
        store.methods.setAlert('Operazione andata a buon fine.');
        emit('updateMappa');
      }
      else store.methods.setAlert('Operazione non riuscita, riprovare.');
    }

    function annullaAddMarkerAmbito() {
      store.methods.setEditModeMkAmbitoGISfalse();
      rimuoviMarkerTemporaneo();
      state.confirmModeMkAmbito = false;
      resetStateMarker();
    }

    function verificaDisplayAdd() {
      return store.getters.getUsrVwList().includes('addMarkerAmbitoGIS') && !store.stateGIS.editModeMkAmbito && !state.confirmModeMkAmbito;
    }

    function verificaDisplayConf() {
      return store.getters.getUsrVwList().includes('addMarkerAmbitoGIS') && store.stateGIS.editModeMkAmbito && !state.confirmModeMkAmbito;
    }

    function verificaDisplaySalva() {
      return store.getters.getUsrVwList().includes('addMarkerAmbitoGIS') && !store.stateGIS.editModeMkAmbito && state.confirmModeMkAmbito;
    }

    function verificaDisplayAnnulla() {
      return store.getters.getUsrVwList().includes('addMarkerAmbitoGIS') && (!(!store.stateGIS.editModeMkAmbito && !state.confirmModeMkAmbito));
    }

    function resetStateMarker() {
      nuovoMarker.value = null;
      coordMarker.value = null;
    }

    function isDatiEdificioValidi() {
      return (
        state.datiEdificio.nome &&
        state.datiEdificio.sigla &&
        state.datiEdificio.descrizione &&
        state.datiEdificio.numero >= 0 &&
        state.datiEdificio.edificio &&
        state.datiEdificio.edif_nome_menu
      );
}

function isDatiLocalitàValidi() {
  return state.datiLocalità.nome && state.datiLocalità.sigla;
}

    return {
      props,
      ...toRefs(state),
      addMarkerAmbito,
      confermaMarkerAmbito,
      salvaMarkerAmbito,
      annullaAddMarkerAmbito,
      verificaDisplayAdd,
      verificaDisplayConf,
      verificaDisplaySalva,
      verificaDisplayAnnulla,
    }
  }
}
</script>
<style scoped>
.btn-gis ~ .btn-gis {
  margin-left: .9rem;
}

.valore {
  float: right;
}
</style>

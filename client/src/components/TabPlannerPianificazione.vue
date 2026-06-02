<template>
<Card>
  <Details summary="PIANIFICAZIONE CONTROLLI E MANUTENZIONI" :open="false" class="loading-wrapper">
    <LoadingScreen :caricamento="state.caricamento" />
    <button @click="programmaControlli" class="bottone-main10ance bottone-prog">Salva</button>
      <br />
    <div class="main-container">
      <label for="select-localita-prog">Località</label>
      <select v-model="state.selectLocalita" id="select-localita-prog">
        <option value=""></option>
        <option v-for="loc in store.statePlanner.listaSigleLoc" :key="loc.sigla" :value="loc.sigla">{{loc.nome}}</option>
      </select>
      <br />
      <br />
      <div><b>Edificio</b></div>
      <div id="div-edificio-prog">
        <div class="checkbox-edifici checkbox-edifici-tutti">
          <input v-model="tuttiEdificiSelezionati" id="check-edif-prog-tutti" type="checkbox">
          <label for="check-edif-prog-tutti">Completa (seleziona tutti)</label>
        </div>
        <div v-for="s in state.listaSigleEdificiFiltrata" :key="s.edificio" class="checkbox-edifici">
          <input v-model="state.listaSigleEdificiSelezionati" :id="`check-edif-prog-${s.edificio}`" :value="s.edificio" type="checkbox">
          <label :for="`check-edif-prog-${s.edificio}`">{{s.edif_nome_menu}}</label>
        </div>
      </div>
      <br />
      <div class="ambito-wrapper">
        <div><b>Ambito</b></div>
        <div class="opzioni-ambito">
          <button
            v-for="ambito in state.listaAmbiti"
            :key="`btn-${ambito.id}`"
            type="button"
            class="opzione-ambito"
            :class="{'opzione-ambito-selezionata': state.selectAmbito === ambito.id}"
            @click="selezionaAmbito(ambito.id)"
          >
            <span>{{ambito.nome}}</span>
            <span class="pallino-ambito" :style="{backgroundColor: ambito.colore}"></span>
          </button>
        </div>
      </div>
      <br />
      <div v-if="state.selectAmbito" class="ambito-wrapper">
        <div><b>Necessità supporto</b></div>
        <div class="opzioni-ambito">
          <button
            v-for="ambito in listaAmbitiSupporto"
            :key="`btn-supporto-${ambito.id}`"
            type="button"
            class="opzione-ambito"
            :class="{'opzione-ambito-selezionata': state.selectAmbitoSupporto === ambito.id}"
            @click="selezionaAmbitoSupporto(ambito.id)"
          >
            <span>{{ambito.nome}}</span>
            <span class="pallino-ambito" :style="{backgroundColor: ambito.colore}"></span>
          </button>
        </div>
      </div>
      <br v-if="state.selectAmbito" />
      <table class="tabella-prog-controlli tabella-attivita-cicliche">
        <caption class="caption-prog-controlli"><b>Pianificazione attività cicliche</b></caption>
        <thead>
          <tr>
            <th><b>Attività</b></th>
            <th><b>Frequenza (mesi)</b></th>
            <th><b>Inizio ciclo</b></th>
            <th><b>Durata prevista (gg - 5gg/sett)</b></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(attivita, ind) in state.datiAttivitaCicliche" :key="attivita.id">
            <td><b>{{attivita.nome}}</b></td>
            <td>
              <input
                v-model="state.datiAttivitaCicliche[ind].freq_mesi"
                type="number"
                min="1"
                step="1"
                inputmode="numeric"
                @input="normalizzaIntero(state.datiAttivitaCicliche[ind], 'freq_mesi')"
              >
            </td>
            <td>
              <input v-model="state.datiAttivitaCicliche[ind].data_inizio" type="date">
            </td>
            <td>
              <input
                v-model="state.datiAttivitaCicliche[ind].durata_prevista_gg"
                type="number"
                min="1"
                step="1"
                inputmode="numeric"
                @input="normalizzaIntero(state.datiAttivitaCicliche[ind], 'durata_prevista_gg')"
              >
            </td>
          </tr>
        </tbody>
      </table>
      <br />
    </div>
  </Details>
</Card>
</template>

<script setup>
import {reactive, watch, inject, computed} from 'vue';
import {registraPianificazioneControlliManutenzioni} from '../js/richieste';
import Details from './elementi/Details.vue';
import LoadingScreen from './elementi/LoadingScreen.vue';
import Card from './elementi/Card.vue';

const emit = defineEmits(['pianificazioneAggiornata']);

const store = inject('store');
const state = reactive({
  caricamento: false,
  selectLocalita: '',
  selectAmbito: '',
  selectAmbitoSupporto: '',
  listaAmbiti: [
    {id: 'cops', nome: 'Coperture e Sistemi di regimazione delle acque', colore: '#9b51e0'},
    {id: 'app_dec', nome: 'Apparati decorativi', colore: '#2f80ed'},
    {id: 'pavs', nome: 'Sentieri, pavimentazioni esterne, muretti', colore: '#707070'},
  ],
  listaSigleEdificiFiltrata: [],
  listaSigleEdificiSelezionati: [],
  datiAttivitaCicliche: [
    {id: 'co', nome: 'CO - Controllo', freq_mesi: '', data_inizio: '', durata_prevista_gg: ''},
    {id: 'mo', nome: 'MO - Manutenzione ordinaria', freq_mesi: '', data_inizio: '', durata_prevista_gg: ''},
    {id: 'ms', nome: 'MS - Manutenzione straordinaria', freq_mesi: '', data_inizio: '', durata_prevista_gg: ''},
  ],
});

const tuttiEdificiSelezionati = computed({
  get() {
    return !!state.listaSigleEdificiFiltrata.length && state.listaSigleEdificiSelezionati.length === state.listaSigleEdificiFiltrata.length;
  },
  set(selezionaTutti) {
    state.listaSigleEdificiSelezionati = selezionaTutti ? state.listaSigleEdificiFiltrata.map(s => s.edificio) : [];
  },
});

const listaAmbitiSupporto = computed(() => state.listaAmbiti.filter(ambito => ambito.id !== state.selectAmbito));

watch(() => state.selectAmbito, newVal => {
  if (!newVal || state.selectAmbitoSupporto === newVal) state.selectAmbitoSupporto = '';
});

watch(() => state.selectLocalita, newVal => {
  const listaSigleEdificiFiltrata = store.statePlanner.listaSigleEdifici.filter(s => s.localita === newVal);
  state.listaSigleEdificiFiltrata = listaSigleEdificiFiltrata;
  state.listaSigleEdificiSelezionati = [];
});

async function programmaControlli() {
  if (!controllaSelezioni()) {
    store.methods.setAlert('Dati incompleti: è necessario selezionare una località, almeno un edificio, e un ambito operativo.');
    return;
  }

  const attivitaComplete = state.datiAttivitaCicliche.filter(attivitaCompleta);
  if (!attivitaComplete.length) {
    store.methods.setAlert('Dati incompleti: è necessario pianificare almeno una tipologia di attività.');
    return;
  }

  azzeraAttivitaIncomplete();
  state.caricamento = true;
  try {
    const res = await registraPianificazioneControlliManutenzioni(raccogliDatiPianificazione(attivitaComplete));
    if (res.success) {
      store.methods.setAlert('Programmazione andata a buon fine');
      emit('pianificazioneAggiornata');
    }
    else {
      store.methods.setAlert('ATTENZIONE: Si è verificato un errore durante la registrazione dei dati');
    }
  }
  catch(e) {
    store.methods.setAlert(e);
  }
  finally {
    state.caricamento = false;
  }
}

function controllaSelezioni() {
  return state.selectLocalita && !!state.listaSigleEdificiSelezionati.length && state.selectAmbito;
}

function valoreInteroValido(valore) {
  return Number.isInteger(Number(valore)) && Number(valore) > 0;
}

function attivitaCompleta(attivita) {
  return valoreInteroValido(attivita.freq_mesi) && !!attivita.data_inizio && valoreInteroValido(attivita.durata_prevista_gg);
}

function azzeraAttivita(attivita) {
  attivita.freq_mesi = '';
  attivita.data_inizio = '';
  attivita.durata_prevista_gg = '';
}

function azzeraAttivitaIncomplete() {
  state.datiAttivitaCicliche.filter(attivita => !attivitaCompleta(attivita)).forEach(azzeraAttivita);
}

function raccogliDatiPianificazione(attivitaComplete) {
  return {
    localita: state.selectLocalita,
    edifici: [...state.listaSigleEdificiSelezionati],
    ambito_operativo: state.selectAmbito,
    necessita_supporto: state.selectAmbitoSupporto || null,
    attivita: attivitaComplete.map(attivita => ({
      tipo_attivita: attivita.id,
      descrizione_attivita: attivita.nome,
      frequenza_mesi: Number(attivita.freq_mesi),
      data_inizio: attivita.data_inizio,
      durata_prevista_gg: Number(attivita.durata_prevista_gg),
    })),
  };
}

function normalizzaIntero(oggetto, campo) {
  const valore = String(oggetto[campo]).split(/[.,eE+-]/)[0].replace(/\D/g, '');
  oggetto[campo] = valore ? Number(valore) : '';
}

function selezionaAmbito(idAmbito) {
  state.selectAmbito = state.selectAmbito === idAmbito ? '' : idAmbito;
}

function selezionaAmbitoSupporto(idAmbito) {
  state.selectAmbitoSupporto = state.selectAmbitoSupporto === idAmbito ? '' : idAmbito;
}
</script>

<style scoped>
select {
  margin-left: 1rem;
}
input[type=checkbox] {
  margin-right: .4rem;
}
td, th {
  border: 1px solid #dddddd;
  padding: 8px;
}
tr:nth-child(even) {
  background-color: var(--verdeMain10anceTrasparenza2);
}
tr:nth-child(odd) {
  background-color: var(--verdeMain10anceTrasparenza3);
}
.main-container {
  margin-top: 10px;
}
.bottone-prog {
  float: right;
}
.bottone-prog:hover {
  background-color: var(--verdeMain10anceTrasparenza);
}
.tabella-prog-controlli {
  table-layout: fixed;
  width: 100%;
  word-wrap: normal;
}
.tabella-prog-controlli th, .tabella-prog-controlli td {
  width: 90%;
  max-width: 50px;
  word-break: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tabella-prog-controlli input {
  width: 90%
}
.checkbox-edifici {
  flex: 0 0 25%;
}
.checkbox-edifici-tutti {
  flex-basis: 100%;
  font-weight: bold;
  margin-bottom: 0.35rem;
}
#div-edificio-prog {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.ambito-wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.ambito-wrapper > div:first-child {
  flex: 0 0 9rem;
}
.opzioni-ambito {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  flex: 1 1 22rem;
}
.opzione-ambito {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.45rem;
  border: 1px solid var(--verdeMain10anceTrasparenza);
  border-radius: 3px;
  padding: 0.2rem 0.45rem;
  min-height: 2rem;
  color: inherit;
  background-color: transparent;
  cursor: pointer;
}
.opzione-ambito-selezionata,
.opzione-ambito:hover {
  background-color: var(--verdeMain10anceTrasparenza2);
}
.pallino-ambito {
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 50%;
  flex: 0 0 0.9rem;
}
.tabella-attivita-cicliche td:first-child {
  text-align: left;
}
.caption-prog-controlli {
  color: unset;
  text-align: center;
  background-color: var(--verdeMain10anceTrasparenza);
}
</style>

<template>
<Card>
  <Details summary="PIANIFICAZIONE CONTROLLI E MANUTENZIONI" :open="false" class="loading-wrapper">
    <LoadingScreen :caricamento="caricamento" />
    <button @click="programmaControlli" class="bottone-main10ance bottone-prog">Salva</button>
      <br />
    <div class="main-container">
      <label for="select-localita-prog">Località</label>
      <select v-model="selectLocalita" id="select-localita-prog">
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
        <div v-for="s in listaSigleEdificiFiltrata" :key="s.edificio" class="checkbox-edifici">
          <input v-model="listaSigleEdificiSelezionati" :id="`check-edif-prog-${s.edificio}`" :value="s.edificio" type="checkbox">
          <label :for="`check-edif-prog-${s.edificio}`">{{s.edif_nome_menu}}</label>
        </div>
      </div>
      <br />
      <div class="ambito-wrapper">
        <div><b>Ambito</b></div>
        <div class="opzioni-ambito">
          <button
            v-for="ambito in listaAmbiti"
            :key="`btn-${ambito.id}`"
            type="button"
            class="opzione-ambito"
            :class="{'opzione-ambito-selezionata': selectAmbito === ambito.id}"
            @click="selezionaAmbito(ambito.id)"
          >
            <span>{{ambito.nome}}</span>
            <span class="pallino-ambito" :style="{backgroundColor: ambito.colore}"></span>
          </button>
        </div>
      </div>
      <br />
      <div v-if="selectAmbito" class="ambito-wrapper">
        <div><b>Necessità supporto</b></div>
        <div class="opzioni-ambito">
          <button
            v-for="ambito in listaAmbitiSupporto"
            :key="`btn-supporto-${ambito.id}`"
            type="button"
            class="opzione-ambito"
            :class="{'opzione-ambito-selezionata': selectAmbitoSupporto === ambito.id}"
            @click="selezionaAmbitoSupporto(ambito.id)"
          >
            <span>{{ambito.nome}}</span>
            <span class="pallino-ambito" :style="{backgroundColor: ambito.colore}"></span>
          </button>
        </div>
      </div>
      <br v-if="selectAmbito" />
      <table class="tabella-prog-controlli tabella-attivita-cicliche">
        <caption class="caption-prog-controlli"><b>Pianificazione attività cicliche</b></caption>
        <tr>
          <th><b>Attività</b></th>
          <th><b>Frequenza (mesi)</b></th>
          <th><b>Inizio ciclo</b></th>
          <th><b>Durata prevista (gg - 5gg/sett)</b></th>
        </tr>
        <tr v-for="(attivita, ind) in datiAttivitaCicliche" :key="attivita.id">
          <td><b>{{attivita.nome}}</b></td>
          <td>
            <input
              v-model="datiAttivitaCicliche[ind].freq_mesi"
              type="number"
              min="1"
              step="1"
              inputmode="numeric"
              @input="normalizzaIntero(datiAttivitaCicliche[ind], 'freq_mesi')"
            >
          </td>
          <td>
            <input v-model="datiAttivitaCicliche[ind].data_inizio" type="date">
          </td>
          <td>
            <input
              v-model="datiAttivitaCicliche[ind].durata_prevista_gg"
              type="number"
              min="1"
              step="1"
              inputmode="numeric"
              @input="normalizzaIntero(datiAttivitaCicliche[ind], 'durata_prevista_gg')"
            >
          </td>
        </tr>
      </table>
      <br />
      <!-- SELECT ENTITA' -->
      <!-- <div class="select-wrapper">
        <input type="checkbox" id="cbx-cl-ogg" v-model="stateCheckBx.clOgg">
        <label for="cbx-cl-ogg">Classe oggetti</label>
        <select v-model="selectClOgg" id="select-cl-ogg">
          <option value=""></option>
          <option v-for="cl in store.statePlanner.listaClOgg" :key="cl.unnest" :value="cl.unnest">{{cl.unnest}}</option>
        </select>
      </div>
      <br /> -->
      <!-- SELECT ENTITA' -->
      <!-- <div class="select-wrapper">
        <input type="checkbox" id="cbx-entita" v-model="stateCheckBx.Ent">
        <label for="cbx-entita">Entità</label>
        <select v-model="selectEntità" id="select-entita">
          <option value=""></option>
          <option v-for="el in store.statePlanner.listaElementi" :key="el.tabella" :value="el.tabella">{{el.alias}}</option>
        </select>
      </div>
      <br /> -->
      <!-- SELECT AGGREGATORI -->
      <!-- <div class="select-wrapper">
        <input type="checkbox" id="cbx-aggr" v-model="stateCheckBx.Aggr">
        <label for="cbx-aggr">Aggregatori</label>
        <select v-model="selectAggregatori" id="select-aggr">
          <option value=""></option> -->
          <!-- TO DO -->
          <!-- <option v-for="el in store.statePlanner.listaElementi" :key="el.tabella" :value="el.tabella">{{el.alias}}</option> -->
        <!-- </select>
      </div>
      <br /> -->
      <!-- SELECT TEMI -->
      <!-- <div class="select-wrapper">
        <input type="checkbox" id="cbx-temi" v-model="stateCheckBx.Temi">
        <label for="cbx-temi">Temi</label>
        <select v-model="selectTemi" id="select-temi">
          <option value=""></option> -->
          <!-- TO DO -->
          <!-- <option v-for="el in store.statePlanner.listaElementi" :key="el.tabella" :value="el.tabella">{{el.alias}}</option> -->
        <!-- </select>
      </div>
      <br /> -->
      <!-- SELECT MATERIALI -->
      <!-- <div class="select-wrapper">
        <input type="checkbox" id="cbx-mat" v-model="stateCheckBx.Mat">
        <label for="cbx-mat">Materiali</label>
        <select v-model="selectMateriali" id="select-mat">
          <option value=""></option> -->
          <!-- TO DO -->
          <!-- <option v-for="el in store.statePlanner.listaElementi" :key="el.tabella" :value="el.tabella">{{el.alias}}</option> -->
        <!-- </select>
      </div>
      <br /> -->
      <!-- <br /> -->
      <!-- <table v-if="selectClOgg" class="tabella-prog-controlli">
        <caption class="caption-prog-controlli"><b>Pianificazione attività cicliche</b></caption>
        <tr>
          <th><b>Frase di rischio</b></th>
          <th><b>Controllo</b></th>
          <th><b>Manutenzione ordinaria</b></th>
          <th><b>Frequenza (mesi)</b></th>
          <th><b>Inizio ciclo</b></th>
        </tr>
        <tr v-for="(fr, ind) in listaFrasiDiRischioFiltrate" :key="fr.id_fr_risc">
          <td :class="fr.fr_risc ? 'tooltip-prog' : null">
            <div class="tab-div">{{fr.fr_risc ? fr.fr_risc : ''}}</div>
            <span v-if="fr.fr_risc" class="tooltip-prog-text">{{fr.fr_risc}}</span>
          </td>
          <td :class="fr.controllo ? 'tooltip-prog' : null">
            <div class="tab-div">{{fr.controllo ? fr.controllo : ''}}</div>
            <span v-if="fr.controllo" class="tooltip-prog-text">{{fr.controllo}}</span>
          </td>
          <td :class="fr.mn_reg ? 'tooltip-prog' : null">
            <div class="tab-div">{{fr.mn_reg ? fr.mn_reg : ''}}</div>
            <span v-if="fr.mn_reg" class="tooltip-prog-text">{{fr.mn_reg}}</span>
          </td>
          <td>
            <input v-model="datiFrasiDiRischioFiltrate[ind].freq_c" type="number" min="1" placeholder="Controllo">
            <input v-if="fr.mn_reg" v-model="datiFrasiDiRischioFiltrate[ind].freq_mr" type="number" min="1" placeholder="Manutenzione">
          </td>
          <td>
            <input v-model="datiFrasiDiRischioFiltrate[ind].data_c" type="date">
            <input v-if="fr.mn_reg" v-model="datiFrasiDiRischioFiltrate[ind].data_mr" type="date">
          </td>
        </tr>
      </table> -->
      <!-- <br> -->
    </div>
  </Details>
</Card>
</template>

<script>
import {reactive, toRefs, watch, inject, computed} from 'vue';
import {registraPianificazioneControlliManutenzioni} from '../js/richieste';
import Details from './elementi/Details.vue';
import LoadingScreen from './elementi/LoadingScreen.vue';
import Card from './elementi/Card.vue';

export default {
  name: 'TabDashboardPianificazione',
  components: {
    Details,
    LoadingScreen,
    Card,
  },
  setup(props, {emit}) {
    const store = inject('store');
    const state = reactive({
      caricamento: false,
      stateCheckBx: {
        clOgg: false,
        Ent: false,
        Aggr: false,
        Temi: false,
        Mat: false,
      },
      selectLocalita: '',
      selectClOgg: '',
      selectEntità: '', // []
      selectAggregatori: '', // []
      selectTemi: '', // []
      selectMateriali: '', // []
      selectAmbito: '',
      selectAmbitoSupporto: '',
      listaAmbiti: [
        {id: 'cops', nome: 'Coperture e Sistemi di regimazione delle acque', colore: '#9b51e0'},
        {id: 'app_dec', nome: 'Apparati decorativi', colore: '#2f80ed'},
        {id: 'pavs', nome: 'Sentieri, pavimentazioni esterne, muretti', colore: '#707070'},
      ],
      listaSigleEdificiFiltrata: [],
      listaSigleEdificiSelezionati: [],
      listaFrasiDiRischioFiltrate: [],
      datiFrasiDiRischioFiltrate: [],
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

    const ambitoSelezionato = computed(() => state.listaAmbiti.find(ambito => ambito.id === state.selectAmbito));
    const listaAmbitiSupporto = computed(() => state.listaAmbiti.filter(ambito => ambito.id !== state.selectAmbito));

    const datiPianificazioneAmbito = computed(() => ({
      localita: state.selectLocalita,
      edifici: [...state.listaSigleEdificiSelezionati],
      ambito_operativo: state.selectAmbito,
      necessita_supporto: state.selectAmbitoSupporto || null,
      attivita: state.datiAttivitaCicliche.filter(attivitaCompleta).map(attivita => ({
        tipo_attivita: attivita.id,
        descrizione_attivita: attivita.nome,
        frequenza_mesi: Number(attivita.freq_mesi),
        data_inizio: attivita.data_inizio,
        durata_prevista_gg: Number(attivita.durata_prevista_gg),
      })),
    }));

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

    return {
      store,
      ...toRefs(state),
      tuttiEdificiSelezionati,
      ambitoSelezionato,
      listaAmbitiSupporto,
      datiPianificazioneAmbito,
      normalizzaIntero,
      selezionaAmbito,
      selezionaAmbitoSupporto,
      programmaControlli,
    }
  }
}
</script>

<style scoped>
select {
  margin-left: 1rem;
}
input[type=checkbox] {
  margin-right: .4rem;
}

.select-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.select-wrapper input[type="checkbox"] {
  margin: 0;
}

.select-wrapper label {
  margin-bottom: 0;
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
.tabella-prog-controlli .tab-div {
  z-index: 10;
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tabella-prog-controlli input {
  width: 90%
}
.tooltip-prog {
  position: relative;
}
.tooltip-prog-text {
  visibility: hidden;
  position: absolute;
  z-index: 100;
  border: 1px;
  background-color: var(--blackOlive);
  border-style: solid;
  border-width: 1px;
  border-color: var(--verdeMain10ance);
  border-radius: 3px;
  padding: 3px;
  color: var(--grigio);
  top: 20px;
  left: 20px;
  width: fit-content;
  min-width: 150%;
}
.tooltip-prog:hover span.tooltip-prog-text {
  visibility: visible;
}
.tooltip-prog:hover {
  overflow: visible;
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
.vincola-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
.vincola {
  margin: 3px 0;
  display: inline;
}
p.vincola {
  margin-left: 5px;
}
</style>

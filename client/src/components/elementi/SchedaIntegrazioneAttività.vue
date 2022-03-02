<template>
  <div :class="pianificate ? 'verde' : 'giallo'" class="wrapper-scheda">
    <h5 v-if="att.necessaria_revisione" class="avviso-revisione">ATTENZIONE: Attività da revisionare</h5>
    <div class="contenitore-colonne mt20">
      <div class="colonna">
        <p><b>Attività: </b>{{stringAtt}}</p>
        <p><b>Classe oggetti: </b>{{att.cl_ogg_fr}}</p>
        <p><b>Località: </b>{{att.località_estesa}}</p>
        <p><b>Edificio: </b>{{edificio}}</p>
        <p v-if="att.frequenza"><b :class="att.necessaria_revisione ? 'avviso-revisione' : ''">Frequenza: </b>{{att.frequenza}} {{parseInt(att.frequenza) === 1 ? 'mese' : 'mesi'}}</p>
      </div>
      <div class="colonna">
        <p>
          <b>Descrizione: </b>
          <span v-for="ta in att.tipo_attività" :key="ta">
            <p>
              <i>{{ta}}: </i>
              {{att[ta]}}
            </p>
          </span>
        </p>
      </div>
    </div>
    <p class="id">{{att.data_prog}}</p>
    <div class="dx">
      <button @click="integra" :class="[integrazioneAttiva ? 'glyphicon-minus' : 'glyphicon-plus', pianificate ? 'verde' : 'giallo']" class="glyphicon integra"></button>
    </div>
    <div v-if="integrazioneAttiva">
      <div class="contenitore-colonne">
        <div class="colonna">
          <div v-if="['manutenzione straordinaria', 'restauro'].includes(att.tipo_attività[0])" class="contenitore-colonne centra">
            <label for="progettista" class="colonna">Progettista:</label>
            <input v-model="progettista" id="progettista" class="colonna">
          </div>
          <div class="contenitore-colonne centra">
            <label for="esecutori" class="colonna">Esecutori:</label>
            <input v-model="esecutori" id="esecutori" class="colonna">
          </div>
          <div class="contenitore-colonne centra">
            <label for="strumentazione" class="colonna">Strumentazione:</label>
            <input v-model="strumentazione" id="strumentazione" class="colonna">
          </div>
          <div class="contenitore-colonne centra">
            <label for="note" class="colonna">Note:</label>
            <input v-model="note" id="note" class="colonna">
          </div>
        </div>
        <div class="colonna">
          <div class="contenitore-colonne centra">
            <label for="costo" class="colonna">Costo previsto (€):</label>
            <input v-model="costoPrevisto" type="number" min="0" step=".01" id="costo" class="colonna">
          </div>
          <div class="contenitore-colonne centra">
            <label for="ore" class="colonna">Ore previste:</label>
            <input v-model="orePreviste" type="number" step=".5" id="ore" class="colonna">
          </div>
          <div class="contenitore-colonne centra">
            <label for="data" class="colonna">Data programmata:</label>
            <input v-model="dataProgrammata" type="date" id="data" class="colonna">
          </div>
          <div v-if="att.necessaria_revisione" class="contenitore-colonne centra">
            <label for="nuova-freq" class="colonna">Nuova frequenza:</label>
            <input v-model="frequenza" type="number" min="1" step="1" id="nuova-freq" class="colonna">
          </div>
        </div>
      </div>
      <button @click="salvaIntegrazione" :class="pianificate ? 'verde' : 'giallo'" class="bottone-main10ance">Salva</button>
    </div>
  </div>
</template>

<script>
import {reactive, toRefs, computed, inject/*, onMounted*/} from 'vue';
import {dataCorta, dataInteger} from '../../js/shared';
import { integraAttività } from '../../js/richieste';

export default {
  name: 'SchedaIntegrazioneAttività',
  props: {
    pianificate: Boolean,
    att: Object,
  },
  setup(props, {emit}) {
    const store = inject('store');
    const state = reactive({
      id_record: props.att.id_att_prog,
      integrazioneAttiva: false,
      esecutori: props.att.esecutori,
      strumentazione: props.att.strumentazione,
      note: props.att.commenti,
      costoPrevisto: props.att.costo,
      orePreviste: props.att.ore,
      dataProgrammata: props.att.data_prog,
      frequenza: props.att.frequenza,
      progettista: '',
    });

    const stringAtt = computed(() => {
      return props.att.tipo_attività.join(', ');
    });
    const edificio = computed(() => {
      return props.att.id_main10ance[0].split('|')[1];
    });

    // onMounted(() => console.log(props.att));

    function integra() {
      state.integrazioneAttiva = !state.integrazioneAttiva;
      if (state.integrazioneAttiva) resetDati();
    }

    function resetDati() {
      state.esecutori = props.att.esecutori;
      state.strumentazione = props.att.strumentazione;
      state.note = props.att.commenti;
      state.costoPrevisto = props.att.costo;
      state.orePreviste = props.att.ore;
      state.dataProgrammata = props.att.data_prog;
      if (props.att.frequenza) state.frequenza = props.att.frequenza;
      state.progettista = '';
    }

    async function salvaIntegrazione() {
      if ([state.esecutori, state.strumentazione, state.costoPrevisto, state.orePreviste, state.dataProgrammata].every(elem => !!elem) && (props.att.necessaria_revisione ? state.frequenza : true)) {
        const jsonAtt = {};
        const datiIns = {};
        jsonAtt['id_att_prog'] = parseInt(state.id_record);
        jsonAtt['data_ultima_mod'] = dataCorta();
        jsonAtt['dati_inserimento'] = datiIns;
        datiIns['tabelle'] = props.att.tipo_attività.map(t => store.statePlanner.attività[t].tabella);
        datiIns['id_att'] = dataInteger();
        datiIns['cl_ogg_fr'] = props.att.cl_ogg_fr;
        datiIns['descrizione'] = props.att.tipo_attività.map(t => props.att[t]);
        datiIns['id_main10ance'] = props.att.id_main10ance;
        datiIns['rid_fr_risc'] = props.att.rid_fr_risc;
        datiIns['data_azione'] = state.dataProgrammata;
        datiIns['id_group'] = props.att.id_group;
        datiIns['rid_contr'] = parseInt(props.att.rid_contr);
        datiIns['rid_dad'] = parseInt(props.att.rid_dad);
        datiIns['progettista'] = state.progettista;
        if (state.dataProgrammata !== props.att.data_prog) jsonAtt['data_prog'] = state.dataProgrammata;
        if (state.esecutori) jsonAtt['esecutori'] = state.esecutori;
        if (state.strumentazione) jsonAtt['strumentaz'] = state.strumentazione;
        if (state.costoPrevisto) jsonAtt['costo'] = state.costoPrevisto;
        if (state.orePreviste) jsonAtt['ore'] = state.orePreviste;
        if (state.note) jsonAtt['commenti'] = state.note;
        if (state.frequenza) jsonAtt['frequenza'] = state.frequenza;
        if (props.att.necessaria_revisione) jsonAtt['necessaria_revisione'] = false;
        const res = await integraAttività(jsonAtt);
        if (res.success) {
          store.methods.setAlert("Salvataggio avvenuto con successo");
          emit('integrazioneCompletata');
        }
        else {
          store.methods.setAlert("ATTENZIONE: Si è verificato un errore durante la registrazione dei dati");
        }
      }
      else {
        store.methods.setAlert('I campi "Esecutori", "Strumentazione", "Costo previsto", "Ore previste" e "Data programmata" sono obbligatori');
      }
    }

    return {
      ...toRefs(state),
      stringAtt,
      edificio,
      integra,
      salvaIntegrazione,
    }
  }
}
</script>

<style scoped>
input {
  margin: 5px;
  z-index: 100;
}
.avviso-revisione {
  color: red;
  font-weight: bold;
}
.bottone-main10ance {
  margin-left: 0;
  margin-bottom: 0;
}
.bottone-main10ance.verde {
  background-color: var(--verdeMain10ance);
}
.bottone-main10ance.giallo {
  background-color: var(--gialloIntervento);
}
.bottone-main10ance.verde:hover {
  background-color: var(--verdeMain10anceTrasparenza);
}
.bottone-main10ance.giallo:hover {
  background-color: var(--gialloInterventoTrasparenza);
}
.wrapper-scheda {
  padding: 5px;
  margin: 10px;
  border-radius: 10px;
  position: relative;
}
.verde {
  background-color: var(--verdeMain10anceTrasparenza);
}
.blu {
  background-color: var(--bluInterregTrasparenza);
}
.giallo {
  background-color: var(--gialloInterventoTrasparenza);
}
.dx {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  z-index: 90;
}
.integra {
  border: none;
  color: var(--blackOlive);
  padding: 5px;
  margin: 5px;
  border-radius: 15px;
}
.integra.verde:hover {
  background-color: var(--verdeMain10ance);
}
.integra.blu:hover {
  background-color: var(--bluInterreg);
}
.integra.giallo:hover {
  background-color: var(--gialloIntervento);
}
.id {
  position: absolute;
  margin: 5px;
  top: 0;
  right: 0;
}
.contenitore-colonne {
  display: flex;
}
.colonna {
  flex: 50%;
}
.centra {
  align-items: center;
}
.mt20 {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>

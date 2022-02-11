<template>
  <div :class="pianificate ? 'verde' : 'giallo'" class="wrapper-scheda">
    <h5 v-if="att.necessaria_revisione" class="avviso-revisione">ATTENZIONE: Attività da revisionare</h5>
    <div class="contenitore-colonne mt20">
      <div class="colonna">
        <p><b>Attività: </b>{{stringAtt}}</p>
        <p><b>Classe oggetti: </b>{{att.cl_ogg_fr}}</p>
        <p><b>Località: </b>{{att.località_estesa}}</p>
        <p><b>Edificio: </b>{{edificio}}</p>
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
            <label for="costo" class="colonna">Costo previsto:</label>
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
        </div>
      </div>
      <button @click="salvaIntegrazione" class="bottone-main10ance">Salva</button>
    </div>
  </div>
</template>

<script>
import {reactive, toRefs, computed, inject} from 'vue';
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
      esecutori: '',
      strumentazione: '',
      note: '',
      costoPrevisto: null,
      orePreviste: null,
      dataProgrammata: props.att.data_prog,
    });

    const stringAtt = computed(() => {
      return props.att.tipo_attività.join(', ');
    });
    const edificio = computed(() => {
      return props.att.id_main10ance[0].split('|')[1];
    });

    function integra() {
      state.integrazioneAttiva = !state.integrazioneAttiva;
      if (state.integrazioneAttiva) resetDati();
    }

    function resetDati() {
      state.esecutori = '';
      state.strumentazione = '';
      state.note = '';
      state.costoPrevisto = null;
      state.orePreviste = null;
      state.dataProgrammata = props.att.data_prog;
    }

    async function salvaIntegrazione() {
      if ([state.esecutori, state.strumentazione, state.costoPrevisto, state.orePreviste].every(elem => !!elem)) {
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
        if (state.dataProgrammata !== props.att.data_prog) jsonAtt['data_prog'] = state.dataProgrammata;
        if (state.esecutori) jsonAtt['esecutori'] = state.esecutori;
        if (state.strumentazione) jsonAtt['strumentaz'] = state.strumentazione;
        if (state.costoPrevisto) jsonAtt['costo'] = state.costoPrevisto;
        if (state.orePreviste) jsonAtt['ore'] = state.orePreviste;
        if (state.note) jsonAtt['commenti'] = state.note;
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
        store.methods.setAlert('ATTENZIONE: I campi "Esecutori", "Strumentazione", "Costo previsto" e "Ore previste" sono obbligatori');
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
.bottone-main10ance:hover {
  background-color: var(--verdeMain10anceTrasparenza);
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

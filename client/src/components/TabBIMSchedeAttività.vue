<template>
  <div>
    <h4><b>Report {{store.stateBIM.schedeAttivitàTipo}}</b></h4>
    <table :class="tipoClass">
      <tr>
        <td class="fLeft"><label><b>OPERATORE</b></label></td>
        <td class="fRight"><p>{{store.statePlanner.datiSchedaInCompilazione['Operatore']}}</p></td>
      </tr>
      <div v-if="store.stateBIM.schedeAttivitàTipo === 'controllo'">
        <tr>
          <td class="fLeft"><label><b>CONTROLLO</b></label></td>
          <td class="fRight"><p>{{store.statePlanner.datiSchedaInCompilazione['Tipo di controllo']}}</p></td>
        </tr>
        <tr>
          <td class="fLeft"><label><b>DATA</b></label></td>
          <td class="fRight"><input v-model="store.statePlanner.datiSchedaInCompilazione['Data controllo']" type="date"></td>
        </tr>
        <tr>
          <td class="fLeft"><label><b>STRUMENTAZIONE</b></label></td>
          <td class="fRight"><input v-model="store.statePlanner.datiSchedaInCompilazione['Strumentazione']"></td>
        </tr>
        <tr>
          <td class="fLeft"><label><b>CLASSE DI RACCOMANDAZIONE</b></label></td>
          <td class="fRight"><select v-model="selectClRacc">
            <option v-for="(en, ind) in store.statePlanner.enumUNI.enumClRacc" :key="ind" :value="ind">{{en}}</option>
          </select></td>
        </tr>
        <tr>
          <td class="fLeft"><label><b>STATO DI CONSERVAZIONE</b></label></td>
          <td class="fRight"><select v-model="selectStCons" :disabled="selectMatriceDisabled">
            <option v-for="(en, ind) in store.statePlanner.enumUNI.enumStCons" :key="ind" :value="ind+2">{{en}}</option>
          </select></td>
        </tr>
        <tr>
          <td class="fLeft"><label><b>LIVELLO DI URGENZA</b></label></td>
          <td class="fRight"><select v-model="selectLivUrg" :disabled="selectMatriceDisabled">
            <option v-for="(en, ind) in store.statePlanner.enumUNI.enumLivUrg" :key="ind" :value="ind+1">{{en}}</option>
          </select></td>
        </tr>
      </div>
      <div v-if="store.stateBIM.schedeAttivitàTipo === 'manutenzione regolare'">modulo per manutenzione regolare</div>
      <div v-if="store.stateBIM.schedeAttivitàTipo === 'manutenzione correttiva'">modulo per manutenzione correttiva</div>
      <div v-if="store.stateBIM.schedeAttivitàTipo === 'manutenzione straordinaria'">modulo per manutenzione straordinaria</div>
      <div v-if="store.stateBIM.schedeAttivitàTipo === 'restauro'">modulo per restauro</div>
      <div v-if="store.stateBIM.schedeAttivitàTipo === 'diagnosi'">modulo per diagnostica</div>
      <tr>
        <td class="fLeft"><label><b>COSTO EFFETTIVO (€)</b></label></td>
        <td class="fRight"><input v-model="store.statePlanner.datiSchedaInCompilazione['Costo previsto (€)']" type="number" min="0" step=".01"></td>
      </tr>
      <tr>
        <td class="fLeft"><label><b>ORE EFFETTIVE</b></label></td>
        <td class="fRight"><input v-model="store.statePlanner.datiSchedaInCompilazione['Ore previste']" type="number" step=".5"></td>
      </tr>
      <tr>
        <td class="fLeft"><label><b>NOTE</b></label></td>
        <td class="fRight"><textarea v-model="store.statePlanner.datiSchedaInCompilazione['Note']"></textarea></td>
      </tr>
      <tr>
        <td class="fLeft"><label><b>DOCUMENTI</b></label></td>
        <td class="fRight"><input v-model="store.statePlanner.datiSchedaInCompilazione['Documenti']"></td>
      </tr>
    </table>
    <button @click="salvaAttività" class="bottone-main10ance">SALVA</button>
  </div>
</template>

<script>
import {inject, onMounted, reactive, computed, toRefs, watch} from 'vue';
import {leggiEnum} from '../js/richieste';
import {dataCorta} from '../js/shared';
import { cambiaColore, cercaElementiDaScheda, getElementiSelezionati, getIdM10AFromSelezione } from '../js/BIM';

export default {
  name: 'TabBIMSchedeAttività',
  setup() {
    const store = inject('store');
    const state = reactive({
      selectStCons: 2,
      selectLivUrg: 1,
      selectClRacc: 0,
      selectMatriceDisabled: true,
    });
    const livPriorità = computed(() => state.selectStCons * state.selectLivUrg);
    const tipoClass = computed(() => store.stateBIM.schedeAttivitàTipo.replaceAll(' ', '-'));

    watch(() => livPriorità.value, newVal => {
      console.log(newVal);
    });

    watch(() => state.selectClRacc, newVal => {
      if (newVal > 1) state.selectMatriceDisabled = false;
      else {
        state.selectMatriceDisabled = true;
        state.selectStCons = 2;
        state.selectLivUrg = 1;
      }
    });

    onMounted(async () => {
      await recuperaEnumUNI();
    });

    async function recuperaEnumUNI() {
      const enumStCons = await leggiEnum('st_cons');
      const enumLivUrg = await leggiEnum('liv_urg');
      const enumClRacc = await leggiEnum('cl_racc');
      store.statePlanner.enumUNI.enumStCons = enumStCons.map(en => en.unnest);
      store.statePlanner.enumUNI.enumLivUrg = enumLivUrg.map(en => en.unnest);
      store.statePlanner.enumUNI.enumClRacc = enumClRacc.map(en => en.unnest);
    }

    async function salvaAttività() {
      // - controllare se compilazioneParziale = true
        // + se sì, verificare quale CR è stato impostato
          // * se CR <= 1: lanciare un INSERT INTO e creare scheletro scheda controllo con:
            // - NUOVO id_contr, stessa cl_ogg_fr, stesso controllo, stessi esecutori, data_ins+data_ultima_mod, stesso rid_fr_risc, stesso rid_att_prog
          // * se CR > 1: proseguire normalmente
      const selezione = await verificaSelezione(); // da fare due volte, indipendente da verifica compilazioneParziale, ma dopo di essa
      if (!selezione) return;
      const dati = await raccogliDati();
      // verifica store.statePlanner.compilazioneParziale = true
      // INSERT INTO oppure UPDATE semplice
      console.log(dati);
      console.log(store.statePlanner.datiSchedaInCompilazione);
      // se CR0: tutto ok, registro attività fatta, registro prossima attività prog
      // se CR1: tutto ok, registro attività ma segnalare da rivedere programmazione, registro prossima attività prog
      // se CR2: necessario riallineamento, registro attività prog CORRETTIVA
      // se CR3: necessario riallineamento, registro attività prog DIAGNOSI

      // se lista id_main10ance è diversa da quella di tutti gli elementi da controllare, filtrare lista, avvisare e riselezionare elementi rimasti
      // lato backend registrare campo "eseguito" come TRUE

      // QUANDO TUTTO E' FINITO E REGISTRATO:
      // store.stateBIM.schedeAttivitàVisibile = false;
      // store.statePlanner.datiSchedaInCompilazione = {};
      // store.stateBIM.elementiSelezionati = null;
    }

    async function raccogliDati() {
      const datiSpec = datiSpecifici();
      const tabella = store.statePlanner.attività[store.stateBIM.schedeAttivitàTipo].tabella;
      const doc = store.statePlanner.datiSchedaInCompilazione['Documenti'];
      const costo = store.statePlanner.datiSchedaInCompilazione['Costo previsto (€)'];
      const ore = store.statePlanner.datiSchedaInCompilazione['Ore previste'];
      const commenti = store.statePlanner.datiSchedaInCompilazione['Note'];
      const autore_ultima_mod = store.state.userSettings.user_id;
      const data_ultima_mod = dataCorta();
      return {...datiSpec, tabella, doc, costo, ore, commenti, autore_ultima_mod, data_ultima_mod};
    }

    function datiSpecifici() {
      const tabella = store.stateBIM.schedeAttivitàTipo;
      switch (tabella) {
        case 'controllo': {
          const data_con = store.statePlanner.datiSchedaInCompilazione['Data controllo'];
          const strumentaz = store.statePlanner.datiSchedaInCompilazione['Strumentazione'];
          const cl_racc = store.statePlanner.enumUNI.enumClRacc[state.selectClRacc];
          const st_cons = store.statePlanner.enumUNI.enumStCons[state.selectStCons-2];
          const liv_urg = store.statePlanner.enumUNI.enumLivUrg[state.selectLivUrg-1];
          const id_contr = store.statePlanner.datiSchedaInCompilazione['Codice scheda controllo'];
          return {strumentaz, data_con, cl_racc, st_cons, liv_urg, id_contr};
        }
        case 'manutenzione regolare': {
          console.log('questa è una manutenzione regolare');
          return 'qui ancora niente';
        }
      }
    }

    async function verificaSelezione() {
      // verifica 0: ci DEVONO essere elementi selezionati o isolati, se lista selezionati è vuota, errore
      const elSelezionati = getElementiSelezionati();
      if (!elSelezionati) return false;
      // verifica 1: non ci devono essere in selezione elementi esterni alla lista "Elementi da controllare"
      const id_main10anceSelezionati = await getIdM10AFromSelezione(elSelezionati);
      const elEstranei = id_main10anceSelezionati.some(idSel => !store.stateBIM.elementiDaSchedare.includes(idSel));
      if (elEstranei) {
        store.methods.setAlert("ATTENZIONE: Alcuni degli elementi selezionati non fanno parte dell'operazione corrente.");
        const idElementi = await cercaElementiDaScheda(store.stateBIM.elementiDaSchedare);
        store.stateBIM.elementiSelezionati = store.stateBIM.elementiDaSchedare;
        cambiaColore(idElementi);
        return false;
      }
      // verifica 2: togliere elementi selezionati da lista "Elementi da controllare", riproporre scheda con elementi rimasti
      const elRimanenti = store.stateBIM.elementiDaSchedare.filter(el => !id_main10anceSelezionati.includes(el));
      // se NON CI SONO elementi rimasti dopo verifica 2
      if (!elRimanenti.length) {
        store.statePlanner.compilazioneParziale = false;
      }
      // se CI SONO elementi rimasti:
      else {
        const frase = elRimanenti.length === 1 ? 'elemento è stato escluso' : 'elementi sono stati esclusi';
        const fraseIntera = `${elRimanenti.length} ${frase} dalla selezione corrente. Sarà necessario registrare un'ulteriore scheda per completare la procedura. Si desidera continuare?`;
        const confermaProcedere = await store.methods.setConfirm(fraseIntera);
        if (confermaProcedere) {
          store.statePlanner.compilazioneParziale = true;
          store.stateBIM.elementiDaSchedare = elRimanenti;
        }
        else {
          const idElementi = await cercaElementiDaScheda(store.stateBIM.elementiDaSchedare);
          store.stateBIM.elementiSelezionati = store.stateBIM.elementiDaSchedare;
          cambiaColore(idElementi);
          return false;
        }
      }
      return id_main10anceSelezionati;
    }

    return {
      store,
      ...toRefs(state),
      tipoClass,
      salvaAttività,
    }
  }
}
</script>

<style scoped>
button {
  float: right;
  margin-right: 0;
}
button:hover {
  background-color: var(--verdeMain10anceTrasparenza);
}
p {
  text-align: justify;
  text-justify: inter-word;
}
input, select {
  width: 100%;
}
textarea {
  width: 100%;
  height: 50px;
  resize: vertical;
}
tr {
  display: flex;
  margin-bottom: 5px;
}
td {
  align-items: center;
  padding: 5px 0;
}
td.fLeft {
  flex: .35;
  padding-left: 10px;
}
td.fRight {
  flex: .65;
  padding-right: 10px;
}
table.controllo, table.manutenzione-regolare {
  background-color: var(--verdeMain10anceTrasparenza);
}
</style>

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
          <td class="fLeft"><label><b>STATO DI CONSERVAZIONE</b></label></td>
          <td class="fRight"><select v-model="selectStCons">
            <option v-for="(en, ind) in store.statePlanner.enumUNI.enumStCons" :key="ind" :value="ind+2">{{en}}</option>
          </select></td>
        </tr>
        <tr>
          <td class="fLeft"><label><b>CLASSE DI RACCOMANDAZIONE</b></label></td>
          <td class="fRight"><select v-model="selectClRacc">
            <!-- <option v-for="(en, ind) in store.statePlanner.enumUNI.enumClRacc" :key="ind" :value="ind">{{en}}</option> -->
            <option v-for="(en, ind) in store.statePlanner.enumUNI.enumClRacc" :key="ind" :value="ind" :disabled="selectClRaccOpzioniBloccate.includes(ind)">{{en}}</option>
          </select></td>
        </tr>
        <tr v-if="!selectLivUrgNascosto">
          <td class="fLeft"><label><b>LIVELLO DI URGENZA</b></label></td>
          <!-- <td class="fRight"><select v-model="selectLivUrg" :disabled="selectMatriceDisabled"> -->
          <td class="fRight"><select v-model="selectLivUrg">
            <option v-for="(en, ind) in store.statePlanner.enumUNI.enumLivUrg" :key="ind" :value="ind+1">{{en}}</option>
          </select></td>
        </tr>
      </div>
      <div v-if="store.stateBIM.schedeAttivitàTipo === 'manutenzione regolare' || store.stateBIM.schedeAttivitàTipo === 'manutenzione correttiva'">
        <tr>
          <td class="fLeft"><label><b>MANUTENZIONE</b></label></td>
          <td class="fRight"><p>{{store.statePlanner.datiSchedaInCompilazione['Tipo di intervento']}}</p></td>
        </tr>
        <tr>
          <td class="fLeft"><label><b>DATA</b></label></td>
          <td class="fRight"><input v-model="store.statePlanner.datiSchedaInCompilazione['Data intervento']" type="date"></td>
        </tr>
        <tr>
          <td class="fLeft"><label><b>STRUMENTAZIONE</b></label></td>
          <td class="fRight"><input v-model="store.statePlanner.datiSchedaInCompilazione['Strumentazione']"></td>
        </tr>
        <tr>
          <td class="fLeft"><label><b>MATERIALE</b></label></td>
          <td class="fRight"><input v-model="materialeMan"></td>
        </tr>
      </div>
      <!-- <div v-if="store.stateBIM.schedeAttivitàTipo === 'manutenzione correttiva'"></div> -->
      <div v-if="store.stateBIM.schedeAttivitàTipo === 'manutenzione straordinaria'">modulo per manutenzione straordinaria</div>
      <div v-if="store.stateBIM.schedeAttivitàTipo === 'restauro'">modulo per restauro</div>
      <div v-if="store.stateBIM.schedeAttivitàTipo === 'diagnosi'">modulo per diagnostica</div>
      <tr v-if="!store.statePlanner.compilazioneParziale">
        <td class="fLeft"><label><b>COSTO EFFETTIVO (€)</b></label></td>
        <td class="fRight"><input v-model="store.statePlanner.datiSchedaInCompilazione['Costo previsto (€)']" type="number" min="0" step=".01"></td>
      </tr>
      <tr v-if="!store.statePlanner.compilazioneParziale">
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
    <div class="div-bottoni">
      <!-- <button @click="salvaAttività" :class="tipoClass" class="bottone-main10ance">SALVA</button> -->
      <BtnBIM @click="chiudiAttReset" class="btn-bim" icona="glyphicon-remove" nome="chiudiSchedaAtt" title="Chiudi" colore="verde" />
      <BtnBIM @click="salvaAttività" class="btn-bim" icona="glyphicon-floppy-disk" nome="salvaSchedaAtt" title="Salva" colore="verde" />
    </div>
  </div>
</template>

<script>
import {inject, onMounted, reactive, computed, toRefs, watch} from 'vue';
import {leggiEnum, prendiFrequenzaAttProg, registraAttivitàEseguita} from '../js/richieste';
import {aggiornaPlanner, aggiungiMesi, dataCorta, dataInteger, chiudiAttività} from '../js/shared';
import { cambiaColore, cercaElementiDaScheda, getElementiSelezionati, getIdM10AFromSelezione, resetColori, resetVista } from '../js/BIM';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';

export default {
  name: 'TabBIMSchedeAttività',
  components: {
    BtnBIM,
  },
  setup() {
    const store = inject('store');
    const state = reactive({
      selectStCons: 2,
      selectLivUrg: 1,
      selectClRacc: 0,
      selectMatriceDisabled: false, // con vecchia logica partiva da "true"
      selectLivUrgNascosto: true,
      selectClRaccOpzioniBloccate: [2, 3], // per bloccare opzioni non selezionabili
      materialeMan: '',
    });
    const livPriorità = computed(() => state.selectStCons * state.selectLivUrg + state.selectClRacc);
    const tipoClass = computed(() => store.stateBIM.schedeAttivitàTipo.replaceAll(' ', '-'));
    // const nascondiLivUrg = computed(() => state.selectStCons === 2);

    /*
    // ---------------------------------- VECCHIA LOGICA ----------------------------------
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
    */

    // ---------------------------------- NUOVA LOGICA ----------------------------------
    watch(() => state.selectClRacc, newVal => {
      if (newVal > 1) {
        state.selectMatriceDisabled = false;
      } else {
        state.selectMatriceDisabled = true;
        if (state.selectStCons === 0) {
          state.selectStCons = 2;
          state.selectLivUrg = 1;
        }
      }
    });

    watch(() => state.selectStCons, newVal => {
      switch(newVal) {
        case 2:
          state.selectLivUrgNascosto = true;
          state.selectClRaccOpzioniBloccate = [2, 3];
          state.selectClRacc = 0;
          state.selectLivUrg = 1;
          break;
        case 3:
          state.selectLivUrgNascosto = false;
          state.selectClRaccOpzioniBloccate = [3];
          state.selectClRacc = 0;
          break;
        case 4:
        case 5:
          state.selectLivUrgNascosto = false;
          state.selectClRaccOpzioniBloccate = [0, 1];
          state.selectClRacc = 2;
          break;
      }
    });

    watch(() => state.selectLivUrg, () => {
      if (state.selectStCons === 0) {
        state.selectLivUrg = 1;
      }
    });

    // watch(() => nascondiLivUrg, newVal => {
    //   console.log(newVal);
    //   state.selectLivUrgNascosto = newVal;
    // });

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
      console.log(store.statePlanner.datiSchedaInCompilazione);
      const {selezione, parziale, rimanenti} = await verificaSelezione();
      if (!selezione.length) return;
      let datiAttività = {};
      store.statePlanner.listaCRregistrati.push(state.selectClRacc);
      const dati = await raccogliDati(selezione);
      datiAttività = dati;
      if (store.statePlanner.compilazioneParziale) { // se "true" -> INSERT INTO, se "false" -> UPDATE
        const datiAggiuntivi = raccogliDatiAggiuntivi();
        datiAttività = {...datiAttività, ...datiAggiuntivi};
      }
      if (!rimanenti.length) {
        datiAttività['listaCRregistrati'] = store.statePlanner.listaCRregistrati;
        datiAttività['idDiEmergenza'] = dataInteger()+100; // necessario per evitare conflitto con "id_att_prog", creato nello stesso processo
      }
      console.log(datiAttività);

      const resp = await registraAttivitàEseguita(datiAttività);
      if (resp.success) {
        const fraseContinuare = rimanenti.length ? '. Si prega di continuare la registrazione per gli elementi rimanenti.' : '';
        store.methods.setAlert(`Operazione completata${fraseContinuare}`);
        store.statePlanner.compilazioneParziale = parziale;
        store.stateBIM.elementiDaSchedare = rimanenti;
        resetColori();
        if (rimanenti.length) {
          const idElementi = await cercaElementiDaScheda(store.stateBIM.elementiDaSchedare);
          store.stateBIM.elementiSelezionati = store.stateBIM.elementiDaSchedare;
          cambiaColore(idElementi);
        }
        else {
          store.stateBIM.schedeAttivitàVisibile = false;
          store.statePlanner.datiSchedaInCompilazione = {};
          store.stateBIM.elementiSelezionati = null;
          store.statePlanner.listaCRregistrati = [];
          resetVista();
          aggiornaPlanner();
        }
      }
      else {
        store.methods.setAlert("ATTENZIONE: L'operazione non è andata a buon fine. Riprovare");
      }
    }

    function chiudiAttReset() {
      chiudiAttività();
      resetVista();
      store.stateBIM.elementiSelezionati = null;
    }

    async function raccogliDati(selezione) {
      const datiSpec = await datiSpecifici();
      if (state.selectClRacc > 1) datiSpec['liv_priorità'] = livPriorità.value;
      const tabella = store.statePlanner.attività[store.stateBIM.schedeAttivitàTipo].tabella;
      const doc = store.statePlanner.datiSchedaInCompilazione['Documenti'];
      const costo = store.statePlanner.datiSchedaInCompilazione['Costo previsto (€)'];
      const ore = store.statePlanner.datiSchedaInCompilazione['Ore previste'];
      const commenti = store.statePlanner.datiSchedaInCompilazione['Note'];
      const id_main10ance = selezione;
      const autore_ultima_mod = store.state.userSettings.user_id;
      const data_ultima_mod = dataCorta();
      const id_att_prog = dataInteger();
      const edificio = store.statePlanner.datiSchedaInCompilazione['Edificio'];
      const esecutori = store.statePlanner.datiSchedaInCompilazione['Operatore'];
      return {...datiSpec, tabella, doc, costo, ore, commenti, id_main10ance, autore_ultima_mod, data_ultima_mod, id_att_prog, edificio, esecutori};
    }

    async function datiSpecifici() {
      const tabella = store.stateBIM.schedeAttivitàTipo;
      switch (tabella) {
        case 'controllo': {
          const data_con = store.statePlanner.datiSchedaInCompilazione['Data controllo'];
          const strumentaz = store.statePlanner.datiSchedaInCompilazione['Strumentazione'];
          const cl_racc = store.statePlanner.enumUNI.enumClRacc[state.selectClRacc];
          const st_cons = store.statePlanner.enumUNI.enumStCons[state.selectStCons-2];
          const liv_urg = store.statePlanner.enumUNI.enumLivUrg[state.selectLivUrg-1];
          const id_contr = parseInt(store.statePlanner.datiSchedaInCompilazione['Codice scheda controllo']);
          const frequenzaJson = await prendiFrequenzaAttProg({id: id_contr, tabella: store.statePlanner.attività[store.stateBIM.schedeAttivitàTipo].tabella});
          const frequenza = frequenzaJson.frequenza;
          const data_next = aggiungiMesi(data_con, frequenza);
          return {data_con, strumentaz, cl_racc, st_cons, liv_urg, id_contr, data_next};
        }
        case 'manutenzione regolare': {
          const data_ese = store.statePlanner.datiSchedaInCompilazione['Data intervento'];
          const strumentaz = store.statePlanner.datiSchedaInCompilazione['Strumentazione'];
          const materiale = state.materialeMan ? state.materialeMan : null;
          const id_mn_reg = parseInt(store.statePlanner.datiSchedaInCompilazione['Codice scheda manutenzione regolare']);
          const frequenzaJson = await prendiFrequenzaAttProg({id: id_mn_reg, tabella: store.statePlanner.attività[store.stateBIM.schedeAttivitàTipo].tabella});
          const frequenza = frequenzaJson.frequenza;
          const data_next = aggiungiMesi(data_ese, frequenza);
          return {data_ese, strumentaz, materiale, id_mn_reg, data_next};
        }
        case 'manutenzione correttiva': {
          const data_ese = store.statePlanner.datiSchedaInCompilazione['Data intervento'];
          const strumentaz = store.statePlanner.datiSchedaInCompilazione['Strumentazione'];
          const materiale = state.materialeMan ? state.materialeMan : null;
          const id_mn_gu = parseInt(store.statePlanner.datiSchedaInCompilazione['Codice scheda manutenzione correttiva']);
          return {data_ese, strumentaz, materiale, id_mn_gu};
        }
      }
    }

    function raccogliDatiAggiuntivi() {
      const nuovo_record = true;
      const nuovo_id = dataInteger();
      return {nuovo_record, nuovo_id};
    }

    async function verificaSelezione() {
      // verifica 0: ci DEVONO essere elementi selezionati o isolati, se lista selezionati è vuota, errore
      const elSelezionati = getElementiSelezionati();
      if (!elSelezionati) return {selezione: [], parziale: false, rimanenti: []};
      // verifica 1: non ci devono essere in selezione elementi esterni alla lista di elementi da schedare
      const id_main10anceSelezionati = await getIdM10AFromSelezione(elSelezionati);
      const elEstranei = id_main10anceSelezionati.some(idSel => !store.stateBIM.elementiDaSchedare.includes(idSel));
      if (elEstranei) {
        store.methods.setAlert("ATTENZIONE: Alcuni degli elementi selezionati non fanno parte dell'operazione corrente.");
        const idElementi = await cercaElementiDaScheda(store.stateBIM.elementiDaSchedare);
        store.stateBIM.elementiSelezionati = store.stateBIM.elementiDaSchedare;
        cambiaColore(idElementi);
        return {selezione: [], parziale: false, rimanenti: []};
      }
      // verifica 2: tenere conto di una eventuale selezione parziale degli elementi da schedare
      const elRimanenti = store.stateBIM.elementiDaSchedare.filter(el => !id_main10anceSelezionati.includes(el));
      // se NON CI SONO elementi rimasti dopo verifica 2
      if (!elRimanenti.length) {
        return {selezione: id_main10anceSelezionati, parziale: false, rimanenti: []};
      }
      // se CI SONO elementi rimasti:
      else {
        const frase = elRimanenti.length === 1 ? 'elemento è stato escluso' : 'elementi sono stati esclusi';
        const fraseIntera = `${elRimanenti.length} ${frase} dalla selezione corrente. Sarà necessario registrare un'ulteriore scheda per completare la procedura. Si desidera continuare?`;
        const confermaProcedere = await store.methods.setConfirm(fraseIntera);
        if (confermaProcedere) {
          // store.stateBIM.elementiDaSchedare = elRimanenti;
          return {selezione: id_main10anceSelezionati, parziale: true, rimanenti: elRimanenti};
        }
        else {
          const idElementi = await cercaElementiDaScheda(store.stateBIM.elementiDaSchedare);
          store.stateBIM.elementiSelezionati = store.stateBIM.elementiDaSchedare;
          cambiaColore(idElementi);
          return {selezione: [], parziale: false, rimanenti: []};
        }
      }
    }

    return {
      store,
      ...toRefs(state),
      tipoClass,
      salvaAttività,
      chiudiAttReset,
    }
  }
}
</script>

<style scoped>
table {
  width: 100%;
}

/* button {
  float: right;
  margin-right: 0;
} */

.div-bottoni {
  float: right;
  margin-right: 0;
}
button.controllo, button.manutenzione-regolare {
  background-color: var(--verdeMain10ance);
}
button.manutenzione-correttiva, button.manutenzione-straordinaria, button.restauro {
  background-color: var(--gialloIntervento);
}
button.controllo:hover, button.manutenzione-regolare:hover {
  background-color: var(--verdeMain10anceTrasparenza);
}
button.manutenzione-correttiva:hover, button.manutenzione-straordinaria:hover, button.restauro:hover {
  background-color: var(--gialloInterventoTrasparenza);
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
table.manutenzione-correttiva, table.manutenzione-straordinaria, table.restauro {
  background-color: var(--gialloInterventoTrasparenza);
}

.btn-bim {
  margin-top: 10px;
}

.btn-bim ~ .btn-bim {
  margin-left: .9rem;
}
</style>

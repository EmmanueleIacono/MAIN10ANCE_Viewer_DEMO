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
          <td class="fLeft"><label><b>DOCUMENTI</b></label></td>
          <td class="fRight"><input v-model="store.statePlanner.datiSchedaInCompilazione['Documenti']"></td>
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
    </table>
    <button @click="salvaAttività" class="bottone-main10ance">SALVA</button>
  </div>
</template>

<script>
import {inject, onMounted, reactive, computed, toRefs, watch} from 'vue';
import {leggiEnum} from '../js/richieste';

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
      const dati = raccogliDati();
      console.log(dati);
      console.log(store.statePlanner.datiSchedaInCompilazione);
    }

    function raccogliDati() {
      return 'ciccio';
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

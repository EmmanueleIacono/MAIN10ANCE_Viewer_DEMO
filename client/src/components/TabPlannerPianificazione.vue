<template>
  <Details summary="PIANIFICAZIONE" :open="true">
    <button @click="programmaControlli" class="bottone-prog">Programma</button>
    <div class="main-container">
      <label for="check-sacro-monte-prog">Sacro Monte</label>
      <select v-model="selectSacroMonte" id="select-sacro-monte-prog">
        <option value=""></option>
        <option v-for="sm in listaSigleSM" :key="sm.sigla" :value="sm.sigla">{{sm.nome}}</option>
      </select>
      <br>
      <div><b>Edificio</b></div>
      <div id="div-edificio-prog">
        <div v-for="s in listaSigleEdificiFiltrata" :key="s.edificio">
          <input v-model="listaSigleEdificiSelezionati" :id="`check-edif-prog-${s.edificio}`" :value="s.edificio" type="checkbox">
          <label :for="`check-edif-prog-${s.edificio}`">{{s.edificio}}</label>
        </div>
      </div>
      <label for="select-cl-ogg">Classe oggetti</label>
      <select v-model="selectClOgg" id="select-cl-ogg">
        <option value=""></option>
        <option v-for="cl in listaClOgg" :key="cl.unnest" :value="cl.unnest">{{cl.unnest}}</option>
      </select>
      <br>
      <div><b>Valutazione dei rischi</b></div>
      <table v-if="selectClOgg" class="tabella-prog-controlli">
        <tr>
          <th><b>Frase di rischio</b></th>
          <th><b>Controllo</b></th>
          <th><b>Manutenzione ordinaria</b></th>
          <th><b>Frequenza</b></th>
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
          <td><input v-model="datiFrasiDiRischioFiltrate[ind].freq" type="number" min="1"></td>
          <td><input v-model="datiFrasiDiRischioFiltrate[ind].data" type="date"></td>
        </tr>
      </table>
      <br>
    </div>
  </Details>
</template>

<script>
import {reactive, onMounted, toRefs, watch, inject} from 'vue';
import {prendiSigleEdifici, prendiSigleSacriMonti, leggiEnum, prendiFrasiDiRischio, getEntitàDaClOgg, getElementiDaEntità} from '../js/richieste';
import Details from './elementi/Details.vue';

export default {
  name: 'TabDashboardPianificazione',
  components: {
    Details,
  },
  setup() {
    const store = inject('store');
    const state = reactive({
      selectSacroMonte: '',
      selectClOgg: '',
      listaSigleSM: [],
      listaSigleEdifici: [],
      listaSigleEdificiFiltrata: [],
      listaSigleEdificiSelezionati: [],
      listaClOgg: [],
      listaFrasiDiRischio: [],
      listaFrasiDiRischioFiltrate: [],
      datiFrasiDiRischioFiltrate: [],
    });

    watch(() => state.selectSacroMonte, newVal => {
      const listaSigleEdificiFiltrata = state.listaSigleEdifici.filter(s => s.sacro_monte === newVal);
      state.listaSigleEdificiFiltrata = listaSigleEdificiFiltrata;
      state.listaSigleEdificiSelezionati = [];
    });

    watch(() => state.selectClOgg, newVal => {
      const listaFrasiDiRischioFiltrate = state.listaFrasiDiRischio.filter(fr => fr.cl_ogg_fr === newVal);
      state.listaFrasiDiRischioFiltrate = listaFrasiDiRischioFiltrate;
      const listaIdFrRiscFiltrati = listaFrasiDiRischioFiltrate.map(fr => ({id_fr_risc: fr.id_fr_risc, freq: null, data: null}));
      state.datiFrasiDiRischioFiltrate = listaIdFrRiscFiltrati;
    });

    onMounted(async () => {
      const listaSigleSM = await prendiSigleSacriMonti();
      const listaSigleEdifici = await prendiSigleEdifici();
      const listaClOgg = await leggiEnum('cl_ogg_fr');
      const listaFrasiDiRischio = await prendiFrasiDiRischio();
      state.listaSigleSM = listaSigleSM;
      state.listaSigleEdifici = listaSigleEdifici;
      state.listaClOgg = listaClOgg;
      state.listaFrasiDiRischio = listaFrasiDiRischio;
    });

    async function programmaControlli() {
      if (controllaSelezioni() && controllaCampiCompilati()) {
        const dati = await raccogliDati();
        console.log(dati);
      }
      else {
        store.methods.setAlert('ATTENZIONE: Informazioni non sufficienti');
      }
    }

    function controllaSelezioni() {
      return state.selectSacroMonte && state.selectClOgg && !!state.listaSigleEdificiSelezionati.length;
    }

    function controllaCampiCompilati() {
      return state.datiFrasiDiRischioFiltrate && !!state.datiFrasiDiRischioFiltrate.length && state.datiFrasiDiRischioFiltrate.every(dato => dato.freq && dato.data);
    }

    async function raccogliDati() {
      const datiProgrammazione = state.datiFrasiDiRischioFiltrate;
      const listaEdifici = state.listaSigleEdificiSelezionati;
      const sacroMonte = state.selectSacroMonte;
      // const metadati = qualcosa...
      const listaEntità = await getEntitàDaClOgg(state.selectClOgg);
      const listaIdM10a = await compilaIdM10a(listaEdifici, listaEntità, sacroMonte);
      return [datiProgrammazione, listaIdM10a];
    }

    async function compilaIdM10a(edifici, entità, sm) {
      const listaElementi = [];
      for (const ed of edifici) {
        const idOgg = {};
        idOgg.edificio = ed;
        idOgg.elementi = [];
        for (const en of entità) {
          if (en === 'grata') {
            const numeri = ed.split('-');
            for (const n of numeri) {
              const elementi = await getElementiDaEntità(sm, n, en);
              idOgg.elementi.push(...elementi);
            }
          }
          else {
            const elementi = await getElementiDaEntità(sm, ed, en);
            idOgg.elementi.push(...elementi);
          }
        }
        listaElementi.push(idOgg);
      }
      return listaElementi;
    }

    return {
      ...toRefs(state),
      programmaControlli,
    }
  }
}
</script>

<style scoped>
select {
  margin-left: .4rem;
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
  background-color: var(--bluInterreg);
  color: white;
  border: none;
  margin-left: 10px;
  float: right;
}
.bottone-prog:hover {
  background-color: var(--grigioScuro);
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
  /* max-width: 100px; */
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
  /* background-color: #eee; */
  background-color: var(--blackOlive);
  border-style: solid;
  border-width: 1px;
  /* border-color: blue; */
  border-color: var(--verdeMain10ance);
  border-radius: 3px;
  padding: 3px;
  /* color: blue; */
  /* color: var(--verdeMain10ance); */
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
</style>

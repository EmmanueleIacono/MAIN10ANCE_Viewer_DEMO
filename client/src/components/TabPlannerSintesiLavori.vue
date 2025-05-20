<template>
  <Card>
    <Details summary="QUADRI DI SINTESI" :open="false" class="loading-wrapper">
      <LoadingScreen :caricamento="caricamento" />
      <button @click="salvaSintesiLavori" class="bottone-main10ance bottone-sint">Salva</button>
        <br />
      <div class="main-container">
        <label for="select-località-prog">Località</label>
        <select v-model="selectLocalità" id="select-località-prog">
          <option value=""></option>
          <option v-for="loc in store.statePlanner.listaSigleLoc" :key="loc.sigla" :value="loc.sigla">{{loc.nome}}</option>
        </select>
        <br />
        <br />
        <table v-if="selectLocalità" class="tabella-sintesi-lavori">
        <caption class="caption-sintesi-lavori"><b>Valutazione sintetica stato conservativo</b></caption>
        <tr>
          <th><b>Edificio</b></th>
          <th><b>Tetti</b></th>
          <th><b>Umidità</b></th>
          <th><b>Statica</b></th>
          <th><b>Interni</b></th>
          <th><b>Esterni</b></th>
        </tr>
        <tr v-for="(edf, ind) in listaSigleEdificiFiltrata" :key="edf.edificio">
          <td><b>{{ edf.edif_nome_menu }}</b></td>
          <!-- tetti -->
          <td>
            <select v-model="datiLavori.listaScoreTetti[ind]" id="tetti" class="sct-tabella">
              <option value=""></option>
              <option v-for="score in scoreLavori" :key="score.stato" :value="score">{{ score.stato }}</option>
            </select>
            <br />
            <input
              v-if="datiLavori.listaScoreTetti[ind]?.stato === 'Lavori eseguiti'"
              v-model="datiLavori.listaAnnoTetti[ind]"
              type="number"
              placeholder="Anno"
            >
          </td>
          <!-- umidità -->
          <td>
            <select v-model="datiLavori.listaScoreUmidità[ind]" id="umidita" class="sct-tabella">
              <option value=""></option>
              <option v-for="score in scoreLavori" :key="score.stato" :value="score">{{ score.stato }}</option>
            </select>
            <br />
            <input
              v-if="datiLavori.listaScoreUmidità[ind]?.stato === 'Lavori eseguiti'"
              v-model="datiLavori.listaAnnoUmidità[ind]"
              type="number"
              placeholder="Anno"
            >
          </td>
          <!-- statica -->
          <td>
            <select v-model="datiLavori.listaScoreStatica[ind]" id="statica" class="sct-tabella">
              <option value=""></option>
              <option v-for="score in scoreLavori" :key="score.stato" :value="score">{{ score.stato }}</option>
            </select>
            <br />
            <input
              v-if="datiLavori.listaScoreStatica[ind]?.stato === 'Lavori eseguiti'"
              v-model="datiLavori.listaAnnoStatica[ind]"
              type="number"
              placeholder="Anno"
            >
          </td>
          <!-- interni -->
          <td>
            <select v-model="datiLavori.listaScoreInterni[ind]" id="interni" class="sct-tabella">
              <option value=""></option>
              <option v-for="score in scoreLavori" :key="score.stato" :value="score">{{ score.stato }}</option>
            </select>
            <br />
            <input
              v-if="datiLavori.listaScoreInterni[ind]?.stato === 'Lavori eseguiti'"
              v-model="datiLavori.listaAnnoInterni[ind]"
              type="number"
              placeholder="Anno"
            >
          </td>
          <!-- esterni -->
          <td>
            <select v-model="datiLavori.listaScoreEsterni[ind]" id="esterni" class="sct-tabella">
              <option value=""></option>
              <option v-for="score in scoreLavori" :key="score.stato" :value="score">{{ score.stato }}</option>
            </select>
            <br />
            <input
              v-if="datiLavori.listaScoreEsterni[ind]?.stato === 'Lavori eseguiti'"
              v-model="datiLavori.listaAnnoEsterni[ind]"
              type="number"
              placeholder="Anno"
            >
          </td>
        </tr>
      </table>
      </div>
      <br>
      <TabPlannerSintesiLavoriVisualizzazione :state-località="selectLocalità" :score-lavori="scoreLavori" />
    </Details>
  </Card>
</template>

<script>
import {reactive, toRefs, watch, inject} from 'vue';
import { dataCorta, dataInteger } from '../js/shared';
import { registraScoreLavori } from '../js/richieste';
import Details from './elementi/Details.vue';
import LoadingScreen from './elementi/LoadingScreen.vue';
import Card from './elementi/Card.vue';
import TabPlannerSintesiLavoriVisualizzazione from './TabPlannerSintesiLavoriVisualizzazione.vue';

export default {
  name: 'TabPlannerSintesiLavori',
  components: {
    Details,
    LoadingScreen,
    Card,
    TabPlannerSintesiLavoriVisualizzazione,
  },
  setup() {
    const store = inject('store');
    const state = reactive({
      caricamento: false,
      selectLocalità: '',
      listaSigleEdificiFiltrata: [],
      listaSigleEdificiSelezionati: [],
      datiLavori: {
        listaScoreTetti: [],
        listaAnnoTetti: [],
        listaScoreUmidità: [],
        listaAnnoUmidità: [],
        listaScoreStatica: [],
        listaAnnoStatica: [],
        listaScoreInterni: [],
        listaAnnoInterni: [],
        listaScoreEsterni: [],
        listaAnnoEsterni: [],
      },
    });

    const scoreLavori = [
      {stato: 'Pessimo', score: 1, score_interno: 1},
      {stato: 'Mediocre', score: 2, score_interno: 2},
      {stato: 'Incerto', score: 3, score_interno: 3},
      {stato: 'Sufficiente', score: 4, score_interno: 4},
      {stato: 'Buono', score: 5, score_interno: 5},
      {stato: 'Lavori eseguiti', score: 5, score_interno: 6},
    ];

    watch(() => state.selectLocalità, newVal => {
      const listaSigleEdificiFiltrata = store.statePlanner.listaSigleEdifici.filter(s => s.località === newVal);
      state.listaSigleEdificiFiltrata = listaSigleEdificiFiltrata;
      console.log(listaSigleEdificiFiltrata);
      state.listaSigleEdificiSelezionati = [];
      resetDatiLavori();
    });

    async function salvaSintesiLavori() {
      const datiLavori = raccogliDatiLavori();
      const anniOk = controllaAnno(datiLavori);
      if (!anniOk) {
        store.methods.setAlert('Tutti i campi "Anno" visibili devono essere compilati.');
        return;
      }
      const datiLavoriFiltrati = filtraDatiLavori(datiLavori);
      state.caricamento = true;
      try {
        const res = await registraScoreLavori(datiLavoriFiltrati);
        if (res.success) {
          store.methods.setAlert('Registrazione andata a buon fine');
          resetDatiLavori();
          state.selectLocalità = '';
        }
        else {
          store.methods.setAlert('ATTENZIONE: Si è verificato un errore durante la registrazione dei dati');
        }
      } catch(e) {
        store.methods.setAlert(e);
      } finally {
        state.caricamento = false;
      }
    }

    function raccogliDatiLavori() {
      const risultati = state.listaSigleEdificiFiltrata.map((edf, ind) => {
        return {
          data: dataCorta(),
          id_interno: dataInteger(), // a che serviva questo???
          edificio: edf, // questo è lo stesso campo "edificio" di "dati_edifici"
          score_tetti: state.datiLavori.listaScoreTetti[ind],
          anno_tetti: state.datiLavori.listaAnnoTetti[ind],
          score_umidità: state.datiLavori.listaScoreUmidità[ind],
          anno_umidità: state.datiLavori.listaAnnoUmidità[ind],
          score_statica: state.datiLavori.listaScoreStatica[ind],
          anno_statica: state.datiLavori.listaAnnoStatica[ind],
          score_interni: state.datiLavori.listaScoreInterni[ind],
          anno_interni: state.datiLavori.listaAnnoInterni[ind],
          score_esterni: state.datiLavori.listaScoreEsterni[ind],
          anno_esterni: state.datiLavori.listaAnnoEsterni[ind],
        };
      });

      return risultati;
    }

    function controllaAnno(dati) {
      const catLavori = ['tetti', 'umidità', 'statica', 'interni', 'esterni'];
      for (const lavoro of dati) {
        for (const cat of catLavori) {
          if (lavoro[`score_${cat}`]?.score_interno === 6 && !lavoro[`anno_${cat}`]) {
            return false;
          }
        }
      }
      return true;
    }

    function filtraDatiLavori(datiLavori) {
      return datiLavori.filter(lavoro => {
        return (
          lavoro.score_tetti?.score_interno || 
          lavoro.score_umidità?.score_interno || 
          lavoro.score_statica?.score_interno || 
          lavoro.score_interni?.score_interno || 
          lavoro.score_esterni?.score_interno
        );
      });
    }

    function resetDatiLavori() {
      state.datiLavori = {
        listaScoreTetti: [],
        listaAnnoTetti: [],
        listaScoreUmidità: [],
        listaAnnoUmidità: [],
        listaScoreStatica: [],
        listaAnnoStatica: [],
        listaScoreInterni: [],
        listaAnnoInterni: [],
        listaScoreEsterni: [],
        listaAnnoEsterni: [],
      };
    }

    return {
      store,
      ...toRefs(state),
      scoreLavori,
      salvaSintesiLavori,
    }
  }
}
</script>

<style scoped>
select {
  margin-left: 1rem;
}

select.sct-tabella {
  width: 90%;
}

.tabella-sintesi-lavori {
  table-layout: fixed;
  width: 100%;
  word-wrap: normal;
}

.tabella-sintesi-lavori input {
  margin-top: 5px;
  width: 80%
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
.bottone-sint {
  float: right;
}
.bottone-sint:hover {
  background-color: var(--verdeMain10anceTrasparenza);
}

.caption-sintesi-lavori {
  color: unset;
  text-align: center;
  background-color: var(--verdeMain10anceTrasparenza);
}
</style>

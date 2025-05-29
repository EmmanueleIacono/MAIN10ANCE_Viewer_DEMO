<template>
  <div class="main-container">
    <LoadingScreen :caricamento="caricamento" />
    <div v-if="records.length" class="sort-controls">
      <button :class="{active: oggi}" @click="setOggi">Oggi</button>
      <button :class="{active: sortKey === 'data_ins'}" @click="setSort('data_ins')">
        Data
        <span v-if="sortKey === 'data_ins'">{{ sortAsc ? '↑' : '↓' }}</span>
      </button>
      <button :class="{active: sortKey === 'edif_nome_menu'}" @click="setSort('edif_nome_menu')">
        Edificio
        <span v-if="sortKey === 'edif_nome_menu'">{{ sortAsc ? '↑' : '↓' }}</span>
      </button>
    </div>

    <table v-if="records.length" class="tabella-lavori">
      <caption class="caption-sintesi-lavori"><b>Inserimenti precedenti</b></caption>
      <thead>
        <tr>
          <th>Data inserimento</th>
          <th>Edificio</th>
          <th>Tetti</th>
          <th>Umidità</th>
          <th>Statica</th>
          <th>Interni</th>
          <th>Esterni</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rec, idx) in filteredSortedRecords" :key="rec.id_interno + idx">
          <td>{{ rec.data_ins }}</td>
          <td>{{ rec.edif_nome_menu }}</td>
          <td :style="cellStyle(trovaVoceDaScore(rec.tetti, 'score'))">{{ trovaVoceDaScore(rec.tetti, 'stato') ?? '-' }}{{ rec.anno_tetti ? `\n${rec.anno_tetti}` : '' }}</td>
          <td :style="cellStyle(trovaVoceDaScore(rec.umidità, 'score'))">{{ trovaVoceDaScore(rec.umidità, 'stato') ?? '-' }}{{ rec.anno_umidità ? `\n${rec.anno_umidità}` : '' }}</td>
          <td :style="cellStyle(trovaVoceDaScore(rec.statica, 'score'))">{{ trovaVoceDaScore(rec.statica, 'stato') ?? '-' }}{{ rec.anno_statica ? `\n${rec.anno_statica}` : '' }}</td>
          <td :style="cellStyle(trovaVoceDaScore(rec.interni, 'score'))">{{ trovaVoceDaScore(rec.interni, 'stato') ?? '-' }}{{ rec.anno_interni ? `\n${rec.anno_interni}` : '' }}</td>
          <td :style="cellStyle(trovaVoceDaScore(rec.esterni, 'score'))">{{ trovaVoceDaScore(rec.esterni, 'stato') ?? '-' }}{{ rec.anno_esterni ? `\n${rec.anno_esterni}` : '' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { computed, inject, reactive, toRefs, watch } from "vue";
import { leggiScoreLavori } from "../js/richieste";
import LoadingScreen from "./elementi/LoadingScreen.vue";

export default {
  name: 'TabPlannerSintesiLavoriVisualizzazione',
  components: {
    LoadingScreen,
  },
  props: {
    stateLocalità: String,
    scoreLavori: Object,
  },
  setup(props) {
    const store = inject('store');
    const state = reactive({
      caricamento: false,
      records: [],
      sortKey: 'data_ins',
      sortAsc: false,
      oggi: false,
    });

    const sortedRecords = computed(() => {
      return [...state.records].sort((a, b) => {
        let va = a[state.sortKey];
        let vb = b[state.sortKey];
        if (state.sortKey === 'data_ins') {
          va = new Date(va);
          vb = new Date(vb);
        }
        if (va == vb) return 0;
        const comp = va > vb ? 1 : -1;
        return state.sortAsc ? comp : -comp;
      });
    });

    const filteredSortedRecords = computed(() => {
      const sorted = sortedRecords.value;
      if (state.oggi) {
        return filtraRecordsOggi(sorted);
      } else {
        return sorted;
      }
    });

    watch(() => props.stateLocalità, async newVal => {
      if (!newVal) {
        state.records = [];
        return;
      }
      state.caricamento = true;
      const att_prec = await leggiScoreLavori(newVal);
      console.log('nuove att prec:\n', att_prec);
      state.records = att_prec;
      state.caricamento = false;
    });

    function setSort(key) {
      if (state.sortKey === key) {
        state.sortAsc = !state.sortAsc;
      } else {
        state.sortKey = key;
        state.sortAsc = true;
      }
    }

    function setOggi() {
      state.oggi = !state.oggi;
    }

    function cellStyle(valore) {
      const default_grey = { backgroundColor: `hsl(0, 0%, 75%)`, color: '#888' };
      try {
        const val_int = parseInt(valore);
        if (isNaN(val_int)) return default_grey;
        // map 1→0°hue (rosso) to 5→120°hue (verde)
        const hue = ((val_int -1) / 4) * 120;
        return {
          backgroundColor: `hsl(${hue}, 70%, 85%)`,
          color: '#888'
        };
      } catch(err) {
        console.log(err);
        return default_grey;
      }
    }

    function trovaVoceDaScore(score, voce) {
      try {
        const score_int = parseInt(score);
        if (isNaN(score_int)) return null;
        const ogg = props.scoreLavori.find(el => el.score_interno === score_int);
        return ogg ? ogg[voce] : null;
      } catch(err) {
        console.log(err);
        return null;
      }
    }

    function filtraRecordsOggi(records) {
      const oggiMap = new Map();

      for (const rec of records) {
        const key = rec.edif_nome_menu;
        const prev = oggiMap.get(key);

        if (!prev) {
          oggiMap.set(key, rec);
        } else {
          const prevData = new Date(prev.data_ins);
          const newData = new Date(rec.data_ins);

          // se rec nuovo, o stessa data ma > id_interno (timestamp)
          if (
            newData > prevData || // data diversa
            (
              newData.getTime() === prevData.getTime() && // stessa data
              rec.id_interno > prev.id_interno // ma timestamp diverso
            )
          ) {
            oggiMap.set(key, rec);
          }
        }
      }

      return Array.from(oggiMap.values());
    }

    return {
      store,
      ...toRefs(state),
      filteredSortedRecords,
      setSort,
      setOggi,
      cellStyle,
      trovaVoceDaScore,
    };
  }
}
</script>

<style scoped>
.sort-controls {
  margin: 1rem 0;
}

.sort-controls button {
  margin-right: .5rem;
  padding: .3rem .6rem;
  border: 1px solid #aaa;
  background: white;
  cursor: pointer;
}

.sort-controls button.active {
  font-weight: bold;
  background: var(--verdeMain10anceTrasparenza2);
}

.tabella-lavori {
  width: 100%;
  border-collapse: collapse;
}

.tabella-lavori th,
.tabella-lavori td {
  border: 1px solid #ddd;
  padding: .5rem;
  text-align: center;
}

.tabella-lavori tr:nth-child(even) {
  background-color: var(--verdeMain10anceTrasparenza2);
}

.tabella-lavori tr:nth-child(odd) {
  background-color: var(--verdeMain10anceTrasparenza3);
}

.caption-sintesi-lavori {
  caption-side: top;
  text-align: center;
  margin-bottom: .5rem;
  color: var(--blackOlive);
}
</style>

<template>
  <div>
    <table>
      <caption @click="apriModello" class="caption-schede"><b>{{`${caption} n. ${dati['Codice scheda controllo']}`}}</b></caption>
      <tr v-for="(valore, chiave) in dati" :key="valore" class="tr-schede">
        <td class="td-schede f40"><b>{{chiave}}</b></td>
        <td v-if="chiave.startsWith('Elementi')" class="td-schede f60">
          <Details summary="Vedi elementi" :open="false">{{valore.join(', ')}}</Details>
        </td>
        <td v-else-if="valore" class="td-schede f60">{{valore}}</td>
        <td v-else class="td-schede f60"><i>Nessun valore</i></td>
      </tr>
    </table>
  </div>
</template>

<script>
import {ref} from 'vue';
import Details from './Details.vue';

export default {
  name: 'SchedaEsecuzione',
  components: {
    Details,
  },
  props: {
    dati: Object,
    caption: String,
  },
  setup(props) {
    const detailsOpen = ref(false);

    console.log(props.dati);

    function apriModello() {
      console.log('sto aprendo il modello');
    }

    return {
      detailsOpen,
      apriModello,
    }
  }
}
</script>

<style scoped>
table {
  width: 100%;
  margin-bottom: 20px;
}
tr {
  display: flex;
}
td {
  padding: 5px 15px;
}
td.f40 {
  flex: .4;
}
td.f60 {
  flex: .6;
}
.caption-schede {
  color: var(--bluInterreg);
}
.caption-schede:hover {
  cursor: pointer;
  text-decoration-line: underline;
  text-decoration-thickness: 3px;
}
.tr-schede:nth-child(even) {
  background-color: var(--verdeMain10anceTrasparenza2);
}
.td-schede {
  border: none;
  background-color: var(--verdeMain10anceTrasparenza);
}
</style>

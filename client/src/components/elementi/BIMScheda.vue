<template>
<div :class="tipo" class="scheda-container">
  <Details :summary="`Scheda n. ${scheda['Codice scheda anagrafica']}` /*qui generalizzare, non va bene 'Codice scheda anagrafica'*/">
    <div v-for="(valore, chiave) in scheda" :key="chiave">
      <p><b>{{chiave}}:</b></p>
      <p v-if="valore || valore === 'null'" class="brk-w">{{valore}}</p>
      <p v-else><i>Nessun valore</i></p>
    </div>
  </Details>
</div>
</template>

<script>
import Details from './Details.vue';

export default {
  name: 'BIMScheda',
  components: {
    Details,
  },
  props: {
    scheda: Object,
    tipo: String,
  },
}
</script>

<style scoped>
p {
  line-height: 1;
}
.scheda-container {
  padding-left: 20px;
}
.anagrafica {
  background-color: var(--gialloAnagraficaTrasparenza);
}
.controllo {
  background-color: var(--verdeMain10anceTrasparenza);
}
.intervento {
  background-color: var(--bluInterregTrasparenza2);
}
.brk-w {
  overflow-wrap: break-word;
}
</style>

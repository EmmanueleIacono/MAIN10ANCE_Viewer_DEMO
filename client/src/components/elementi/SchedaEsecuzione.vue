<template>
  <div>
    <table>
      <caption @click="confirmApriModello" class="caption-schede"><b>{{`Attività di ${tipo} n. ${dati[`Codice scheda ${tipo}`]}`}}</b></caption>
      <tr v-for="(valore, chiave) in dati" :key="valore" :class="tipoClass" class="tr-schede">
        <td :class="tipoClass" class="td-schede f40"><b>{{chiave}}</b></td>
        <td v-if="chiave.startsWith('Elementi')" :class="tipoClass" class="td-schede f60">
          <Details summary="Vedi elementi" :open="false">{{valore.join(', ')}}</Details>
        </td>
        <td v-else-if="valore" :class="tipoClass" class="td-schede f60">{{valore}}</td>
        <td v-else :class="tipoClass" class="td-schede f60"><i>Nessun valore</i></td>
      </tr>
    </table>
  </div>
</template>

<script>
import {ref, computed, inject} from 'vue';
import {prendiUrn} from '../../js/richieste';
import {getModel, cercaElementiDaScheda, cambiaColore} from '../../js/BIM';
import Details from './Details.vue';

export default {
  name: 'SchedaEsecuzione',
  components: {
    Details,
  },
  props: {
    dati: Object,
    tipo: String,
  },
  setup(props) {
    const store = inject('store');
    const detailsOpen = ref(false);
    const tipoClass = computed(() => props.tipo.replaceAll(' ', '-'));

    async function confirmApriModello() {
      const conferma = await store.methods.setConfirm('Visualizzare gli elementi nel BIM Viewer?');
      if (conferma) apriModello();
      return;
    }

    async function apriModello() {
      const listaIdM10a = Object.entries(props.dati).filter(e => e[0].startsWith('Elementi'))[0][1];
      const idArray = listaIdM10a[0].split('|');
      const loc = idArray[0];
      const edif = idArray[1].split('-')[0];
      const urnJson = await prendiUrn({sm: loc, capp: edif});
      const urn = await urnJson.urn;
      aggiornaStateAttività(listaIdM10a);
      store.methods.toggleLoaderGlobale();
      getModel(urn, async () => {
        const idElementi = await cercaElementiDaScheda(listaIdM10a);
        store.stateBIM.elementiSelezionati = listaIdM10a;
        cambiaColore(idElementi);
        store.methods.toggleLoaderGlobale();
      });
    }

    function aggiornaStateAttività(listaIdM10a) {
      store.stateBIM.elementiDaSchedare = listaIdM10a;
      store.stateBIM.schedeAttivitàTipo = props.tipo;
      store.stateBIM.schedeAttivitàVisibile = true;
      store.statePlanner.datiSchedaInCompilazione = props.dati;
    }

    return {
      detailsOpen,
      tipoClass,
      confirmApriModello,
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
  border: none;
  text-align: justify;
  text-justify: inter-word;
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
.tr-schede:nth-child(even).controllo, .tr-schede:nth-child(even).manutenzione-regolare {
  background-color: var(--verdeMain10anceTrasparenza2);
}
.td-schede.controllo, .td-schede.manutenzione-regolare {
  background-color: var(--verdeMain10anceTrasparenza);
}
.tr-schede:nth-child(even).manutenzione-correttiva, .tr-schede:nth-child(even).manutenzione-straordinaria, .tr-schede:nth-child(even).restauro {
  background-color: var(--gialloInterventoTrasparenza2);
}
.td-schede.manutenzione-correttiva, .td-schede.manutenzione-straordinaria, .td-schede.restauro {
  background-color: var(--gialloInterventoTrasparenza);
}
</style>

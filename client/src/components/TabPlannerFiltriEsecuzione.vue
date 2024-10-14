<template>
  <Details class="loading-wrapper" summary="FILTRI ESECUZIONE" :open="false">
    <input v-model="filtri.cbxTipoScheda" type="checkbox" id="check-tipo-scheda">
    <label for="check-tipo-scheda">Scheda</label>
    <select v-model="filtri.selectTipoScheda">
      <option value="controllo">Scheda di controllo</option>
      <option value="manutenzione regolare">Scheda di manutenzione ordinaria</option>
      <option value="manutenzione correttiva">Scheda di manutenzione correttiva</option>
      <option value="manutenzione straordinaria">Scheda di manutenzione straordinaria</option>
      <option value="restauro">Scheda di restauro</option>
      <option value="diagnosi">Scheda di di diagnosi</option>
    </select>
    <br>
    <input v-model="filtri.cbxLocalità" type="checkbox" id="check-località">
    <label for="check-località">Località</label>
    <select v-model="filtri.selectLocalità">
      <option v-for="loc in store.statePlanner.listaSigleLoc" :key="loc.uuid" :value="loc.sigla">{{loc.nome}}</option>
    </select>
    <br>
    <input :disabled="!filtri.cbxLocalità" v-model="filtri.cbxEdificio" type="checkbox" id="check-edificio">
    <label for="check-edificio">Edificio</label>
    <select v-model="filtri.selectEdificio">
      <option v-for="edif in listaEdifFiltrata" :key="edif.uuid" :value="edif.edificio">{{edif.nome}}</option>
    </select>
    <br>
    <input v-model="filtri.cbxElemento" type="checkbox" id="check-elemento">
    <label for="check-elemento">Elemento</label>
    <select v-model="filtri.selectElemento">
      <option v-for="el in store.statePlanner.listaElementi" :key="el.tabella" :value="el.tabella">{{el.alias}}</option>
    </select>
    <br>
    <input v-model="filtri.cbxData" type="checkbox" id="check-data">
    <label for="check-data">Data</label>
    <label for="input-data-da">Da</label>
    <input v-model="filtri.selectDataDa" type="date">
    <label for="input-data-a">A</label>
    <input v-model="filtri.selectDataA" type="date">
    <br>
  </Details>
</template>

<script>
import {inject, reactive, toRefs, watch} from 'vue';
import Details from './elementi/Details.vue';

export default {
  name: 'TabPlannerFiltriEsecuzione',
  components: {
    Details,
  },
  setup() {
    const store = inject('store');
    const state = reactive({
      filtri: {
        cbxTipoScheda: false,
        cbxLocalità: false,
        cbxEdificio: false,
        cbxElemento: false,
        cbxData: false,
        selectTipoScheda: 'controllo',
        selectLocalità: '',
        selectEdificio: '',
        selectElemento: '',
        selectDataDa: '',
        selectDataA: '',
      },
      listaEdifFiltrata: [],
    });

    watch(() => store.statePlanner.datiPlannerLoaded, newVal => {
      if (newVal) inizializzaSelect();
    });

    watch(() => state.filtri.selectLocalità, async newVal => {
      const listaEdifFiltrata = store.statePlanner.listaEdif.filter(ed => ed.località === newVal);
      state.listaEdifFiltrata = listaEdifFiltrata;
      if (listaEdifFiltrata[0]) state.filtri.selectEdificio = listaEdifFiltrata[0].edificio;
    });

    watch(() => state.filtri.cbxLocalità, newLocCbx => {
      if (newLocCbx === false) state.filtri.cbxEdificio = false;
    });

    watch(() => state.filtri, (newFiltri) => {
      resetFiltroSchede();
      if (newFiltri.cbxTipoScheda) filtraTipoScheda(newFiltri.selectTipoScheda);
      if (newFiltri.cbxLocalità) filtraLocEdifElemScheda(newFiltri.selectLocalità, 0);
      if (newFiltri.cbxEdificio) filtraLocEdifElemScheda(newFiltri.selectEdificio, 1);
      if (newFiltri.cbxElemento) filtraLocEdifElemScheda(newFiltri.selectElemento, 2);
      if (newFiltri.cbxData) filtraDataScheda(newFiltri.selectDataDa, newFiltri.selectDataA);
    }, {
      deep: true
    });

    function inizializzaSelect() {
      if (store.statePlanner.listaSigleLoc.length) state.filtri.selectLocalità = store.statePlanner.listaSigleLoc[0].sigla;
      if (store.statePlanner.listaElementi.length) state.filtri.selectElemento = store.statePlanner.listaElementi[0].tabella;
    }

    function filtraTipoScheda(tipoScheda) {
      store.statePlanner.schedeEsecuzioneFiltrate['controllo'] = [];
      store.statePlanner.schedeEsecuzioneFiltrate['manutenzione regolare'] = [];
      store.statePlanner.schedeEsecuzioneFiltrate['manutenzione correttiva'] = [];
      store.statePlanner.schedeEsecuzioneFiltrate['manutenzione straordinaria'] = [];
      store.statePlanner.schedeEsecuzioneFiltrate['restauro'] = [];
      store.statePlanner.schedeEsecuzioneFiltrate['diagnosi'] = [];

      store.statePlanner.schedeEsecuzioneFiltrate[tipoScheda] = store.statePlanner.schedeEsecuzione[tipoScheda];
    }

    function filtraLocEdifElemScheda(proprietà, indice) {
      store.statePlanner.schedeEsecuzioneFiltrate['controllo'] = store.statePlanner.schedeEsecuzioneFiltrate['controllo'].filter(scheda => {
        const prop = scheda['Elementi da controllare'][0]?.split('|')[indice];
        return prop === proprietà;
      });
      store.statePlanner.schedeEsecuzioneFiltrate['manutenzione regolare'] = store.statePlanner.schedeEsecuzioneFiltrate['manutenzione regolare'].filter(scheda => {
        const prop = scheda['Elementi interessati'][0]?.split('|')[indice];
        return prop === proprietà;
      });
      store.statePlanner.schedeEsecuzioneFiltrate['manutenzione correttiva'] = store.statePlanner.schedeEsecuzioneFiltrate['manutenzione correttiva'].filter(scheda => {
        const prop = scheda['Elementi interessati'][0]?.split('|')[indice];
        return prop === proprietà;
      });
      store.statePlanner.schedeEsecuzioneFiltrate['manutenzione straordinaria'] = store.statePlanner.schedeEsecuzioneFiltrate['manutenzione straordinaria'].filter(scheda => {
        const prop = scheda['Elementi interessati'][0]?.split('|')[indice];
        return prop === proprietà;
      });
      store.statePlanner.schedeEsecuzioneFiltrate['restauro'] = store.statePlanner.schedeEsecuzioneFiltrate['restauro'].filter(scheda => {
        const prop = scheda['Elementi interessati'][0]?.split('|')[indice];
        return prop === proprietà;
      });
      store.statePlanner.schedeEsecuzioneFiltrate['diagnosi'] = store.statePlanner.schedeEsecuzioneFiltrate['diagnosi'].filter(scheda => {
        const prop = scheda['Elementi interessati'][0]?.split('|')[indice];
        return prop === proprietà;
      });
    }

    function filtraDataScheda(dataDa, dataA) {
      if (dataDa || dataA) {
        const dataFrom = dataDa ? new Date(dataDa) : null;
        const dataTo = dataA ? new Date(dataA) : null;
        store.statePlanner.schedeEsecuzioneFiltrate['controllo'] = store.statePlanner.schedeEsecuzioneFiltrate['controllo'].filter(scheda => {
          const dataScheda = new Date(scheda['Data controllo']);
          if (dataFrom && dataTo) {
            return dataScheda >= dataFrom && dataScheda <= dataTo;
          } else if (dataFrom) {
            return dataScheda >= dataFrom;
          } else if (dataTo) {
            return dataScheda <= dataTo;
          }
          return true;
        });
        store.statePlanner.schedeEsecuzioneFiltrate['manutenzione regolare'] = store.statePlanner.schedeEsecuzioneFiltrate['manutenzione regolare'].filter(scheda => {
          const dataScheda = new Date(scheda['Data intervento']);
          if (dataFrom && dataTo) {
            return dataScheda >= dataFrom && dataScheda <= dataTo;
          } else if (dataFrom) {
            return dataScheda >= dataFrom;
          } else if (dataTo) {
            return dataScheda <= dataTo;
          }
          return true;
        });
        store.statePlanner.schedeEsecuzioneFiltrate['manutenzione correttiva'] = store.statePlanner.schedeEsecuzioneFiltrate['manutenzione correttiva'].filter(scheda => {
          const dataScheda = new Date(scheda['Data intervento']);
          if (dataFrom && dataTo) {
            return dataScheda >= dataFrom && dataScheda <= dataTo;
          } else if (dataFrom) {
            return dataScheda >= dataFrom;
          } else if (dataTo) {
            return dataScheda <= dataTo;
          }
          return true;
        });
        store.statePlanner.schedeEsecuzioneFiltrate['manutenzione straordinaria'] = store.statePlanner.schedeEsecuzioneFiltrate['manutenzione straordinaria'].filter(scheda => {
          const dataScheda = new Date(scheda['Data intervento']);
          if (dataFrom && dataTo) {
            return dataScheda >= dataFrom && dataScheda <= dataTo;
          } else if (dataFrom) {
            return dataScheda >= dataFrom;
          } else if (dataTo) {
            return dataScheda <= dataTo;
          }
          return true;
        });
        store.statePlanner.schedeEsecuzioneFiltrate['restauro'] = store.statePlanner.schedeEsecuzioneFiltrate['restauro'].filter(scheda => {
          const dataScheda = new Date(scheda['Data intervento']);
          if (dataFrom && dataTo) {
            return dataScheda >= dataFrom && dataScheda <= dataTo;
          } else if (dataFrom) {
            return dataScheda >= dataFrom;
          } else if (dataTo) {
            return dataScheda <= dataTo;
          }
          return true;
        });
        store.statePlanner.schedeEsecuzioneFiltrate['diagnosi'] = store.statePlanner.schedeEsecuzioneFiltrate['diagnosi'].filter(scheda => {
          const dataScheda = new Date(scheda['Data intervento']);
          if (dataFrom && dataTo) {
            return dataScheda >= dataFrom && dataScheda <= dataTo;
          } else if (dataFrom) {
            return dataScheda >= dataFrom;
          } else if (dataTo) {
            return dataScheda <= dataTo;
          }
          return true;
        });
      }
    }

    function resetFiltroSchede() {
      store.statePlanner.schedeEsecuzioneFiltrate['controllo'] = store.statePlanner.schedeEsecuzione['controllo'];
      store.statePlanner.schedeEsecuzioneFiltrate['manutenzione regolare'] = store.statePlanner.schedeEsecuzione['manutenzione regolare'];
      store.statePlanner.schedeEsecuzioneFiltrate['manutenzione correttiva'] = store.statePlanner.schedeEsecuzione['manutenzione correttiva'];
      store.statePlanner.schedeEsecuzioneFiltrate['manutenzione straordinaria'] = store.statePlanner.schedeEsecuzione['manutenzione straordinaria'];
      store.statePlanner.schedeEsecuzioneFiltrate['restauro'] = store.statePlanner.schedeEsecuzione['restauro'];
      store.statePlanner.schedeEsecuzioneFiltrate['diagnosi'] = store.statePlanner.schedeEsecuzione['diagnosi'];
    }

    return {
      store,
      ...toRefs(state),
    }
  }
}
</script>

<style scoped>
button ~ button {
  margin-left: .4rem;
}
input[type=checkbox] {
  margin-right: .4rem;
}
input[type=date], select {
  margin-left: .4rem;
}
label[for=input-data-da], label[for=input-data-a] {
  margin-left: .4rem;
  font-weight: normal;
}
</style>

<template>
<div class="loading-wrapper">
  <LoadingScreen :caricamento="caricamento" />
  <label class="nome" for="check-località">Località</label>
  <select class="valore" v-model="selectLocalità">
    <option v-for="loc in listaSigleLoc" :key="loc.sigla" :value="loc.sigla">{{loc.nome}}</option>
    <option value="" disabled>----------</option>
    <option value="loc-pdiff">Patrimonio diffuso</option>
  </select>
  <br>
  <label class="nome" for="check-edificio">{{selectLocalità === 'loc-pdiff' ? 'Punto' : 'Edificio'}}</label>
  <select v-if="selectLocalità === 'loc-pdiff'" class="valore" v-model="selectEdificio">
    <option v-for="edif in listaEdifFiltrata" :key="edif.sigla" :value="edif.sigla">{{edif.nome}}</option>
  </select>
  <select v-else class="valore" v-model="selectEdificio">
    <option v-for="edif in listaEdifFiltrata" :key="edif.numero" :value="edif.numero">{{edif.nome}}</option>
  </select>
  <br>
  <label class="nome" for="check-elemento">Categoria elemento</label>
  <select v-if="selectLocalità === 'loc-pdiff'" class="valore" v-model="selectElemento">
    <option value="manufatto">Manufatto</option>
    <option value="dettaglio">Dettaglio</option>
  </select>
  <select v-else class="valore" v-model="selectElemento">
    <option v-for="el in listaElementi" :key="el.tabella" :value="el.tabella">{{el.alias}}</option>
  </select>
  <br>
</div>
</template>

<script>
import { onMounted, toRefs, watch, inject} from 'vue';
import {prendiSigleLocalità, leggiDBMarkerEdifAmbito, prendiLOD, leggiDBMarkerLocPdiff} from '../js/richieste';
import LoadingScreen from './elementi/LoadingScreen.vue';

export default {
  name: 'TabCollectionPercorso',
  components: {
    LoadingScreen,
  },
  setup() {
    const statePercorso = inject('stateArtifact');

    watch(() => statePercorso.selectLocalità, async newVal => {
      const listaEdifFiltrata = statePercorso.listaEdif.filter(ed => ed.località === newVal);
      statePercorso.listaEdifFiltrata = listaEdifFiltrata;
      if (listaEdifFiltrata[0] && listaEdifFiltrata[0].numero) statePercorso.selectEdificio = listaEdifFiltrata[0].numero;
      else if (listaEdifFiltrata[0] && listaEdifFiltrata[0].sigla) statePercorso.selectEdificio = listaEdifFiltrata[0].sigla;
      else statePercorso.selectEdificio = '';
      if (newVal !== 'loc-pdiff') statePercorso.selectElemento = statePercorso.listaElementi[0].tabella;
      else statePercorso.selectElemento = 'manufatto';
    });

    onMounted(async () => {
      statePercorso.caricamento = true;
      const listaSigleLoc = await prendiSigleLocalità();
      const listaEdif = await leggiDBMarkerEdifAmbito();
      // const listaEdif = await leggiDBMarkerEdif();
      const listaLocPdiff = await leggiDBMarkerLocPdiff();
      const listaElementi = await prendiLOD(4);
      statePercorso.listaSigleLoc = listaSigleLoc;
      statePercorso.listaEdif = [...listaEdif, ...listaLocPdiff];
      statePercorso.listaElementi = listaElementi;
      statePercorso.selectLocalità = listaSigleLoc[0].sigla;
      statePercorso.selectElemento = listaElementi[0].tabella;
      statePercorso.caricamento = false;
      console.log(statePercorso.listaEdif);
    });

    return {
      ...toRefs(statePercorso),
    }
  }
}
</script>

<style scoped>
button ~ button {
  margin-left: .4rem;
}
.valore {
  float: right;
}
</style>

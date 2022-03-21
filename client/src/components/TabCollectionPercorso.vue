<template>
<div>
  <label class="nome" for="check-località">Località</label>
  <select class="valore" v-model="selectLocalità">
    <option v-for="loc in listaSigleLoc" :key="loc.sigla" :value="loc.sigla">{{loc.nome}}</option>
  </select>
  <br>
  <label class="nome" for="check-edificio">Edificio</label>
  <select class="valore" v-model="selectEdificio">
    <option v-for="edif in listaEdifFiltrata" :key="edif.numero" :value="edif.numero">{{edif.nome}}</option>
  </select>
  <br>
  <label class="nome" for="check-elemento">Elemento</label>
  <select class="valore" v-model="selectElemento">
    <option v-for="el in listaElementi" :key="el.tabella" :value="el.tabella">{{el.alias}}</option>
  </select>
  <br>
</div>
</template>

<script>
import { onMounted, toRefs, watch, inject} from 'vue';
import {prendiSigleLocalità, leggiDBMarkerEdif, prendiLOD} from '../js/richieste';

export default {
  name: 'TabCollectionPercorso',
  props: {
    stateUD: String
  },
  setup(props) {
    const stateDownload = inject(props.stateUD);

    watch(() => stateDownload.selectLocalità, async newVal => {
      const listaEdifFiltrata = stateDownload.listaEdif.filter(ed => ed.località === newVal);
      stateDownload.listaEdifFiltrata = listaEdifFiltrata;
      if (listaEdifFiltrata[0]) stateDownload.selectEdificio = listaEdifFiltrata[0].numero;
      else stateDownload.selectEdificio = '';
    });

    onMounted(async () => {
      stateDownload.caricamento = true;
      const listaSigleLoc = await prendiSigleLocalità();
      const listaEdif = await leggiDBMarkerEdif();
      const listaElementi = await prendiLOD(4);
      stateDownload.listaSigleLoc = listaSigleLoc;
      stateDownload.listaEdif = listaEdif;
      stateDownload.listaElementi = listaElementi;
      stateDownload.selectLocalità = listaSigleLoc[0].sigla;
      stateDownload.selectElemento = listaElementi[0].tabella;
      stateDownload.caricamento = false;
    });

    return {
      ...toRefs(stateDownload),
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
  margin-left: 4rem;
}
label[for=input-data-da], label[for=input-data-a] {
  margin-left: .4rem;
  font-weight: normal;
}
.valore {
  float: right;
}
</style>

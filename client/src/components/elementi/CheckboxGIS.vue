<template>
  <div>
    <img v-if="!condizione" src="../../assets/img/ajax-loader-4.gif" class="img-cbx-gis">
    <input v-if="condizione" :id="`cbx-${idUnivoco}`" :value="valore" v-model="livelli.livelliGISAttivi" :style="{'accent-color': colore}" type="checkbox" class="cbx-gis">
    <label :for="`cbx-${idUnivoco}`">{{nome}}</label>
  </div>
</template>

<script>
import {inject, watch} from 'vue';

export default {
  name: 'Checkbox',
  props: {
    idUnivoco: String,
    valore: String,
    nome: String,
    colore: String,
    condizione: Boolean,
  },
  setup() {
    const store = inject('store');
    const livelli = inject('livelliGISAttivi');

    watch(() => livelli.livelliGISAttivi, (newList, oldList) => {
      if (newList.length > oldList.length) {
        newList.forEach(liv => {
          if (!oldList.includes(liv)) {
            store.methods.aggiungiLivello(store.state.entitàGIS[liv].geometria);
            console.log(store.state.entitàGIS[liv].geometria);
            console.log(`ho aggiunto ${liv}`);
          }
        });
      }
      else {
        oldList.forEach(liv => {
          if (!newList.includes(liv)) {
            store.methods.rimuoviLivello(store.state.entitàGIS[liv].geometria);
            console.log(`ho tolto ${liv}`);
          }
        });
      }
    }, {
      deep: true,
    });

    return {
      store,
      livelli,
    }
  }
}
</script>

<style scoped>
.cbx-gis, .img-cbx-gis {
  margin-right: 10px;
}
</style>

<template>
<div></div>
</template>

<script>
import {onMounted, inject} from 'vue';
// import {creaLivelloGIS} from '../../js/GIS';

export default {
  name: 'GISLayer',
  props: {
    livello: String,
    mappa: Object
  },
  setup(props) {
    const store = inject('store');

    onMounted(() => {
      // const liv = creaLivelloGIS(store.state.entitàGIS[props.livello]);
      // console.log(liv);
      // store.methods.setGeometriaEntità(props.livello, liv);
      store.methods.aggiungiLivelloGIS(props.livello);
    });
  }
}
</script>

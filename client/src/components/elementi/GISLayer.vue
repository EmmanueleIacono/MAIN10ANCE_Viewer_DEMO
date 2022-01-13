<template>
<div></div>
</template>

<script>
import {inject, watch} from 'vue';
import {creaLivelloGIS} from '../../js/GIS';

export default {
  name: 'GISLayer',
  props: {
    livello: String,
  },
  setup(props) {
    const store = inject('store');

    watch(() => store.stateGIS.entitàGIS[props.livello].ready, () => {
      const liv = creaLivelloGIS(store.stateGIS.entitàGIS[props.livello]);
      store.methods.setGeometriaEntità(props.livello, liv);
    });
  }
}
</script>

<template>
<div>
  <img v-if="!pronto" src="../../assets/img/ajax-loader-4.gif" class="img-cbx-gis">
  <input v-show="pronto" :id="`cbx-${idUnivoco}`" :value="valore" :style="{'accent-color': colore}" type="checkbox" class="cbx-gis">
  <label :for="`cbx-${idUnivoco}`">{{nome}}</label>
</div>
</template>

<script>
import {watch} from 'vue';

export default {
  name: 'Checkbox',
  props: {
    idUnivoco: String,
    valore: String,
    nome: String,
    colore: String,
    pronto: Boolean,
  },
  setup(props, context) {
    watch(() => props.pronto, (newCond) => {
      if (newCond) {
        emettiCreaLivello(props.idUnivoco);
      }
    });

    function emettiCreaLivello(idLiv) {
      context.emit('creazioneLivello', idLiv);
    }
  }
}
</script>

<style scoped>
.cbx-gis, .img-cbx-gis {
  margin-right: 10px;
}
</style>

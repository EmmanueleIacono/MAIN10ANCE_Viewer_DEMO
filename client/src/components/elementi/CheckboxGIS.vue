<template>
  <div>
    <img v-if="!condizione" src="../../assets/img/ajax-loader-4.gif" class="img-cbx-gis">
    <input v-if="condizione" :id="`cbx-${idUnivoco}`" :value="valore" :style="{'accent-color': colore}" type="checkbox" class="cbx-gis">
    <label :for="`cbx-${idUnivoco}`">{{nome}}</label>
  </div>
</template>

<script>
export default {
  name: 'Checkbox',
  props: {
    idUnivoco: String,
    valore: String,
    nome: String,
    colore: String,
    condizione: Boolean,
  }
}
</script>

<style scoped>
.cbx-gis, .img-cbx-gis {
  margin-right: 10px;
}
</style>

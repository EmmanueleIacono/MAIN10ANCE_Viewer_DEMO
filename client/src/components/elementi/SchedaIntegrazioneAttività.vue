<template>
  <div :class="pianificate ? 'verde' : 'blu'" class="wrapper-scheda">
    <p><b>Attività: </b>{{stringAtt}}</p>
    <p><b>Descrizione: </b></p>
    <p><b>Categoria: </b>{{attività.cl_ogg_fr}}</p>
    <p class="data">{{attività.data_ins}}</p>
    <div class="dx">
      <button @click="integra" :class="integrazioneAttiva ? 'glyphicon-minus' : 'glyphicon-plus'" class="glyphicon integra"></button>
    </div>
    <div v-if="integrazioneAttiva">
      qui dentro integrazione
      <button @click="salvaIntegrazione">Salva</button>
    </div>
  </div>
</template>

<script>
import {reactive, toRefs, computed} from 'vue';

export default {
  name: 'SchedaIntegrazioneAttività',
  props: {
    pianificate: Boolean,
    attività: Object,
  },
  setup(props) {
    const state = reactive({
      integrazioneAttiva: false,
    });

    const stringAtt = computed(() => {
      return props.attività.tipo_attività.join(', ');
    });

    console.log(props);

    function integra() {
      state.integrazioneAttiva = !state.integrazioneAttiva;
    }

    function salvaIntegrazione() {
      console.log('sto salvando i nuovi dati');
    }

    return {
      ...toRefs(state),
      stringAtt,
      integra,
      salvaIntegrazione,
    }
  }
}
</script>

<style scoped>
.wrapper-scheda {
  padding: 5px;
  margin: 10px;
  border-radius: 10px;
  position: relative;
}
.verde {
  background-color: var(--verdeMain10anceTrasparenza);
}
.blu {
  background-color: var(--bluInterregTrasparenza);
}
.dx {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.integra {
  border: none;
  background-color: var(--verdeMain10anceTrasparenza);
  color: var(--blackOlive);
  padding: 5px;
  margin: 5px;
  border-radius: 15px;
}
.integra:hover {
  background-color: var(--verdeMain10ance);
}
.data {
  position: absolute;
  margin: 5px;
  top: 0;
  right: 0;
}
</style>

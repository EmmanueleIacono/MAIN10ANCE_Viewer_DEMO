<template>
<Card>
  <h5><b>GALLERIA</b></h5>
  <div class="bottoni-galleria">
    <div class="btn-gall btn-left">
      <BtnBIM @click="indietro" icona="glyphicon-chevron-left" nome="img-prev" title="Precedente" colore="verde" />
    </div>
    <div class="btn-gall btn-right">
      <BtnBIM @click="avanti" icona="glyphicon-chevron-right" nome="img-next" title="Successiva" colore="verde" />
    </div>
  </div>
  <br />
  <br />
  <div v-if="stateGalleria.listaImmagini.length" class="contenitore-immagine">
    <img :src="stateGalleria.listaImmagini[indiceImmagineCorrente].object">
    <br />
    <h6><b>{{nomeImmagine}}</b></h6>
    <p class="conteggio-immagini"><b>{{indiceImmagineCorrente + 1}}/{{stateGalleria.listaImmagini.length}}</b></p>
  </div>
</Card>
</template>

<script>
import {computed, inject, ref, watch} from 'vue';
import Card from './elementi/Card.vue';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';

export default {
  name: 'TabCollectionGallery',
  components: {
    Card,
    BtnBIM,
  },
  setup() {
    const stateGalleria = inject('stateGalleria');
    const indiceImmagineCorrente = ref(0);
    const nomeImmagine = computed(() => stateGalleria.listaImmagini[indiceImmagineCorrente.value].percorso.split('/').pop());

    watch(() => stateGalleria.listaImmagini, () => {
      indiceImmagineCorrente.value = 0;
    });

    function indietro() {
      if (indiceImmagineCorrente.value > 0) indiceImmagineCorrente.value -= 1;
      else indiceImmagineCorrente.value = stateGalleria.listaImmagini.length -1;
    }

    function avanti() {
      if (indiceImmagineCorrente.value < stateGalleria.listaImmagini.length - 1) indiceImmagineCorrente.value += 1;
      else indiceImmagineCorrente.value = 0;
    }

    return {
      stateGalleria,
      indiceImmagineCorrente,
      nomeImmagine,
      indietro,
      avanti,
    }
  }
}
</script>

<style scoped>
.bottoni-galleria {
  margin-top: 20px;
}
.btn-left {
  float: left;
}
.btn-right, .conteggio-immagini {
  float: right;
}
.contenitore-immagine {
  margin-top: 10px;
}
.contenitore-immagine h6 {
  text-align: center;
}
.contenitore-immagine img {
  max-width: 100%;
}
</style>

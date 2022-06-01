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
  <div v-if="stateGalleria.listaImmagini.length" class="contenitore-colonne mt40">
    <div class="colonna">
      <p v-if="datiImmagine.Nome"><b>Nome: </b>{{datiImmagine["Nome"]}}</p>
      <p v-else><b>Nome: </b><i>N/A</i></p>
      <p v-if="datiImmagine.Artista"><b>Artista: </b>{{datiImmagine["Artista"]}}</p>
      <p v-else><b>Artista: </b><i>N/A</i></p>
      <p v-if="datiImmagine.Datazione"><b>Datazione: </b>{{datiImmagine["Datazione"]}}</p>
      <p v-else><b>Datazione: </b><i>N/A</i></p>
    </div>
    <div class="colonna">
      <p v-if="datiImmagine.Dimensioni"><b>Dimensioni: </b>{{datiImmagine["Dimensioni"]}}</p>
      <p v-else><b>Dimensioni: </b><i>N/A</i></p>
      <p v-if="datiImmagine.Note"><b>Note: </b>{{datiImmagine["Note"]}}</p>
      <p v-else><b>Note: </b><i>N/A</i></p>
      <p><b>id_main10ance: </b>{{datiImmagine["id_main10ance"]}}</p>
    </div>
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
    const datiImmagine = computed(() => stateGalleria.listaImmagini[indiceImmagineCorrente.value].info);

    watch(() => stateGalleria.listaImmagini, () => {
      indiceImmagineCorrente.value = 0;
    });

    function indietro() {
      if (indiceImmagineCorrente.value > 0) indiceImmagineCorrente.value -= 1;
      else indiceImmagineCorrente.value = stateGalleria.listaImmagini.length - 1;
    }

    function avanti() {
      if (indiceImmagineCorrente.value < stateGalleria.listaImmagini.length - 1) indiceImmagineCorrente.value += 1;
      else indiceImmagineCorrente.value = 0;
    }

    return {
      stateGalleria,
      indiceImmagineCorrente,
      nomeImmagine,
      datiImmagine,
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
.contenitore-colonne {
  display: flex;
}
.colonna {
  flex: 50%;
}
.mt40 {
  margin-top: 40px;
  margin-bottom: 10px;
}
</style>

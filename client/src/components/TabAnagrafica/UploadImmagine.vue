<template>
<div>
  <img :src="props.source" alt="Anteprima">
  <br />
  <div class="wrapper-info">
    <div class="contenitore">
      <label for="percorso" class="colonna1">Percorso di destinazione:</label>
      <p id="percorso" class="colonna2">
        <b v-if="verificaPercorso(props.percorso)">{{props.percorso}}</b>
        <i v-else>Percorso non valido</i>
      </p>
    </div>
    <div class="contenitore">
      <label for="id_main10ance" class="colonna1">id_main10ance:</label>
      <p id="id_main10ance" class="colonna2"><b>{{id_main10ance}}</b></p>
    </div>
    <div class="contenitore">
      <label for="nome" class="colonna1">Nome/Soggetto</label>
      <input v-model="state_elemento.nome" id="nome" class="colonna2">
    </div>
    <div class="contenitore">
      <label for="codice" class="colonna1">Codice</label>
      <input v-model="state_elemento.codice" id="codice" class="colonna2">
    </div>
    <div class="contenitore">
      <label for="artista" class="colonna1">Artista/Autore</label>
      <input v-model="state_elemento.artista" id="artista" class="colonna2">
    </div>
    <div class="contenitore">
      <label for="datazione" class="colonna1">Datazione</label>
      <input v-model="state_elemento.datazione" id="datazione" class="colonna2">
    </div>
    <div class="contenitore">
      <label for="dimensioni" class="colonna1">Dimensioni</label>
      <input v-model="state_elemento.dimensioni" id="dimensioni" class="colonna2">
    </div>
    <div class="contenitore">
      <label for="commenti" class="colonna1">Note</label>
      <textarea v-model="state_elemento.commenti" id="commenti" class="colonna2"></textarea>
    </div>
  </div>
  <div class="wrapper-bottoni flt-dx">
    <BtnBIM @click="annulla" icona="glyphicon-remove" nome="img-remove" title="Annulla" colore="verde" class="btn-img" />
    <BtnBIM @click="salva" icona="glyphicon-floppy-disk" nome="img-save" title="Salva" colore="verde" class="btn-img last" />
  </div>
</div>
</template>

<script setup>
import { inject, computed } from 'vue';
import { verificaPercorso } from '../../js/shared';
import BtnBIM from '../elementi/BottoneBIMExplorer.vue';

const props = defineProps({
  source: String,
  percorso: String,
});

const emit = defineEmits(['annullaCaricamento', 'salvaCaricamento']);

const store_anagrafica = inject('store_anagrafica');
const state_anagrafica = store_anagrafica.state_anagrafica;
const state_elemento = state_anagrafica.dati_elemento;

const codice_pulito = computed(() => state_elemento.codice.trim().replaceAll(/(\s|\|)/g, '_'));
const id_main10ance = computed(() => `${state_anagrafica.selezione.select_loc}|${state_anagrafica.selezione.select_edif}|${state_anagrafica.selezione.select_elem}|${codice_pulito.value}`);

function annulla() {
  emit('annullaCaricamento');
}

function salva() {
  const dati_completi = {...state_elemento, id_main10ance: id_main10ance.value};
  emit('salvaCaricamento', dati_completi);
}
</script>

<style scoped>
img {
  max-width: 100%;
}
label {
  margin-bottom: 0;
}
p {
  margin: 0;
}
textarea {
  resize: vertical;
}
.wrapper-info {
  margin-top: 20px;
}
.contenitore {
  display: flex;
  margin-bottom: 10px;
}
.contenitore p {
  align-self: center;
}
.colonna1 {
  flex: .5;
}
.colonna2 {
  flex: .5;
  line-height: 100%;
}
.flt-dx {
  float: right;
}
.btn-img {
  margin-top: 10px;
}
.btn-img ~ .btn-img {
  margin-left: .9rem;
}
.btn-img.last {
  margin-right: 0;
}
</style>

<template>
<div>
  <img :src="source" alt="Anteprima">
  <br />
  <div class="wrapper-info">
    <div class="contenitore">
      <label for="id_main10ance" class="colonna1">id_main10ance:</label>
      <p id="id_main10ance" class="colonna2"><b>{{id_main10ance}}</b></p>
    </div>
    <div class="contenitore">
      <label for="nome" class="colonna1">Nome</label>
      <input id="nome" class="colonna2">
    </div>
    <div class="contenitore">
      <label for="artista" class="colonna1">Artista</label>
      <input id="artista" class="colonna2">
    </div>
    <div class="contenitore">
      <label for="datazione" class="colonna1">Datazione</label>
      <input id="datazione" class="colonna2">
    </div>
    <div class="contenitore">
      <label for="dimensioni" class="colonna1">Dimensioni</label>
      <input id="dimensioni" class="colonna2"> 
    </div>
    <div class="contenitore">
      <label for="note" class="colonna1">Note</label>
      <textarea id="commenti" class="colonna2"></textarea>
    </div>
  </div>
</div>
</template>

<script>
import {computed, inject} from 'vue';
import {dataInteger} from '../js/shared';

export default {
  name: 'TabCollectionUploadImage',
  props: {
    source: String,
    stateUD: String,
  },
  setup(props) {
    const stateUpload = inject(props.stateUD);

    const id_main10ance = computed(() => `${stateUpload.selectLocalità}|${stateUpload.selectEdificio}|${stateUpload.selectElemento}|${dataInteger()}`);
    /////////////       TENERE!       //////////////////

    // async function uploadImage() {
    //   if(!state.previewImage) return;
    //   try {
    //     const {error} = await supabase.storage.from("sacri-monti").upload(state.filePath, state.file);
    //     if (error) throw error;
    //     else {
    //       await listImage(folderPath.value);
    //       state.previewImage = null;
    //     }
    //   }
    //   catch (error) {
    //     alert(error.message);
    //   }
    // }

    // creaRecordLOD4([id_main10ance.value]);

    ///////// QUESTA NON DA USARE QUA, POI LA SPOSTO
    // async function deleteImage() {
    //   const {error} = await supabase.storage.from('sacri-monti').remove(state.percorsiSelezionati);
    //   if (error) throw error;
    //   else {
    //     await listImage(folderPath.value);
    //   }
    // }

    return {
      id_main10ance,
      // uploadImage,
    }
  }
}
</script>

<style scoped>
img {
  max-width: 100%;
}
label {
  margin-bottom: 0;
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
/* .flt-dx {
  float: right;
} */
/* .btn {
  margin-left: 1rem;
  background-color: gray;
  border: none;
  color: white;
  cursor: pointer;
}
.btn:hover {
  background-color: var(--verdeMain10ance);
}
.btn label {
  cursor: pointer;
} */
</style>

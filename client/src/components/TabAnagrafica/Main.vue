<template>
  <div>
    <MainPanel :colonna="'col-sm-7'">
      WIP
    </MainPanel>
    <Explorer :colonna="'col-sm-5'">
      <Details summary="PERCORSO" :open="true">
        <label class="nome" for="check-località">Località</label>
        <select class="valore" v-model="state_anagrafica.selezione.select_loc">
          <option v-for="loc in state_globale.lista_località" :key="loc.sigla" :value="loc.sigla">{{loc.nome}}</option>
        </select>
        <br>
        <label class="nome" for="check-località">Edifici</label>
        <select class="valore" v-model="state_anagrafica.selezione.select_edif">
          <option v-for="ed in state_anagrafica.selezione.lista_edif_filtrata" :key="ed.edificio" :value="ed.edificio">{{ed.edif_nome_menu}}</option>
        </select>
        <!-- <br>
        <label class="nome" for="check-località">Classe elementi</label>
        <select class="valore" v-model="state_anagrafica.selezione.select_classe">
          <option v-for="cl in state_globale.lista_cl_ogg" :key="cl.cl_ogg" :value="cl.cl_ogg">{{cl.cl_ogg}}</option>
        </select> -->
        <!-- <br>
        <label class="nome" for="check-località">Elementi</label>
        <select class="valore" v-model="state_anagrafica.selezione.select_elem">
          <option v-for="el in state_anagrafica.selezione.lista_elem_filtrata" :key="el.elemento_sigla" :value="el.elemento_sigla">{{el.elemento_nome}}</option>
        </select> -->
        <br>
        <label class="nome" for="check-località">TEMP: LIV 1</label>
        <select class="valore" v-model="state_anagrafica.selezione.select_def_liv_1">
          <option v-for="def in state_globale.gerarchia_classi_elementi" :key="def.id" :value="def.sigla">{{def.nome}}</option>
        </select>
        <!-- <div v-if="state_anagrafica.selezione.select_def_liv_1"> -->
          <br>
          <label class="nome" for="check-località">TEMP: LIV 2</label>
          <select class="valore" v-model="state_anagrafica.selezione.select_def_liv_2">
            <option v-for="def in opzioni_livello_2" :key="def.id" :value="def.sigla">{{def.nome}}</option>
          </select>
        <!-- </div> -->
        <!-- <div v-if="state_anagrafica.selezione.select_def_liv_2"> -->
          <br>
          <label class="nome" for="check-località">TEMP: LIV 3</label>
          <select class="valore" v-model="state_anagrafica.selezione.select_def_liv_3">
            <option v-for="def in opzioni_livello_3" :key="def.id" :value="def.sigla">{{def.nome}}</option>
          </select>
        <!-- </div> -->
        <!-- <div v-if="state_anagrafica.selezione.select_def_liv_3"> -->
          <br>
          <label class="nome" for="check-località">TEMP: LIV 4</label>
          <select class="valore" v-model="state_anagrafica.selezione.select_def_liv_4">
            <option v-for="def in opzioni_livello_4" :key="def.id" :value="def.sigla">{{def.nome}}</option>
          </select>
        <!-- </div> -->
      </Details>
      <div class="explorer-body">
        <div class="loading-wrapper">
          <LoadingScreen :caricamento="false" />
          <div class="wrapper-bottoni">
            <div class="input-wrapper">
              <BtnBIM @click="cliccaInput" icona="glyphicon-plus" nome="img-upload" title="Aggiungi elemento" colore="verde" />
              <input @change="mostraAnteprima" ref="inputAnagraficaRef" type="file" accept="image/*" />
            </div>
          </div>
          <UploadImmagine
            @annullaCaricamento="cancellaAnteprima"
            @salvaCaricamento="salvaImmagine"
            v-if="state_anagrafica.caricamento.anteprima_img"
            :source="state_anagrafica.caricamento.anteprima_img"
            :percorso="percorsoCartella"
          />
        </div>
      </div>
    </Explorer>
  </div>
</template>

<script>
import { computed, inject, onMounted, ref, watch } from "vue";
import { dataInteger } from "../../js/shared";
import MainPanel from '../elementi/MainPanel.vue';
import Explorer from '../elementi/Explorer.vue';
import Details from '../elementi/Details.vue';
import LoadingScreen from '../elementi/LoadingScreen.vue';
import BtnBIM from '../elementi/BottoneBIMExplorer.vue';
import UploadImmagine from "./UploadImmagine.vue";

export default {
  components: {
    MainPanel,
    Explorer,
    Details,
    LoadingScreen,
    BtnBIM,
    UploadImmagine,
  },
  setup() {
    const store_globale = inject('store_globale');
    const store_anagrafica = inject('store_anagrafica');
    const state_globale = store_globale.state_globale;
    const state_anagrafica = store_anagrafica.state_anagrafica;
    const methods_anagrafica = store_anagrafica.methods_anagrafica;
    console.log(state_globale);
    console.log(state_anagrafica);

    const inputAnagraficaRef = ref(null);

    const opzioni_livello_2 = computed(() => {
      return filtraOpzioniLivelli(
        state_globale.gerarchia_classi_elementi,
        state_anagrafica.selezione.select_def_liv_1,
        "livello_2"
      );
    });
    const opzioni_livello_3 = computed(() => {
      return filtraOpzioniLivelli(
        opzioni_livello_2.value,
        state_anagrafica.selezione.select_def_liv_2,
        "livello_3"
      );
    });
    const opzioni_livello_4 = computed(() => {
      return filtraOpzioniLivelli(
        opzioni_livello_3.value,
        state_anagrafica.selezione.select_def_liv_3,
        "livello_4"
      );
    }
    );
    const percorsoCartella = computed(() => `${state_anagrafica.selezione.select_loc}/${state_anagrafica.selezione.select_edif}/${state_anagrafica.selezione.select_elem}`);

    watch(() => [state_anagrafica.selezione.select_loc, /*state_anagrafica.selezione.select_classe*/], () => {
      filtraListaEdif();
      // filtraListaElem();
    }, {
      deep: true, // forse non serve
    });

    onMounted(async () => {});

    function temp2() {
      console.log('temp2');
    }

    function cliccaInput() {
      inputAnagraficaRef.value.click();
    }

    function mostraAnteprima(event) {
      const file = event.target.files[0];
      if (file) {
        const id_img = dataInteger();
        state_anagrafica.caricamento.id_img = id_img;
        state_anagrafica.caricamento.anteprima_img = URL.createObjectURL(file);
        const nuovoNomeImmagine = `${state_anagrafica.caricamento.id_img}__${file.name}`;
        const nuovoFile = new File([file], nuovoNomeImmagine, {type: file.type});
        state_anagrafica.caricamento.file = nuovoFile;
        console.log(state_anagrafica.caricamento);
        console.log('percorso cartella: ', percorsoCartella.value);
        console.log('nuovo nome file: ', nuovoNomeImmagine);
      }
      else {
        cancellaAnteprima();
      }
    }

    function cancellaAnteprima() {
      URL.revokeObjectURL(state_anagrafica.caricamento.anteprima_img);
      const dt = new DataTransfer();
      inputAnagraficaRef.value.files = dt.files;
      // state_anagrafica.caricamento.anteprima_img = null;
      // state_anagrafica.caricamento.file = null;
      // state_anagrafica.caricamento.id_img = '';
      methods_anagrafica.reset_state_anagrafica();
    }

    function salvaImmagine(dati) {
      alert('salvataggio work in progress');
      console.log("state anagrafica", state_anagrafica);
      console.log("dati", dati);
    }

    function filtraListaEdif() {
      const lista_edif = state_globale.lista_edifici;
      const lista_edif_filtrata = lista_edif.filter(edif => edif.località === state_anagrafica.selezione.select_loc);
      state_anagrafica.selezione.lista_edif_filtrata = lista_edif_filtrata;
    }

    // function filtraListaElem() {
    //   const lista_elem = state_globale.lista_elementi;
    //   const lista_elem_filtrata = lista_elem.filter(el => el.cl_ogg === state_anagrafica.selezione.select_classe);
    //   state_anagrafica.selezione.lista_elem_filtrata = lista_elem_filtrata;
    // }

    function filtraOpzioniLivelli(parentArray, selectedSigla, childKey) {
      if (!selectedSigla || !parentArray || parentArray.length === 0) return [];
      const parentObj = parentArray.find(def => def.sigla === selectedSigla);
      return parentObj ? (parentObj[childKey] || []) : [];
    }

    return {
      state_globale,
      state_anagrafica,
      inputAnagraficaRef,
      opzioni_livello_2,
      opzioni_livello_3,
      opzioni_livello_4,
      percorsoCartella,
      temp2,
      cliccaInput,
      mostraAnteprima,
      cancellaAnteprima,
      salvaImmagine,
    }
  }
}
</script>

<style scoped>
.wrapper-bottoni {
  display: inline-flex;
}

.explorer-body {
  padding: 10px;
  overflow: auto;
}

.nome {
  padding-left: 15px;
}

.valore {
  float: right;
}

.input-wrapper input {
  display: none;
}
</style>

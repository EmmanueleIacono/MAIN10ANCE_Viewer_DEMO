<template>
  <div :class="pianificate ? 'verde' : 'blu'" class="wrapper-scheda">
    <div class="contenitore-colonne mt20">
      <div class="colonna">
        <p><b>Attività: </b>{{stringAtt}}</p>
        <p><b>Classe oggetti: </b>{{attività.cl_ogg_fr}}</p>
        <p><b>Località: </b>{{attività.località_estesa}}</p>
        <p><b>Edificio: </b>{{edificio}}</p>
      </div>
      <div class="colonna">
        <p>
          <b>Descrizione: </b>
          <span v-for="att in attività.tipo_attività" :key="att">
            <p>
              <i>{{att}}: </i>
              {{attività[att]}}
            </p>
          </span>
        </p>
      </div>
    </div>
    <p class="id">{{attività.data_prog}}</p>
    <div class="dx">
      <button @click="integra" :class="[integrazioneAttiva ? 'glyphicon-minus' : 'glyphicon-plus', pianificate ? 'verde' : 'blu']" class="glyphicon integra"></button>
    </div>
    <div v-if="integrazioneAttiva">
      <div class="contenitore-colonne">
        <div class="colonna">
          <div class="contenitore-colonne centra">
            <label for="esecutori" class="colonna">Esecutori:</label>
            <input v-model="esecutori" id="esecutori" class="colonna">
          </div>
          <div class="contenitore-colonne centra">
            <label for="strumentazione" class="colonna">Strumentazione: </label>
            <input v-model="strumentazione" id="strumentazione" class="colonna">
          </div>
          <div class="contenitore-colonne centra">
            <label for="note" class="colonna">Note: </label>
            <input v-model="note" id="note" class="colonna">
          </div>
        </div>
        <div class="colonna">
          <div class="contenitore-colonne centra">
            <label for="costo" class="colonna">Costo previsto:</label>
            <input v-model="costoPrevisto" type="number" min="0" step=".01" id="costo" class="colonna">
          </div>
          <div class="contenitore-colonne centra">
            <label for="ore" class="colonna">Ore previste:</label>
            <input v-model="orePreviste" type="number" step=".5" id="ore" class="colonna">
          </div>
          <div class="contenitore-colonne centra">
            <label for="data" class="colonna">Data programmata:</label>
            <input v-model="dataProgrammata" type="date" id="data" class="colonna">
          </div>
        </div>
      </div>
      <button @click="salvaIntegrazione" class="bottone-main10ance">Salva</button>
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
      id_record: props.attività.id_att_prog,
      integrazioneAttiva: false,
      esecutori: '',
      strumentazione: '',
      note: '',
      costoPrevisto: null,
      orePreviste: null,
      dataProgrammata: props.attività.data_prog,
    });

    const stringAtt = computed(() => {
      return props.attività.tipo_attività.join(', ');
    });
    const edificio = computed(() => {
      return props.attività.id_main10ance[0].split('|')[1];
    });

    // console.log(props.attività);

    function integra() {
      state.integrazioneAttiva = !state.integrazioneAttiva;
      if (state.integrazioneAttiva) resetDati();
    }

    function resetDati() {
      state.esecutori = '';
      state.strumentazione = '';
      state.note = '';
      state.costoPrevisto = null;
      state.orePreviste = null;
      state.dataProgrammata = props.attività.data_prog;
    }

    function salvaIntegrazione() {
      console.log(state);
    }

    return {
      ...toRefs(state),
      stringAtt,
      edificio,
      integra,
      salvaIntegrazione,
    }
  }
}
</script>

<style scoped>
input {
  margin: 5px;
  z-index: 100;
}
.bottone-main10ance {
  margin-left: 0;
  margin-bottom: 0;
}
.bottone-main10ance:hover {
  background-color: var(--verdeMain10anceTrasparenza);
}
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
  z-index: 90;
}
.integra {
  border: none;
  /* background-color: var(--verdeMain10anceTrasparenza); */
  color: var(--blackOlive);
  padding: 5px;
  margin: 5px;
  border-radius: 15px;
}
.integra.verde:hover {
  background-color: var(--verdeMain10ance);
}
.integra.blu:hover {
  background-color: var(--bluInterreg);
}
.id {
  position: absolute;
  margin: 5px;
  top: 0;
  right: 0;
}
.contenitore-colonne {
  display: flex;
}
.colonna {
  flex: 50%;
}
.centra {
  align-items: center;
}
.mt20 {
  margin-top: 20px;
}
</style>

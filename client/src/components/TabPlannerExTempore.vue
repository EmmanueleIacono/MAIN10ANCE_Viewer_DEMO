<template>
  <Card>
    <Details summary="PROGRAMMAZIONE EX-TEMPORE" :open="false">
      <div class="contenitore-bottoni-scelta">
        <!-- <button @click="moduloVisibile = 'contr'">Programma controllo straordinario</button> -->
        <!-- <button @click="moduloVisibile = 'int'">Programma intervento a guasto</button> -->
      </div>
      <div v-if="state.moduloVisibile">
        <!-- <h4>{{moduloVisibile === 'contr' ? 'Controllo straordinario' : 'Pronto intervento'}}</h4> -->
        <h4>Controllo straordinario</h4>
      </div>
      <div v-if="state.moduloVisibile" class="contesto">
        <div class="contenitore-colonne">
          <label for="localita-ex-tmp" class="colonna">Località:</label>
          <select v-model="state.selectLocalita" id="localita-ex-tmp" class="colonna">
            <option value=""></option>
            <option v-for="loc in store.statePlanner.listaSigleLoc" :key="loc.sigla" :value="loc.sigla">{{loc.nome}}</option>
          </select>
          <label for="select-cl-ogg" class="colonna">Classe oggetti:</label>
          <select v-model="state.selectClOgg" id="select-cl-ogg" class="colonna">
            <option value=""></option>
            <option v-for="cl in store.statePlanner.listaClOgg" :key="cl.unnest" :value="cl.unnest">{{cl.unnest}}</option>
          </select>
        </div>
        <div class="label-edificio"><b>Edificio:</b></div>
        <div id="div-edificio-prog">
          <div v-for="s in state.listaSigleEdificiFiltrata" :key="s.edificio" class="checkbox-edifici">
            <input v-model="state.listaSigleEdificiSelezionati" :id="`check-edif-prog-${s.edificio}`" :value="s.edificio" type="checkbox">
            <label :for="`check-edif-prog-${s.edificio}`">{{s.edificio}}</label>
          </div>
        </div>
        <br />
      </div>
      <div v-if="state.moduloVisibile === 'contr'">
        <div class="label-descrizione"><b>Descrizione attività:</b></div>
        <div id="div-descrizione">
          <textarea v-model="state.datiContrStr.descrizioneContr"></textarea>
        </div>
        <div class="contenitore-colonne">
          <label for="esecutori" class="colonna">Esecutori:</label>
          <input v-model="state.datiContrStr.esecutori" id="esecutori" class="colonna">
          <label for="costo" class="colonna">Costo previsto (€):</label>
          <input v-model="state.datiContrStr.costoPrevisto" type="number" min="0" step=".01" id="costo" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="strumentazione" class="colonna">Strumentazione:</label>
          <input v-model="state.datiContrStr.strumentazione" id="strumentazione" class="colonna">
          <label for="ore" class="colonna">Ore previste:</label>
          <input v-model="state.datiContrStr.orePreviste" type="number" step=".5" id="ore" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="note" class="colonna">Note:</label>
          <input v-model="state.datiContrStr.note" id="note" class="colonna">
          <label for="data" class="colonna">Data programmata:</label>
          <input v-model="state.datiContrStr.dataProgrammata" type="date" id="data" class="colonna">
        </div>
      </div>
      <div v-if="state.moduloVisibile === 'int'">
        <div class="label-descrizione"><b>Descrizione attività:</b></div>
        <div id="div-descrizione">
          <textarea v-model="state.datiProntoInt.descrizioneProntoInt"></textarea>
        </div>
        <div class="contenitore-colonne">
          <label for="esecutori" class="colonna">Esecutori:</label>
          <input v-model="state.datiProntoInt.esecutori" id="esecutori" class="colonna">
          <label for="costo" class="colonna">Costo previsto (€):</label>
          <input v-model="state.datiProntoInt.costoPrevisto" type="number" min="0" step=".01" id="costo" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="strumentazione" class="colonna">Strumentazione:</label>
          <input v-model="state.datiProntoInt.strumentazione" id="strumentazione" class="colonna">
          <label for="ore" class="colonna">Ore previste:</label>
          <input v-model="state.datiProntoInt.orePreviste" type="number" step=".5" id="ore" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="note" class="colonna">Note:</label>
          <input v-model="state.datiProntoInt.note" id="note" class="colonna">
          <label for="data" class="colonna">Data programmata:</label>
          <input v-model="state.datiProntoInt.dataProgrammata" type="date" id="data" class="colonna">
        </div>
      </div>
      <div v-if="state.moduloVisibile" class="contenitore-bottoni-salva">
        <button @click="chiudi" class="bottone-main10ance">Annulla</button>
        <button @click="salva" class="bottone-main10ance">Salva</button>
      </div>
    </Details>
  </Card>
</template>

<script setup>
import {inject, reactive, watch} from 'vue';
import Card from './elementi/Card.vue';
import Details from './elementi/Details.vue';

const store = inject('store');
const state = reactive({
  moduloVisibile: 'contr',
  selectLocalita: '',
  selectClOgg: '',
  listaSigleEdificiFiltrata: [],
  listaSigleEdificiSelezionati: [],
  datiContrStr: {
    descrizioneContr: '',
    esecutori: '',
    strumentazione: '',
    note: '',
    costoPrevisto: '',
    orePreviste: '',
    dataProgrammata: null,
  },
  datiProntoInt: {
    descrizioneProntoInt: '',
    esecutori: '',
    strumentazione: '',
    note: '',
    costoPrevisto: '',
    orePreviste: '',
    dataProgrammata: null,
  },
});

watch(() => state.selectLocalita, newVal => {
  const listaSigleEdificiFiltrata = store.statePlanner.listaSigleEdifici.filter(s => s.località === newVal);
  state.listaSigleEdificiFiltrata = listaSigleEdificiFiltrata;
  state.listaSigleEdificiSelezionati = [];
});

function chiudi() {
  state.moduloVisibile = '';
  resetDati();
}

function salva() { // implementare registrazione attività nel database
  switch (state.moduloVisibile) {
    case 'contr': {
      console.log(state.datiContrStr);
      console.log(state.selectLocalita);
      console.log(state.selectClOgg);
      console.log(state.listaSigleEdificiSelezionati);
      break;
    }
    case 'int': {
      console.log(state.datiProntoInt);
      break;
    }
    default: {
      store.methods.setAlert('Si è verificato un problema. Impossibile procedere');
      break;
    }
  }
}

function resetDati() {
  state.selectLocalita = '';
  state.selectClOgg = '';
  state.listaSigleEdificiFiltrata = [];
  state.listaSigleEdificiSelezionati = [];
  state.datiContrStr.descrizioneContr = '';
  state.datiContrStr.esecutori = '';
  state.datiContrStr.strumentazione = '';
  state.datiContrStr.note = '';
  state.datiContrStr.costoPrevisto = '';
  state.datiContrStr.orePreviste = '';
  state.datiContrStr.dataProgrammata = null;
  state.datiProntoInt.descrizioneProntoInt = '';
  state.datiProntoInt.esecutori = '';
  state.datiProntoInt.strumentazione = '';
  state.datiProntoInt.note = '';
  state.datiProntoInt.costoPrevisto = '';
  state.datiProntoInt.orePreviste = '';
  state.datiProntoInt.dataProgrammata = null;
}
</script>

<style scoped>
button {
  background-color: var(--bluInterreg);
}
button:hover {
  background-color: var(--bluInterregTrasparenza);
}
.contenitore-bottoni-scelta {
  display: flex;
  justify-content: space-between;
}
.contenitore-bottoni-scelta button {
  border: none;
  color: var(--ghostWhite);
  padding: 5px;
  font-weight: bold;
  margin-right: 10px;
  flex: 0 0 49.3%;
  margin: 10px 0;
}
.contenitore-bottoni-salva {
  float: right;
  margin-right: -10px;
}
textarea {
  width: 100%;
  resize: vertical;
}
.label-edificio, #div-edificio-prog, .label-descrizione, #div-descrizione {
  margin-left: 5px;
  margin-right: 5px;
}
.contenitore-colonne {
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}
.colonna {
  flex: 25%;
  margin-left: 5px;
  margin-right: 5px;
}
input[type="checkbox"] {
  margin-right: .4rem;
}
.checkbox-edifici {
  flex: 0 0 25%;
}
#div-edificio-prog {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>

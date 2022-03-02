<template>
  <Card>
    <Details summary="PROGRAMMAZIONE EX-TEMPORE" :open="false">
      <button @click="moduloVisibile = 'contr'">Programma controllo straordinario</button>
      <button @click="moduloVisibile = 'int'">Programma pronto intervento</button>
      <div v-if="moduloVisibile">
        <h4>{{moduloVisibile === 'contr' ? 'Controllo straordinario' : 'Pronto intervento'}}</h4>
      </div>
      <div v-if="moduloVisibile" class="contesto">
        <div class="contenitore-colonne">
          <label for="località" class="colonna">Località:</label>
          <select v-model="selectLocalità" id="località" class="colonna">
            <option value=""></option>
            <option v-for="loc in store.statePlanner.listaSigleLoc" :key="loc.sigla" :value="loc.sigla">{{loc.nome}}</option>
          </select>
          <label for="select-cl-ogg" class="colonna">Classe oggetti:</label>
          <select v-model="selectClOgg" id="select-cl-ogg" class="colonna">
            <option value=""></option>
            <option v-for="cl in store.statePlanner.listaClOgg" :key="cl.unnest" :value="cl.unnest">{{cl.unnest}}</option>
          </select>
        </div>
        <div class="label-edificio"><b>Edificio:</b></div>
        <div id="div-edificio-prog">
          <div v-for="s in listaSigleEdificiFiltrata" :key="s.edificio" class="checkbox-edifici">
            <input v-model="listaSigleEdificiSelezionati" :id="`check-edif-prog-${s.edificio}`" :value="s.edificio" type="checkbox">
            <label :for="`check-edif-prog-${s.edificio}`">{{s.edificio}}</label>
          </div>
        </div>
        <br />
        <div class="label-descrizione"><b>Descrizione attività:</b></div>
        <div id="div-descrizione">
          <textarea v-model="datiContrStr.descrizioneContr"></textarea>
        </div>
      </div>
      <div v-if="moduloVisibile === 'contr'">
        <div class="contenitore-colonne">
          <label for="esecutori" class="colonna">Esecutori:</label>
          <input v-model="datiContrStr.esecutori" id="esecutori" class="colonna">
          <label for="costo" class="colonna">Costo previsto (€):</label>
          <input v-model="datiContrStr.costoPrevisto" type="number" min="0" step=".01" id="costo" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="strumentazione" class="colonna">Strumentazione:</label>
          <input v-model="datiContrStr.strumentazione" id="strumentazione" class="colonna">
          <label for="ore" class="colonna">Ore previste:</label>
          <input v-model="datiContrStr.orePreviste" type="number" step=".5" id="ore" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="note" class="colonna">Note:</label>
          <input v-model="datiContrStr.note" id="note" class="colonna">
          <label for="data" class="colonna">Data programmata:</label>
          <input v-model="datiContrStr.dataProgrammata" type="date" id="data" class="colonna">
        </div>
      </div>
      <div v-if="moduloVisibile === 'int'">
        <div class="contenitore-colonne">
          <label for="esecutori" class="colonna">Esecutori:</label>
          <input v-model="datiProntoInt.esecutori" id="esecutori" class="colonna">
          <label for="costo" class="colonna">Costo previsto (€):</label>
          <input v-model="datiProntoInt.costoPrevisto" type="number" min="0" step=".01" id="costo" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="strumentazione" class="colonna">Strumentazione:</label>
          <input v-model="datiProntoInt.strumentazione" id="strumentazione" class="colonna">
          <label for="ore" class="colonna">Ore previste:</label>
          <input v-model="datiProntoInt.orePreviste" type="number" step=".5" id="ore" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="note" class="colonna">Note:</label>
          <input v-model="datiProntoInt.note" id="note" class="colonna">
          <label for="data" class="colonna">Data programmata:</label>
          <input v-model="datiProntoInt.dataProgrammata" type="date" id="data" class="colonna">
        </div>
      </div>
      <div v-if="moduloVisibile">
        <button @click="chiudi">Annulla</button>
        <button @click="salva">Salva</button>
      </div>
    </Details>
  </Card>
</template>

<script>
import {inject, reactive, toRefs, watch} from 'vue';
import Card from './elementi/Card.vue';
import Details from './elementi/Details.vue';

export default {
  name: 'TabPlannerExTempore',
  components: {
    Card,
    Details,
  },
  setup() {
    const store = inject('store');
    const state = reactive({
      moduloVisibile: '',
      selectLocalità: '',
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

    watch(() => state.selectLocalità, newVal => {
      const listaSigleEdificiFiltrata = store.statePlanner.listaSigleEdifici.filter(s => s.sacro_monte === newVal);
      state.listaSigleEdificiFiltrata = listaSigleEdificiFiltrata;
      state.listaSigleEdificiSelezionati = [];
    });

    function chiudi() {
      state.moduloVisibile = '';
      resetDati();
    }

    function salva() {
      switch (state.moduloVisibile) {
        case 'contr': {
          console.log(state.datiContrStr);
          console.log(state.selectLocalità);
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
      state.selectLocalità = '';
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

    return {
      store,
      ...toRefs(state),
      chiudi,
      salva,
    }
  }
}
</script>

<style scoped>
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

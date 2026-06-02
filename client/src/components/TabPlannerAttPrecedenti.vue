<template>
  <Card>
    <Details summary="ATTIVITÀ PRECEDENTI" :open="false">
      <div>
        <br />
        <label for="tabella" class="colonna">Tipo scheda:</label>
        <select v-model="state.moduloVisibile" id="tabella" class="colonna">
          <option v-for="(tab, ind) in listaTabelle" :key="ind" :value="tab.tab">{{tab.nome}}</option>
        </select>
        <h4 v-if="state.moduloVisibile === 'scheda_controllo'">Controllo</h4>
        <h4 v-if="state.moduloVisibile === 'scheda_manutenzione_regolare'">Manutenzione regolare</h4>
        <h4 v-if="state.moduloVisibile === 'scheda_manutenzione_correttiva'">Manutenzione correttiva</h4>
        <h4 v-if="state.moduloVisibile === 'scheda_manutenzione_straordinaria'">Manutenzione straordinaria</h4>
        <h4 v-if="state.moduloVisibile === 'scheda_restauro'">Restauro</h4>
      </div>
      <div v-if="state.moduloVisibile" class="contesto">
        <div class="contenitore-colonne">
          <label for="località" class="colonna">Località:</label>
          <select v-model="state.selectLocalita" id="località" class="colonna">
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
        <div class="contenitore-colonne">
          <label for="categoria" class="colonna">Categoria:</label>
          <select v-model="state.selectCategoria" id="categoria" class="colonna">
            <option value=""></option>
            <option v-for="(cat, ind) in state.listaCategorie" :key="ind" :value="cat">{{cat}}</option>
          </select>
          <label for="elemento" class="colonna">Elemento:</label>
          <input v-model="state.inputElemento" id="elemento" class="colonna">
        </div>
        <br />
      </div>
      <div v-if="state.moduloVisibile === 'scheda_controllo'">
        <div class="label-st-cons"><b>Stato di conservazione:</b></div>
        <div id="div-st-cons">
          <select v-model="state.datiContr.st_cons">
            <option v-for="(en, ind) in state.listaStCons" :key="ind" :value="ind+2">{{en}}</option>
          </select>
        </div>
        <br />
        <div class="label-cl-racc"><b>Classe di raccomandazione:</b></div>
        <div id="div-cl-racc">
          <select v-model="state.datiContr.cl_racc">
            <option v-for="(en, ind) in state.listaClRacc" :key="ind" :value="ind" :disabled="state.selectClRaccOpzioniBloccate.includes(ind)">{{en}}</option>
          </select>
        </div>
        <br />
        <div v-if="!state.selectLivUrgNascosto">
          <div class="label-liv-urg"><b>Livello di urgenza:</b></div>
          <div id="div-liv-urg">
            <select v-model="state.datiContr.liv_urg">
              <option v-for="(en, ind) in state.listaLivUrg" :key="ind" :value="ind+1">{{en}}</option>
            </select>
          </div>
          <br />
        </div>
        <div class="label-descrizione"><b>Descrizione attività:</b></div>
        <div id="div-descrizione">
          <textarea v-model="state.datiContr.descrizioneContr"></textarea>
        </div>
        <div class="contenitore-colonne">
          <label for="esecutori" class="colonna">Esecutori:</label>
          <input v-model="state.datiContr.esecutori" id="esecutori" class="colonna">
          <label for="costo" class="colonna">Costo (€):</label>
          <input v-model="state.datiContr.costo" type="number" min="0" step=".01" id="costo" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="strumentazione" class="colonna">Strumentazione:</label>
          <input v-model="state.datiContr.strumentazione" id="strumentazione" class="colonna">
          <label for="ore" class="colonna">Data inizio:</label>
          <input v-model="state.datiContr.dataInizio" type="date" id="data-i" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="note" class="colonna">Note:</label>
          <input v-model="state.datiContr.note" id="note" class="colonna">
          <label for="data" class="colonna">Data fine:</label>
          <input v-model="state.datiContr.dataFine" type="date" id="data-f" class="colonna">
        </div>
      </div>
      <div v-if="state.moduloVisibile === 'scheda_manutenzione_regolare'">
        <div class="label-descrizione"><b>Descrizione attività:</b></div>
        <div id="div-descrizione">
          <textarea v-model="state.datiManReg.descrizioneManReg"></textarea>
        </div>
        <div class="contenitore-colonne">
          <label for="esecutori" class="colonna">Esecutori:</label>
          <input v-model="state.datiManReg.esecutori" id="esecutori" class="colonna">
          <label for="costo" class="colonna">Costo (€):</label>
          <input v-model="state.datiManReg.costo" type="number" min="0" step=".01" id="costo" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="strumentazione" class="colonna">Strumentazione:</label>
          <input v-model="state.datiManReg.strumentazione" id="strumentazione" class="colonna">
          <label for="ore" class="colonna">Data inizio:</label>
          <input v-model="state.datiManReg.dataInizio" type="date" id="data-i" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="note" class="colonna">Note:</label>
          <input v-model="state.datiManReg.note" id="note" class="colonna">
          <label for="data" class="colonna">Data fine:</label>
          <input v-model="state.datiManReg.dataFine" type="date" id="data-f" class="colonna">
        </div>
      </div>
      <div v-if="state.moduloVisibile === 'scheda_manutenzione_correttiva'">
        <div class="label-descrizione"><b>Descrizione attività:</b></div>
        <div id="div-descrizione">
          <textarea v-model="state.datiManCorr.descrizioneManCorr"></textarea>
        </div>
        <div class="contenitore-colonne">
          <label for="esecutori" class="colonna">Esecutori:</label>
          <input v-model="state.datiManCorr.esecutori" id="esecutori" class="colonna">
          <label for="costo" class="colonna">Costo (€):</label>
          <input v-model="state.datiManCorr.costo" type="number" min="0" step=".01" id="costo" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="strumentazione" class="colonna">Strumentazione:</label>
          <input v-model="state.datiManCorr.strumentazione" id="strumentazione" class="colonna">
          <label for="ore" class="colonna">Data inizio:</label>
          <input v-model="state.datiManCorr.dataInizio" type="date" id="data-i" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="note" class="colonna">Note:</label>
          <input v-model="state.datiManCorr.note" id="note" class="colonna">
          <label for="data" class="colonna">Data fine:</label>
          <input v-model="state.datiManCorr.dataFine" type="date" id="data-f" class="colonna">
        </div>
      </div>
      <div v-if="state.moduloVisibile === 'scheda_manutenzione_straordinaria'">
        <div class="label-descrizione"><b>Descrizione attività:</b></div>
        <div id="div-descrizione">
          <textarea v-model="state.datiManStr.descrizioneManStr"></textarea>
        </div>
        <div class="contenitore-colonne">
          <label for="esecutori" class="colonna">Esecutori:</label>
          <input v-model="state.datiManStr.esecutori" id="esecutori" class="colonna">
          <label for="costo" class="colonna">Costo (€):</label>
          <input v-model="state.datiManStr.costo" type="number" min="0" step=".01" id="costo" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="strumentazione" class="colonna">Strumentazione:</label>
          <input v-model="state.datiManStr.strumentazione" id="strumentazione" class="colonna">
          <label for="ore" class="colonna">Data inizio:</label>
          <input v-model="state.datiManStr.dataInizio" type="date" id="data-i" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="note" class="colonna">Note:</label>
          <input v-model="state.datiManStr.note" id="note" class="colonna">
          <label for="data" class="colonna">Data fine:</label>
          <input v-model="state.datiManStr.dataFine" type="date" id="data-f" class="colonna">
        </div>
      </div>
      <div v-if="state.moduloVisibile === 'scheda_restauro'">
        <div class="label-descrizione"><b>Descrizione attività:</b></div>
        <div id="div-descrizione">
          <textarea v-model="state.datiRest.descrizioneRestauro"></textarea>
        </div>
        <div class="contenitore-colonne">
          <label for="esecutori" class="colonna">Esecutori:</label>
          <input v-model="state.datiRest.esecutori" id="esecutori" class="colonna">
          <label for="costo" class="colonna">Costo (€):</label>
          <input v-model="state.datiRest.costo" type="number" min="0" step=".01" id="costo" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="strumentazione" class="colonna">Strumentazione:</label>
          <input v-model="state.datiRest.strumentazione" id="strumentazione" class="colonna">
          <label for="ore" class="colonna">Data inizio:</label>
          <input v-model="state.datiRest.dataInizio" type="date" id="data-i" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="note" class="colonna">Note:</label>
          <input v-model="state.datiRest.note" id="note" class="colonna">
          <label for="data" class="colonna">Data fine:</label>
          <input v-model="state.datiRest.dataFine" type="date" id="data-f" class="colonna">
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
import {inject, reactive, watch, onMounted} from 'vue';
import {registraAttPrecedenti, leggiEnum} from '../js/richieste';
import {dataCorta, dataInteger} from '../js/shared';
import Card from './elementi/Card.vue';
import Details from './elementi/Details.vue';

onMounted(async () => {
  await datiEnumUNI();
});

const listaTabelle = [
  {nome: 'Controllo', tab: 'scheda_controllo'},
  {nome: 'Manutenzione regolare', tab: 'scheda_manutenzione_regolare'},
  {nome: 'Manutenzione correttiva', tab: 'scheda_manutenzione_correttiva'},
  {nome: 'Manutenzione straordinaria', tab: 'scheda_manutenzione_straordinaria'},
  {nome: 'Restauro', tab: 'scheda_restauro'},
];

const store = inject('store');
const state = reactive({
  moduloVisibile: 'scheda_controllo',
  selectLocalita: '',
  selectClOgg: '',
  selectCategoria: '',
  inputElemento: '',
  listaSigleEdificiFiltrata: [],
  listaSigleEdificiSelezionati: [],
  listaCategorie: ['', 'apparato_decorativo', 'arredo', 'catena', 'dipinto_murale', 'finestra', 'grata', 'muro', 'pavimento', 'pavimento_decorativo', 'pilastro', 'porta', 'quadro', 'scala', 'statua', 'tetto', 'trave', 'volta'],
  listaStCons: [],
  listaLivUrg: [],
  listaClRacc: [],
  datiContr: {
    descrizioneContr: '',
    esecutori: '',
    strumentazione: '',
    note: '',
    costo: '',
    st_cons: 2,
    liv_urg: 1,
    cl_racc: 0,
    dataInizio: null,
    dataFine: null,
  },
  datiManReg: {
    descrizioneManReg: '',
    esecutori: '',
    strumentazione: '',
    note: '',
    costo: '',
    dataInizio: null,
    dataFine: null,
  },
  datiManCorr: {
    descrizioneManCorr: '',
    esecutori: '',
    strumentazione: '',
    note: '',
    costo: '',
    dataInizio: null,
    dataFine: null,
  },
  datiManStr: {
    descrizioneManStr: '',
    esecutori: '',
    strumentazione: '',
    note: '',
    costo: '',
    dataInizio: null,
    dataFine: null,
  },
  datiRest: {
    descrizioneRestauro: '',
    esecutori: '',
    strumentazione: '',
    note: '',
    costo: '',
    dataInizio: null,
    dataFine: null,
  },
  selectMatriceDisabled: false, // con vecchia logica partiva da "true" // FORSE ELIMINABILE, NON AGISCE MAI SU INTERFACCIA
  selectLivUrgNascosto: true,
  selectClRaccOpzioniBloccate: [2, 3] // per bloccare opzioni non selezionabili
});

watch(() => state.selectLocalita, newVal => {
  const listaSigleEdificiFiltrata = store.statePlanner.listaSigleEdifici.filter(s => s.località === newVal);
  state.listaSigleEdificiFiltrata = listaSigleEdificiFiltrata;
  state.listaSigleEdificiSelezionati = [];
});

// ---------------------------------- NUOVA LOGICA ST_CONS, CL_RACC, LIV_URG ----------------------------------
watch(() => state.datiContr.cl_racc, newVal => {
  if (newVal > 1) {
    state.selectMatriceDisabled = false;
  } else {
    state.selectMatriceDisabled = true;
    if (state.datiContr.st_cons === 0) {
      state.datiContr.st_cons = 2;
      state.datiContr.liv_urg = 1;
    }
  }
});

watch(() => state.datiContr.st_cons, newVal => {
  switch(newVal) {
    case 2:
      state.selectLivUrgNascosto = true;
      state.selectClRaccOpzioniBloccate = [2, 3];
      state.datiContr.cl_racc = 0;
      state.datiContr.liv_urg = 1;
      break;
    case 3:
      state.selectLivUrgNascosto = false;
      state.selectClRaccOpzioniBloccate = [3];
      state.datiContr.cl_racc = 0;
      break;
    case 4:
    case 5:
      state.selectLivUrgNascosto = false;
      state.selectClRaccOpzioniBloccate = [0, 1];
      state.datiContr.cl_racc = 2;
      break;
  }
});

watch(() => state.datiContr.liv_urg, () => {
  if (state.datiContr.st_cons === 0) {
    state.datiContr.liv_urg = 1;
  }
});

// valutare se mettere un watch per reset dati al cambio di scheda

async function datiEnumUNI() {
  const enumStCons = await leggiEnum('st_cons');
  const enumLivUrg = await leggiEnum('liv_urg');
  const enumClRacc = await leggiEnum('cl_racc');
  state.listaStCons = enumStCons.map(en => en.unnest);
  state.listaLivUrg = enumLivUrg.map(en => en.unnest);
  state.listaClRacc = enumClRacc.map(en => en.unnest);
}

function chiudi() {
  state.moduloVisibile = '';
  resetDati();
}

async function salva() {
  const jsonReq = {};
  jsonReq.località = state.selectLocalita;
  jsonReq.cl_ogg = state.selectClOgg;
  jsonReq.edifici = state.listaSigleEdificiSelezionati;
  jsonReq.categoria = state.selectCategoria;
  jsonReq.elemento = state.inputElemento;
  const metadati = {};
  metadati.autore = store.state.userSettings.user_id;
  metadati.id_scheda = dataInteger();
  metadati.data_ins = dataCorta();
  metadati.tabella = state.moduloVisibile;
  jsonReq.metadati = metadati;
  // IMPOSTAZIONE DATI SPECIFICI SCHEDA
  switch (state.moduloVisibile) {
    case 'scheda_controllo': {
      jsonReq.dati = state.datiContr;
      break;
    }
    case 'scheda_manutenzione_regolare': {
      jsonReq.dati = state.datiManReg;
      break;
    }
    case 'scheda_manutenzione_correttiva': {
      jsonReq.dati = state.datiManCorr;
      break;
    }
    case 'scheda_manutenzione_straordinaria': {
      jsonReq.dati = state.datiManStr;
      break;
    }
    case 'scheda_restauro': {
      jsonReq.dati = state.datiRest;
      break;
    }
    default: {
      store.methods.setAlert('Si è verificato un problema. Impossibile procedere');
      break;
    }
  }
  // REGISTRAZIONE SCHEDA
  console.log(jsonReq);
  const resp = await registraAttPrecedenti(jsonReq);
  if (resp.success) {
    store.methods.setAlert('Scheda registrata correttamente');
  }
  else {
    store.methods.setAlert('Si è verificato un problema. Scheda non registrata');
  }
}

function resetDati() {
  state.selectLocalita = '';
  state.selectClOgg = '';
  state.selectCategoria = '';
  state.inputElemento = '';
  state.listaSigleEdificiFiltrata = [];
  state.listaSigleEdificiSelezionati = [];
  state.datiContr.descrizioneContr = '';
  state.datiContr.esecutori = '';
  state.datiContr.strumentazione = '';
  state.datiContr.note = '';
  state.datiContr.costo = '';
  state.datiContr.dataInizio = null;
  state.datiContr.dataFine = null;
  state.datiContr.st_cons = '';
  state.datiContr.cl_racc = '';
  state.datiContr.liv_urg = '';
  state.datiManReg.descrizioneManReg = '';
  state.datiManReg.esecutori = '';
  state.datiManReg.strumentazione = '';
  state.datiManReg.note = '';
  state.datiManReg.costo = '';
  state.datiManReg.dataInizio = null;
  state.datiManReg.dataFine = null;
}
</script>

<style scoped>
button {
  background-color: var(--bluInterreg);
}
button:hover {
  background-color: var(--bluInterregTrasparenza);
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

<template>
  <Card>
    <Details summary="ATTIVITÀ PRECEDENTI" :open="false">
      <div>
        <br />
        <label for="tabella" class="colonna">Tipo scheda:</label>
        <select v-model="moduloVisibile" id="tabella" class="colonna">
          <option v-for="(tab, ind) in listaTabelle" :key="ind" :value="tab.tab">{{tab.nome}}</option>
        </select>
        <h4 v-if="moduloVisibile === 'controllo_stato_di_conservazione_livello_di_urgenza'">Controllo</h4>
        <h4 v-if="moduloVisibile === 'manutenzione_regolare'">Manutenzione regolare</h4>
        <h4 v-if="moduloVisibile === 'manutenzione_correttiva_o_a_guasto'">Manutenzione correttiva</h4>
        <h4 v-if="moduloVisibile === 'manutenzione_straordinaria'">Manutenzione straordinaria</h4>
        <h4 v-if="moduloVisibile === 'restauri'">Restauro</h4>
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
        <div class="contenitore-colonne">
          <label for="categoria" class="colonna">Categoria:</label>
          <select v-model="selectCategoria" id="categoria" class="colonna">
            <option value=""></option>
            <option v-for="(cat, ind) in listaCategorie" :key="ind" :value="cat">{{cat}}</option>
          </select>
          <label for="elemento" class="colonna">Elemento:</label>
          <input v-model="inputElemento" id="elemento" class="colonna">
        </div>
        <br />
      </div>
      <div v-if="moduloVisibile === 'controllo_stato_di_conservazione_livello_di_urgenza'">
        <div class="label-st-cons"><b>Stato di conservazione:</b></div>
        <div id="div-st-cons">
          <select v-model="datiContr.st_cons">
            <option v-for="(en, ind) in listaStCons" :key="ind" :value="en">{{en}}</option>
          </select>
        </div>
        <br />
        <div class="label-cl-racc"><b>Classe di raccomandazione:</b></div>
        <div id="div-cl-racc">
          <select v-model="datiContr.cl_racc">
            <option v-for="(en, ind) in listaClRacc" :key="ind" :value="en">{{en}}</option>
          </select>
        </div>
        <br />
        <div class="label-liv-urg"><b>Livello di urgenza:</b></div>
        <div id="div-liv-urg">
          <select v-model="datiContr.liv_urg">
            <option v-for="(en, ind) in listaLivUrg" :key="ind" :value="en">{{en}}</option>
          </select>
        </div>
        <br />
        <div class="label-descrizione"><b>Descrizione attività:</b></div>
        <div id="div-descrizione">
          <textarea v-model="datiContr.descrizioneContr"></textarea>
        </div>
        <div class="contenitore-colonne">
          <label for="esecutori" class="colonna">Esecutori:</label>
          <input v-model="datiContr.esecutori" id="esecutori" class="colonna">
          <label for="costo" class="colonna">Costo (€):</label>
          <input v-model="datiContr.costo" type="number" min="0" step=".01" id="costo" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="strumentazione" class="colonna">Strumentazione:</label>
          <input v-model="datiContr.strumentazione" id="strumentazione" class="colonna">
          <label for="ore" class="colonna">Data inizio:</label>
          <input v-model="datiContr.dataInizio" type="date" id="data-i" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="note" class="colonna">Note:</label>
          <input v-model="datiContr.note" id="note" class="colonna">
          <label for="data" class="colonna">Data fine:</label>
          <input v-model="datiContr.dataFine" type="date" id="data-f" class="colonna">
        </div>
      </div>
      <div v-if="moduloVisibile === 'manutenzione_regolare'">
        <div class="label-descrizione"><b>Descrizione attività:</b></div>
        <div id="div-descrizione">
          <textarea v-model="datiManReg.descrizioneManReg"></textarea>
        </div>
        <div class="contenitore-colonne">
          <label for="esecutori" class="colonna">Esecutori:</label>
          <input v-model="datiManReg.esecutori" id="esecutori" class="colonna">
          <label for="costo" class="colonna">Costo (€):</label>
          <input v-model="datiManReg.costo" type="number" min="0" step=".01" id="costo" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="strumentazione" class="colonna">Strumentazione:</label>
          <input v-model="datiManReg.strumentazione" id="strumentazione" class="colonna">
          <label for="ore" class="colonna">Data inizio:</label>
          <input v-model="datiManReg.dataInizio" type="date" id="data-i" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="note" class="colonna">Note:</label>
          <input v-model="datiManReg.note" id="note" class="colonna">
          <label for="data" class="colonna">Data fine:</label>
          <input v-model="datiManReg.dataFine" type="date" id="data-f" class="colonna">
        </div>
      </div>
      <div v-if="moduloVisibile === 'manutenzione_correttiva_o_a_guasto'">
        <div class="label-descrizione"><b>Descrizione attività:</b></div>
        <div id="div-descrizione">
          <textarea v-model="datiManCorr.descrizioneManCorr"></textarea>
        </div>
        <div class="contenitore-colonne">
          <label for="esecutori" class="colonna">Esecutori:</label>
          <input v-model="datiManCorr.esecutori" id="esecutori" class="colonna">
          <label for="costo" class="colonna">Costo (€):</label>
          <input v-model="datiManCorr.costo" type="number" min="0" step=".01" id="costo" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="strumentazione" class="colonna">Strumentazione:</label>
          <input v-model="datiManCorr.strumentazione" id="strumentazione" class="colonna">
          <label for="ore" class="colonna">Data inizio:</label>
          <input v-model="datiManCorr.dataInizio" type="date" id="data-i" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="note" class="colonna">Note:</label>
          <input v-model="datiManCorr.note" id="note" class="colonna">
          <label for="data" class="colonna">Data fine:</label>
          <input v-model="datiManCorr.dataFine" type="date" id="data-f" class="colonna">
        </div>
      </div>
      <div v-if="moduloVisibile === 'manutenzione_straordinaria'">
        <div class="label-descrizione"><b>Descrizione attività:</b></div>
        <div id="div-descrizione">
          <textarea v-model="datiManStr.descrizioneManStr"></textarea>
        </div>
        <div class="contenitore-colonne">
          <label for="esecutori" class="colonna">Esecutori:</label>
          <input v-model="datiManStr.esecutori" id="esecutori" class="colonna">
          <label for="costo" class="colonna">Costo (€):</label>
          <input v-model="datiManStr.costo" type="number" min="0" step=".01" id="costo" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="strumentazione" class="colonna">Strumentazione:</label>
          <input v-model="datiManStr.strumentazione" id="strumentazione" class="colonna">
          <label for="ore" class="colonna">Data inizio:</label>
          <input v-model="datiManStr.dataInizio" type="date" id="data-i" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="note" class="colonna">Note:</label>
          <input v-model="datiManStr.note" id="note" class="colonna">
          <label for="data" class="colonna">Data fine:</label>
          <input v-model="datiManStr.dataFine" type="date" id="data-f" class="colonna">
        </div>
      </div>
      <div v-if="moduloVisibile === 'restauri'">
        <div class="label-descrizione"><b>Descrizione attività:</b></div>
        <div id="div-descrizione">
          <textarea v-model="datiRest.descrizioneRestauro"></textarea>
        </div>
        <div class="contenitore-colonne">
          <label for="esecutori" class="colonna">Esecutori:</label>
          <input v-model="datiRest.esecutori" id="esecutori" class="colonna">
          <label for="costo" class="colonna">Costo (€):</label>
          <input v-model="datiRest.costo" type="number" min="0" step=".01" id="costo" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="strumentazione" class="colonna">Strumentazione:</label>
          <input v-model="datiRest.strumentazione" id="strumentazione" class="colonna">
          <label for="ore" class="colonna">Data inizio:</label>
          <input v-model="datiRest.dataInizio" type="date" id="data-i" class="colonna">
        </div>
        <div class="contenitore-colonne">
          <label for="note" class="colonna">Note:</label>
          <input v-model="datiRest.note" id="note" class="colonna">
          <label for="data" class="colonna">Data fine:</label>
          <input v-model="datiRest.dataFine" type="date" id="data-f" class="colonna">
        </div>
      </div>
      <div v-if="moduloVisibile" class="contenitore-bottoni-salva">
        <button @click="chiudi" class="bottone-main10ance">Annulla</button>
        <button @click="salva" class="bottone-main10ance">Salva</button>
      </div>
    </Details>
  </Card>
</template>

<script>
import {inject, reactive, toRefs, watch, onMounted} from 'vue';
import {registraAttPrecedenti, leggiEnum} from '../js/richieste';
import {dataCorta, dataInteger} from '../js/shared';
import Card from './elementi/Card.vue';
import Details from './elementi/Details.vue';

export default {
  name: 'TabPlannerExTempore',
  components: {
    Card,
    Details,
  },
  setup() {
    onMounted(async () => {
      await datiEnumUNI();
    });

    const listaTabelle = [
      {nome: 'Controllo', tab: 'controllo_stato_di_conservazione_livello_di_urgenza'},
      {nome: 'Manutenzione regolare', tab: 'manutenzione_regolare'},
      {nome: 'Manutenzione correttiva', tab: 'manutenzione_correttiva_o_a_guasto'},
      {nome: 'Manutenzione straordinaria', tab: 'manutenzione_straordinaria'},
      {nome: 'Restauro', tab: 'restauri'},
    ];

    const store = inject('store');
    const state = reactive({
      moduloVisibile: 'controllo_stato_di_conservazione_livello_di_urgenza',
      selectLocalità: '',
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
        st_cons: '',
        liv_urg: '',
        cl_racc: '',
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
    });

    watch(() => state.selectLocalità, newVal => {
      const listaSigleEdificiFiltrata = store.statePlanner.listaSigleEdifici.filter(s => s.località === newVal);
      state.listaSigleEdificiFiltrata = listaSigleEdificiFiltrata;
      state.listaSigleEdificiSelezionati = [];
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
      jsonReq.località = state.selectLocalità;
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
        case 'controllo_stato_di_conservazione_livello_di_urgenza': {
          jsonReq.dati = state.datiContr;
          break;
        }
        case 'manutenzione_regolare': {
          jsonReq.dati = state.datiManReg;
          break;
        }
        case 'manutenzione_correttiva_o_a_guasto': {
          jsonReq.dati = state.datiManCorr;
          break;
        }
        case 'manutenzione_straordinaria': {
          jsonReq.dati = state.datiManStr;
          break;
        }
        case 'restauri': {
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
      state.selectLocalità = '';
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

    return {
      listaTabelle,
      store,
      ...toRefs(state),
      chiudi,
      salva,
    }
  }
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

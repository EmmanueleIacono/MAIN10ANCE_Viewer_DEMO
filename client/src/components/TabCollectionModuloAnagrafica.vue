<template>
<div>
  <div class="scheda-anagrafica">
    <LoadingScreen :caricamento="loadingDati" />
    <div class="div-titolo-bottoni">
      <div class="float-dx div-bottoni">
        <BtnBIM @click="salvaScheda" icona="glyphicon-floppy-disk" nome="salvaScAnagLOD4" title="Salva" colore="blu" />
        <BtnBIM @click="resetState" icona="glyphicon-erase" nome="annullaDBLOD4" title="Cancella tutti i campi" colore="blu" />
        <BtnBIM @click="chiudiScheda" icona="glyphicon-remove" nome="chiudiScAnagLOD4" title="Annulla" colore="blu" />
      </div>
      <h4 v-if="qualeScheda === 'manufatto'"><b>SCHEDA ANAGRAFICA MANUFATTO</b></h4>
      <h4 v-else-if="qualeScheda === 'dettaglio'"><b>SCHEDA ANAGRAFICA DETTAGLIO</b></h4>
      <h4 v-else><b>SCHEDA ANAGRAFICA</b></h4>
    </div>
    <br />
    <label><b>OPERATORE</b></label>
    <p class="user-field float-dx">{{store.state.userSettings.user_id}}</p>
    <br />
    <div v-if="qualeScheda === 'manufatto'">
      <label><b>DEFINIZIONE</b></label>
      <input v-model="definizione" :disabled="schedaRegistrata">
      <br />
      <label><b>EPOCA</b></label>
      <input v-model="epoca" :disabled="schedaRegistrata">
      <br />
      <label><b>AUTORE</b></label>
      <input v-model="autore" :disabled="schedaRegistrata">
      <br />
      <label><b>DESCRIZIONE</b></label>
      <input v-model="descrizione" :disabled="schedaRegistrata">
      <br />
      <label><b>MATERIALE/I</b></label>
      <input v-model="materiale" :disabled="schedaRegistrata">
      <br />
      <label><b>TECNICHE</b></label>
      <input v-model="tecniche" :disabled="schedaRegistrata">
      <br />
      <label><b>DOCUMENTI</b></label>
      <input v-model="documenti" :disabled="schedaRegistrata">
      <br />
      <label><b>ITER AUTORIZZATIVO</b></label>
      <input v-model="iter_autorizzativo" :disabled="schedaRegistrata">
      <br />
    </div>
    <div v-else-if="qualeScheda === 'dettaglio'">
      <label><b>DEFINIZIONE</b></label>
      <input v-model="definizione" :disabled="schedaRegistrata">
      <br />
      <label><b>DESCRIZIONE</b></label>
      <input v-model="descrizione" :disabled="schedaRegistrata">
      <br />
      <label><b>MATERIALE/I</b></label>
      <input v-model="materiale" :disabled="schedaRegistrata">
      <br />
      <label><b>TECNICHE</b></label>
      <input v-model="tecniche" :disabled="schedaRegistrata">
      <br />
      <label><b>EPOCA</b></label>
      <input v-model="epoca" :disabled="schedaRegistrata">
      <br />
      <label><b>DOCUMENTI</b></label>
      <input v-model="documenti" :disabled="schedaRegistrata">
      <br />
      <label><b>AUTORE</b></label>
      <input v-model="autore" :disabled="schedaRegistrata">
      <br />
      <label><b>DATA</b></label>
      <input v-model="data" :disabled="schedaRegistrata">
      <br />
    </div>
    <div v-else-if="qualeScheda === 'statua'">
      <label><b>DESCRIZIONE STATUA</b></label>
      <textarea v-model="stateModuloAnagraficaStatua.descrizione_statua" :disabled="schedaRegistrata" style="height: 20px;"></textarea>
      <br />
      <label><b>TECNICA DI ESECUZIONE</b></label>
      <input v-model="stateModuloAnagraficaStatua.tecnica_esecuzione" :disabled="schedaRegistrata">
      <br />
      <label><b>DIMENSIONI</b></label>
      <input v-model="stateModuloAnagraficaStatua.dimensioni" :disabled="schedaRegistrata">
      <br />
      <label><b>MATERIALE ANNOTAZIONI</b></label>
      <input v-model="stateModuloAnagraficaStatua.materiale_annotazioni" :disabled="schedaRegistrata">
      <br />
      <label><b>MATERIALE ARMATURA</b></label>
      <select v-model="stateModuloAnagraficaStatua.materiale_armatura" :disabled="schedaRegistrata" class="float-dx">
        <option value=""></option>
        <option v-for="mat in datiEnum.materiale_armatura" :key="mat" :value="mat">{{ mat }}</option>
      </select>
      <br />
      <label><b>MATERIALE SUPPORTO</b></label>
      <select v-model="stateModuloAnagraficaStatua.materiale_supporto" :disabled="schedaRegistrata" class="float-dx">
        <option value=""></option>
        <option v-for="mat in datiEnum.materiale_supporto" :key="mat" :value="mat">{{ mat }}</option>
      </select>
      <br />
      <label><b>LAMINA METALLICA</b></label>
      <input type="checkbox" v-model="stateModuloAnagraficaStatua.lamina_metallica" :disabled="schedaRegistrata">
      <br />
      <label><b>PELLICOLA PITTORICA</b></label>
      <input v-model="stateModuloAnagraficaStatua.pellicola_pittorica" :disabled="schedaRegistrata">
      <br />
      <label><b>STRATO DI PREPARAZIONE</b></label>
      <input v-model="stateModuloAnagraficaStatua.strato_di_preparazione" :disabled="schedaRegistrata">
      <br />
      <label><b>ELEMENTI ACCESSORI</b></label>
      <select v-model="stateModuloAnagraficaStatua.elementi_accessori" :disabled="schedaRegistrata" class="float-dx">
        <option value=""></option>
        <option v-for="mat in datiEnum.elementi_accessori" :key="mat" :value="mat">{{ mat }}</option>
      </select>
      <br />
      <label><b>MONILI</b></label>
      <select v-model="stateModuloAnagraficaStatua.monili" :disabled="schedaRegistrata" class="float-dx">
        <option value=""></option>
        <option v-for="mat in datiEnum.monili" :key="mat" :value="mat">{{ mat }}</option>
      </select>
      <br />
      <label><b>EPOCA</b></label>
      <input v-model="stateModuloAnagraficaStatua.epoca" :disabled="schedaRegistrata">
      <br />
      <label><b>FONTI</b></label>
      <input v-model="stateModuloAnagraficaStatua.fonti" :disabled="schedaRegistrata">
      <br />
      <label><b>AUTORE</b></label>
      <input v-model="stateModuloAnagraficaStatua.autore" :disabled="schedaRegistrata">
      <br />
      <label><b>ACCESSIBILITÀ</b></label>
      <input type="checkbox" v-model="stateModuloAnagraficaStatua.accessibilità" :disabled="schedaRegistrata">
      <br />
    </div>
    <div v-else>
      <label><b>DESCRIZIONE SISTEMA</b></label>
      <textarea v-model="descrizione_sistema" :disabled="schedaRegistrata" style="height: 20px;"></textarea>
      <br />
      <label><b>DESCRIZIONE SUBSISTEMA</b></label>
      <textarea v-model="descrizione_subsistema" :disabled="schedaRegistrata" style="height: 20px;"></textarea>
      <br />
      <label><b>TECNICA COSTRUTTIVA</b></label>
      <input v-model="tecnica_costruttiva" :disabled="schedaRegistrata">
      <br />
      <label><b>DIMENSIONI</b></label>
      <input v-model="dimensioni" :disabled="schedaRegistrata">
      <br />
      <label><b>MATERIALE/I</b></label>
      <input v-model="materiale" :disabled="schedaRegistrata">
      <br />
      <label><b>EPOCA</b></label>
      <input v-model="epoca" :disabled="schedaRegistrata">
      <br />
      <label><b>ISPEZIONABILITÀ</b></label>
      <input v-model="ispezionabilità" :disabled="schedaRegistrata">
      <br />
      <label><b>FONTI</b></label>
      <input v-model="fonti" :disabled="schedaRegistrata">
      <br />
    </div>
  </div>
</div>
</template>

<script>
import { inject, toRefs, computed, ref, onMounted, reactive } from 'vue';
import {dataCorta, dataInteger} from '../js/shared';
import {compilaScheda, leggiEnumServizio} from '../js/richieste';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';
import LoadingScreen from './elementi/LoadingScreen.vue';

export default {
  name: 'TabCollectionModuloAnagrafica',
  components: {
    LoadingScreen,
    BtnBIM,
  },
  setup() {
    const store = inject('store');
    const stateAnagrafica = inject('stateAnagrafica');
    const stateGalleria = inject('stateGalleria');
    const stateModuloAnagrafica = inject('stateModuloAnagrafica');
    const stateModuloAnagraficaStatua = inject('stateModuloAnagraficaStatua');
    const stateArtifact = inject('stateArtifact');
    const schedaRegistrata = ref(false); // MAI USATO IN LOGICA, FORSE ELIMINABILE
    const loadingDati = ref(false);
    const datiEnum = reactive({
      materiale_armatura: [],
      materiale_supporto: [],
      elementi_accessori: [],
      monili: [],
    });

    const schedaVuota = computed(() => {
      return !(
        stateModuloAnagrafica.descrizione_sistema || stateModuloAnagrafica.descrizione_subsistema
        || stateModuloAnagrafica.tecnica_costruttiva || stateModuloAnagrafica.dimensioni
        || stateModuloAnagrafica.materiale || stateModuloAnagrafica.epoca
        || stateModuloAnagrafica.ispezionabilità || stateModuloAnagrafica.fonti
        || stateModuloAnagrafica.definizione || stateModuloAnagrafica.autore
        || stateModuloAnagrafica.descrizione || stateModuloAnagrafica.tecniche
        || stateModuloAnagrafica.documenti || stateModuloAnagrafica.iter_autorizzativo
        || stateModuloAnagrafica.data
      );
    });

    const schedaVuotaStatua = computed(() => {
      return !(
        stateModuloAnagraficaStatua.descrizione_statua || stateModuloAnagraficaStatua.tecnica_esecuzione
        || stateModuloAnagraficaStatua.dimensioni || stateModuloAnagraficaStatua.materiale_annotazioni
        || stateModuloAnagraficaStatua.materiale_armatura || stateModuloAnagraficaStatua.materiale_supporto
        || stateModuloAnagraficaStatua.lamina_metallica || stateModuloAnagraficaStatua.pellicola_pittorica
        || stateModuloAnagraficaStatua.strato_di_preparazione || stateModuloAnagraficaStatua.elementi_accessori
        || stateModuloAnagraficaStatua.monili || stateModuloAnagraficaStatua.epoca
        || stateModuloAnagraficaStatua.fonti || stateModuloAnagraficaStatua.definizione
        || stateModuloAnagraficaStatua.autore || stateModuloAnagraficaStatua.accessibilità
      );
    });

    const qualeScheda = computed(() => {
      let scheda;
      switch (stateArtifact.selectElemento) {
        case 'manufatto':
          scheda = 'manufatto';
          break;

        case 'dettaglio':
          scheda = 'dettaglio';
          break;

        case 'statua':
          scheda = 'statua';
          break;

        default:
          scheda = 'altro';
          break;
      }
      return scheda;
    });

    onMounted(async () => {
      loadingDati.value = true;
      const lsMatArm = await leggiEnumServizio('stat_arm_mat'); // materiale armatura
      const lsMatSupp = await leggiEnumServizio('stat_supp_mat'); // materiale supporto
      const lsMatElAcc = await leggiEnumServizio('stat_el_acc_mat'); // elementi accessori
      const lsMatMonl = await leggiEnumServizio('stat_monil_mat'); // monili
      datiEnum.materiale_armatura = lsMatArm.map(mat => mat.unnest);
      datiEnum.materiale_supporto = lsMatSupp.map(mat => mat.unnest);
      datiEnum.elementi_accessori = lsMatElAcc.map(mat => mat.unnest);
      datiEnum.monili = lsMatMonl.map(mat => mat.unnest);
      loadingDati.value = false;
    });

    async function salvaScheda() {
      console.log('salva scheda');
      if (stateGalleria.idImgSelezionate) {
        if (
          qualeScheda.value == 'altro' && schedaVuota.value
          || qualeScheda.value == 'statua' && schedaVuotaStatua.value
        ) {
          store.methods.setAlert('Non è possibile salvare una scheda vuota');
          return;
        }
        impostaMetadati();
        let jsonReq;
        if (qualeScheda.value == 'altro') jsonReq = impostaOggetti(Object.entries(stateModuloAnagrafica), stateGalleria.idImgSelezionate);
        else if (qualeScheda.value == 'statua') jsonReq = impostaOggetti(Object.entries(stateModuloAnagraficaStatua), stateGalleria.idImgSelezionate);
        console.log(jsonReq);
        const resp = await compilaScheda(jsonReq);
        if (resp.success) {
          store.methods.setAlert('Operazione andata a buon fine');
          chiudiScheda();
        }
        else {
          store.methods.setAlert('Operazione non riuscita');
        }
      }
      else {
        store.methods.setAlert('Nessun ID associato alla scheda. Selezionare un elemento e riprovare.');
        chiudiScheda();
      }
    }

    function chiudiScheda() {
      stateAnagrafica.moduloAnagraficaVisibile = false;
      resetState();
    }

    function resetState() { // QUESTA MAGARI SI PUÒ SPOSTARE SU TABCOLLECTION
      switch (qualeScheda.value) {
        case 'statua':
          stateModuloAnagraficaStatua.descrizione_statua = '';
          stateModuloAnagraficaStatua.tecnica_esecuzione = '';
          stateModuloAnagraficaStatua.dimensioni = '';
          stateModuloAnagraficaStatua.materiale_annotazioni = '';
          stateModuloAnagraficaStatua.materiale_armatura = ''; // enum
          stateModuloAnagraficaStatua.materiale_supporto = ''; // enum
          stateModuloAnagraficaStatua.lamina_metallica = false; // bool
          stateModuloAnagraficaStatua.pellicola_pittorica = '';
          stateModuloAnagraficaStatua.strato_di_preparazione = '';
          stateModuloAnagraficaStatua.elementi_accessori = ''; // enum
          stateModuloAnagraficaStatua.monili = ''; // enum
          stateModuloAnagraficaStatua.epoca = '';
          stateModuloAnagraficaStatua.fonti = '';
          stateModuloAnagraficaStatua.autore = '';
          stateModuloAnagraficaStatua.accessibilità = false; // bool
          stateModuloAnagraficaStatua.id_anagr = null;
          stateModuloAnagraficaStatua.data_registrazione = null;
          stateModuloAnagraficaStatua.data_ultima_mod = null;
          stateModuloAnagraficaStatua.autore_scheda = null;
          stateModuloAnagraficaStatua.autore_ultima_mod = null;
          break;

        case 'altro':
          stateModuloAnagrafica.descrizione_sistema = '';
          stateModuloAnagrafica.descrizione_subsistema = '';
          stateModuloAnagrafica.tecnica_costruttiva = '';
          stateModuloAnagrafica.dimensioni = '';
          stateModuloAnagrafica.materiale = '';
          stateModuloAnagrafica.epoca = '';
          stateModuloAnagrafica.ispezionabilità = '';
          stateModuloAnagrafica.fonti = '';
          stateModuloAnagrafica.definizione = '';
          stateModuloAnagrafica.autore = '';
          stateModuloAnagrafica.descrizione = '';
          stateModuloAnagrafica.tecniche = '';
          stateModuloAnagrafica.documenti = '';
          stateModuloAnagrafica.iter_autorizzativo = '';
          stateModuloAnagrafica.data = '';
          stateModuloAnagrafica.id_anagr = null;
          stateModuloAnagrafica.data_registrazione = null;
          stateModuloAnagrafica.data_ultima_mod = null;
          stateModuloAnagrafica.autore_scheda = null;
          stateModuloAnagrafica.autore_ultima_mod = null;
          schedaRegistrata.value = false;
          break;

        default:
          return;
      }
    }

    function impostaMetadati() {
      let modulo;
      switch (qualeScheda.value) {
        case 'statua':
          modulo = stateModuloAnagraficaStatua;
          break;
        
        case 'altro':
          modulo = stateModuloAnagrafica;
          break;

        default:
          return;
      }

      modulo.id_anagr = dataInteger();
      modulo.data_registrazione = dataCorta();
      modulo.data_ultima_mod = dataCorta();
      modulo.autore_scheda = store.state.userSettings.user_id;
      modulo.autore_ultima_mod = store.state.userSettings.user_id;
    }

    function impostaOggetti(stateArray, idMain10ance) {
      const listaOgg = [];
      idMain10ance.forEach((id, ind) => {
        const ogg = {
          tabella: nomeTabellaAnagrafica(stateArtifact.selectElemento),
          colonne: [],
          valori: [],
        };
        stateArray.forEach(stateVal => {
          console.log(stateVal);
          if (stateVal[1]) {
            ogg.colonne.push(stateVal[0]);
            ogg.valori.push(stateVal[1]);
          }
        });
        ogg.valori[ogg.colonne.indexOf('id_anagr')] += ind;
        ogg.colonne.push('id_main10ance');
        ogg.valori.push(id);
        listaOgg.push(ogg);
      });

      return listaOgg;
    }

    function nomeTabellaAnagrafica(entitàSelez) {
      let nomeTabella;
      switch (entitàSelez) {
        case 'manufatto':
          nomeTabella = 'anagrafica_manufatto';
          break;

        case 'dettaglio':
          nomeTabella = 'anagrafica_dettaglio';
          break;

        case 'statua':
          nomeTabella = 'scheda_anagrafica_statua';
          break;

        default:
          nomeTabella = 'scheda_anagrafica';
          break;
      }
      console.log(nomeTabella);
      return nomeTabella;
    }

    return {
      store,
      schedaRegistrata,
      loadingDati,
      ...toRefs(stateModuloAnagrafica),
      stateModuloAnagraficaStatua,
      datiEnum,
      qualeScheda,
      salvaScheda,
      resetState,
      chiudiScheda,
    }
  }
}
</script>

<style scoped>
textarea {
  resize: vertical;
}
input, textarea {
  float: right;
  line-height: 100%;
  padding: 1px;
  border: 0;
}
.scheda-anagrafica {
  background-color: var(--bluInterregTrasparenza);
  font-size: 13px;
  padding: 30px 14px;
}
.float-dx {
  float: right;
}
.user-field {
  line-height: 100%;
  padding: 0px;
  text-align: right;
}
.div-titolo-bottoni {
  position: relative;
}
.div-bottoni {
  position: absolute;
  bottom: -1rem;
  right: 0;
}
</style>

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
      <h4 v-else-if="qualeScheda === 'statua'"><b>SCHEDA ANAGRAFICA STATUA</b></h4>
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
      <label><b>NOME STATUA</b></label>
      <input v-model="stateModuloAnagraficaStatua.nome_statua" :disabled="schedaRegistrata">
      <br />
      <label><b>DESCRIZIONE STATUA</b></label>
      <textarea v-model="stateModuloAnagraficaStatua.descrizione_statua" :disabled="schedaRegistrata" style="height: 20px;"></textarea>
      <br />
      <label><b>DIMENSIONI</b></label>
      <input v-model="stateModuloAnagraficaStatua.dimensioni" :disabled="schedaRegistrata">
      <br />
      <label><b>ELEMENTI DI ANCORAGGIO A PARETE</b></label>
      <input type="checkbox" v-model="stateModuloAnagraficaStatua.elementi_di_ancoraggio_a_parete" :disabled="schedaRegistrata">
      <br />
      <label><b>ELEMENTI DI ANCORAGGIO A PAVIMENTO</b></label>
      <input type="checkbox" v-model="stateModuloAnagraficaStatua.elementi_di_ancoraggio_a_pavimento" :disabled="schedaRegistrata">
      <br />
      <label><b>ELEMENTI DI ANCORAGGIO ANNOTAZIONI</b></label>
      <textarea v-model="stateModuloAnagraficaStatua.elementi_di_ancoraggio_annotazioni" :disabled="schedaRegistrata" style="height: 20px;"></textarea>
      <br />
      <label><b>TECNICA DI ESECUZIONE</b></label>
      <input v-model="stateModuloAnagraficaStatua.tecnica_esecuzione" :disabled="schedaRegistrata">
      <br />
      <label><b>MATERIALE STATUA</b></label>
      <select v-model="stateModuloAnagraficaStatua.materiale_statua" :disabled="schedaRegistrata" class="float-dx">
        <option value=""></option>
        <option v-for="mat in datiEnum.materiale_statua" :key="mat" :value="mat">{{ mat }}</option>
      </select>
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
    <!-- DOCUMENTI -->
    <!-- (capire switch tra file input e risultato query scheda esistente) -->
    <div class="div-docs">
      <label><b>DOCUMENTI</b></label>
      <div v-if="stateDocumenti.docs?.length > 0">
        <p><b>Documenti esistenti:</b></p>
        <p v-for="doc in stateDocumenti.docs" :key="doc">{{ doc.split("/").pop() }}</p>
      </div>
      <div class="div-doc-vfor" v-for="(file_item, index) in files" :key="index">
        <label class="label-doc"><b>Documento {{ index+1 }}</b></label>
        <input :ref="el => fileInputs[index] = el" type="file" accept="*/*" @change="gestisciFileUpload($event, index)" style="display: none;">
        <button v-if="files.length > 1" class="x" type="button" @click="rimuoviFile(index)">x</button>
        <button class="scegli-file-btn" @click="scegliFile(index)">Scegli file</button>
        <span v-if="file_item.name">{{ file_item.name }}</span>
      </div>
      <button type="button" class="x" @click="aggiungiFile">+</button>
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
    const stateDocumenti = inject('stateDocumenti');
    const stateArtifact = inject('stateArtifact');
    const schedaRegistrata = ref(false); // MAI USATO IN LOGICA, FORSE ELIMINABILE
    const loadingDati = ref(false);
    const datiEnum = reactive({
      materiale_statua: [],
      materiale_armatura: [],
      materiale_supporto: [],
      elementi_accessori: [],
      monili: [],
    });

    const files = reactive([
      {file: null, name: ""}
    ]);

    const fileInputs = reactive([null]); // refs per <input type="file">

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
        stateModuloAnagraficaStatua.nome_statua || stateModuloAnagraficaStatua.descrizione_statua
        || stateModuloAnagraficaStatua.tecnica_esecuzione || stateModuloAnagraficaStatua.dimensioni
        || stateModuloAnagraficaStatua.materiale_statua || stateModuloAnagraficaStatua.materiale_annotazioni
        || stateModuloAnagraficaStatua.materiale_armatura || stateModuloAnagraficaStatua.materiale_supporto
        || stateModuloAnagraficaStatua.lamina_metallica || stateModuloAnagraficaStatua.pellicola_pittorica
        || stateModuloAnagraficaStatua.strato_di_preparazione || stateModuloAnagraficaStatua.elementi_accessori
        || stateModuloAnagraficaStatua.monili || stateModuloAnagraficaStatua.elementi_di_ancoraggio_a_parete
        || stateModuloAnagraficaStatua.elementi_di_ancoraggio_a_pavimento || stateModuloAnagraficaStatua.elementi_di_ancoraggio_annotazioni
        || stateModuloAnagraficaStatua.epoca || stateModuloAnagraficaStatua.fonti
        || stateModuloAnagraficaStatua.definizione || stateModuloAnagraficaStatua.autore
        || stateModuloAnagraficaStatua.accessibilità
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
      const lsMatStat = await leggiEnumServizio('stat_mat'); // materiale statua
      const lsMatArm = await leggiEnumServizio('stat_arm_mat'); // materiale armatura
      const lsMatSupp = await leggiEnumServizio('stat_supp_mat'); // materiale supporto
      const lsMatElAcc = await leggiEnumServizio('stat_el_acc_mat'); // elementi accessori
      const lsMatMonl = await leggiEnumServizio('stat_monil_mat'); // monili
      datiEnum.materiale_statua = lsMatStat.map(mat => mat.unnest);
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
        if (qualeScheda.value == 'statua' && !stateModuloAnagraficaStatua.nome_statua) {
          store.methods.setAlert('Il campo "Nome statua" deve essere compilato.');
          return;
        }
        impostaMetadati();
        let jsonReq;
        let qualeState;
        if (qualeScheda.value === 'altro') qualeState = stateModuloAnagrafica;
        else if (qualeScheda.value === 'statua') qualeState = stateModuloAnagraficaStatua;

        if (files && files.length > 0) {
          files.forEach(fl => {
            if (fl.file) {
              qualeState.docs.push(`${qualeState.id_anagr}/${fl.name}`);
            }
          });
        }

        jsonReq = impostaOggetti(Object.entries(qualeState), stateGalleria.idImgSelezionate);

        const fd = new FormData();
        // append FILES a fd
        files.forEach((fileItem, idx) => {
          if (fileItem.file) {
            fd.append(`file_${idx}`, fileItem.file, fileItem.name);
          }
        });
        // append JSONREQ a fd
        fd.append('dati', JSON.stringify(jsonReq));

        // const resp = await compilaScheda(jsonReq);
        const resp = await compilaScheda(fd);
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
          stateModuloAnagraficaStatua.nome_statua = '';
          stateModuloAnagraficaStatua.descrizione_statua = '';
          stateModuloAnagraficaStatua.tecnica_esecuzione = '';
          stateModuloAnagraficaStatua.dimensioni = '';
          stateModuloAnagraficaStatua.materiale_statua = '', // enum
          stateModuloAnagraficaStatua.materiale_annotazioni = '';
          stateModuloAnagraficaStatua.materiale_armatura = ''; // enum
          stateModuloAnagraficaStatua.materiale_supporto = ''; // enum
          stateModuloAnagraficaStatua.lamina_metallica = false; // bool
          stateModuloAnagraficaStatua.pellicola_pittorica = '';
          stateModuloAnagraficaStatua.strato_di_preparazione = '';
          stateModuloAnagraficaStatua.elementi_accessori = ''; // enum
          stateModuloAnagraficaStatua.monili = ''; // enum
          stateModuloAnagraficaStatua.elementi_di_ancoraggio_a_parete = false; // bool
          stateModuloAnagraficaStatua.elementi_di_ancoraggio_a_pavimento = false; // bool
          stateModuloAnagraficaStatua.elementi_di_ancoraggio_annotazioni = '';
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
          break;
      }

      // reset state documenti
      stateDocumenti.docs = [];
      // reset lista file
      files.splice(0, files.length, {file: null, name: ""});
      fileInputs.splice(0, fileInputs.length, null);
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
        ogg.valori[ogg.colonne.indexOf('id_anagr')] += ind; // incrementa id per assicurare unicità in caso di più oggetti insieme
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

    function scegliFile(ind) {
      fileInputs[ind]?.click(); // per aprire selettore file nascosto
    }

    function gestisciFileUpload(evt, ind) {
      const file = evt.target.files[0];

      if (file) {
        files[ind].file = file;
        files[ind].name = file.name;
      } else {
        files[ind].file = null;
        files[ind].name = "";
      }
    }

    function aggiungiFile() {
      files.push({file: null, name: ""});
    }

    function rimuoviFile(ind) {
      files.splice(ind, 1);
      fileInputs.splice(ind, 1);
    }

    return {
      store,
      schedaRegistrata,
      loadingDati,
      ...toRefs(stateModuloAnagrafica),
      stateModuloAnagraficaStatua,
      stateDocumenti,
      datiEnum,
      files,
      fileInputs,
      qualeScheda,
      salvaScheda,
      resetState,
      chiudiScheda,
      scegliFile,
      gestisciFileUpload,
      aggiungiFile,
      rimuoviFile
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
.div-docs {
  margin: 5px 0;
}
.div-doc-vfor {
  margin: 20px 0;
}
.label-doc {
  margin-right: 20px;
}
.scegli-file-btn {
  margin-right: 5px;
}
button.x {
  width: 25px;
  height: 25px;
  margin: 5px;
  font-weight: bold;
  font-size: large;
  border: none;
  align-content: center;
  justify-content: center;
  color: #fff;
  background-color: var(--bluInterreg);
  float: right;
}
button.x:hover {
  background-color: var(--bluInterregTrasparenza);
}
</style>

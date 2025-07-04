<template>
  <div v-if="store.state.docsDialogVisibile" class="overlay">
    <div class="dialog">
      <!-- Top Bar -->
      <div class="top-bar">
        <h4>Caricamento documenti</h4>
        <button class="close-btn" @click="chiudi"><span class="glyphicon glyphicon-remove"></span></button>
      </div>

      <!-- Body: Sidebar + Main -->
      <div class="body">
        <!--Sidebar: Navigazione cartelle  -->
        <!-- <aside class="sidebar">
          <p style="color: red; padding-left: 5px;">SEZIONE IN COSTRUZIONE</p>
          <TreeNode @cambiaIdCliccato="selectCartella(cart)" v-for="cart in cartelle" :key="cart.id" :node="cart" class="tree-node" />
        </aside> -->

        <!-- Main: Lista file -->
        <main class="main-content">
          <div class="file-list">
            <div v-for="(doc, idx) in docs" :key="idx" class="file-item">
              <!-- Barra principale -->
              <div class="file-bar" @click="toggleEspandi(idx)">
                <div class="file-icon">{{ getEstensione(doc) }}</div>
                <div class="file-name">{{ doc && doc.file ? doc.file.name : '-' }}</div>
                <div class="file-actions">
                  <button class="add-btn" title="Aggiungi un documento" @click.stop="addDoc(idx)">
                    <span class="glyphicon glyphicon-plus"></span>
                  </button>
                  <button class="remove-btn" title="Rimuovi documento" @click.stop="removeDoc(idx)">
                    <span class="glyphicon glyphicon-trash"></span>
                  </button>
                </div>
              </div>
              <!-- Dettagli -->
              <div v-if="doc.espanso" class="file-details">
                <!-- parte superiore, su due colonne -->
                <div class="details-top">
                  <div class="col">
                    <label>
                      File:
                      <input type="file" :key="doc.input_key" @change="onFileChange($event, idx)" />
                    </label>
                    <label>
                      Nome univoco documento:
                      <div class="typeahead-wrapper">
                        <input
                          type="text"
                          :class="{'id-non-valido' : !idDisponibile(doc.id, idx)}"
                          v-model="doc.id"
                          @input="doc.id = sanitizeStringa($event.target.value)"
                          @focus="doc.id_focused = true"
                          @blur="doc.id_focused = false"
                          placeholder="Nome univoco"
                        />
                        <ul v-if="doc.id_focused && getSuggerimenti(doc).length" class="typeahead-list">
                          <li v-for="s in getSuggerimenti(doc)" :key="s" @mousedown.prevent="selezionaSuggerimento(s, idx)">
                            {{ s }}
                          </li>
                        </ul>
                      </div>
                      <p v-if="!idDisponibile(doc.id, idx)" style="color: red;">Attenzione! Il nome inserito è già esistente.</p>
                    </label>
                    <label>
                      Data documento:
                      <input type="date" v-model="doc.data" />
                    </label>
                    <label>
                      Autore documento:
                      <input type="text" v-model="doc.autore" placeholder="Chi ha redatto il documento" />
                    </label>
                  </div>
                  <div class="col">
                    <label>
                      Tipo documento:
                      <select v-model="doc.tipo">
                        <option v-for="tipo in tipiDocs.tipi" :key="tipo" :value="tipo">{{ tipo }}</option>
                      </select>
                    </label>
                    <label>
                      Descrizione:
                      <textarea v-model="doc.descr" placeholder="Descrizione del documento"></textarea>
                    </label>
                    <label>
                      Annotazioni:
                      <textarea v-model="doc.note" placeholder="Annotazioni aggiuntive"></textarea>
                    </label>
                  </div>
                </div>
                <!-- separatore orizzontale -->
                <div class="details-divider"></div>
                <!-- parte inferiore, su due colonne -->
                <div class="details-bottom">
                  <div class="col">
                    <fieldset class="temi-group">
                      <legend><h5>Temi</h5></legend>
                      <label class="temi-item" v-for="tema in tipiDocs.temi" :key="tema">
                        <input type="checkbox" :value="tema" v-model="doc.temi" />
                        <span>{{ tema }}</span>
                      </label>
                    </fieldset>
                    <label>
                      Sistema composto:
                      <select v-model="doc.sist_comp">
                        <option value=""></option>
                        <option v-for="sc in tipiDocs.sist_comp" :key="sc" :value="sc">{{ sc }}</option>
                      </select>
                    </label>
                  </div>
                  <div class="col">
                    <div class="relazioni-group">
                      <h5>Il documento è associato a:</h5>
                      <div v-for="(rel, ridx) in doc.relazioni" :key="ridx" class="relazione-item">
                        <fieldset>
                          <legend><h6>Relazione #{{ ridx+1 }}</h6></legend>
                          <label>
                            Località:
                            <select v-model="rel.località" @change="onLocalitaChanged(rel)">
                              <option value=""></option>
                              <option v-for="l in relOptions.località" :key="l.sigla" :value="l.sigla">{{ l.nome }}</option>
                            </select>
                          </label>
                          <label>
                            Edificio:
                            <select v-model="rel.edificio" :disabled="!rel.località">
                              <option value=""></option>
                              <option v-for="e in getFilteredEdifici(rel)" :key="e.edificio" :value="e.edificio">{{ e.edif_nome_menu }}</option>
                            </select>
                          </label>
                          <label>
                            Classe:
                            <select v-model="rel.classe" @change="onClasseChanged(rel)">
                              <option value=""></option>
                              <option v-for="c in relOptions.classe" :key="c" :value="c">{{ c }}</option>
                            </select>
                          </label>
                          <label>
                            Elemento:
                            <select v-model="rel.elemento" :disabled="!rel.classe">
                              <option value=""></option>
                              <option v-for="e in getFilteredElementi(rel)" :key="e.elemento_sigla" :value="e.elemento_sigla">{{ e.elemento_nome }}</option>
                            </select>
                          </label>
                          <label>
                            Annotazioni:
                            <textarea v-model="rel.annotazioni"></textarea>
                          </label>
    
                          <button type="button" @click="removeRelazione(idx, ridx)" class="btn-add-rmv-rel">-</button>
                        </fieldset>
                      </div>
                      <button type="button" @click="addRelazione(idx)" class="btn-add-rmv-rel">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <!-- Footer -->
      <div class="footer">
        <button type="button" @click="resetDocs">Reset</button>
        <button type="button" @click="submitDocs" :disabled="docs.some(doc => (!doc.file || !doc.id))">Carica</button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, inject, /*provide,*/ computed, onMounted } from 'vue';
import { leggiEnumServizio, leggiListaLocalità, leggiListaEdifici, leggiListaElementi, caricaDocumento, leggiIdDocEsistenti } from "../js/richieste";
// import TreeNode from './elementi/TreeNode.vue';

export default {
  name: 'DialogFileUpload',
  // components: {
  //   TreeNode,
  // },
  setup() {
    // const cartelle = [
    //   {id: 'cartella_1', type: 'folder', nome: 'Cartella 1', open: true, children: [
    //     {id: 'cartella_1.1', type: 'folder', nome: 'Cartella 1.1', open: false, children: []},
    //     {id: 'cartella_1.2', type: 'folder', nome: 'Cartella 1.2', open: false, children: [
    //       {id: 'cartella_1.2.1', type: 'folder', nome: 'Cartella 1.2.1', open: false, children: []},
    //     ]},
    //   ]},
    //   {id: 'cartella_2', type: 'folder', nome: 'Cartella 2', open: false, children: []},
    //   {id: 'cartella_3', type: 'folder', nome: 'Cartella 3', open: false, children: []},
    // ];

    const store = inject('store');

    const tipiDocs = reactive({
      tipi: [],
      temi: [],
      sist_comp: [],
    });

    const relOptions = reactive({
      località: [],
      edificio: [],
      classe: [],
      elemento: [],
    });

    const idDocs = reactive([]);

    const state = reactive({
      docs: [
        {
          file: null,
          input_key: Date.now(),
          tipo: tipiDocs.tipi[0], // tipo_doc servizio.docs_ty
          id: '', // id_doc varchar NOT NULL
          data: '', // data_doc varchar
          autore: '', // autore_doc varchar
          descr: '', // descrizione
          note: '', // annotazioni
          temi: [], // temi servizio.temi[]
          sist_comp: tipiDocs.sist_comp[0], // sist_composto servizio.sistemi_composti
          relazioni: [], // relazioni servizio.doc_relazione[]
          espanso: true,
          id_focused: false,
        },
      ],
      // cartelle: cartelle,
      // cartellaSelezionata: cartelle[0],
    });

    const idDocsInCompilazione = computed(() => state.docs.map(doc => doc.id).filter(id => !!id));

    // const idCartellaSelezionata = computed(() => state.cartellaSelezionata.id);

    // provide('cartellaSelezionata', idCartellaSelezionata);

    onMounted(async () => {
      const tpDocsRaw = await leggiEnumServizio('docs_ty');
      const temiDocsRaw = await leggiEnumServizio('temi');
      const sistCompDocsRaw = await leggiEnumServizio('sistemi_composti');
      const clOggRaw = await leggiEnumServizio('cl_ogg');
      const listaLoc = await leggiListaLocalità();
      const listaEdif = await leggiListaEdifici();
      const listaElems = await leggiListaElementi();
      const idDocEsistenti = await leggiIdDocEsistenti();

      const tpDocs = tpDocsRaw.map(datoRaw => datoRaw.unnest);
      const temiDocs = temiDocsRaw.map(datoRaw => datoRaw.unnest);
      const sistCompDocs = sistCompDocsRaw.map(datoRaw => datoRaw.unnest);
      const clOgg = clOggRaw.map(datoRaw => datoRaw.unnest);
      idDocEsistenti.forEach(idObj => idDocs.push(idObj.id_doc));

      tipiDocs.tipi = tpDocs;
      tipiDocs.temi = temiDocs;
      tipiDocs.sist_comp = sistCompDocs;
      relOptions.località = listaLoc;
      relOptions.edificio = listaEdif;
      relOptions.classe = clOgg;
      relOptions.elemento = listaElems;

      state.docs.forEach(doc => {
        if (!doc.tipo) doc.tipo = tipiDocs.tipi[0];
      });
    });

    function creaRelazione() {
      return {
        località: '',
        edificio: '',
        classe: '',
        elemento: '',
        annotazioni: "",
      };
    }

    function chiudi() {
      store.methods.chiudiDocsDialog();
      resetDocs();
    }

    async function submitDocs() {
      store.methods.toggleLoaderGlobale();

      const datiDocs = collectDatiDocs();
      console.log("datiDocs:\n", datiDocs);

      // conferma se relazioni vuote
      if (datiDocs.some(doc => doc.metadata.relazioni.length < 1)) {
        const confermaProcedere = await store.methods.setConfirm('Alcuni dei documenti in caricamento sono privi di associazioni. Proseguire ugualmente?');
        if (!confermaProcedere) {
          store.methods.toggleLoaderGlobale();
          return;
        }
      }

      // invio in sequenza
      const uploadPromises = datiDocs.map(({ file, metadata }) => {
        // form data
        const form = new FormData();
        form.append('file', file);
        form.append('metadata', JSON.stringify(metadata));
        // return con la fetch-promise
        return caricaDocumento(form);
      });

      const results = await Promise.allSettled(uploadPromises);
      console.log("results:\n", results);

      const report = results.map((res, idx) => ({
        id_doc: datiDocs[idx].metadata.id_doc,
        success: res.value.success, // true o false
      }));
      console.log("report:\n", report);

      const successi = report.filter(r => r.success === true);
      const fallimenti = report.filter(r => r.success === false);

      let msg;
      if (fallimenti.length === 0) {
        msg = `Operazione andata a buon fine. ${successi.length} documenti caricati.`;
      } else if (successi.length === 0) {
        msg = `Operazione fallita. Nessun documento è stato caricato.`;
      } else {
        const okList = successi.map(r => r.id_doc).join(', ');
        const failList = fallimenti.map(r => r.id_doc).join(', ');
        msg = `I seguenti documenti sono stati caricati con successo: ${okList}.\nI seguenti documenti non sono stati caricati: ${failList}.`;
      }

      store.methods.toggleLoaderGlobale();
      store.methods.setAlert(msg);

      if (fallimenti.length === 0) {
        chiudi();
      }
    }

    function resetDocs() {
      state.docs = [
        {
          file: null,
          input_key: Date.now(),
          tipo: tipiDocs.tipi[0],
          id: '',
          data: '',
          autore: '',
          descr: '',
          note: '',
          temi: [],
          sist_comp: '',
          relazioni: [],
          espanso: true,
          id_focused: false,
        },
      ];
    }

    function addDoc(idx) {
      state.docs.splice(
        idx + 1,
        0,
        {
          file: null,
          input_key: Date.now(),
          tipo: tipiDocs.tipi[0],
          id: '',
          data: '',
          autore: '',
          descr: '',
          note: '',
          temi: [],
          sist_comp: '',
          relazioni: [],
          espanso: true,
          id_focused: false,
        },
      );
    }

    function removeDoc(idx) {
      if (state.docs.length > 1) state.docs.splice(idx, 1);
      else resetDocs();
    }

    function addRelazione(docIdx) {
      state.docs[docIdx].relazioni.push(creaRelazione());
    }

    function removeRelazione(docIdx, relIdx) {
      state.docs[docIdx].relazioni.splice(relIdx, 1);
    }

    function onFileChange(evt, index) {
      const files = (evt.target || evt.srcElement).files;
      if (files && files.length > 0) {
        state.docs[index].file = files[0];
      }
    }

    function toggleEspandi(idx) {
      state.docs[idx].espanso = !state.docs[idx].espanso;
    }

    function getEstensione(doc) {
      if (doc && doc.file) return doc.file.name.split('.').pop().toUpperCase();
      return 'N/A';
    }

    function formattaStringa(str) {
      return str
        .toString() // per sicurezza, qualsiasi sia l'oggetto, rende una stringa
        .trim() // rimuove spazi prima e dopo
        .toLowerCase() // tutto minuscolo
        .replace(/[\\/]/g, '') // rimuove tutti backslash e forwardslash
        .replace(/\s+/g, ' ') // sostituisce spazi multipli con spazio singolo
        .replace(/\s/g, '_'); // sostituisce spazi rimanenti con underscore
    }

    function getFilteredEdifici(rel) {
      if (!rel.località) return [];
      return relOptions.edificio.filter(ed => ed.località === rel.località);
    }

    function onLocalitaChanged(rel) {
      rel.edificio = '';
    }

    function getFilteredElementi(rel) {
      if (!rel.classe) return [];
      return relOptions.elemento.filter(el => el.cl_ogg === rel.classe);
    }

    function onClasseChanged(rel) {
      rel.elemento = '';
    }

    function collectDatiDocs() {
      return state.docs.map(doc => {
        return {
          file: doc.file,
          metadata: {
            cartella_tipo: formattaStringa(doc.tipo),
            tipo_doc: doc.tipo,
            id_doc: sanitizeStringa(doc.id),
            data_doc: doc.data,
            autore_doc: doc.autore,
            descrizione: doc.descr,
            annotazioni: doc.note,
            temi: doc.temi,
            sist_composto: doc.sist_comp,
            relazioni: doc.relazioni.map(r => ({
              località: r.località,
              edificio: r.edificio,
              classe: r.classe,
              elemento: r.elemento,
              annotazioni: r.annotazioni
            }))
          }
        };
      });
    }

    function sanitizeStringa(str) {
      return str.replaceAll(/\s/g, '_').replaceAll(/(\/|\\)/g, '-').replaceAll(/(\?|!)/g, '');
    }

    function idDisponibile(id, idx) {
      if (id) {
        const idSanit = sanitizeStringa(id);
        const idEsistente = idDocs.includes(idSanit);
        const idInCompilazione = idDocsInCompilazione.value.filter((id_cmp, ind) => ind !== idx).includes(idSanit);
        return !(idEsistente || idInCompilazione);
      } else return true;
    }

    function getSuggerimenti(doc) {
      if (!doc.id) return [];
      const q = doc.id.toLowerCase();
      return idDocs
        .filter(id => id.toLowerCase().startsWith(q) && id !== doc.id)
        .slice(0, 10);
    }

    function selezionaSuggerimento(suggerimento, idx) {
      state.docs[idx].id = suggerimento;
    }

    // function selectCartella(cartella) {
    //   state.cartellaSelezionata = cartella;
    //   console.log('cartella selezionata: ', state.cartellaSelezionata);
    // }

    return {
      store,
      relOptions,
      ...toRefs(state),
      tipiDocs,
      chiudi,
      submitDocs,
      resetDocs,
      addDoc,
      removeDoc,
      addRelazione,
      removeRelazione,
      onFileChange,
      toggleEspandi,
      getEstensione,
      getFilteredEdifici,
      onLocalitaChanged,
      getFilteredElementi,
      onClasseChanged,
      sanitizeStringa,
      idDisponibile,
      getSuggerimenti,
      selezionaSuggerimento,
      // selectCartella,
    }
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: #fff;
  border-radius: 8px;
  width: 80vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  margin-bottom: 5px;
  color: var(--verdeMain10ance);
  background-color: var(--blackOlive);
  border: none;
}

.close-btn,
.add-btn,
.remove-btn {
  background-color: var(--blackOlive);
}

.close-btn:hover {
  background-color: var(--blackOliveChiaro);
}

.add-btn:hover,
.remove-btn:hover {
  background-color: var(--lightGray);
}

.close-btn span {
  color: var(--verdeMain10ance);
}

.body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* .sidebar {
  width: 200px;
  background: #fafafa;
  border-right: 1px solid #ddd;
  overflow-y: auto;
} */

/* .sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 10px;
  cursor: pointer;
}

.sidebar li.active {
  background: #e0e0e0;
} */

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.file-bar {
  display: grid;
  grid-template-columns: 30px 1fr auto;
  align-items: center;
  padding: 8px;
  background-color: var(--lightGray);
  cursor: pointer;
  gap: 10px;
}

.file-bar:hover {
  background-color: var(--grigioScuro);
}

.file-icon {
  width: 32px;
  height: 32px;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 4px;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-actions button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  margin-left: 5px;
}

/* .file-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 10px;
  background: #fff;
} */

.file-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.file-details label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

.details-top,
.details-bottom {
  margin: 10px 5px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.details-top .col,
.details-bottom .col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.details-divider {
  height: 1px;
  background: #ddd;
  width: 95%;
  margin: 0;
  align-self: center;
}

.typeahead-wrapper {
  position: relative;
}

.typeahead-wrapper input {
  width: 100%;
}

.typeahead-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 8em;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
  background: white;
  border: 1px solid #ccc;
  z-index: 10;
}

.typeahead-list li {
  padding: 4px 8px;
  cursor: pointer;
}

.typeahead-list li:hover {
  background: #f0f0f0;
}

.id-non-valido {
  color: red;
  font-weight: bold;
}

.temi-group {
  /* 2 colonne equidimensionate */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 16px;
  padding: 8px;
  max-height: 7em;
}

.temi-group .temi-item {
  display: inline-flex;
  margin: 0;
  flex-direction: row-reverse;
  justify-content: space-around;
  align-items: center;
  gap: 6px;
}

.temi-group .temi-item span {
  align-self: flex-end;
}

.footer {
  padding: 10px 20px;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background: #f5f5f5;
}

button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: var(--lightGray);
}

button:hover {
  background-color: var(--grigioScuro);
}

button:disabled {
  cursor: not-allowed;
}

input, textarea, select {
  font-weight: normal;
}

textarea {
  resize: vertical;
}

legend {
  margin-bottom: 0;
}

.btn-add-rmv-rel {
  padding: 2px 7px;
  margin: 5px 0;
}
</style>

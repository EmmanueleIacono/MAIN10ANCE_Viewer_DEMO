<template>
<div>
  <div class="scheda-anagrafica">
    <div class="div-titolo-bottoni">
      <div class="float-dx div-bottoni">
        <BtnBIM @click="chiudiScheda" icona="glyphicon-remove" nome="chiudiScAnagLOD4" title="Chiudi" colore="blu" />
      </div>
      <h4><b>SCHEDA ANAGRAFICA</b></h4>
    </div>
    <br />
    <div v-if="stateAnagrafica.schedaAnagrafica">
      <div v-for="(valore, chiave) in stateAnagrafica.schedaAnagrafica" :key="chiave" class="contenitore-colonne">
        <p class="colonna"><b>{{chiave}}:</b></p>
        <p v-if="!valore || valore === 'null'" class="user-field colonna"><i>Nessun valore</i></p>
        <div v-else-if="chiave === 'Documenti'" class="brk-w user-field colonna">
          <p v-for="doc in valore" :key="doc" class="download" @click="scarica_doc(doc)">{{ doc }}</p>
        </div>
        <p v-else class="brk-w user-field colonna">{{valore}}</p>
      </div>
    </div>
    <div v-else>
      <p><i>Nessuna scheda presente</i></p>
    </div>
  </div>
</div>
</template>

<script>
import { inject } from 'vue';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';
import { downloadDocumentiSchede } from '../js/richieste';

export default {
  name: 'TabCollectionModuloAnagrafica',
  components: {
    BtnBIM,
  },
  setup() {
    const store = inject('store');
    const stateAnagrafica = inject('stateAnagrafica');
    console.log('stateAnagrafica: ', stateAnagrafica);
    console.log('schedaAnagrafica: ', stateAnagrafica.schedaAnagrafica);
    console.log('Documenti: ', stateAnagrafica.schedaAnagrafica['Documenti']);

    async function scarica_doc(nome_documento) {
      try {
        const doc_blob = await downloadDocumentiSchede(nome_documento);
        console.log(doc_blob);
        const blobUrl = URL.createObjectURL(doc_blob);

        const link = document.createElement('a'); // creazione di un <a> nascosto dove inserire l'URL del documento
        link.href = blobUrl;
        const nome_doc_pulito = nome_documento.split('/').pop();
        link.download = nome_doc_pulito; // impostazione del nome del documento
        document.body.appendChild(link); // simulo un click per avviare il download
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } catch (err) {
        console.error('Errore nello scaricamento del documento:', err);
        store.methods.setAlert('Errore nello scaricamento del documento');
      }
    }

    function chiudiScheda() {
      stateAnagrafica.schedaAnagraficaVisibile = false;
      stateAnagrafica.schedaAnagrafica = null;
    }

    return {
      store,
      stateAnagrafica,
      scarica_doc,
      chiudiScheda,
    }
  }
}
</script>

<style scoped>
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
.brk-w {
  overflow-wrap: break-word;
}
.contenitore-colonne {
  display: flex;
}
.colonna {
  flex: 50%;
}
.download {
  color: var(--bluInterreg);
}
.download:hover {
  cursor: pointer;
  font-weight: bold;
}
</style>

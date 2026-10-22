<template>
  <div class="documenti-scheda">
    <ul v-if="documentiSalvati.length" class="documenti-associati">
      <li v-for="doc in documentiSalvati" :key="doc">
        <button type="button" class="documento-link" @click="apriAnteprimaDocumento(doc)">
          {{ nomeDocumento(doc) }}
        </button>
      </li>
    </ul>
    <p v-else-if="solaLettura" class="nessun-valore">Nessun valore</p>

    <div v-if="!solaLettura" class="documenti-editor">
      <div v-if="files.length" class="nuovi-documenti">
        <div v-for="(file, index) in files" :key="chiaveFile(file)" class="nuovo-documento">
          <span>{{ file.name }}</span>
          <button type="button" class="rimuovi-documento glyphicon glyphicon-remove" title="Rimuovi documento" @click="rimuoviFile(index)"></button>
        </div>
      </div>
      <input ref="inputFileRef" type="file" multiple @change="aggiungiFileSelezionati">
      <button type="button" class="aggiungi-documento glyphicon glyphicon-plus" title="Aggiungi documenti" @click="apriSelettoreFile"></button>
    </div>

    <div v-if="preview.visibile" class="documento-dialog-backdrop" @click.self="chiudiAnteprimaDocumento">
      <div class="documento-dialog">
        <div class="documento-dialog-header">
          <h4>{{ preview.nome }}</h4>
          <button type="button" class="documento-close" title="Chiudi" @click="chiudiAnteprimaDocumento">
            <span class="glyphicon glyphicon-remove"></span>
          </button>
        </div>

        <div class="documento-preview">
          <p v-if="preview.caricamento">Caricamento anteprima...</p>
          <p v-else-if="preview.errore">{{ preview.errore }}</p>
          <img v-else-if="preview.tipo === 'immagine'" :src="preview.url" :alt="preview.nome">
          <iframe v-else-if="preview.tipo === 'pdf'" :src="preview.url" :title="preview.nome"></iframe>
          <pre v-else-if="preview.tipo === 'testo'">{{ preview.testo }}</pre>
          <p v-else>Anteprima non disponibile</p>
        </div>

        <div class="documento-dialog-actions">
          <span></span>
          <button type="button" class="documento-download" :disabled="!preview.url" @click="scaricaDocumentoPreview">
            <span class="glyphicon glyphicon-download-alt"></span>
            Download
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onBeforeUnmount, reactive, ref} from 'vue';
import {downloadDocumentiSchede} from '../../js/richieste';

const props = defineProps({
  documentiSalvati: {
    type: Array,
    default: () => [],
  },
  files: {
    type: Array,
    default: () => [],
  },
  solaLettura: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:files']);
const inputFileRef = ref(null);
const preview = reactive({
  visibile: false,
  caricamento: false,
  path: '',
  nome: '',
  url: '',
  tipo: '',
  testo: '',
  errore: '',
});

onBeforeUnmount(chiudiAnteprimaDocumento);

function apriSelettoreFile() {
  inputFileRef.value?.click();
}

function aggiungiFileSelezionati(event) {
  const selezionati = [...(event.target.files || [])];
  const files = [...props.files];
  selezionati.forEach(file => {
    if (!files.some(esistente => chiaveFile(esistente) === chiaveFile(file))) files.push(file);
  });
  emit('update:files', files);
  event.target.value = '';
}

function rimuoviFile(index) {
  const files = [...props.files];
  files.splice(index, 1);
  emit('update:files', files);
}

function chiaveFile(file) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

async function apriAnteprimaDocumento(path) {
  chiudiAnteprimaDocumento();
  preview.visibile = true;
  preview.caricamento = true;
  preview.path = path;
  preview.nome = nomeDocumento(path);

  try {
    const blob = await downloadDocumentiSchede(path);
    if (blob?.errMsg) throw new Error(blob.errMsg);
    preview.url = URL.createObjectURL(blob);
    preview.tipo = tipoAnteprimaDocumento(blob, path);
    if (preview.tipo === 'testo') preview.testo = await blob.text();
  }
  catch {
    preview.errore = 'Documento non disponibile';
  }
  finally {
    preview.caricamento = false;
  }
}

function chiudiAnteprimaDocumento() {
  if (preview.url) URL.revokeObjectURL(preview.url);
  Object.assign(preview, {
    visibile: false,
    caricamento: false,
    path: '',
    nome: '',
    url: '',
    tipo: '',
    testo: '',
    errore: '',
  });
}

function scaricaDocumentoPreview() {
  if (!preview.url) return;
  const link = document.createElement('a');
  link.href = preview.url;
  link.download = preview.nome;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function nomeDocumento(path) {
  return String(path || '').split(/[/\\]/).filter(Boolean).pop() || 'documento';
}

function tipoAnteprimaDocumento(blob, path) {
  const mime = blob.type || '';
  const estensione = nomeDocumento(path).split('.').pop()?.toLowerCase();
  if (mime.startsWith('image/')) return 'immagine';
  if (mime === 'application/pdf' || estensione === 'pdf') return 'pdf';
  if (mime.startsWith('text/') || ['txt', 'csv', 'json', 'xml', 'md'].includes(estensione)) return 'testo';
  return 'non-disponibile';
}
</script>

<style scoped>
.documenti-associati,
.nuovi-documenti {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: .5rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.documento-link {
  padding: 0;
  border: 0;
  background: transparent;
  color: #0b5cad;
  font-weight: 700;
  text-align: right;
  cursor: pointer;
}

.documento-link:hover,
.documento-link:focus {
  text-decoration: underline;
}

.nessun-valore {
  margin: 0;
  font-style: italic;
  text-align: right;
  opacity: .7;
}

.documenti-editor {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: .8rem;
  margin-top: .8rem;
}

.documenti-editor input[type=file] {
  display: none;
}

.nuovo-documento {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: .8rem;
  word-break: break-word;
}

.aggiungi-documento,
.rimuovi-documento {
  border: 1px solid rgba(26, 91, 167, .45);
  background: transparent;
  color: var(--bluMain10ance);
  cursor: pointer;
}

.aggiungi-documento {
  width: 3.4rem;
  height: 3.4rem;
  font-size: 16px;
}

.rimuovi-documento {
  width: 2.6rem;
  height: 2.6rem;
}

.aggiungi-documento:hover,
.aggiungi-documento:focus,
.rimuovi-documento:hover,
.rimuovi-documento:focus {
  background: var(--bluMain10ance);
  color: #fff;
}

.documento-dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(0, 0, 0, .45);
}

.documento-dialog {
  width: min(92vw, 900px);
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #777;
  box-shadow: 0 1.2rem 3rem rgba(0, 0, 0, .35);
}

.documento-dialog-header,
.documento-dialog-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.2rem;
  background: var(--bluInterregTrasparenza);
}

.documento-dialog-header h4 {
  margin: 0;
  font-weight: 700;
  word-break: break-word;
}

.documento-close,
.documento-download {
  border: 0;
  background: var(--bluMain10ance);
  color: #000;
  font-weight: 700;
  cursor: pointer;
}

.documento-close {
  width: 3.4rem;
  height: 3.4rem;
}

.documento-download {
  display: inline-flex;
  align-items: center;
  gap: .6rem;
  padding: .8rem 1.2rem;
}

.documento-download:disabled {
  opacity: .45;
  cursor: not-allowed;
}

.documento-preview {
  min-height: 24rem;
  overflow: auto;
  padding: 1.2rem;
  text-align: center;
}

.documento-preview img {
  max-width: 100%;
  max-height: 62vh;
  object-fit: contain;
}

.documento-preview iframe {
  width: 100%;
  height: 62vh;
  border: 0;
}

.documento-preview pre {
  margin: 0;
  text-align: left;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>

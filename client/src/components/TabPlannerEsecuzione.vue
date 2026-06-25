<template>
<Card>
  <Details summary="ESECUZIONE" :open="state.aperto" class="loading-wrapper">
    <!-- Vecchia logica di esecuzione mantenuta come traccia dead code per revisione successiva.
    <div v-if="store.statePlanner.schedeEsecuzioneFiltrate['controllo'].length || store.statePlanner.schedeEsecuzioneFiltrate['manutenzione regolare'].length || store.statePlanner.schedeEsecuzioneFiltrate['manutenzione correttiva'].length">
      <SchedaEsecuzione v-for="att in store.statePlanner.schedeEsecuzioneFiltrate['controllo']" :key="att['Codice scheda controllo']" :dati="att" :tipo="'controllo'" />
      <SchedaEsecuzione v-for="att in store.statePlanner.schedeEsecuzioneFiltrate['manutenzione regolare']" :key="att['Codice scheda manutenzione regolare']" :dati="att" :tipo="'manutenzione regolare'" />
      <SchedaEsecuzione v-for="att in store.statePlanner.schedeEsecuzioneFiltrate['manutenzione correttiva']" :key="att['Codice scheda manutenzione correttiva']" :dati="att" :tipo="'manutenzione correttiva'" />
    </div>
    <div v-else>Nessuna attivit&agrave; da eseguire</div>
    -->

    <div class="esecuzione-layout">
      <div class="ambiti-tabs">
        <button
          v-for="ambito in ambitiOperativi"
          :key="ambito.id"
          type="button"
          class="ambito-tab"
          :class="{attivo: state.ambitoAttivo === ambito.id}"
          :style="{'--ambito-colore': ambito.colore}"
          @click="state.ambitoAttivo = ambito.id"
        >
          <span class="ambito-dot"></span>
          <span>{{ambito.nome}}</span>
        </button>
      </div>

      <div class="tipo-tabs">
        <button
          v-for="tipo in tipiAttivita"
          :key="tipo.id"
          type="button"
          class="tipo-tab"
          :class="{attivo: state.tipoAttivo === tipo.id}"
          @click="state.tipoAttivo = tipo.id"
        >
          <strong>{{tipo.sigla}}</strong>
          <span>{{tipo.nome}}</span>
        </button>
      </div>

      <div v-if="state.caricamento" class="stato-vuoto">Caricamento attivit&agrave; programmate...</div>

      <div v-else-if="attivitaFiltrate.length" class="lista-esecuzione">
        <article
          v-for="attivita in attivitaFiltrate"
          :key="attivita.uuid"
          class="scheda-esecuzione"
          :class="`attivita-${attivita.tipo_attivita}`"
          :style="stileScheda(attivita)"
        >
          <header class="scheda-header">
            <div>
              <div class="scheda-kicker">
                <span class="badge-attivita">{{attivita.tipo_attivita.toUpperCase()}}</span>
                <span>{{ambitoEsteso(attivita.ambito_operativo)}}</span>
              </div>
              <h4>{{attivita.localita}} - {{attivita.edificio}}</h4>
            </div>
            <button type="button" class="btn-apri" @click="toggleScheda(attivita)">
              {{attivita.aperta ? 'Chiudi scheda' : 'Compila scheda'}}
            </button>
          </header>

          <dl class="overview-grid">
            <div>
              <dt>Localit&agrave;</dt>
              <dd>{{attivita.localita_estesa}}</dd>
            </div>
            <div>
              <dt>Inizio programmato</dt>
              <dd>{{formattaData(attivita.data_programmata)}}</dd>
            </div>
            <div>
              <dt>Durata</dt>
              <dd>{{attivita.durata_programmata_gg}} gg</dd>
            </div>
            <div>
              <dt>Operatore</dt>
              <dd>{{attivita.operatore_programmazione || '-'}}</dd>
            </div>
            <div>
              <dt>Edifici</dt>
              <dd>{{listaEdifici(attivita)}}</dd>
            </div>
          </dl>

          <section v-if="attivita.aperta" class="form-esecuzione">
            <div class="legame-pianificazione">
              Scheda edificio <strong>{{attivita.edificio}}</strong>, parte di pianificazione edifici: {{listaEdifici(attivita)}}.
            </div>

            <div class="form-grid">
              <label>
                Data controllo/esecuzione
                <input v-model="attivita.form.data_con" type="date">
              </label>
              <label>
                Operatore
                <input v-model="attivita.form.operatore">
              </label>
              <label>
                Strumentazione
                <input v-model="attivita.form.strumentaz">
              </label>
              <label>
                Costo
                <input v-model="attivita.form.costo" type="number" min="0" step=".01">
              </label>
              <label>
                Durata
                <input v-model="attivita.form.durata" type="number" min="1" step="1">
              </label>
              <label>
                Documentazione
                <input v-model="attivita.form.doc" placeholder="WIP - Doc upload">
              </label>
            </div>

            <label class="campo-largo">
              Descrizione
              <textarea v-model="attivita.form.sc_1_descrizione" rows="3"></textarea>
            </label>
            <label class="campo-largo">
              Materiali
              <textarea v-model="attivita.form.sc_1_materiali" rows="2"></textarea>
            </label>
            <label class="campo-largo">
              Annotazioni
              <textarea v-model="attivita.form.sc_1_annotazioni" rows="3"></textarea>
            </label>

            <div class="azioni-scheda">
              <span v-if="attivita.salvata" class="bozza-ok">Scheda salvata</span>
              <button type="button" class="btn-salva" @click="salvaScheda(attivita)">Salva scheda</button>
            </div>
          </section>
        </article>
      </div>

      <div v-else class="stato-vuoto">
        Nessuna attivit&agrave; programmata da eseguire per questa selezione.
      </div>
    </div>
  </Details>
</Card>
</template>

<script setup>
import {computed, inject, onMounted, reactive} from 'vue';
import Card from './elementi/Card.vue';
import Details from './elementi/Details.vue';
import {leggiAttivitaProgrammatePerEsecuzione, registraSchedaControlloTipo1} from '../js/richieste';
// Vecchia scheda mantenuta come riferimento dead code.
// import SchedaEsecuzione from './elementi/SchedaEsecuzione.vue';

const store = inject('store');

const ambitiOperativi = [
  {id: 'cops', nome: 'Coperture e Sistemi di regimazione delle acque', colore: '#9b51e0'},
  {id: 'app_dec', nome: 'Apparati decorativi', colore: '#2f80ed'},
  {id: 'pavs', nome: 'Sentieri, pavimentazioni esterne, muretti', colore: '#707070'},
];

const tipiAttivita = [
  {id: 'co', sigla: 'CO', nome: 'Controlli'},
  {id: 'mo', sigla: 'MO', nome: 'Manutenzioni ordinarie'},
  {id: 'ms', sigla: 'MS', nome: 'Manutenzioni straordinarie'},
];

const state = reactive({
  aperto: false,
  caricamento: false,
  ambitoAttivo: 'cops',
  tipoAttivo: 'co',
  attivita: [],
});

const attivitaFiltrate = computed(() => state.attivita
  .filter(attivita => attivita.ambito_operativo === state.ambitoAttivo)
  .filter(attivita => attivita.tipo_attivita === state.tipoAttivo)
  .sort((a, b) => dataISO(a.data_programmata).localeCompare(dataISO(b.data_programmata)) || a.localita.localeCompare(b.localita)));

onMounted(async () => {
  await caricaAttivitaProgrammate();
});

async function caricaAttivitaProgrammate() {
  state.caricamento = true;
  try {
    const attivita = await leggiAttivitaProgrammatePerEsecuzione();
    state.attivita = attivita.map(preparaAttivita);
  }
  catch(e) {
    store.methods.setAlert(e);
  }
  finally {
    state.caricamento = false;
  }
}

function preparaAttivita(attivita) {
  return {
    ...attivita,
    aperta: false,
    salvata: false,
    form: creaFormEsecuzione(attivita),
  };
}

function creaFormEsecuzione(attivita) {
  return {
    data_con: dataISO(attivita.data_programmata),
    operatore: attivita.operatore_programmazione || '',
    doc: '',
    strumentaz: attivita.strumentazione_programmazione || '',
    costo: attivita.costo_previsto || '',
    durata: attivita.durata_programmata_gg || '',
    data_inizio: dataISO(attivita.data_programmata),
    data_fine: '',
    ambito_azione: attivita.ambito_operativo,
    sc_1_descrizione: '',
    sc_1_fotografia: '',
    sc_1_materiali: '',
    sc_1_annotazioni: attivita.note_programmazione || '',
    docs: [],
    rid_pianificazione_uuid: attivita.uuid,
    edificio: attivita.edificio,
    tipo_attivita: attivita.tipo_attivita,
  };
}

function toggleScheda(attivita) {
  attivita.aperta = !attivita.aperta;
}

async function salvaScheda(attivita) {
  if (attivita.tipo_attivita !== 'co') {
    store.methods.setAlert('Il salvataggio DB e pronto per le schede di controllo. Per MO e MS serve definire la tabella di dettaglio dedicata.');
    return;
  }

  if (!campiSchedaValidi(attivita.form)) {
    store.methods.setAlert('Dati incompleti: data, operatore, strumentazione e durata sono obbligatori.');
    return;
  }

  state.caricamento = true;
  try {
    const res = await registraSchedaControlloTipo1(attivita.form);
    if (res.success) {
      attivita.salvata = true;
      store.methods.setAlert('Scheda controllo salvata correttamente');
      await caricaAttivitaProgrammate();
    }
    else {
      store.methods.setAlert(res.error || 'ATTENZIONE: Si e verificato un errore durante il salvataggio della scheda');
    }
  }
  catch(e) {
    store.methods.setAlert(e);
  }
  finally {
    state.caricamento = false;
  }
}

function campiSchedaValidi(form) {
  return form.data_con
    && form.operatore
    && form.strumentaz
    && Number.isInteger(Number(form.durata))
    && Number(form.durata) > 0;
}

function stileScheda(attivita) {
  const colore = ambitiOperativi.find(ambito => ambito.id === attivita.ambito_operativo)?.colore || '#707070';
  const opacita = {
    co: 0.12,
    mo: 0.26,
    ms: 0.88,
  }[attivita.tipo_attivita] || 0.16;
  return {
    '--scheda-colore': colore,
    '--scheda-sfondo': coloreConAlpha(colore, opacita),
    '--scheda-testo': attivita.tipo_attivita === 'ms' ? '#fff' : '#202020',
    '--scheda-testo-soft': attivita.tipo_attivita === 'ms' ? 'rgba(255, 255, 255, .82)' : '#5b5b5b',
  };
}

function listaEdifici(attivita) {
  return (attivita.edifici_pianificazione || [attivita.edificio]).join(', ');
}

function ambitoEsteso(idAmbito) {
  return ambitiOperativi.find(ambito => ambito.id === idAmbito)?.nome || idAmbito;
}

function dataISO(data) {
  if (!data) return '';
  return String(data).slice(0, 10);
}

function formattaData(data) {
  const iso = dataISO(data);
  if (!iso) return '-';
  return iso.split('-').reverse().join('/');
}

function coloreConAlpha(hex, alpha) {
  const colore = hex.replace('#', '');
  const r = parseInt(colore.slice(0, 2), 16);
  const g = parseInt(colore.slice(2, 4), 16);
  const b = parseInt(colore.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
</script>

<style scoped>
.esecuzione-layout {
  display: grid;
  gap: 16px;
}

.ambiti-tabs,
.tipo-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ambito-tab,
.tipo-tab,
.btn-apri,
.btn-salva {
  border: 1px solid #d7d7d7;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font: inherit;
}

.ambito-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-color: var(--ambito-colore);
  color: var(--ambito-colore);
  font-weight: 700;
}

.ambito-tab.attivo {
  background: var(--ambito-colore);
  color: #fff;
}

.ambito-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--ambito-colore);
  border: 2px solid currentColor;
}

.ambito-tab.attivo .ambito-dot {
  background: #fff;
}

.tipo-tab {
  display: grid;
  gap: 2px;
  min-width: 170px;
  padding: 8px 12px;
  text-align: left;
}

.tipo-tab.attivo {
  border-color: #222;
  box-shadow: inset 0 -3px 0 #222;
}

.tipo-tab span {
  color: #555;
  font-size: .9rem;
}

.lista-esecuzione {
  display: grid;
  gap: 12px;
}

.scheda-esecuzione {
  display: grid;
  gap: 12px;
  padding: 14px;
  border: 2px solid var(--scheda-colore);
  border-radius: 8px;
  background: var(--scheda-sfondo);
  color: var(--scheda-testo);
}

.scheda-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.scheda-header h4 {
  margin: 4px 0 0;
  font-size: 1.05rem;
}

.scheda-kicker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  color: var(--scheda-testo-soft);
  font-size: .86rem;
}

.badge-attivita {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  padding: 3px 7px;
  border-radius: 999px;
  background: rgba(255, 255, 255, .78);
  color: #202020;
  font-weight: 800;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
  margin: 0;
}

.overview-grid div {
  min-width: 0;
}

.overview-grid dt {
  color: var(--scheda-testo-soft);
  font-size: .78rem;
  font-weight: 700;
  text-transform: uppercase;
}

.overview-grid dd {
  margin: 2px 0 0;
  overflow-wrap: anywhere;
}

.form-esecuzione {
  display: grid;
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid rgba(0, 0, 0, .18);
}

.legame-pianificazione {
  padding: 8px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, .55);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 10px;
}

.form-grid label,
.campo-largo {
  display: grid;
  gap: 5px;
  font-weight: 700;
}

.form-grid input,
.campo-largo input,
.campo-largo textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #bdbdbd;
  border-radius: 5px;
  padding: 7px 8px;
  font: inherit;
  font-weight: 400;
}

.campo-largo textarea {
  resize: vertical;
}

.azioni-scheda {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}

.btn-apri,
.btn-salva {
  padding: 7px 10px;
  font-weight: 700;
}

.btn-salva {
  border-color: #222;
  background: #222;
  color: #fff;
}

.bozza-ok {
  color: #125c2f;
  font-weight: 700;
}

.stato-vuoto {
  padding: 18px;
  border: 1px dashed #bdbdbd;
  border-radius: 8px;
  color: #555;
}
</style>

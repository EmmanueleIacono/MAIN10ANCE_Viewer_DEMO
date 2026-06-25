<template>
<Card>
  <Details summary="PROGRAMMAZIONE CON INSERIMENTO A CALENDARIO" :open="state.aperto" class="loading-wrapper">
    <LoadingScreen :caricamento="state.caricamento" />

    <div class="tabs-ambito">
      <button
        v-for="ambito in ambitiOperativi"
        :key="ambito.id"
        type="button"
        class="tab-ambito"
        :class="{'tab-ambito-attivo': state.ambitoAttivo === ambito.id}"
        :style="{'--ambito-colore': ambito.colore}"
        @click="state.ambitoAttivo = ambito.id"
      >
        {{ambito.nome}}
      </button>
    </div>

    <div class="filtri-programmazione">
      <div class="gruppo-filtro">
        <b>Ordina per:</b>
        <label for="ordina-cronologia">
          <input v-model="state.ordinaPer" type="radio" id="ordina-cronologia" value="cronologia">
          Cronologia pianificata
        </label>
        <label for="ordina-localita">
          <input v-model="state.ordinaPer" type="radio" id="ordina-localita" value="localita">
          Località
        </label>
      </div>
      <div class="gruppo-filtro">
        <b>Mostra:</b>
        <label for="tipo-co">
          <input v-model="state.tipiVisibili.co" type="checkbox" id="tipo-co">
          Controlli
        </label>
        <label for="tipo-mo">
          <input v-model="state.tipiVisibili.mo" type="checkbox" id="tipo-mo">
          Manutenzioni ordinarie
        </label>
        <label for="tipo-ms">
          <input v-model="state.tipiVisibili.ms" type="checkbox" id="tipo-ms">
          Manutenzioni straordinarie
        </label>
      </div>
    </div>

    <div v-if="attivitaFiltrate.length">
      <article
        v-for="attivita in attivitaFiltrate"
        :key="`${attivita.id_pianificazione}-${attivita.tipo_attivita}`"
        class="scheda-programmazione"
        :class="`attivita-${attivita.tipo_attivita}`"
        :style="stileScheda(attivita)"
      >
        <div class="scheda-overview">
          <div class="scheda-header">
            <span class="badge-attivita">{{attivita.tipo_attivita.toUpperCase()}}</span>
            <div>
              <h4>{{localitaCalendario(attivita)}} - {{attivita.descrizione_attivita}}</h4>
              <p>{{ambitoEsteso(attivita.ambito_operativo)}}</p>
            </div>
          </div>
          <div class="scheda-dati">
            <div>
              <span>Località</span>
              <b>{{attivita.localita_estesa}}</b>
            </div>
            <div>
              <span>Edifici</span>
              <b>{{attivita.edifici.join(', ')}}</b>
            </div>
            <div>
              <span>Inizio ciclo</span>
              <b>{{formattaData(attivita.data_inizio)}}</b>
            </div>
            <div>
              <span>Durata</span>
              <b>{{attivita.durata_prevista_gg}} gg</b>
            </div>
            <div>
              <span>Frequenza</span>
              <b>{{attivita.frequenza_mesi}} mesi</b>
            </div>
            <div>
              <span>Stato</span>
              <b>{{attivita.stato}}</b>
            </div>
          </div>
        </div>

        <div class="dx">
          <button
            type="button"
            class="glyphicon integra"
            :class="attivita.aperta ? 'glyphicon-minus' : 'glyphicon-plus'"
            @click="toggleProgrammazione(attivita)"
          ></button>
        </div>

        <div v-if="attivita.aperta" class="form-programmazione">
          <div class="contenitore-colonne">
            <div class="colonna">
              <div class="contenitore-colonne centra">
                <label :for="`operatore-${attivita.id_pianificazione}-${attivita.tipo_attivita}`" class="colonna">Operatore:</label>
                <input v-model="attivita.form.operatore" :id="`operatore-${attivita.id_pianificazione}-${attivita.tipo_attivita}`" class="colonna">
              </div>
              <div class="contenitore-colonne centra">
                <label :for="`strumentazione-${attivita.id_pianificazione}-${attivita.tipo_attivita}`" class="colonna">Strumentazione:</label>
                <input v-model="attivita.form.strumentazione" :id="`strumentazione-${attivita.id_pianificazione}-${attivita.tipo_attivita}`" class="colonna">
              </div>
              <div class="contenitore-colonne centra">
                <label :for="`note-${attivita.id_pianificazione}-${attivita.tipo_attivita}`" class="colonna">Note:</label>
                <input v-model="attivita.form.note" :id="`note-${attivita.id_pianificazione}-${attivita.tipo_attivita}`" class="colonna">
              </div>
            </div>
            <div class="colonna">
              <div class="contenitore-colonne centra">
                <label :for="`costo-${attivita.id_pianificazione}-${attivita.tipo_attivita}`" class="colonna">Costo previsto (€):</label>
                <input v-model="attivita.form.costo_previsto" type="number" min="0" step=".01" :id="`costo-${attivita.id_pianificazione}-${attivita.tipo_attivita}`" class="colonna">
              </div>
              <div class="contenitore-colonne centra">
                <label :for="`durata-${attivita.id_pianificazione}-${attivita.tipo_attivita}`" class="colonna">Durata prevista (gg):</label>
                <input v-model="attivita.form.durata_prevista_gg" type="number" min="1" step="1" :id="`durata-${attivita.id_pianificazione}-${attivita.tipo_attivita}`" class="colonna">
              </div>
              <div class="contenitore-colonne centra">
                <label :for="`data-${attivita.id_pianificazione}-${attivita.tipo_attivita}`" class="colonna">Data di inizio attività:</label>
                <input v-model="attivita.form.data_inizio_attivita" type="date" :id="`data-${attivita.id_pianificazione}-${attivita.tipo_attivita}`" class="colonna">
              </div>
            </div>
          </div>
          <button @click="salvaProgrammazione(attivita)" class="bottone-main10ance bottone-salva-programmazione">Salva programmazione</button>
        </div>
      </article>
    </div>
    <div v-else>Nessuna attività pianificata per l'ambito selezionato</div>
  </Details>
</Card>
</template>

<script setup>
import {computed, onMounted, reactive, inject} from 'vue';
import {leggiPianificazioniDaProgrammare, programmaPianificazioneControlliManutenzioni} from '../js/richieste';
import Card from './elementi/Card.vue';
import Details from './elementi/Details.vue';
import LoadingScreen from './elementi/LoadingScreen.vue';

const emit = defineEmits(['integrazioneAggiornata']);
defineExpose({
  popolaAttività,
  get aperto() {
    return state.aperto;
  },
  set aperto(valore) {
    state.aperto = valore;
  },
});

const store = inject('store');
const ambitiOperativi = [
  {id: 'cops', nome: 'Coperture e Sistemi di regimazione delle acque', colore: '#9b51e0'},
  {id: 'app_dec', nome: 'Apparati decorativi', colore: '#2f80ed'},
  {id: 'pavs', nome: 'Sentieri, pavimentazioni esterne, muretti', colore: '#707070'},
];

const state = reactive({
  aperto: false,
  caricamento: false,
  ambitoAttivo: 'cops',
  attivita: [],
  ordinaPer: 'cronologia',
  tipiVisibili: {
    co: true,
    mo: true,
    ms: true,
  },
});

const attivitaFiltrate = computed(() => state.attivita
  .filter(attivita => attivita.ambito_operativo === state.ambitoAttivo)
  .filter(attivita => state.tipiVisibili[attivita.tipo_attivita])
  .sort(ordinaAttivita));

onMounted(async () => {
  await popolaAttività();
});

async function popolaAttività() {
  state.caricamento = true;
  const attivita = await leggiPianificazioniDaProgrammare();
  state.attivita = attivita.map(preparaAttivita);
  state.caricamento = false;
}

function preparaAttivita(attivita) {
  const dataInizio = dataISO(attivita.data_inizio_programmata || attivita.data_inizio);
  const durata = attivita.durata_programmata_gg || attivita.durata_prevista_gg;
  return {
    ...attivita,
    aperta: false,
    form: {
      operatore: attivita.operatore_programmazione || '',
      strumentazione: attivita.strumentazione_programmazione || '',
      costo_previsto: attivita.costo_previsto || '',
      durata_prevista_gg: durata,
      data_inizio_attivita: dataInizio,
      note: attivita.note_programmazione || '',
    },
  };
}

function toggleProgrammazione(attivita) {
  attivita.aperta = !attivita.aperta;
  if (attivita.aperta) resetForm(attivita);
}

function resetForm(attivita) {
  const preparata = preparaAttivita(attivita);
  attivita.form = preparata.form;
}

async function salvaProgrammazione(attivita) {
  if (!campiProgrammazioneValidi(attivita.form)) {
    store.methods.setAlert('I campi "Operatore", "Strumentazione", "Costo previsto", "Durata prevista" e "Data di inizio attività" sono obbligatori');
    return;
  }

  state.caricamento = true;
  try {
    const res = await programmaPianificazioneControlliManutenzioni({
      id_pianificazione: attivita.id_pianificazione,
      tipo_attivita: attivita.tipo_attivita,
      ...attivita.form,
    });
    if (res.success) {
      store.methods.setAlert('Programmazione salvata correttamente');
      await popolaAttività();
      emit('integrazioneAggiornata');
    }
    else {
      store.methods.setAlert('ATTENZIONE: Si è verificato un errore durante la registrazione dei dati');
    }
  }
  catch(e) {
    store.methods.setAlert(e);
  }
  finally {
    state.caricamento = false;
  }
}

function campiProgrammazioneValidi(form) {
  return form.operatore
    && form.strumentazione
    && Number(form.costo_previsto) >= 0
    && Number.isInteger(Number(form.durata_prevista_gg))
    && Number(form.durata_prevista_gg) > 0
    && form.data_inizio_attivita;
}

function stileScheda(attivita) {
  const colore = ambitiOperativi.find(ambito => ambito.id === attivita.ambito_operativo)?.colore || '#707070';
  const opacita = {
    co: 0.16,
    mo: 0.34,
    ms: 0.94,
  }[attivita.tipo_attivita] || 0.18;
  return {
    '--scheda-colore': colore,
    '--scheda-sfondo': coloreConAlpha(colore, opacita),
    '--scheda-testo': attivita.tipo_attivita === 'ms' ? '#fff' : 'inherit',
  };
}

function ordinaAttivita(a, b) {
  if (state.ordinaPer === 'localita') {
    return `${a.localita}-${a.tipo_attivita}`.localeCompare(`${b.localita}-${b.tipo_attivita}`);
  }
  return dataISO(a.data_inizio).localeCompare(dataISO(b.data_inizio)) || a.localita.localeCompare(b.localita);
}

function ambitoEsteso(idAmbito) {
  return ambitiOperativi.find(ambito => ambito.id === idAmbito)?.nome || idAmbito;
}

function localitaCalendario(attivita) {
  return attivita.localita_calendario || attivita.localita;
}

function coloreConAlpha(hex, alpha) {
  const colore = hex.replace('#', '');
  const r = parseInt(colore.slice(0, 2), 16);
  const g = parseInt(colore.slice(2, 4), 16);
  const b = parseInt(colore.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function dataISO(data) {
  if (!data) return '';
  if (typeof data === 'string' && !data.includes('T')) return data.slice(0, 10);
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  const anno = dataObj.getFullYear();
  const mese = String(dataObj.getMonth() + 1).padStart(2, '0');
  const giorno = String(dataObj.getDate()).padStart(2, '0');
  return `${anno}-${mese}-${giorno}`;
}

function formattaData(data) {
  return data ? new Date(`${dataISO(data)}T00:00:00`).toLocaleDateString('it-IT') : '';
}
</script>

<style scoped>
.tabs-ambito {
  display: flex;
  gap: 0.4rem;
  margin: 10px 0;
}
.tab-ambito {
  flex: 1;
  border: 2px solid var(--ambito-colore);
  border-radius: 3px;
  padding: 0.45rem 0.35rem;
  color: var(--ghostWhite);
  background-color: var(--ambito-colore);
  font-weight: bold;
  opacity: 0.72;
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.tab-ambito-attivo,
.tab-ambito:hover {
  color: var(--ghostWhite);
  background-color: var(--ambito-colore);
  opacity: 1;
  transform: translateY(-1px);
}
.filtri-programmazione {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  align-items: center;
  margin: 0.75rem 0;
  padding: 0.5rem 0;
  border-top: 1px solid var(--verdeMain10anceTrasparenza);
  border-bottom: 1px solid var(--verdeMain10anceTrasparenza);
}
.gruppo-filtro {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}
.gruppo-filtro label {
  margin-bottom: 0;
}
.scheda-programmazione {
  position: relative;
  margin: 0.75rem 0;
  border: 1px solid var(--scheda-colore);
  border-left-width: 7px;
  border-radius: 4px;
  padding: 0.85rem 2.6rem 0.85rem 0.95rem;
  background-color: var(--scheda-sfondo);
  color: var(--scheda-testo);
}
.scheda-overview {
  display: block;
}
.scheda-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.scheda-header p {
  margin: 0.1rem 0 0;
}
.scheda-header h4 {
  margin-top: 0;
  margin-bottom: 0;
}
.badge-attivita {
  flex: 0 0 3.2rem;
  border: 1px solid currentColor;
  border-radius: 3px;
  padding: 0.25rem 0.35rem;
  text-align: center;
  font-weight: bold;
  color: var(--scheda-testo);
  background-color: color-mix(in srgb, var(--scheda-colore), transparent 20%);
}
.scheda-dati {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.65rem 1rem;
}
.scheda-dati div {
  min-width: 0;
}
.scheda-dati span {
  display: block;
  font-size: 0.82rem;
  opacity: 0.78;
}
.scheda-dati b {
  display: block;
  overflow-wrap: anywhere;
}
.contenitore-colonne {
  display: flex;
  gap: 1rem;
}
.colonna {
  flex: 1;
}
.form-programmazione {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid color-mix(in srgb, var(--scheda-colore), transparent 35%);
}
input {
  margin: 5px;
  z-index: 100;
}
.centra {
  align-items: center;
}
.dx {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  z-index: 90;
}
.integra {
  border: none;
  color: var(--ghostWhite);
  padding: 5px;
  margin: 5px;
  border-radius: 15px;
  background-color: var(--scheda-colore);
}
.bottone-salva-programmazione {
  margin-left: 0;
  margin-bottom: 0;
  background-color: var(--scheda-colore);
}
@media (max-width: 900px) {
  .tabs-ambito {
    flex-direction: column;
  }
  .scheda-dati {
    grid-template-columns: 1fr;
  }
  .contenitore-colonne {
    flex-direction: column;
  }
}
</style>

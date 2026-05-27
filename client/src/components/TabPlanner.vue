<template>
<div v-if="store.getters.getUsrVwList().includes('apriTabSchede')">
  <MainPanel :colonna="'col-sm-7'">
    <br />
    <SintesiLavori v-if="store.getters.getUsrVwList().includes('pianificazione')" />
    <Pianificazione @pianificazioneAggiornata="aggiornaEventi" v-if="store.getters.getUsrVwList().includes('pianificazione')" />
    <Programmazione @integrazioneAggiornata="aggiornaEventi" v-if="store.getters.getUsrVwList().includes('pianificazione')" ref="IntegrazioneRef" />
    <ExTempore v-if="store.getters.getUsrVwList().includes('pianificazione')" />
    <AttPrecedenti v-if="store.getters.getUsrVwList().includes('pianificazione')" />
    <Esecuzione ref="EsecuzioneRef" />
    <Storico />
  </MainPanel>
  <Explorer :colonna="'col-sm-5'">
    <FullCalendar ref="fullCalendarPlanner" :options="calendarOptions" />
    <div v-if="eventoPianificazioneAperto" class="overlay-evento" @click.self="chiudiEventoPianificazione">
      <div class="dialog-evento">
        <button type="button" class="chiudi-evento" @click="chiudiEventoPianificazione">×</button>
        <h3>{{eventoPianificazioneAperto.title}}</h3>
        <p><b>Località:</b> {{eventoPianificazioneAperto.localita_estesa}}</p>
        <p><b>Edifici:</b> {{eventoPianificazioneAperto.edifici.join(', ')}}</p>
        <p><b>Ambito operativo:</b> {{eventoPianificazioneAperto.ambito_operativo_esteso}}</p>
        <p v-if="eventoPianificazioneAperto.necessita_supporto"><b>Necessità supporto:</b> {{eventoPianificazioneAperto.necessita_supporto_estesa}}</p>
        <p><b>Stato:</b> {{eventoPianificazioneAperto.stato}}</p>
        <ul>
          <li v-for="attivita in eventoPianificazioneAperto.attivita_univoche" :key="attivita.tipo_attivita">
            <b>{{attivita.tipo_attivita.toUpperCase()}}</b> - {{attivita.descrizione_attivita}}:
            ogni {{attivita.frequenza_mesi}} mesi, dal {{formattaData(attivita.data_inizio)}}, durata {{attivita.durata_prevista_gg}} gg
          </li>
        </ul>
      </div>
    </div>
    <br />
    <FiltriEsecuzione />
    <br />
    <FiltriStorico />
  </Explorer>
</div>
</template>

<script>
import {inject, onActivated, reactive, ref, watch} from 'vue';
import {leggiAttivitàProg, leggiPianificazioniControlliManutenzioni} from '../js/richieste';
import FullCalendar from '@fullcalendar/vue3';
import DayGridPlugin from '@fullcalendar/daygrid';
import itLocale from '@fullcalendar/core/locales/it';
import MainPanel from './elementi/MainPanel.vue';
import Explorer from './elementi/Explorer.vue';
import FiltriEsecuzione from './TabPlannerFiltriEsecuzione.vue';
import FiltriStorico from './TabPlannerFiltriStorico.vue';
import Pianificazione from './TabPlannerPianificazione.vue';
import Programmazione from './TabPlannerIntegrazione.vue';
import Esecuzione from './TabPlannerEsecuzione.vue';
import Storico from './TabPlannerStorico.vue';
import ExTempore from './TabPlannerExTempore.vue';
import AttPrecedenti from './TabPlannerAttPrecedenti.vue';
import SintesiLavori from './TabPlannerSintesiLavori.vue';

export default {
  name: 'TabPlanner',
  components: {
    MainPanel,
    Explorer,
    FullCalendar,
    FiltriEsecuzione,
    FiltriStorico,
    Pianificazione,
    Programmazione,
    Esecuzione,
    Storico,
    ExTempore,
    AttPrecedenti,
    SintesiLavori,
  },
  setup() {
    const store = inject('store');
    const fullCalendarPlanner = ref(null);
    const IntegrazioneRef = ref(null);
    const EsecuzioneRef = ref(null);
    const eventoPianificazioneAperto = ref(null);
    const calendarOptions = reactive({
      plugins: [DayGridPlugin],
      initialView: 'dayGridMonth',
      timeZone: 'local',
      locale: itLocale,
      headerToolbar: {
        left: 'dayGridMonth,dayGridWeek',
        center: 'title',
        right: 'prevYear,prev,next,nextYear'
      },
      defaultAllDay: true,
      dayMaxEvents: true,
      events: [],
      eventMouseEnter: (info) => {
        info.el.style.cursor = 'pointer';
        info.el.title = info.event.title;
      },
      eventDidMount: (info) => {
        if (info.event.extendedProps.tipo_evento === 'pianificazione_cm' && info.event.extendedProps.stato === 'pianificata') {
          info.el.style.backgroundColor = 'transparent';
          info.el.style.border = `3px dashed ${info.event.borderColor}`;
          info.el.style.color = info.event.borderColor;
        }
      },
      eventClick: (info) => {
        if (info.event.extendedProps.tipo_evento === 'pianificazione_cm') {
          apriEventoPianificazione(info.event);
          return;
        }
        isolaScheda(info.event.id, info.event.extendedProps);
      },
    });

    watch(() => store.statePlanner.refreshPlanner, () => {
      aggiornaEventi();
    });

    watch(() => store.state.tabAttivo, tab => {
      if (tab === 'Tab3') {
        popolaCalendario();
        setTimeout(() => {
          resizeCal();
        }, 100);
      }
    }, {immediate: true});

    onActivated(async () => {
      if (!store.statePlanner.datiPlannerLoaded) {
        popolaCalendario();
        await store.methods.recuperaDatiPlanner();
      }
    });

    async function aggiornaEventi() {
      await popolaCalendario();
      await IntegrazioneRef.value.popolaAttività();
      await store.methods.recuperaDatiPlanner();
    }

    async function popolaCalendario() {
      const listaEventiProg = await aggiungiEventiProg();
      const listaEventiPianificazioni = await aggiungiEventiPianificazioniControlliManutenzioni();
      const listaEventiTotale = [...listaEventiProg, ...listaEventiPianificazioni];
      calendarOptions.events = listaEventiTotale;
    }

    async function aggiungiEventiProg() {
      const eventi = await leggiAttivitàProg();
      const nuoviEventiProg = eventi.map(evento => ({
        id: `PROG-${evento.id_att_prog}`,
        title: `${evento.id_main10ance[0]?.split('|')[0]} - ${evento.tipo_attività[0][0].toUpperCase()}${evento.tipo_attività[0].slice(1)}`,
        start: evento.data_prog,
        extendedProps: {
          classe: evento.cl_ogg_fr,
          gruppo: evento.id_group,
          frase_di_rischio: evento.rid_fr_risc,
          frequenza_prevista: evento.frequenza,
          attività_previste: evento.tipo_attività,
          ciclica: ['controllo', 'manutenzione regolare'].includes(evento.tipo_attività[0]),
          elementi_interessati: evento.id_main10ance,
          data_inserimento: evento.data_ins,
          da_integrare: evento.da_integrare,
        },
        backgroundColor: evento.da_integrare ? '#bbb' : (['controllo', 'manutenzione regolare'].includes(evento.tipo_attività[0]) ? '#a8c956' : '#ceba4c'),
        borderColor: evento.da_integrare ? '#bbb' : (['controllo', 'manutenzione regolare'].includes(evento.tipo_attività[0]) ? '#a8c956' : '#ceba4c'),
        textColor: '#fff'
      }));
      return nuoviEventiProg;
    }

    async function aggiungiEventiPianificazioniControlliManutenzioni() {
      const pianificazioni = await leggiPianificazioniControlliManutenzioni();
      return pianificazioni.map(pianificazione => {
        const coloreAmbito = coloreAmbitoOperativo(pianificazione.ambito_operativo);
        const start = dataISO(pianificazione.data_inizio);
        return {
          id: `PIAN-CM-${pianificazione.id_pianificazione}`,
          title: `${pianificazione.localita} - ${pianificazione.tipi_attivita.map(tipo => tipo.toUpperCase()).join(' ')}`,
          start,
          end: calcolaFinePianificazione(pianificazione.attivita),
          allDay: true,
          extendedProps: {
            tipo_evento: 'pianificazione_cm',
            id_pianificazione: pianificazione.id_pianificazione,
            localita: pianificazione.localita,
            localita_estesa: pianificazione.localita_estesa,
            edifici: pianificazione.edifici,
            ambito_operativo: pianificazione.ambito_operativo,
            ambito_operativo_esteso: nomeAmbitoOperativo(pianificazione.ambito_operativo),
            necessita_supporto: pianificazione.necessita_supporto,
            necessita_supporto_estesa: nomeAmbitoOperativo(pianificazione.necessita_supporto),
            stato: pianificazione.stato,
            attivita: pianificazione.attivita,
            attivita_univoche: attivitaUnivoche(pianificazione.attivita),
          },
          backgroundColor: pianificazione.stato === 'pianificata' ? 'transparent' : coloreAmbito,
          borderColor: coloreAmbito,
          textColor: pianificazione.stato === 'pianificata' ? coloreAmbito : '#fff',
        };
      });
    }

    function resizeCal() {
      const calAPI = fullCalendarPlanner.value.getApi();
      calAPI.updateSize();
    }

    function apriEventoPianificazione(evento) {
      eventoPianificazioneAperto.value = {
        title: evento.title,
        ...evento.extendedProps,
      };
    }

    function chiudiEventoPianificazione() {
      eventoPianificazioneAperto.value = null;
    }

    function coloreAmbitoOperativo(ambito) {
      return infoAmbitoOperativo(ambito).colore;
    }

    function nomeAmbitoOperativo(ambito) {
      return infoAmbitoOperativo(ambito).nome;
    }

    function infoAmbitoOperativo(ambito) {
      const ambiti = {
        cops: {nome: 'Coperture e Sistemi di regimazione delle acque', colore: '#9b51e0'},
        app_dec: {nome: 'Apparati decorativi', colore: '#2f80ed'},
        pavs: {nome: 'Sentieri, pavimentazioni esterne, muretti', colore: '#707070'},
      };
      return ambiti[ambito] || {nome: ambito || '', colore: '#707070'};
    }

    function attivitaUnivoche(attivita) {
      return Object.values(attivita.reduce((acc, att) => {
        if (!acc[att.tipo_attivita]) acc[att.tipo_attivita] = att;
        return acc;
      }, {}));
    }

    function calcolaFinePianificazione(attivita) {
      const dateFine = attivita.map(att => aggiungiGiorniLavorativi(att.data_inizio, att.durata_prevista_gg));
      return dateFine.sort().at(-1);
    }

    function aggiungiGiorniLavorativi(dataInizio, durataGiorni) {
      const data = creaDataLocale(dataInizio);
      let giorniRimanenti = Number(durataGiorni);
      while (giorniRimanenti > 0) {
        const giornoSettimana = data.getDay();
        if (giornoSettimana !== 0 && giornoSettimana !== 6) giorniRimanenti--;
        data.setDate(data.getDate() + 1);
      }
      return dataISO(data);
    }

    function creaDataLocale(data) {
      return new Date(`${dataISO(data)}T00:00:00`);
    }

    function dataISO(data) {
      if (typeof data === 'string' && !data.includes('T')) return data.slice(0, 10);
      const dataObj = typeof data === 'string' ? new Date(data) : data;
      const anno = dataObj.getFullYear();
      const mese = String(dataObj.getMonth() + 1).padStart(2, '0');
      const giorno = String(dataObj.getDate()).padStart(2, '0');
      return `${anno}-${mese}-${giorno}`;
    }

    function formattaData(data) {
      return creaDataLocale(data).toLocaleDateString('it-IT');
    }

    function isolaScheda(id, props) {
      if (props.da_integrare) {
        EsecuzioneRef.value.aperto = false;
        IntegrazioneRef.value.aperto = true;
        const attCicliche = store.statePlanner.datiProgrammazione.attCicliche;
        console.log(id);
        const idSchedaProg = id.split('-')[1];
        console.log(idSchedaProg);
        console.log(attCicliche);
        attCicliche.forEach(att => {
          if (att.id_att_prog !== idSchedaProg) att.visibile = false;
          else att.visibile = true;
        });

      }
      else {
        IntegrazioneRef.value.aperto = false;
        EsecuzioneRef.value.aperto = true;
      }
    }

    return {
      store,
      fullCalendarPlanner,
      IntegrazioneRef,
      EsecuzioneRef,
      eventoPianificazioneAperto,
      calendarOptions,
      aggiornaEventi,
      resizeCal,
      chiudiEventoPianificazione,
      formattaData,
    }
  }
}
</script>

<style scoped>
.overlay-evento {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.35);
}
.dialog-evento {
  position: relative;
  width: min(42rem, 100%);
  max-height: 85vh;
  overflow: auto;
  border: 1px solid var(--verdeMain10ance);
  border-radius: 4px;
  padding: 1.25rem;
  background-color: var(--blackOlive);
  color: var(--grigio);
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.35);
}
.dialog-evento h3 {
  margin-top: 0;
}
.dialog-evento ul {
  padding-left: 1.25rem;
}
.chiudi-evento {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  border: 1px solid var(--verdeMain10anceTrasparenza);
  border-radius: 3px;
  color: inherit;
  background-color: transparent;
  cursor: pointer;
}
</style>

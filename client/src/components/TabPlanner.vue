<template>
<div v-if="store.getters.getUsrVwList().includes('apriTabSchede')">
  <MainPanel :colonna="'col-sm-7'">
    <br />
    <!-- <div v-if="store.getters.getUsrVwList().includes('pianificazione')"> -->
      <!-- <ViewerPlanner v-if="store.getters.getUsrVwList().includes('pianificazione')" /> -->
      <!-- <br v-if="store.getters.getUsrVwList().includes('pianificazione')" />
      <br v-if="store.getters.getUsrVwList().includes('pianificazione')" />
      <br v-if="store.getters.getUsrVwList().includes('pianificazione')" /> -->
      <Pianificazione @pianificazioneAggiornata="aggiornaEventi" v-if="store.getters.getUsrVwList().includes('pianificazione')" />
      <Programmazione @integrazioneAggiornata="aggiornaEventi" v-if="store.getters.getUsrVwList().includes('pianificazione')" ref="IntegrazioneRef" />
      <ExTempore v-if="store.getters.getUsrVwList().includes('pianificazione')" />
      <AttPrecedenti v-if="store.getters.getUsrVwList().includes('pianificazione')" />
    <!-- </div> -->
    <Esecuzione ref="EsecuzioneRef" />
    <Storico />
  </MainPanel>
  <Explorer :colonna="'col-sm-5'">
    <FullCalendar ref="fullCalendarPlanner" :options="calendarOptions" />
    <br />
    <Filtri />
  </Explorer>
</div>
</template>

<script>
import {inject, onActivated, onMounted, reactive, ref, watch} from 'vue';
import {leggiAttivitàProg} from '../js/richieste';
import FullCalendar from '@fullcalendar/vue3';
import DayGridPlugin from '@fullcalendar/daygrid';
import itLocale from '@fullcalendar/core/locales/it';
import MainPanel from './elementi/MainPanel.vue';
import Explorer from './elementi/Explorer.vue';
import Filtri from './TabPlannerFiltri.vue';
import Pianificazione from './TabPlannerPianificazione.vue';
import Programmazione from './TabPlannerIntegrazione.vue';
import Esecuzione from './TabPlannerEsecuzione.vue';
import Storico from './TabPlannerStorico.vue';
import ExTempore from './TabPlannerExTempore.vue';
import AttPrecedenti from './TabPlannerAttPrecedenti.vue';
// import ViewerPlanner from './TabPlannerBIMViewer.vue';

export default {
  name: 'TabPlanner',
  components: {
    MainPanel,
    Explorer,
    FullCalendar,
    Filtri,
    Pianificazione,
    Programmazione,
    Esecuzione,
    Storico,
    ExTempore,
    AttPrecedenti,
    // ViewerPlanner,
  },
  setup() {
    const store = inject('store');
    const fullCalendarPlanner = ref(null);
    const IntegrazioneRef = ref(null);
    const EsecuzioneRef = ref(null);
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
      eventClick: (info) => {
        isolaScheda(info.event.id, info.event.extendedProps);
      },
    });

    // popolaCalendario();

    watch(() => store.statePlanner.refreshPlanner, () => {
      aggiornaEventi();
    });

    watch(() => store.state.tabAttivo, tab => {
      if (tab === 'Tab3') {
        setTimeout(() => {
          resizeCal();
        }, 100);
      }
    }, {immediate: true});

    onMounted(async () => {
      popolaCalendario();
      await store.methods.recuperaDatiPlanner();
    });

    onActivated(async () => {
      if (!store.statePlanner.datiPlannerLoaded) {
        popolaCalendario();
        await store.methods.recuperaDatiPlanner();
      }
    });

    async function aggiornaEventi() {
      await popolaCalendario();
      await IntegrazioneRef.value.popolaAttività();
      await EsecuzioneRef.value.popolaSchede();
    }

    async function popolaCalendario() {
      const listaEventiProg = await aggiungiEventiProg();
      const listaAltrobooo = [];
      const listaEventiTotale = [...listaEventiProg, ...listaAltrobooo];
      calendarOptions.events = listaEventiTotale;
    }

    async function aggiungiEventiProg() {
      const eventi = await leggiAttivitàProg();
      const nuoviEventiProg = eventi.map(evento => ({
        id: `PROG-${evento.id_att_prog}`,
        title: `${evento.tipo_attività[0][0].toUpperCase()}${evento.tipo_attività[0].slice(1)}`,
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

    function resizeCal() {
      const calAPI = fullCalendarPlanner.value.getApi();
      calAPI.updateSize();
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
      calendarOptions,
      aggiornaEventi,
      resizeCal,
    }
  }
}
</script>

<style scoped>
</style>

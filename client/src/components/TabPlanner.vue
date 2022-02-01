<template>
<div v-if="store.getters.getUsrVwList().includes('apriTabSchede')">
  <MainPanel :colonna="'col-sm-7'">
    <br />
    <Pianificazione @aggiornaCalendario="popolaCalendario" />
    <Integrazione />
    <h4>
      <span id="refreshSchede" class="glyphicon glyphicon-refresh"></span>
      <b>SCHEDE</b>
    </h4>
    <div id="contenitore-schede">
      QUI SCHEDE
    </div>
  </MainPanel>
  <Explorer :colonna="'col-sm-5'">
    <FullCalendar ref="fullCalendarPlanner" :options="calendarOptions" />
    <br />
    <Filtri />
  </Explorer>
</div>
</template>

<script>
import {inject, reactive, ref} from 'vue';
import {leggiAttivitàProg} from '../js/richieste';
import FullCalendar from '@fullcalendar/vue3';
import DayGridPlugin from '@fullcalendar/daygrid';
import itLocale from '@fullcalendar/core/locales/it';
import MainPanel from './elementi/MainPanel.vue';
import Explorer from './elementi/Explorer.vue';
import Filtri from './TabPlannerFiltri.vue';
import Pianificazione from './TabPlannerPianificazione.vue';
import Integrazione from './TabPlannerIntegrazione.vue';

export default {
  name: 'TabPlanner',
  components: {
    MainPanel,
    Explorer,
    FullCalendar,
    Filtri,
    Pianificazione,
    Integrazione,
  },
  setup() {
    const store = inject('store');
    const fullCalendarPlanner = ref(null);
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
      events: [
        { title: 'event 1', date: '2022-02-01' },
        { title: 'event 2', date: '2022-02-01' },
        { title: 'event 3', date: '2022-02-01' },
        { title: 'event 4', date: '2022-02-01' },
        { title: 'event 5', date: '2022-02-01' },
        { title: 'event 6', date: '2022-02-02' },
      ],
      eventMouseEnter: (info) => {
        info.el.style.cursor = 'pointer';
        info.el.title = info.event.title;
      },
      eventClick: (info) => {
        console.log(info.event.id);
        console.log(info.event.extendedProps);
      },
    });

    popolaCalendario();

    async function popolaCalendario() {
      const listaEventiProg = await aggiungiEventiProg();
      const listaAltrobooo = [];
      const listaEventiTotale = [...listaEventiProg, ...listaAltrobooo];
      calendarOptions.events = listaEventiTotale;
    }

    async function aggiungiEventiProg() {
      const eventi = await leggiAttivitàProg();
      const nuoviEventiProg = eventi.map(evento => ({
        id: `PROG-C-${evento.id_att_prog}`,
        title: `Controllo programmato`,
        start: evento.data_prog,
        extendedProps: {
          classe: evento.cl_ogg_fr,
          gruppo: evento.id_group,
          frase_di_rischio: evento.rid_fr_risc,
          frequenza_prevista: evento.frequenza,
          attività_previste: evento.tipo_attività,
          elementi_interessati: evento.id_main10ance,
          data_inserimento: evento.data_ins,
        },
        backgroundColor: evento.da_integrare ? '#bbb' : '#a8c956',
        borderColor: '#c74646',
        texcColor: '#fff'
      }));
      return nuoviEventiProg;
    }

    return {
      store,
      fullCalendarPlanner,
      calendarOptions,
      popolaCalendario,
    }
  }
}
</script>

<style scoped>
#refreshSchede {
  cursor: pointer;
  margin-right: 5px;
}
</style>

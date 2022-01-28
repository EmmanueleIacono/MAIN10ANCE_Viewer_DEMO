<template>
<div v-if="store.getters.getUsrVwList().includes('apriTabSchede')">
  <MainPanel :colonna="'col-sm-7'">
    <br />
    <br />
    <Pianificazione />
    <h4 id="tabella-titolo">
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
import {inject, reactive, ref/*, onActivated*/} from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import DayGridPlugin from '@fullcalendar/daygrid';
import itLocale from '@fullcalendar/core/locales/it';
import MainPanel from './elementi/MainPanel.vue';
import Explorer from './elementi/Explorer.vue';
import Filtri from './TabPlannerFiltri.vue';
import Pianificazione from './TabPlannerPianificazione.vue';

export default {
  name: 'TabPlanner',
  components: {
    MainPanel,
    Explorer,
    FullCalendar,
    Filtri,
    Pianificazione,
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
      dayMaxEvents: true,
      eventMouseEnter: (info) => {
        info.el.style.cursor = 'pointer';
        info.el.title = info.event.title;
      },
      eventClick: (info) => {
        console.log(info);
      },
    });

    // onActivated(() => {
    //   console.log('planner');
    //   const calendarAPI_P = fullCalendarPlanner.value.getApi();
    //   setTimeout(() => {
    //     calendarAPI_P.updateSize();
    //     console.log(calendarAPI_P);
    //   }, 100);
    // });

    return {
      store,
      fullCalendarPlanner,
      calendarOptions,
    }
  }
}
</script>

<style scoped>
#tabella-titolo {
  padding: 15px 0 10px;
}
#refreshSchede {
  cursor: pointer;
  margin-right: 5px;
}
</style>

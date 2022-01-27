<template>
<div v-if="store.getters.getUsrVwList().includes('apriTabDashboard')">
  <MainPanel :colonna="'col-sm-7'">Dashboard</MainPanel>
  <Explorer :colonna="'col-sm-5'">
    <FullCalendar ref="fullCalendarDashboard" :options="calendarOptions" />
    <br />
    <Pianificazione />
  </Explorer>
</div>
</template>

<script>
import {reactive, inject, ref/*, onActivated*/} from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import DayGridPlugin from '@fullcalendar/daygrid';
import itLocale from '@fullcalendar/core/locales/it';
import MainPanel from './elementi/MainPanel.vue';
import Explorer from './elementi/Explorer.vue';
import Pianificazione from './TabDashboardPianificazione.vue';

export default {
  name: 'TabDashboard',
  components: {
    MainPanel,
    Explorer,
    FullCalendar,
    Pianificazione,
  },
  setup() {
    const store = inject('store');
    const fullCalendarDashboard = ref(null);
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
    //   console.log('dashboard');
    //   const calendarAPI_D = fullCalendarDashboard.value.getApi();
    //   setTimeout(() => {
    //     calendarAPI_D.updateSize();
    //     console.log(calendarAPI_D);
    //   }, 100);
    // });

    return {
      store,
      fullCalendarDashboard,
      calendarOptions,
    }
  }
}
</script>

<style scoped>
</style>

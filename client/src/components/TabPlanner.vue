<template>
<div>
  <MainPanel :colonna="'col-sm-7'">
    <h4 id="tabella-titolo">
      <span id="refreshSchede" class="glyphicon glyphicon-refresh"></span>
      <b>SCHEDE</b>
    </h4>
    <div id="contenitore-schede">
      QUI SCHEDE
    </div>
  </MainPanel>
  <Explorer :colonna="'col-sm-5'">
    <FullCalendar :options="calendarOptions" />
  </Explorer>
</div>
</template>

<script>
// import '@fullcalendar/core/vdom'
import {reactive} from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import DayGridPlugin from '@fullcalendar/daygrid';
import TimeGridPlugin from '@fullcalendar/timegrid';
import itLocale from '@fullcalendar/core/locales/it';
import MainPanel from './elementi/MainPanel.vue';
import Explorer from './elementi/Explorer.vue';

export default {
  name: 'TabPlanner',
  components: {
    MainPanel,
    Explorer,
    FullCalendar,
  },
  setup() {
    const calendarOptions = reactive({
      plugins: [DayGridPlugin, TimeGridPlugin],
      initialView: 'dayGridMonth',
      timeZone: 'local',
      locale: itLocale,
      headerToolbar: {
        left: 'dayGridMonth,timeGridWeek', //eventualmente si potrebbe usare dayGridWeek al posto di timeGridWeek
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

    return {
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

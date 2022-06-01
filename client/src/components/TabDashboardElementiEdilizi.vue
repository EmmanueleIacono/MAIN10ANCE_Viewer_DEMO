<template>
<Card>
  <h3 class="title-2">Elementi edilizi</h3>
  <PieChart :chartData="data" :options="options" class="mxh" />
  <div class="fit-cerchi sp-ev">
    <Speedometer :percentuale="25" :descrizione="'Nessun sintomo'" :colore="'green'" />
    <Speedometer :percentuale="15" :descrizione="'Sintomi lievi'" :colore="'yellow'" />
    <Speedometer :percentuale="20" :descrizione="'Sintomi moderati'" :colore="'orange'" />
  </div>
  <div class="fit-cerchi sp-ev">
    <Speedometer :percentuale="5" :descrizione="'Sintomi gravi'" :colore="'red'" />
    <Speedometer :percentuale="35" :descrizione="'Nessuno dato'" :colore="'grey'" />
  </div>
</Card>
</template>

<script>
import {Chart, PieController, Legend} from 'chart.js';
import {PieChart} from 'vue-chart-3';
import {onMounted, reactive, computed} from 'vue';
import {getDatiElementiEdiliziDashboard} from '../js/richieste';
import {generaColoreRandom} from '../js/shared';
import Card from './elementi/Card.vue';
import Speedometer from './elementi/Speedometer.vue';

Chart.register(PieController, Legend);

export default {
  name: 'TabDashboardElementiEdilizi',
  components: {
    Card,
    PieChart,
    Speedometer,
  },
  setup() {
    const state = reactive({
      dataBIM: [],
      labelsBIM: [],
    });

    const data = computed(() => ({
      datasets: [{
        data: state.dataBIM,
        backgroundColor: state.dataBIM.map(() => generaColoreRandom()),
      }],
      labels: state.labelsBIM,
    }));

    const options = {
      plugins: {
        legend: {display: true, position: 'left'},
      },
      responsive: true
    }

    onMounted(async () => {
      [state.dataBIM, state.labelsBIM] = await getDatiElementiEdiliziDashboard();
    });

    return {
      data,
      options,
    }
  }
}
</script>

<style scoped>
.fit-cerchi {
  display: flex;
  flex-direction: row;
}
.sp-ev {
  justify-content: space-evenly;
}
.title-2 {
  font-weight: 400;
  font-size: 24px;
  line-height: 1;
  margin-bottom: 30px;
}
.mxh {max-height: 400px;}
</style>

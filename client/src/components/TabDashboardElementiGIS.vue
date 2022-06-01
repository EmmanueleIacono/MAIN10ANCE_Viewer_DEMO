<template>
<Card>
  <h3 class="title-2">Elementi GIS</h3>
  <PieChart :chartData="data" :options="options" class="mxh" />
</Card>
</template>

<script>
import {Chart, PieController, Legend} from 'chart.js';
import {PieChart} from 'vue-chart-3';
import {onMounted, reactive, computed} from 'vue';
import {getDatiElementiGISDashboard} from '../js/richieste';
import {generaColoreRandom} from '../js/shared';
import Card from './elementi/Card.vue';

Chart.register(PieController, Legend);

export default {
  name: 'TabDashboardElementiGIS',
  components: {
    Card,
    PieChart,
  },
  setup() {
    const state = reactive({
      dataGIS: [],
      labelsGIS: [],
      colori: []
    });

    const data = computed(() => ({
      datasets: [{
        data: state.dataGIS,
        backgroundColor: state.dataGIS.map(() => generaColoreRandom()),
      }],
      labels: state.labelsGIS,
    }));

    const options = {
      plugins: {
        legend: {
          display: true,
          position: 'left'
          },
        },
      responsive: true
    }

    onMounted(async () => {
      [state.dataGIS, state.labelsGIS] = await getDatiElementiGISDashboard();
    });

    return {
      data,
      options,
    }
  }
}
</script>

<style scoped>
.title-2 {
  font-weight: 400;
  font-size: 24px;
  line-height: 1;
  margin-bottom: 30px;
}
.mxh {max-height: 400px;}
</style>

<template>
<Card>
  <BarChart :chartData="data" :options="options" />
</Card>
</template>

<script>
import {Chart, BarController, BarElement, Legend} from 'chart.js';
import {BarChart} from 'vue-chart-3';
import Card from './elementi/Card.vue';

Chart.register(BarController, BarElement, Legend);

export default {
  name: 'TabDashboardElementiEdilizi',
  components: {
    Card,
    BarChart,
  },
  setup() {
    const [dataBIM, tableBIM] = [[], []];
    const colorBIM = '#fff';

    const data = {
      datasets: [{
        data: dataBIM,
        backgroundColor: colorBIM,
      }],
      labels: tableBIM,
    }

    const options = {
      plugins: {
        legend: {display: true, position: 'left'},
      },
      responsive: true
    }

    return {
      data,
      options,
    }
  }
}
</script>

<style scoped>
</style>

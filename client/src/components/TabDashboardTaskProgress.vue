<template>
<Card>
  <div>
    <div class="col-sm-10 col-lg-11">
      <h3 class="title-2">Progresso attività</h3>
    </div>
    <div class="col-sm-2 col-lg-1">
      <select name="anni" id="anni">
        <option value="anno">2022</option>
        <option value="anno">2021</option>
        <option value="anno">2020</option>
        <option value="anno">2019</option>
        <option value="anno">2018</option>
      </select>
    </div>
    <!-- <div class="col-sm-12 col-lg-8"> -->
    <div class="col-sm-12 col-lg-12">
      <div class="recent-report">
        <div>
          <div class="recent-report__chart">
            <BarChart :chartData="testData" :options="options" />
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="col-sm-12 col-lg-4"> -->
      <!-- <div class="task-progress">
        <div class="au-skill-container">
          <div class="au-progress">
            <span class="au-progress__title">Controllo</span>
            <div class="au-progress__bar">
              <div class="au-progress__inner js-progressbar-simple" role="progressbar" data-transitiongoal="90">
                <span class="au-progress__value js-value"></span>
              </div>
            </div>
          </div>
          <div class="au-progress">
            <span class="au-progress__title">Manutenzione ordinaria</span>
            <div class="au-progress__bar">
              <div class="au-progress__inner js-progressbar-simple" role="progressbar" data-transitiongoal="65">
                <span class="au-progress__value js-value"></span>
              </div>
            </div>
          </div>
          <div class="au-progress">
            <span class="au-progress__title">Manutenzione correttiva</span>
            <div class="au-progress__bar">
              <div class="au-progress__inner js-progressbar-simple" role="progressbar" data-transitiongoal="85">
                <span class="au-progress__value js-value"></span>
              </div>
            </div>
          </div>
          <div class="au-progress">
            <span class="au-progress__title">Restauro</span>
            <div class="au-progress__bar">
              <div class="au-progress__inner js-progressbar-simple" role="progressbar" data-transitiongoal="95">
                <span class="au-progress__value js-value"></span>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    <!-- </div> -->
  </div>
</Card>
</template>

<script>
import {Chart, BarController, LineController, PointElement, LineElement, BarElement, Legend} from 'chart.js';
import {BarChart} from 'vue-chart-3';
import Card from './elementi/Card.vue';

Chart.register(BarController, LineController, PointElement, LineElement, BarElement, Legend);

export default {
  name: 'TabDashboardTaskProgress',
  components: {
    Card,
    BarChart,
  },
  setup() {
    const controllo = '#a8c956';
    const intervento = '#1a4f9c';

    const data1 = [52, 60, 55, 50, 65, 80, 57, 70, 105, 115, 100, 0];
    const data2 = [102, 70, 80, 100, 56, 53, 80, 75, 65, 90];
    const data3 = [13, 27, 15, 42, 23, 25, 10, 12, 13, 25, 17, 0];

    const testData = {
      type: 'bar',
      labels: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio ', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
      datasets: [
        {
          label: 'attività',
          type: 'line',
          borderColor: 'orange',
          backgroundColor: 'orange',
          pointBorderColor: 'orange',
          borderRadius: 5,
          borderWidth: 2,
          data: data3
        },
        {
          label: 'Costo previsto (€)',
          type: 'bar',
          backgroundColor: controllo,
          borderRadius: 5,
          data: data1
        },
        {
          label: 'Costo effettivo (€)',
          type: 'bar',
          backgroundColor: intervento,
          borderRadius: 5,
          data: data2
        },
      ]
    }

    const options = {
      maintainAspectRation: true,
      plugins: {
        legend: {display: true, position: 'top',
          font: {size: 12, family: 'Poppins'}},
        // responsive: true,
        scales: [{
          x: {display: true, color: 'grey'},
          y: {display: true, color: 'grey'}
        }],
      },
      elements: {
        point: {radius: 5, hitRadius: 10, hoverRadius: 15, hoverBorderWidth: 3},
        line: {backgroundColor: 'grey', borderWidth: 10}
        },
      animations: {
        animation: true,
        // tension: {duration: 1000, easing: 'linear', from: 1, to: 0, loop: true}
      }
    }

    return {
      testData,
      options,
    }
  }
}
</script>

<style scoped>
.title-2 {
  /* text-transform: capitalize; */
  font-weight: 400;
  font-size: 24px;
  line-height: 1;
  margin-bottom: 30px;
}
.recent-report {
  padding-bottom: 20px;
  margin-bottom: 20px;
}
.recent-report__chart canvas {
  height: 80%;
  width: 100%;
}
</style>

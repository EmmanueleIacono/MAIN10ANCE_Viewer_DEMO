<template>
<div>
  <div>
    <div class="col-sm-12 col-lg-12 no-pdg">
      <Card>
        <div>
          <h3 class="title-2 m-b-40">Controllo</h3>
          <BarChart :chartData="testBarData1" :options="optionsBar" />
        </div>
      </Card>
    </div>
    <div class="col-sm-12 col-lg-6 no-pdg">
      <Card class="mr">
        <div>
          <h3 class="title-2 m-b-40">Controllo</h3>
          <PolarAreaChart :chartData="testPolarData1" :options="optionsPolar" />
        </div>
      </Card>
    </div>
    <div class="col-sm-12 col-lg-6 no-pdg">
      <Card class="ml">
        <div>
          <h3 class="title-2 m-b-40">Controllo</h3>
          <RadarChart :chartData="testRadarData1" :options="optionsRadar" />
        </div>
      </Card>
    </div>
  </div>
  <div>
    <div class="col-sm-12 col-lg-12 no-pdg">
      <Card>
        <div>
          <h3 class="title-2 m-b-40">Intervento</h3>
          <BarChart :chartData="testBarData2" :options="optionsBar" />
        </div>
      </Card>
    </div>
    <div class="col-sm-12 col-lg-6 no-pdg">
      <Card class="mr">
        <div>
          <h3 class="title-2 m-b-40">Intervento</h3>
          <PolarAreaChart :chartData="testPolarData2" :options="optionsPolar" />
        </div>
      </Card>
    </div>
    <div class="col-sm-12 col-lg-6 no-pdg">
      <Card class="ml">
        <div>
          <h3 class="title-2 m-b-40">Intervento</h3>
          <RadarChart :chartData="testRadarData2" :options="optionsRadar" />
        </div>
      </Card>
    </div>
  </div>
</div>
</template>

<script>
import {Chart, BarController, LineController, PolarAreaController, RadarController, BarElement, LineElement, RadialLinearScale, Filler, Legend} from 'chart.js';
import {BarChart, PolarAreaChart, RadarChart} from 'vue-chart-3';
import Card from './elementi/Card.vue';

Chart.register(BarController, LineController, PolarAreaController, RadarController, BarElement, LineElement, RadialLinearScale, Filler, Legend);

export default {
  name: 'TabDashboardGraficiDettaglio',
  components: {
    Card,
    BarChart,
    PolarAreaChart,
    RadarChart,
  },
  setup() {
    const verdeMain10ance = '#a8c956';
    const verdeMain10anceTrasparenza = '#a8c95660';
    const verdeMain10anceTrasparenza2 = '#a8c95630';
    const verdeMain10anceTrasparenza3 = '#a8c95615';
    const bluInterreg = '#1a4f9c';
    const bluInterregTrasparenza = '#1a4f9c60';
    const bluInterregTrasparenza2 = '#1a4f9c30';
    const bluInterregTrasparenza3 = '#1a4f9c15';
    const dataBar1 = [65, 59, 80, 81, 56, 55, 40, 14, 66, 44, 43, 23];
    const dataBar2 = [28, 48, 40, 19, 86, 27, 90, 34, 56, 24, 25, 3];
    const dataBar3 = [23, 38, 43, 13, 56, 37, 10, 32, 12, 24, 23, 13];
    const dataBar4 = [8, 8, 10, 9, 16, 27, 0, 4, 6, 24, 2, 3];

    const testBarData1 = {
      labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
      datasets: [
        {
          label: "Degrado1",
          data: dataBar1,
          borderColor: verdeMain10ance,
          borderWidth: 1,
          backgroundColor: verdeMain10anceTrasparenza3,
          fontFamily: "Poppins"
        },
        {
          label: "Degrado2",
          data: dataBar2,
          borderColor: verdeMain10ance,
          borderWidth: 1,
          backgroundColor: verdeMain10anceTrasparenza2,
          fontFamily: "Poppins"
        },
        {
          label: "Degrado3",
          data: dataBar3,
          borderColor: verdeMain10ance,
          borderWidth: 1,
          backgroundColor: verdeMain10anceTrasparenza,
          fontFamily: "Poppins"
        },
        {
          label: "Attività",
          type: 'line',
          data: dataBar4,
          borderColor: verdeMain10ance,
          backgroundColor: verdeMain10ance,
          borderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 10,
          pointBackgroundColor: verdeMain10ance,
          pointHoverBackgroundColor: verdeMain10ance,
          fontFamily: "Poppins"
        }
      ]
    }

    const testBarData2 = {
      labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
      datasets: [
        {
          label: "Degrado1",
          data: dataBar1,
          borderColor: bluInterreg,
          borderWidth: 1,
          backgroundColor: bluInterregTrasparenza3,
          fontFamily: "Poppins"
        },
        {
          label: "Degrado2",
          data: dataBar2,
          borderColor: bluInterreg,
          borderWidth: 1,
          backgroundColor: bluInterregTrasparenza2,
          fontFamily: "Poppins"
        },
        {
          label: "Degrado3",
          data: dataBar3,
          borderColor: bluInterreg,
          borderWidth: 1,
          backgroundColor: bluInterregTrasparenza,
          fontFamily: "Poppins"
        },
        {
          label: "Attività",
          type: 'line',
          data: dataBar4,
          borderColor: bluInterreg,
          backgroundColor: bluInterreg,
          borderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 10,
          pointBackgroundColor: bluInterreg,
          pointHoverBackgroundColor: bluInterreg,
          fontFamily: "Poppins"
        }
      ]
    }

    const testPolarData1 = {
      datasets: [{
        data: [15, 18, 6],
        backgroundColor: [verdeMain10anceTrasparenza3, verdeMain10anceTrasparenza2, verdeMain10anceTrasparenza],
        borderColor: verdeMain10ance,
        borderWidth: 1
      }],
      labels: ["Attività1", "Attività2", "Attività3"]
    }

    const testPolarData2 = {
      datasets: [{
        data: [15, 18, 9],
        backgroundColor: [bluInterregTrasparenza3, bluInterregTrasparenza2, bluInterregTrasparenza],
        borderColor: bluInterreg,
        borderWidth: 1
      }],
      labels: ["Attività1", "Attività2", "Attività3"]
    }

    const testRadarData1 = {
      labels: ["Degrado1", "Degrado2", "Degrado3","Degrado4", "Degrado5", "Degrado6", "Degrado7"],
      defaultFontFamily: 'Poppins',
      datasets: [
        {
          label: "Muri",
          data: [65, 59, 66, 45, 56, 55, 40],
          fill: true,
          borderColor: verdeMain10ance,
          borderWidth: 1,
          backgroundColor: verdeMain10anceTrasparenza3,
          pointHighlightStroke: verdeMain10ance,
          pointBackgroundColor: verdeMain10ance
        },
        {
          label: "Tetti",
          data: [28, 12, 40, 19, 63, 27, 87],
          fill: true,
          borderColor: verdeMain10ance,
          borderWidth: 1,
          backgroundColor: verdeMain10anceTrasparenza3,
          pointHighlightStroke: verdeMain10ance,
          pointBackgroundColor: verdeMain10ance
        },
        {
          label: "Pavimenti",
          data: [20, 58, 55, 15, 86, 25, 10],
          fill: true,
          borderColor: verdeMain10ance,
          borderWidth: 1,
          backgroundColor: verdeMain10anceTrasparenza3,
          pointHighlightStroke: verdeMain10ance,
          pointBackgroundColor: verdeMain10ance
        },
        {
          label: "Colonne",
          data: [2, 13, 30, 9, 13, 17, 37],
          fill: true,
          borderColor: verdeMain10ance,
          borderWidth: 1,
          backgroundColor: verdeMain10anceTrasparenza3,
          pointHighlightStroke: verdeMain10ance,
          pointBackgroundColor: verdeMain10ance
        }
      ]
    }

    const testRadarData2 = {
      labels: ["Degrado1", "Degrado2", "Degrado3","Degrado4", "Degrado5", "Degrado6", "Degrado7"],
      defaultFontFamily: 'Poppins',
      datasets: [
        {
          label: "Muri",
          data: [65, 59, 66, 45, 56, 55, 40],
          fill: true,
          borderColor: bluInterreg,
          borderWidth: 1,
          backgroundColor: bluInterregTrasparenza3,
          pointHighlightStroke: bluInterreg,
          pointBackgroundColor: bluInterreg
        },
        {
          label: "Tetti",
          data: [28, 12, 40, 19, 63, 27, 87],
          fill: true,
          borderColor: bluInterreg,
          borderWidth: 1,
          backgroundColor: bluInterregTrasparenza3,
          pointHighlightStroke: bluInterreg,
          pointBackgroundColor: bluInterreg
        },
        {
          label: "Pavimenti",
          data: [20, 58, 55, 15, 86, 25, 10],
          fill: true,
          borderColor: bluInterreg,
          borderWidth: 1,
          backgroundColor: bluInterregTrasparenza3,
          pointHighlightStroke: bluInterreg,
          pointBackgroundColor: bluInterreg
        },
        {
          label: "Colonne",
          data: [2, 13, 30, 9, 13, 17, 37],
          fill: true,
          borderColor: bluInterreg,
          borderWidth: 1,
          backgroundColor: bluInterregTrasparenza3,
          pointHighlightStroke: bluInterreg,
          pointBackgroundColor: bluInterreg
        }
      ]
    }

    const optionsBar = {
      legend: {
        position: 'top',
        labels: {
          fontFamily: 'Poppins'
        }
      },
      scales: {
        x: {
          stacked: false,
        },
        y: {
          stacked: false
        }
      }
    }

    const optionsPolar = {
      plugins: {
        legend: {
          position: 'top',
          labels: {
            fontFamily: 'Poppins'
          }
        }
      },
      responsive: true
    }

    const optionsRadar = {
      legend: {
        position: 'top',
        labels: {
          fontFamily: 'Poppins'
        }
      },
      scale: {
        ticks: {
          beginAtZero: true,
          fontFamily: "Poppins"
        }
      }
    }

    return {
      testBarData1,
      testBarData2,
      testPolarData1,
      testPolarData2,
      testRadarData1,
      testRadarData2,
      optionsBar,
      optionsPolar,
      optionsRadar,
    }
  }
}
</script>

<style scoped>
h3 {
  font-size: 24px;
  color: #333333;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}
.no-pdg {
  padding-left: 0;
  padding-right: 0;
}
.title-2 {
  font-weight: 400;
  font-size: 24px;
  line-height: 1;
  margin-bottom: 30px;
}
.m-b-40 {margin-bottom: 40px;}
.ml {margin-left: 10px;}
.mr {margin-right: 10px;}
</style>

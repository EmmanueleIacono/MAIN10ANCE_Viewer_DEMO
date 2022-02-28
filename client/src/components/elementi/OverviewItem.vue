<template>
<div class="col-sm-6 col-lg-3">
  <div :class="gradiente" class="overview-item">
    <div class="overview-box clearfix">
      <div class="m-b-20">
        <div class="icon"><i :class="icona" class="zmdi"></i></div>
        <div class="text"><h2>{{numContenuto}}</h2><span>{{infoContenuto}}</span></div>
      </div>
      <div class="m-b-20">
        <div class="overview-chart">
          <div class="canvas">
            <DoughnutChart :chartData="testData" :options="options" />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { Chart, DoughnutController, ArcElement, Tooltip, CategoryScale, LinearScale } from 'chart.js';
import {DoughnutChart} from 'vue-chart-3';

Chart.register(DoughnutController, ArcElement, Tooltip, CategoryScale, LinearScale);

export default {
  name: 'OverviewItem',
  components: {
    DoughnutChart,
  },
  props: {
    infoContenuto: String,
    numContenuto: Number,
    gradiente: String,
    icona: {
      type: String,
      default: 'zmdi-info',
    }
  },
  setup() {
    const testData = {
      labels: ['Data_A', 'Data_B', 'Data_C', 'Data_D', 'Data_E'],
      datasets: [
        {
          data: [30, 40, 60, 70, 5],
          borderColor: "white",
          borderWidth: "2",
          backgroundColor: "rgba(255,255,255,.3)",
          hoverBackgroundColor: 'white',
        },
      ],
    };
    const options = {
      cutout: '70%',
      // maintainAspectRatio: false,
      plugins: {
        legend: {display: false}
      },
      scales: {
        x: {display: false, beginAtZero: true},
        y: {display: false, beginAtZero: true}
      },
      // animation: false
    }

    return {
      testData,
      options,
    }
  }
}
</script>

<style scoped>
.text {
  position: absolute;
}

h1, h2, h3, h4, h5, h6 {
  color: #333333;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}
h1 {font-size: 36px;}
h2 {font-size: 30px;}
h3 {font-size: 24px;}
h4 {font-size: 18px;}
h5 {font-size: 15px;}
h6 {font-size: 13px;}

.overview-item {
  border-radius: 10px;
  padding: 30px;
  padding-bottom: 0;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

@media (min-width: 992px) and (max-width: 1519px) {
  .overview-item {
    padding-left: 15px;
    padding-right: 15px;
  }
}

.overview-item--c1 {
  background-image: linear-gradient(0deg, #3f5efb 0%, #fc466b 100%);
}

.overview-item--c2 {
  background-image: linear-gradient(0deg, #11998e 0%, #38ef7d 100%);
}

.overview-item--c3 {
  background-image: linear-gradient(0deg, #ee0979 0%, #ff6a00 100%);
}

.overview-item--c4 {
  background-image: linear-gradient(0deg, #45b649 0%, #dce35b 100%);
}

.overview-box .icon {
  display: inline-block;
  vertical-align: top;
  margin-right: 15px;
}

.overview-box .icon i {
  /* font-size: 60px; */
  font-size: 50px;
  color: #fff;
}

@media (min-width: 992px) and (max-width: 1199px) {
  .overview-box .icon {
    margin-right: 3px;
  }

  .overview-box .icon i {
    font-size: 30px;
  }
}

@media (max-width: 991px) {
  .overview-box .icon {
    font-size: 46px;
  }
}

.overview-box .text {
  font-weight: 300;
  display: inline-block;
}

.overview-box .text h2 {
  font-weight: 300;
  color: #fff;
  /* font-size: 36px; */
  line-height: 1;
}

.overview-box .text span {
  font-size: 18px;
  color: rgb(255, 255, 255);
}

@media (min-width: 992px) and (max-width: 1199px) {
  .overview-box .text {
    display: inline-block;
  }

  .overview-box .text h2 {
    font-size: 20px;
    margin-bottom: 0;
  }

  .overview-box .text span {
    font-size: 14px;
  }
}

@media (max-width: 991px) {
  .overview-box .text h2 {
    font-size: 26px;
  }

  .overview-box .text span {
    font-size: 15px;
  }
}

.overview-chart {
  /* height: 115px; */
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overview-chart .canvas {
  /* max-width: 90%;
  max-height: 90%;
  min-width: 90%;
  min-height: 90%; */
  width: 90%;
  height: 90%;
}

.m-b-20 {margin-bottom: 20px;}
.m-b-30 {margin-bottom: 30px;}
.m-b-40 {margin-bottom: 40px;}
</style>
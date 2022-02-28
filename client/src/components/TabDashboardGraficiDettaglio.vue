<template>
<div>
  <div id="Controllo">
    <div class="col-sm-12 col-lg-12 no-pdg">
      <Card>
        <div class="au-card-inner"><h3 class="h3-db title-2 m-b-40">Controllo</h3><canvas id="barChart1"></canvas></div>
      </Card>
    </div>
    <div class="col-sm-12 col-lg-6 no-pdg">
      <Card>
        <div class="au-card-inner"><h3 class="h3-db title-2 m-b-40">Controllo</h3><canvas id="polarChart1"></canvas></div>
      </Card>
    </div>
    <div class="col-sm-12 col-lg-6 no-pdg">
      <Card>
        <div class="au-card-inner"><h3 class="h3-db title-2 m-b-40">Controllo</h3><canvas id="radarChart1"></canvas></div>
      </Card>
    </div>
  </div>
  <div id="Intervento">
    <div class="col-sm-12 col-lg-12 no-pdg">
      <Card>
        <div class="au-card-inner"><h3 class="h3-db title-2 m-b-40">Intervento</h3><canvas id="barChart2"></canvas></div>
      </Card>
    </div>
    <div class="col-sm-12 col-lg-6 no-pdg">
      <Card>
        <div class="au-card-inner"><h3 class="h3-db title-2 m-b-40">Intervento</h3><canvas id="polarChart2"></canvas></div>
      </Card>
    </div>
    <div class="col-sm-12 col-lg-6 no-pdg">
      <Card>
        <div class="au-card-inner"><h3 class="h3-db title-2 m-b-40">Intervento</h3><canvas id="radarChart2"></canvas></div>
      </Card>
    </div>
  </div>
</div>
</template>

<script>
import Card from './elementi/Card.vue';

export default {
  name: 'TabDashboardGraficiDettaglio',
  components: {
    Card,
  },
}
</script>

<style scoped>
.no-pdg {
  padding-left: 0;
  padding-right: 0;
}
</style>

<template>
<div class="row" id="Overview">
  <OverviewItem :numContenuto="13" :infoContenuto="'utenti'" :icona="'zmdi-account-o'" :gradiente="'overview-item--c1'"></OverviewItem>
  <OverviewItem :numContenuto="8" :infoContenuto="'modelli'" :icona="'zmdi-home'" :gradiente="'overview-item--c2'"></OverviewItem>
  <OverviewItem :numContenuto="543" :infoContenuto="'oggetti'" :icona="'zmdi-info'" :gradiente="'overview-item--c3'"></OverviewItem>
  <OverviewItem :numContenuto="67" :infoContenuto="'attività'" :icona="'zmdi-calendar-note'" :gradiente="'overview-item--c4'"></OverviewItem>
</div>
</template>

<script>
import OverviewItem from './elementi/OverviewItem.vue';

export default {
  name: 'TabDashboardOverview',
  components: {
    OverviewItem,
  }
}
</script>

<style scoped>
</style>

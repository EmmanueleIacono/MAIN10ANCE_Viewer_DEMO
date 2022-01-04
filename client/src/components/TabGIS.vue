<template>
<div id="sono-il-parent">
    <MainPanel :colonna="'col-sm-9'">Mappa GIS</MainPanel>
    <Explorer :colonna="'col-sm-3'">Explorer GIS</Explorer>
</div>
</template>

<script>
import MainPanel from './elementi/MainPanel.vue';
import Explorer from './elementi/Explorer.vue';

export default {
    name: 'TabGIS',
    components: {
        MainPanel,
        Explorer,
    }
}
</script>

<style scoped>
</style>

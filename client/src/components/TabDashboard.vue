<template>
<div>
    <MainPanel :colonna="'col-sm-7'">Dashboard</MainPanel>
    <Explorer :colonna="'col-sm-5'">Explorer Dashboard</Explorer>
</div>
</template>

<script>
import MainPanel from './elementi/MainPanel.vue';
import Explorer from './elementi/Explorer.vue';

export default {
    name: 'TabDashboard',
    components: {
        MainPanel,
        Explorer,
    }
}
</script>

<style scoped>
</style>

<template>
<div>
    <MainPanel :colonna="'col-sm-7'">Planner</MainPanel>
    <Explorer :colonna="'col-sm-5'">Explorer Planner</Explorer>
</div>
</template>

<script>
import MainPanel from './elementi/MainPanel.vue';
import Explorer from './elementi/Explorer.vue';

export default {
    name: 'TabPlanner',
    components: {
        MainPanel,
        Explorer,
    }
}
</script>

<style scoped>
</style>

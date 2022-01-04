<template>
<div>
    <MainPanel :colonna="`col-sm-${store.getters.getBimVwSets()[0]}`">BIM Viewer</MainPanel>
    <Explorer :colonna="`col-sm-${store.getters.getBimVwSets()[1]}`">Explorer BIM</Explorer>
</div>
</template>

<script>
import {inject} from 'vue';
import MainPanel from './elementi/MainPanel.vue';
import Explorer from './elementi/Explorer.vue';

export default {
    name: 'TabBIM',
    components: {
        MainPanel,
        Explorer,
    },
    setup() {
        const store = inject('store');

        return {
            store,
        }
    }
}
</script>

<style scoped>
</style>

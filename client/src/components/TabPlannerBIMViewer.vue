<template>
  <div :class="selectLocalità ? 'contenitore-50' : 'contenitore-0'">
    <div>
      <label for="località" class="colonna">Località:</label>
      <select v-model="selectLocalità" id="località" class="colonna">
        <option value=""></option>
        <option v-for="loc in store.statePlanner.listaSigleLoc" :key="loc.sigla" :value="loc.sigla">{{loc.nome}}</option>
      </select>
      <!-- <button @click="apriModello">Apri un modello di prova</button> -->
    </div>
    <div id="forgeViewerPlanner"></div>
  </div>
</template>

<script>
import {inject, reactive, toRefs, watch} from 'vue';
import {getModel} from '../js/BIM_Planner';
import {prendiUrnLocalità} from '../js/richieste';

export default {
  name: 'TabPlannerBIMViewer',
  setup() {
    const store = inject('store');
    const state = reactive({
      selectLocalità: '',
    });

    watch(() => state.selectLocalità, async newVal => {
      if (newVal) {
        const urn = await prendiUrnLocalità({loc: newVal});
        getModel(urn.urn);
      }
      else {
        store.statePlanner.urnModelloCorrente = null;
      }
    });

    // function apriModello() {
    //   const urn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c2Fjcm8tbW9udGUtdmFyYWxsby9TTSUyMFZhcmFsbG8ucnZ0';
    //   getModel(urn);
    //   console.log('apri modello');
    // }

    return {
      store,
      ...toRefs(state),
      // apriModello,
    }
  }
}
</script>

<style scoped>
select {
  margin-left: 1rem;
}
.contenitore-50 {
  height: 50%;
}
.contenitore-0 {
  height: 0;
}
#forgeViewerPlanner {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>

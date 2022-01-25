<template>
  <div v-if="store.stateBIM.schedeRisultatiVisibile" id="formDB">
    <Details summary="Scheda anagrafica">
      <div v-for="(scheda, ind) in schedeAnagrafica" :key="ind">{{scheda.title}}</div>
    </Details>
    <Details summary="Schede di controllo">
      <div v-for="(scheda, ind) in schedeControllo" :key="ind">{{scheda.title}}</div>
    </Details>
    <Details summary="Schede di manutenzione ordinaria">
      <div v-for="(scheda, ind) in schedeManOrd" :key="ind">{{scheda.title}}</div>
    </Details>
    <Details summary="Schede di manutenzione correttiva">
      <div v-for="(scheda, ind) in schedeManCorr" :key="ind">{{scheda.title}}</div>
    </Details>
    <Details summary="Schede di manutenzione straordinaria">
      <div v-for="(scheda, ind) in schedeManStr" :key="ind">{{scheda.title}}</div>
    </Details>
    <Details summary="Schede di restauro">
      <div v-for="(scheda, ind) in schedeRestauro" :key="ind">{{scheda.title}}</div>
    </Details>
  </div>
</template>

<script>
import { inject, reactive, toRefs, onUpdated } from 'vue';
// import {prendiSchedeAnagrafica, prendiSchedeControllo, prendiSchedeManReg, prendiSchedeManCorr, prendiSchedeRestauro} from '../js/richieste';
import Details from './elementi/Details.vue';

export default {
  name: 'SchedeDB',
  components: {
    Details,
  },
  setup() {
    const store = inject('store');
    const state = reactive({
      schedeAnagrafica: null,
      schedeControllo: null,
      schedeManOrd: null,
      schedeManCorr: null,
      schedeManStr: null,
      schedeRestauro: null,
    });

    onUpdated(async () => {
      if (store.stateBIM.schedeRisultatiVisibile) {
        await popolaSchede();
      }
    });

    // watch(() => store.stateBIM.elementiSelezionati, async newVal => {
    //   console.log(newVal);
    //   console.log(store.stateBIM.schedeRisultatiVisibile);
    //   if (newVal && store.stateBIM.schedeRisultatiVisibile) {
    //     await popolaSchede();
    //   }
    // });

    async function popolaSchede() {
      const schedeJson = await fetch('https://jsonplaceholder.typicode.com/todos');
      const schedeFull = await schedeJson.json();
      state.schedeAnagrafica = schedeFull.splice(0, 10);
      state.schedeControllo = schedeFull.splice(10, 10);
      state.schedeManOrd = schedeFull.splice(20, 10);
      state.schedeManCorr = schedeFull.splice(30, 10);
      state.schedeManStr = schedeFull.splice(40, 10);
      state.schedeRestauro = schedeFull.splice(50, 10);
    }

    return {
      store,
      ...toRefs(state),
    }
  }
}
</script>

<style scoped>
#formDB {
  line-height: 150%;
}
</style>

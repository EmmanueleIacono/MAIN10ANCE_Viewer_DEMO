<template>
  <div v-if="store.stateBIM.schedeRisultatiVisibile" id="formDB">
    <img v-if="schedeNonPronte" id="loading-image" src="../assets/img/ajax-loader-3.gif" alt="Loading..." height="20" />
    <Details v-if="schedeAnagrafica && schedeAnagrafica.length" summary="Scheda anagrafica">
      <BIMScheda v-for="scheda in schedeAnagrafica" :key="scheda['Codice scheda anagrafica']" :scheda="scheda" tipo="anagrafica" />
    </Details>
    <Details v-if="schedeControllo && schedeControllo.length" summary="Schede di controllo">
      <BIMScheda v-for="scheda in schedeControllo" :key="scheda['Codice scheda controllo']" :scheda="scheda" tipo="controllo" />
    </Details>
    <Details v-if="schedeManOrd && schedeManOrd.length" summary="Schede di manutenzione ordinaria">
      <BIMScheda v-for="scheda in schedeManOrd" :key="scheda['Codice scheda manuetenzione regolare']" :scheda="scheda" tipo="intervento" />
    </Details>
    <Details v-if="schedeManCorr && schedeManCorr.length" summary="Schede di manutenzione correttiva">
      <BIMScheda v-for="scheda in schedeManCorr" :key="scheda['Codice scheda manutenzione correttiva']" :scheda="scheda" tipo="intervento" />
    </Details>
    <Details v-if="schedeManStr && schedeManStr.length" summary="Schede di manutenzione straordinaria">
      <BIMScheda v-for="scheda in schedeManStr" :key="scheda['Codice scheda manutenzione straordinaria']" :scheda="scheda" tipo="intervento" />
    </Details>
    <Details v-if="schedeRestauro && schedeRestauro.length" summary="Schede di restauro">
      <BIMScheda v-for="scheda in schedeRestauro" :key="scheda['Codice scheda restauro']" :scheda="scheda" tipo="intervento" />
    </Details>
  </div>
</template>

<script>
import { inject, reactive, toRefs, computed } from 'vue';
import {prendiSchedeAnagrafica, prendiSchedeControllo, prendiSchedeManReg, prendiSchedeManCorr, prendiSchedeManStr, prendiSchedeRestauro} from '../js/richieste';
import Details from './elementi/Details.vue';
import BIMScheda from './elementi/BIMScheda.vue';

export default {
  name: 'SchedeDB',
  components: {
    Details,
    BIMScheda,
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

    const schedeNonPronte = computed(() => {
      return !(state.schedeAnagrafica && state.schedeControllo && state.schedeManOrd && state.schedeManCorr && state.schedeManStr && state.schedeRestauro);
    });

    async function popolaSchede() {
      resetSchede();
      const schedeAnagrafica = await prendiSchedeAnagrafica();
      const schedeControllo = await prendiSchedeControllo();
      const schedeManOrd = await prendiSchedeManReg();
      const schedeManCorr = await prendiSchedeManCorr();
      const schedeManStr = await prendiSchedeManStr();
      const schedeRestauro = await prendiSchedeRestauro();
      const schedeAnFiltrate = schedeAnagrafica.filter(scheda => store.stateBIM.elementiSelezionati.includes(scheda['Elemento schedato']));
      const schedeConFiltrate = schedeControllo.filter(scheda => store.stateBIM.elementiSelezionati.includes(scheda['Elementi controllati']));
      const schedeManOrdFiltrate = schedeManOrd.filter(scheda => store.stateBIM.elementiSelezionati.includes(scheda['Elementi interessati']));
      const schedeManCorrFiltrate = schedeManCorr.filter(scheda => store.stateBIM.elementiSelezionati.includes(scheda['Elementi interessati']));
      const schedeManStrFiltrate = schedeManStr.filter(scheda => store.stateBIM.elementiSelezionati.includes(scheda['Elementi interessati']));
      const schedeRestFiltrate = schedeRestauro.filter(scheda => store.stateBIM.elementiSelezionati.includes(scheda['Elementi interessati']));
      state.schedeAnagrafica = schedeAnFiltrate;
      state.schedeControllo = schedeConFiltrate;
      state.schedeManOrd = schedeManOrdFiltrate;
      state.schedeManCorr = schedeManCorrFiltrate;
      state.schedeManStr = schedeManStrFiltrate;
      state.schedeRestauro = schedeRestFiltrate;
    }

    function resetSchede() {
      state.schedeAnagrafica = null;
      state.schedeControllo = null;
      state.schedeManOrd = null;
      state.schedeManCorr = null;
      state.schedeManStr = null;
      state.schedeRestauro = null;
    }

    return {
      store,
      ...toRefs(state),
      popolaSchede,
      schedeNonPronte,
    }
  }
}
</script>

<style scoped>
#formDB {
  line-height: 150%;
}
</style>

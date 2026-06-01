<template>
<div class="fill" id="tabLogin">
  <div id="messaggio-errore-container">
    <h4 v-if="state.messaggioDiErrore" id="messaggio-errore">{{state.messaggioDiErrore}}</h4>
  </div>
  <div id="contenitoreLoginSignup">
    <component :is="tabLoginAttivo" @cambioTab="cambiaTab" @authErr="cambiaMessaggioErrore" />
  </div>
</div>
</template>

<script setup>
import {reactive, shallowRef} from 'vue';
import PannelloLogin from './TabAuthPannelloLogin.vue';
import PannelloSignup from './TabAuthPannelloSignup.vue';

const state = reactive({
  messaggioDiErrore: '',
});

const authPanels = {
  PannelloLogin,
  PannelloSignup,
};

const tabLoginAttivo = shallowRef(authPanels.PannelloLogin);

function cambiaTab(nomeTab) {
  tabLoginAttivo.value = authPanels[nomeTab] || authPanels.PannelloLogin;
}

function cambiaMessaggioErrore(errMsg) {
  state.messaggioDiErrore = errMsg;
}
</script>

<style scoped>
#contenitoreLoginSignup {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

#messaggio-errore {
  display: flex;
  justify-content: center;
  color: red;
}
</style>

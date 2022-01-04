<template>
<div class="fill" id="tabLogin">
    <div id="messaggio-errore-container">
        <h4 v-if="messaggioDiErrore" id="messaggio-errore">{{messaggioDiErrore}}</h4>
    </div>
    <div id="contenitoreLoginSignup">
        <component :is="tabLoginAttivo" @cambioTab="cambiaTab" @authErr="cambiaMessaggioErrore" />
    </div>
</div>
</template>

<script>
import {reactive, toRefs, inject} from 'vue';
import PannelloLogin from './PannelloLogin.vue';
import PannelloSignup from './PannelloSignup.vue';

export default {
    name: 'TabAuth',
    components: {
        PannelloLogin,
        PannelloSignup,
    },
    setup() {
        const state = reactive({
            tabLoginAttivo: 'PannelloLogin',
            messaggioDiErrore: '',
        });

        const store = inject('store');

        function cambiaTab(nomeTab) {
            state.tabLoginAttivo = nomeTab;
        }

        function cambiaMessaggioErrore(errMsg) {
            state.messaggioDiErrore = errMsg;
        }

        return {
            store,
            ...toRefs(state),
            cambiaTab,
            cambiaMessaggioErrore,
        }
    }
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

<template>
<div id="contenitoreLogin" class="auth-div">
  <h4><b>Effettua il login</b></h4>
  <form @submit.prevent="submitLogin" id="formLogin">
    <input v-model="username" required type="text" id="userLogin" placeholder="nome utente">
    <br>
    <br>
    <input v-model="pw" required type="password" id="pwLogin" placeholder="password">
    <br>
    <br>
    <button type="submit">Login</button>
    <br>
    <br>
    <div>
      <p>Non sei registrato? <a @click="emettiCambioTab" id="signup-a">Registrati</a></p>
    </div>
  </form>
</div>
</template>

<script>
import {reactive, toRefs, inject} from 'vue';

export default {
  name: 'PannelloLogin',
  setup(props, {emit}) {
    const state = reactive({
      username: '',
      pw: ''
    });

    const store = inject('store');

    function emettiCambioTab() {
      emit('cambioTab', 'PannelloSignup');
    }

    function emettiImpostaMessaggioErrore(errMsg) {
      emit('authErr', errMsg);
    }

    async function submitLogin() {
      const userInfo = {
        username: state.username,
        pw: state.pw
      }
      try {
        const res = await login(userInfo);
        const resJson = await res.json();
        if (res.status !== 200) {
          emettiImpostaMessaggioErrore(resJson.message);
        }
        else {
          emettiImpostaMessaggioErrore('');
          store.methods.setLocalStorageUserInfo(resJson);
          store.methods.setAlert(resJson.message);
          store.methods.setTabAttivo('Tab2');
        }
      }
      catch(e) {
        emettiImpostaMessaggioErrore(e);
      }

      state.username = '';
      state.pw = '';
    }

    function login(user) {
      return fetch("/auth/login", {method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify(user)});
    }

    return {
      props,
      ...toRefs(state),
      emettiCambioTab,
      submitLogin,
    }
  }
}
</script>

<style scoped>
.auth-div {
  background-color: var(--grigioScuro);
  padding: 10px;
}
#login-a, #signup-a {
  cursor: pointer;
}
</style>

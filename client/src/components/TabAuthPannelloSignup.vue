<template>
<div id="contenitoreSignup" class="auth-div">
  <h4><b>Registrati</b></h4>
  <form @submit.prevent="submitSignup" id="formSignup">
    <input v-model="state.username" required type="text" id="userSignup" placeholder="nome utente">
    <label for="userSignup">Inserisci un nome valido</label>
    <br>
    <br>
    <input v-model="state.email" required type="email" id="emailSignup" placeholder="e-mail">
    <label for="emailSignup">Inserisci un indirizzo e-mail valido</label>
    <br>
    <br>
    <input v-model="state.pw" required type="password" id="pwSignup" placeholder="password">
    <label for="pwSignup">Scegli una password di almeno 6 caratteri</label>
    <br>
    <br>
    <button type="submit">Registrati</button>
    <br>
    <br>
    <div>
      <p>Sei già registrato? Effettua il <a @click="emettiCambioTab" id="login-a">login</a></p>
    </div>
  </form>
</div>
</template>

<script setup>
import { reactive, inject } from 'vue';

const emit = defineEmits(['cambioTab', 'authErr']);

const store = inject('store');

const state = reactive({
  username: '',
  email: '',
  pw: ''
});

function emettiCambioTab() {
  emit('cambioTab', 'PannelloLogin');
}

function emettiImpostaMessaggioErrore(errMsg) {
  emit('authErr', errMsg);
}

async function submitSignup() {
  const userInfo = {
    username: state.username,
    email: state.email,
    pw: state.pw
  }
  try {
    const res = await signup(userInfo);
    const resJson = await res.json();
    if (res.status !== 200) {
      emettiImpostaMessaggioErrore(resJson.message);
    }
    else {
      emettiImpostaMessaggioErrore('');
      store.methods.setAlert(resJson.message);
      emettiCambioTab();
    }
  }
  catch(e) {
    emettiImpostaMessaggioErrore(e);
  }

  state.username = '';
  state.email = '';
  state.pw = '';
}

function signup(user) {
  return fetch("/auth/signup", {method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify(user)});
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

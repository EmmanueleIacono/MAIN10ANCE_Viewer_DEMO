<template>
<div class="parent">
  <table>
    <tr>
      <th>Utenti</th>
      <th>E-mail</th>
      <th>Ruolo</th>
    </tr>
    <tr v-for="utente in infoUtenti" :key="utente.email">
      <td>{{utente.user}}</td>
      <td>{{utente.email}}</td>
      <td>
        <select v-model="utente.ruolo" :disabled="store.state.userSettings.user_id === utente.user">
          <option v-for="ruolo in listaRuoli" :key="ruolo" :value="ruolo">{{ruolo}}</option>
        </select>
        <button @click="modificaRuolo(utente)" :disabled="store.state.userSettings.user_id === utente.user">MODIFICA</button>
      </td>
    </tr>
  </table>
</div>
</template>

<script>
import {inject, onMounted, reactive, toRefs} from 'vue';
import {getInfoGestioneUtenti, getRuoliEnum, updateRuoloUtente} from '../js/richieste';

export default {
  name: 'TabDashboardGestioneUtenti',
  setup() {
    const store = inject('store');
    const state = reactive({
      infoUtenti: [],
      listaRuoli: [],
    });

    let ruoliOriginali = [];

    onMounted(async () => {
      const listaRuoli = await getRuoliEnum();
      state.listaRuoli = listaRuoli;
      await impostaTabellaUtenti();
    });

    async function impostaTabellaUtenti() {
      const infoUtenti = await getInfoGestioneUtenti();
      ruoliOriginali = infoUtenti.map(utente => JSON.parse(JSON.stringify(utente)));
      state.infoUtenti = infoUtenti;
    }

    async function modificaRuolo(datiUtente) {
      if (store.state.userSettings.user_id === datiUtente.user) return;
      const datiUtenteOriginali = ruoliOriginali.find(utente => utente.user === datiUtente.user);
      const match = datiUtenteOriginali.ruolo === datiUtente.ruolo;
      if (match) {
        store.methods.setAlert('Nessuna modifica da effettuare');
      }
      else {
        const userJson = {
          user: datiUtente.user,
          ruolo: datiUtente.ruolo,
        }
        store.methods.toggleLoaderGlobale();
        const res = await updateRuoloUtente(userJson);
        if (res) store.methods.setAlert('Modifica effettuata');
        else store.methods.setAlert('Si è verificato un errore, la modifica non è andata a buon fine');
        await impostaTabellaUtenti();
        store.methods.toggleLoaderGlobale();
      }
    }

    return {
      store,
      ...toRefs(state),
      modificaRuolo,
    }
  }
}
</script>

<style scoped>
.parent {
  margin: 15px;
}
button {
  float: right;
  border: none;
  color: var(--ghostWhite);
  background-color: var(--verdeMain10ance);
  cursor: pointer;
  font-weight: bold;
}
button:hover {
  background-color: var(--verdeMain10anceTrasparenza);
}
button:disabled {
  cursor: not-allowed;
  background-color: var(--verdeMain10anceTrasparenza);
}
table {
  border-collapse: collapse;
  width: 100%;
  /* padding: 10px; */
  overflow: auto;
}
td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
  max-width: 200px;
}
td {
  word-break: break-all;
}
th {
  background-color: var(--verdeMain10ance);
} 
tr:nth-child(even) {
  background-color: var(--verdeMain10anceTrasparenza);
}
tr:nth-child(odd) {
  background-color: var(--verdeMain10anceTrasparenza2);
}
</style>

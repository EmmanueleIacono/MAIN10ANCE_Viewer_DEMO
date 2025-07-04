<template>
<div>
  <!-- navbar -->
  <nav class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a href="https://main10ance.eu/" target="_blank" id="logoSito" class="navbar-brand">
          <img alt="Main10ance" src="./assets/img/AsseII_MAIN10ANCE.png" height="50">
        </a>
      </div>
      <div id="navbar" class="navbar-collapse collapse">
        <ul class="nav navbar-nav left tabs">
          <li @click="store.methods.setTabAttivo('Tab2')" :class="{active: store.state.tabAttivo==='Tab2'}" class="tab" id="apriTabGIS">GIS VIEWER</li>
          <li @click="store.methods.setTabAttivo('Tab1')" :class="{active: store.state.tabAttivo==='Tab1'}" class="tab" id="apriTabBIM">BIM VIEWER</li>
          <li @click="store.methods.setTabAttivo('Tab5')" :class="{active: store.state.tabAttivo==='Tab5'}" class="tab" id="apriTabCollection">ARTIFACT VIEWER</li>
          <li @click="store.methods.setTabAttivo('Tab3')" :class="{active: store.state.tabAttivo==='Tab3'}" v-if="store.getters.getUsrVwList().includes('apriTabSchede')" class="tab" id="apriTabSchede">PLANNER</li>
          <li @click="store.methods.setTabAttivo('Tab4')" :class="{active: store.state.tabAttivo==='Tab4'}" v-if="store.getters.getUsrVwList().includes('apriTabDashboard')" class="tab" id="apriTabDashboard">DASHBOARD</li>
          <li @click="store.methods.apriDocsDialog" v-if="store.getters.getUsrVwList().includes('apriTabDocumenti')" class="tab">DOCUMENTI</li>
        </ul>
        <div class="pull-right">
          <ul class="nav navbar-nav">
            <li id="liUsernameNavbar">{{store.state.userSettings.user_id}}</li>
            <li @click="store.methods.setTabAttivo('TabAuth')" v-if="!store.state.userSettings.user_id" :class="{active: store.state.tabAttivo==='TabLogin'}" class="tab" id="apriTabLogin">LOGIN</li>
            <li @click="logout" v-if="store.state.userSettings.user_id" class="tab" id="navbarLogout">LOGOUT</li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
  <!-- End of navbar -->
  <div class="container-fluid fill">
    <div class="row fill">
      <div class="fill loading-wrapper">
        <LoadingScreen :caricamento="store.state.loaderGlobaleVisibile" />
        <keep-alive>
          <component :is="store.state.tabAttivo" @loadLivelli="loadLayers" @updateMappa="popolaMappa" />
        </keep-alive>
      </div>
    </div>
  </div>
  <DialogFileUpload />
  <Alert />
  <Confirm />
</div>
</template>

<script>
import {provide, onMounted} from 'vue';
import {getTabelleGIS, getGIS, leggiDBMarkerLoc, leggiDBMarkerEdif, leggiDBMarkerLocPdiff} from './js/richieste';
import store from '@/store';
import Tab1 from './components/TabBIM.vue';
import Tab2 from './components/TabGIS.vue';
import Tab3 from './components/TabPlanner.vue';
import Tab4 from './components/TabDashboard.vue';
import Tab5 from './components/TabCollection.vue';
import TabAuth from './components/TabAuth.vue';
import Alert from './components/Alert.vue';
import Confirm from './components/Confirm.vue';
import LoadingScreen from './components/elementi/LoadingScreen.vue';
import DialogFileUpload from './components/DialogFileUpload.vue';

export default {
  name: 'App',
  components: {
    Tab1,
    Tab2,
    Tab3,
    Tab4,
    Tab5,
    TabAuth,
    Alert,
    Confirm,
    LoadingScreen,
    DialogFileUpload,
  },
  setup() {
    provide('store', store);

    primoLoad();

    onMounted(async () => {
      await popolaMappa();
    });

    function primoLoad() {
      if (localStorage.user_id) {
        store.methods.setUserSettings();
      }
    }

    async function logout() {
      const resRaw = await fetch("/auth/logout", {method: "GET", headers: {"content-type": "application/json"} });
      const res = await resRaw.json();
      store.methods.setLogoutUserSettings();
      // store.methods.resetStateBIM();
      // store.methods.resetStateGIS();
      store.methods.resetStatePlanner();
      store.methods.setAlert(res.message);
      store.methods.setTabAttivo('Tab2');
    }

    async function loadLayers() {
      const tabelleGIS = await getTabelleGIS();
      store.methods.setTabelleGIS(tabelleGIS);
      for await (const tab of tabelleGIS) {
        if (tab.colonneUtili) {
          const gis = await getGIS(tab.tabella, tab.geometria, tab.colonneUtili.join(", "));
          store.methods.setEntitàGIS(tab.tabella, gis);
        }
      }
    }

    async function popolaMappa() {
      const localitàJson = await leggiDBMarkerLoc();
      const edificiJson = await leggiDBMarkerEdif();
      const locPdiffJson = await leggiDBMarkerLocPdiff();
      store.methods.setMarkerLoc(localitàJson);
      store.methods.setMarkerEdif(edificiJson);
      store.methods.setMarkerLocPdiff(locPdiffJson);
    }

    return {
      store,
      logout,
      loadLayers,
      popolaMappa,
    }
  }
}
</script>

<style>
:root {
  --blue: steelblue;
  --white: #fff;
  --grigio: #dddddd;
  --grigioScuro: #bbbbbb;
  --gialloIntervento: #ceba4c;
  --gialloInterventoTrasparenza: #ceba4c60;
  --gialloInterventoTrasparenza2: #ceba4c30;
  --arancioneIntervento: #ce964c;
  --arancioneInterventoTrasparenza: #ce964c60;
  --rossoIntervento: #ce624c;
  --rossoInterventoTrasparenza: #ce624c60;
  --grigioMoltoScuro: #3d3d3d;
  --verdeMain10ance: #a8c956;
  --bluInterreg: #1a4f9c;
  --blackOlive: #36382e;
  --blackOliveChiaro: #4e5143;
  --ghostWhite: #f8f8ff;
  --lightGray: #d3d4d9;
  --verdeMain10anceTrasparenza: #a8c95660;
  --verdeMain10anceTrasparenza2: #a8c95630;
  --verdeMain10anceTrasparenza3: #a8c95615;
  --bluInterregTrasparenza: #1a4f9c60;
  --bluInterregTrasparenza2: #1a4e9c30;
  --bluInterregTrasparenza3: #1a4e9c15;
}
html, body {
  min-height: 100%;
  height: 100%;
  font-family: "Poppins", sans-serif;
  -webkit-font-smoothing: antialiased;
}

body {
  padding-top: 70px; /* space for the top nav bar */
  margin-right: 0px;
  background-color: var(--lightGray);
}

.fill {
  height: calc(100vh - 100px);
}

/* NAVBAR */

.navbar, .nav {
  background-color: var(--blackOlive);
}

#logoSito {
  padding: 0px;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 5px;
  margin-right: 15px;
  background-color: var(--lightGray);
  box-shadow: 0 0 0 5px var(--lightGray);
}

#logoSito:hover {
  background-color: var(--grigioScuro);
  box-shadow: 0 0 0 5px var(--grigioScuro);
}

.tab, .bottone-main10ance {
  cursor: pointer;
  padding: 10px;
  margin: 10px;
  color: var(--ghostWhite);
  background-color: var(--verdeMain10ance);
  font-weight: bold;
  border: none;
}

.tab.active {
  background-color: #ccc;
}

.tab:hover {
  background-color: #aaa;
}

#liUsernameNavbar {
  padding: 10px;
  margin: 10px;
  color: var(--verdeMain10ance);
  font-weight: bold;
  border: none;
}

.panel, .panel-heading {
  background-color: var(--grigio);
}

/* STILI TABELLE FULLCALENDAR --- PER ORA NON FUNZIONANO BENISSIMO */
th {
  /* background-color: #b6b4b4; */
  background-color: var(--verdeMain10anceTrasparenza);
}
.fc-theme-standard td, .fc-theme-standard th {
  border: 1px solid var(--verdeMain10anceTrasparenza);
}
/* table[class^="fc-"] {
  border-collapse: collapse;
  width: 100%;
  padding: 10px;
  overflow: auto;
}

td[class^="fc-"], th[class^="fc-"] {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
  max-width: 200px;
}

td[class^="fc-"] {
  word-break: break-all;
}

th[class^="fc-"] {
  background-color: #b6b4b4;
} 

tr:nth-child(even)[class^="fc-"] {
  background-color: #cacaca;
} */

.loading-wrapper {
  position: relative;
}
</style>

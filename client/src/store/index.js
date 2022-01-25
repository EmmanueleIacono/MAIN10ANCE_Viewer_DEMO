import {reactive, readonly} from 'vue';
import {generaColoreRandom} from '../js/shared';

const state = reactive({
    tabAttivo: 'Tab2',
    userSettings: {
        user_id: '',
        bim_vw_sets: '9-3',
        usr_vw: ''
    },
    alertVisibile: false,
    alertMessaggio: '',
});

const stateGIS = reactive({
    tabelleGIS: null,
    entitàGIS: {},
    markerSM: null,
    markerCapp: null,
});

const stateBIM = reactive({
    modelPlaceholder: true,
    urnModelloCorrente: null,
    elementiSelezionati: null,
    schedeRisultatiVisibile: false,
    schedeModuliVisibile: false,
});

const methods = {
    setTabAttivo(nomeTab) {
        state.tabAttivo = nomeTab;
    },

    setLocalStorageUserInfo(settingsJson) {
        localStorage.user_id = settingsJson.id;
        localStorage.bim_vw_sets = settingsJson.bim_vw_sets;
        localStorage.usr_vw = settingsJson.usr_vw;
        this.setUserSettings();
    },

    setUserSettings() {
        state.userSettings.user_id = localStorage.user_id;
        state.userSettings.bim_vw_sets = localStorage.bim_vw_sets;
        state.userSettings.usr_vw = localStorage.usr_vw;
    },

    setLogoutUserSettings() {
        localStorage.removeItem('user_id');
        localStorage.removeItem('bim_vw_sets');
        localStorage.removeItem('usr_vw');
        state.userSettings.user_id = '';
        state.userSettings.bim_vw_sets = '9-3';
        state.userSettings.usr_vw = '';
    },

    setAlert(messaggio) {
        state.alertMessaggio = messaggio;
        state.alertVisibile = true;
    },

    resetAlert() {
        state.alertVisibile = false;
        state.alertMessaggio = '';
    },

    setTabelleGIS(tabelle) {
        stateGIS.tabelleGIS = tabelle;
        tabelle.forEach(tab => {
            if (tab.colonneUtili) {
                const oggEntità = {
                    ready: false,
                    alias: tab.alias,
                    gis: [],
                    colore: generaColoreRandom(),
                    geometria: {}, // eliminabile
                    presente: false, // eliminabile
                }
                stateGIS.entitàGIS[tab.tabella] = oggEntità;
            }
        });
    },

    setEntitàGIS(tabella, listaGIS) {
        stateGIS.entitàGIS[tabella].gis = listaGIS;
        stateGIS.entitàGIS[tabella].ready = true;
    },

    setGeometriaEntità(tabella, livello) {
        stateGIS.entitàGIS[tabella].geometria = livello;
    },

    setMarkerSM(listaMarker) {
        stateGIS.markerSM = listaMarker;
    },

    setMarkerCapp(listaCapp) {
        stateGIS.markerCapp = listaCapp;
    }
}

const getters = {
    getUsrVwList() {
        return state.userSettings.usr_vw.split(',');
    },
    getBimVwSets() {
        return state.userSettings.bim_vw_sets.split('-');
    }
}

export default {
    state: readonly(state),
    stateGIS,
    stateBIM,
    methods,
    getters,
}

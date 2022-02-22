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
    confirmVisibile: false,
    confirmMessaggio: '',
    confirmResolvePromise: undefined,
    confirmRejectPromise: undefined,
    loaderGlobaleVisibile: false,
});

const stateGIS = reactive({
    tabelleGIS: null,
    entitàGIS: {},
    markerLoc: null,
    markerEdif: null,
});

const stateBIM = reactive({
    modelPlaceholder: true,
    urnModelloCorrente: null,
    elementiSelezionati: null,
    schedeRisultatiVisibile: false,
    schedeModuliVisibile: false,
    schedeAttivitàVisibile: false,
    schedeAttivitàTipo: '',
    elementiDaSchedare: [],
});

const statePlanner = reactive({
    attività: {
        'controllo': {
            tabella: 'controllo_stato_di_conservazione_livello_di_urgenza',
        },
        'manutenzione regolare': {
            tabella: 'manutenzione_regolare',
        },
        'manutenzione correttiva': {
            tabella: 'manutenzione_correttiva_o_a_guasto',
        },
        'manutenzione straordinaria': {
            tabella: 'manutenzione_straordinaria',
        },
        'restauro': {
            tabella: 'restauri',
        },
        'diagnosi': {
            tabella: 'danno_alterazione_degrado',
        },
    },
    enumUNI: {
        enumStCons: [],
        enumLivUrg: [],
        enumClRacc: [],
    },
    datiSchedaInCompilazione: {},
    compilazioneParziale: false,
    listaCRregistrati: [],
    refreshPlanner: false,
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

    setConfirm(messaggio) {
        state.confirmMessaggio = messaggio;
        state.confirmVisibile = true;
        return new Promise((resolve, reject) => {
            state.confirmResolvePromise = resolve;
            state.confirmRejectPromise = reject;
        });
    },

    resetConfirm(bool = false) {
        state.confirmResolvePromise(bool);
        state.confirmVisibile = false;
        state.confirmMessaggio = '';
    },

    toggleLoaderGlobale() {
        state.loaderGlobaleVisibile = !state.loaderGlobaleVisibile;
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

    setMarkerLoc(listaMarker) {
        stateGIS.markerLoc = listaMarker;
    },

    setMarkerEdif(listaEdif) {
        stateGIS.markerEdif = listaEdif;
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
    statePlanner,
    methods,
    getters,
}

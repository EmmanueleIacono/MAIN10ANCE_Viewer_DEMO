import {reactive, readonly} from 'vue';
import {generaColoreRandom} from '../js/shared';
import {prendiSigleLocalità, prendiSigleEdifici, leggiEnum, prendiFrasiDiRischio, leggiDBMarkerEdif, prendiLOD3e4, leggiGlossDegradi} from '../js/richieste';

const state = reactive({
    tabAttivo: 'Tab2',
    userSettings: {
        user_id: '',
        bim_vw_sets: '9-3',
        usr_vw: '',
        bkts: '',
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
    editMode: false,
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
    datiPlannerLoaded: false,
    listaSigleLoc: [],
    listaSigleEdifici: [],
    listaClOgg: [],
    listaFrasiDiRischio: [],
    listaEdif: [],
    listaElementi: [],
    listaStCons: [],
    listaFenomeni: [],
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
    urnModelloCorrente: null,
    datiProgrammazione: {
        attCicliche: [],
        attRiallineamento: [],
    }
});

const methods = {
    setTabAttivo(nomeTab) {
        state.tabAttivo = nomeTab;
    },

    setLocalStorageUserInfo(settingsJson) {
        localStorage.user_id = settingsJson.id;
        localStorage.bim_vw_sets = settingsJson.bim_vw_sets;
        localStorage.usr_vw = settingsJson.usr_vw;
        localStorage.bkts = settingsJson.buckets;
        this.setUserSettings();
    },

    setUserSettings() {
        state.userSettings.user_id = localStorage.user_id;
        state.userSettings.bim_vw_sets = localStorage.bim_vw_sets;
        state.userSettings.usr_vw = localStorage.usr_vw;
        state.userSettings.bkts = localStorage.bkts;
    },

    setLogoutUserSettings() {
        localStorage.removeItem('user_id');
        localStorage.removeItem('bim_vw_sets');
        localStorage.removeItem('usr_vw');
        localStorage.removeItem('bkts');
        state.userSettings.user_id = '';
        state.userSettings.bim_vw_sets = '9-3';
        state.userSettings.usr_vw = '';
        state.userSettings.bkts = '';
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
    },

    setEditModeGIStrue() {
        stateGIS.editMode = true;
    },

    setEditModeGISfalse() {
        stateGIS.editMode = false;
    },

    async recuperaDatiPlanner() {
        this.toggleLoaderGlobale();
        const listaSigleLoc = await prendiSigleLocalità();
        const listaSigleEdifici = await prendiSigleEdifici();
        const listaClOgg = await leggiEnum('cl_ogg_fr');
        const listaFrasiDiRischio = await prendiFrasiDiRischio();
        const listaEdif = await leggiDBMarkerEdif();
        const listaElementi = await prendiLOD3e4();
        const listaStCons = await leggiEnum('st_cons');
        const listaFenomeni = await leggiGlossDegradi();
        statePlanner.listaSigleLoc = listaSigleLoc;
        statePlanner.listaSigleEdifici = listaSigleEdifici;
        statePlanner.listaClOgg = listaClOgg;
        statePlanner.listaFrasiDiRischio = listaFrasiDiRischio;
        statePlanner.listaEdif = listaEdif;
        statePlanner.listaElementi = listaElementi;
        statePlanner.listaStCons = listaStCons;
        statePlanner.listaFenomeni = listaFenomeni;
        statePlanner.datiPlannerLoaded = true;
        this.toggleLoaderGlobale();
    },

    // resetStateBIM() {
    //     stateBIM.modelPlaceholder = true;
    //     stateBIM.urnModelloCorrente = null;
    //     stateBIM.elementiSelezionati = null;
    //     stateBIM.schedeRisultatiVisibile = false;
    //     stateBIM.schedeModuliVisibile = false;
    //     stateBIM.schedeAttivitàVisibile = false;
    //     stateBIM.schedeAttivitàTipo = '';
    //     stateBIM.elementiDaSchedare = [];
    // },

    // resetStateGIS() {
    //     stateGIS.tabelleGIS = null;
    //     stateGIS.entitàGIS = {};
    //     stateGIS.markerLoc = null;
    //     stateGIS.markerEdif = null;
    // },

    resetStatePlanner() {
        statePlanner.datiPlannerLoaded = false;
        statePlanner.listaSigleLoc = [];
        statePlanner.listaSigleEdifici = [];
        statePlanner.listaClOgg = [];
        statePlanner.listaFrasiDiRischio = [];
        statePlanner.listaEdif = [];
        statePlanner.listaElementi = [];
        statePlanner.listaStCons = [];
        statePlanner.listaFenomeni = [];
        statePlanner.attività = {
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
        };
        statePlanner.enumUNI = {
            enumStCons: [],
            enumLivUrg: [],
            enumClRacc: [],
        };
        statePlanner.datiSchedaInCompilazione = {};
        statePlanner.compilazioneParziale = false;
        statePlanner.listaCRregistrati = [];
        statePlanner.refreshPlanner = false;
        statePlanner.urnModelloCorrente = null;
    },
}

const getters = {
    getUsrVwList() {
        return state.userSettings.usr_vw.split(',');
    },
    getBimVwSets() {
        return state.userSettings.bim_vw_sets.split('-');
    },
    getBkts() {
        return state.userSettings.bkts.split(',');
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

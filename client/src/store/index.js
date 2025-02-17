import {reactive, readonly} from 'vue';
import {generaColoreRandom} from '../js/shared';
import {
    prendiSigleLocalitàAmbito,
    prendiSigleEdifici,
    leggiEnum,
    prendiFrasiDiRischio,
    leggiDBMarkerEdif,
    prendiLOD3e4,
    prendiSchedeStoricoControllo,
    prendiSchedeStoricoManReg,
    prendiSchedeStoricoManCorr,
    prendiSchedeControllo,
    prendiSchedeManReg,
    prendiSchedeManCorr
} from '../js/richieste';

const state = reactive({
    tabAttivo: 'Tab2',
    userSettings: {
        user_id: '',
        bim_vw_sets: '9-3',
        usr_vw: '',
        bkts: '',
        ambito: '',
        ambito_schema: '',
        ambito_full_name: '',
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
    markerLocPdiff: null,
    editMode: false,
    editModeMkAmbito: false,
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
    schedeEsecuzione: {
        "controllo": [],
        "manutenzione regolare": [],
        "manutenzione correttiva": [],
        "manutenzione straordinaria": [],
        "restauro": [],
        "diagnosi": [],
    },
    schedeEsecuzioneFiltrate: {
        "controllo": [],
        "manutenzione regolare": [],
        "manutenzione correttiva": [],
        "manutenzione straordinaria": [],
        "restauro": [],
        "diagnosi": [],
    },
    schedeStorico: {
        "controllo": [],
        "manutenzione regolare": [],
        "manutenzione correttiva": [],
        "manutenzione straordinaria": [],
        "restauro": [],
        "diagnosi": [],
    },
    schedeStoricoFiltrate: {
        "controllo": [],
        "manutenzione regolare": [],
        "manutenzione correttiva": [],
        "manutenzione straordinaria": [],
        "restauro": [],
        "diagnosi": [],
    },
    attività: {
        'controllo': {
            tabella: 'scheda_controllo',
        },
        'manutenzione regolare': {
            tabella: 'scheda_manutenzione_regolare',
        },
        'manutenzione correttiva': {
            tabella: 'scheda_manutenzione_correttiva',
        },
        'manutenzione straordinaria': {
            tabella: 'scheda_manutenzione_straordinaria',
        },
        'restauro': {
            tabella: 'scheda_restauro',
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
        localStorage.ambito = settingsJson.ambito; // SAREBBE MEGLIO PRENDERLO DAI COOKIE // nuovi settings 29/05/2024
        localStorage.ambito_schema = settingsJson.ambito_schema; // nuovi settings 29/05/2024
        localStorage.ambito_full_name = settingsJson.ambito_full_name // nuovi settings 29/05/2024
        this.setUserSettings();
    },

    setUserSettings() {
        state.userSettings.user_id = localStorage.user_id;
        state.userSettings.bim_vw_sets = localStorage.bim_vw_sets;
        state.userSettings.usr_vw = localStorage.usr_vw;
        state.userSettings.bkts = localStorage.bkts;
        state.userSettings.ambito = localStorage.ambito;
        state.userSettings.ambito_schema = localStorage.ambito_schema;
        state.userSettings.ambito_full_name = localStorage.ambito_full_name;
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
        state.userSettings.ambito = '';
        state.userSettings.ambito_schema = '';
        state.userSettings.ambito_full_name = '';
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

    setMarkerLocPdiff(listaLocPdiff) {
        stateGIS.markerLocPdiff = listaLocPdiff;
    },

    setEditModeGIStrue() {
        stateGIS.editMode = true;
    },

    setEditModeGISfalse() {
        stateGIS.editMode = false;
    },

    setEditModeMkAmbitoGIStrue() {
        stateGIS.editModeMkAmbito = true;
    },

    setEditModeMkAmbitoGISfalse() {
        stateGIS.editModeMkAmbito = false;
    },

    async recuperaDatiPlanner() {
        this.toggleLoaderGlobale();
        const listaSigleLoc = await prendiSigleLocalitàAmbito();
        const listaSigleEdifici = await prendiSigleEdifici();
        const listaClOgg = await leggiEnum('cl_ogg_fr'); // USARE UNA TABELLA PER cl_ogg_fr, NON UNA ENUM
        const listaFrasiDiRischio = await prendiFrasiDiRischio();
        const listaEdif = await leggiDBMarkerEdif();
        const listaElementi = await prendiLOD3e4();
        const attEsecuzioneContr = await prendiSchedeControllo();
        const attEsecuzioneManReg = await prendiSchedeManReg();
        const attEsecuzioneManCorr = await prendiSchedeManCorr();
        const attEsecuzioneManStr = []; // DA IMPLEMENTARE (11-10-2024)
        const attEsecuzioneRest = []; // DA IMPLEMENTARE (11-10-2024)
        const attEsecuzioneDiagn = []; // DA IMPLEMENTARE (11-10-2024)
        const attStoricoContr = await prendiSchedeStoricoControllo();
        const attStoricoManReg = await prendiSchedeStoricoManReg();
        const attStoricoManCorr = await prendiSchedeStoricoManCorr();
        const attStoricoManStr = []; // DA IMPLEMENTARE (24-09-2024)
        const attStoricoRest = []; // DA IMPLEMENTARE (24-09-2024)
        const attStoricoDiagn = []; // DA IMPLEMENTARE (24-09-2024)
        statePlanner.listaSigleLoc = listaSigleLoc;
        statePlanner.listaSigleEdifici = listaSigleEdifici;
        statePlanner.listaClOgg = listaClOgg;
        statePlanner.listaFrasiDiRischio = listaFrasiDiRischio;
        statePlanner.listaEdif = listaEdif;
        statePlanner.listaElementi = listaElementi;
        statePlanner.schedeEsecuzione['controllo'] = attEsecuzioneContr;
        statePlanner.schedeEsecuzione['manutenzione regolare'] = attEsecuzioneManReg;
        statePlanner.schedeEsecuzione['manutenzione correttiva'] = attEsecuzioneManCorr;
        statePlanner.schedeEsecuzione['manutenzione straordinaria'] = attEsecuzioneManStr;
        statePlanner.schedeEsecuzione['restauro'] = attEsecuzioneRest;
        statePlanner.schedeEsecuzione['diagnosi'] = attEsecuzioneDiagn;
        statePlanner.schedeEsecuzioneFiltrate['controllo'] = attEsecuzioneContr;
        statePlanner.schedeEsecuzioneFiltrate['manutenzione regolare'] = attEsecuzioneManReg;
        statePlanner.schedeEsecuzioneFiltrate['manutenzione correttiva'] = attEsecuzioneManCorr;
        statePlanner.schedeEsecuzioneFiltrate['manutenzione straordinaria'] = attEsecuzioneManStr;
        statePlanner.schedeEsecuzioneFiltrate['restauro'] = attEsecuzioneRest;
        statePlanner.schedeEsecuzioneFiltrate['diagnosi'] = attEsecuzioneDiagn;
        statePlanner.schedeStorico['controllo'] = attStoricoContr;
        statePlanner.schedeStorico['manutenzione regolare'] = attStoricoManReg;
        statePlanner.schedeStorico['manutenzione correttiva'] = attStoricoManCorr;
        statePlanner.schedeStorico['manutenzione straordinaria'] = attStoricoManStr;
        statePlanner.schedeStorico['restauro'] = attStoricoRest;
        statePlanner.schedeStorico['diagnosi'] = attStoricoDiagn;
        statePlanner.schedeStoricoFiltrate['controllo'] = attStoricoContr;
        statePlanner.schedeStoricoFiltrate['manutenzione regolare'] = attStoricoManReg;
        statePlanner.schedeStoricoFiltrate['manutenzione correttiva'] = attStoricoManCorr;
        statePlanner.schedeStoricoFiltrate['manutenzione straordinaria'] = attStoricoManStr;
        statePlanner.schedeStoricoFiltrate['restauro'] = attStoricoRest;
        statePlanner.schedeStoricoFiltrate['diagnosi'] = attStoricoDiagn;
        statePlanner.datiPlannerLoaded = true;
        this.toggleLoaderGlobale();
    },

    resetStatePlanner() {
        statePlanner.datiPlannerLoaded = false;
        statePlanner.listaSigleLoc = [];
        statePlanner.listaSigleEdifici = [];
        statePlanner.listaClOgg = [];
        statePlanner.listaFrasiDiRischio = [];
        statePlanner.listaEdif = [];
        statePlanner.listaElementi = [];
        statePlanner.schedeEsecuzione = {
            "controllo": [],
            "manutenzione regolare": [],
            "manutenzione correttiva": [],
            "manutenzione straordinaria": [],
            "restauro": [],
            "diagnosi": [],
        };
        statePlanner.schedeEsecuzioneFiltrate = {
            "controllo": [],
            "manutenzione regolare": [],
            "manutenzione correttiva": [],
            "manutenzione straordinaria": [],
            "restauro": [],
            "diagnosi": [],
        };
        statePlanner.schedeStorico = {
            "controllo": [],
            "manutenzione regolare": [],
            "manutenzione correttiva": [],
            "manutenzione straordinaria": [],
            "restauro": [],
            "diagnosi": [],
        };
        statePlanner.schedeStoricoFiltrate = {
            "controllo": [],
            "manutenzione regolare": [],
            "manutenzione correttiva": [],
            "manutenzione straordinaria": [],
            "restauro": [],
            "diagnosi": [],
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
    },
    getUsrInfoAmbito() {
        return {
            ambito: state.userSettings.ambito,
            ambito_schema: state.userSettings.ambito_schema,
            ambito_full_name: state.userSettings.ambito_full_name,
        }
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

import {reactive, /*readonly, */watch} from 'vue';
import {generaColoreRandom} from '../js/shared';
import {creaMappa, setVistaMappa, aggiungiLayer, rimuoviLayer, creaLivelloGISeAggiungiLayer} from '../js/GIS';
// import {getGIS} from '../assets/js/richieste';

const state = reactive({
    tabAttivo: 'Tab2',
    userSettings: {
        user_id: '',
        bim_vw_sets: '9-3',
        usr_vw: ''
    },
    mappaGIS: null,
    tabelleGIS: null,
    entitàGIS: {},
});

watch(() => state.tabelleGIS, (tabelle) => {
    if (tabelle && tabelle.length) {
        // console.log('partito');
        // tabelle.forEach(async tab => {
        //     const gruppoGis = {}
        //     const gisTabella = await getGIS(tab.tabella, tab.geometria, tab.colonneUtili);
        //     console.log(gisTabella);
        //     gruppoGis.alias = tab.alias;
        //     gruppoGis.geometria = gisTabella.geom;
        //     gruppoGis.info = gisTabella.info;
        //     state.entitàGIS.push(gruppoGis);
        // });
        // console.log(state.entitàGIS);
        // console.log('finito');
    }
}, {
    immediate: true,
    deep: true,
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

    setTabelleGIS(tabelle) {
        state.tabelleGIS = tabelle;
        tabelle.forEach(tab => {
            if (tab.colonneUtili) {
                const oggEntità = {
                    ready: false,
                    alias: tab.alias,
                    gis: [],
                    colore: generaColoreRandom(),
                    geometria: {},
                }
                state.entitàGIS[tab.tabella] = oggEntità;
            }
        });
    },

    setEntitàGIS(tabella, listaGIS) {
        state.entitàGIS[tabella].gis = listaGIS;
        state.entitàGIS[tabella].ready = true;
    },

    setGeometriaEntità(tabella, livello) {
        state.entitàGIS[tabella].geometria = livello;
    },

    creaMappaGIS(divId, pos) {
        state.mappaGIS = creaMappa(divId, pos);
    },

    setViewMappa(pos, zoom) {
        setVistaMappa(state.mappaGIS, pos, zoom);
    },

    aggiungiLivello(livello) {
        aggiungiLayer(livello, state.mappaGIS);
    },

    rimuoviLivello(livello) {
        rimuoviLayer(livello, state.mappaGIS);
    },

    aggiungiLivelloGIS(tabella) {
        // const liv = creaLivelloGIS(state.entitàGIS[tabella]);
        // aggiungiLayer(liv, state.mappaGIS);
        creaLivelloGISeAggiungiLayer(tabella);
    },

    // rimuoviLivelloGIS(livello) {
    //     rimuoviLayer(livello, state.mappaGIS);
    // }
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
    // se voglio che lo state sia modificabile solo attraverso i methods e non direttamente dai component,
    // esporto "state" tramite la funzione "readonly"
    // state: readonly(state),
    state,
    methods,
    getters,
}

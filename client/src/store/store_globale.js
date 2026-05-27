import { reactive, readonly } from 'vue';
import { leggiListaLocalita, leggiListaEdifici, /*leggiListaClassiOggetto, leggiListaElementi,*/ leggiDefinizioniClassiElementi } from '../js/richieste';

const state_globale = reactive({
  lista_localita: [],
  lista_edifici: [],
  // lista_cl_ogg: [],
  // lista_elementi: [],
  gerarchia_classi_elementi: [],
});

const methods = {
  async popolaStoreGlobale() {
    const lista_localita = await leggiListaLocalita();
    const lista_edifici = await leggiListaEdifici();
    // const lista_cl_ogg = await leggiListaClassiOggetto();
    // const lista_elementi = await leggiListaElementi();
    const definizioni_classi = await leggiDefinizioniClassiElementi();
    state_globale.lista_localita = lista_localita;
    state_globale.lista_edifici = lista_edifici;
    // state_globale.lista_cl_ogg = lista_cl_ogg;
    // state_globale.lista_elementi = lista_elementi;
    state_globale.gerarchia_classi_elementi = definizioni_classi;
  }
};

export default {
  state_globale: readonly(state_globale),
  methods,
};

import { reactive, readonly } from 'vue';
import { leggiListaLocalità, leggiListaEdifici, /*leggiListaClassiOggetto, leggiListaElementi,*/ leggiDefinizioniClassiElementi } from '../js/richieste';

const state_globale = reactive({
  lista_località: [],
  lista_edifici: [],
  // lista_cl_ogg: [],
  // lista_elementi: [],
  gerarchia_classi_elementi: [],
});

const methods = {
  async popolaStoreGlobale() {
    const lista_località = await leggiListaLocalità();
    const lista_edifici = await leggiListaEdifici();
    // const lista_cl_ogg = await leggiListaClassiOggetto();
    // const lista_elementi = await leggiListaElementi();
    const definizioni_classi = await leggiDefinizioniClassiElementi();
    state_globale.lista_località = lista_località;
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

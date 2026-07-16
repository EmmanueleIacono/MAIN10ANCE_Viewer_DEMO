import { reactive } from 'vue';

const state_anagrafica = reactive({
  selezione: {
    select_loc: null,
    select_edif: null,
    // select_classe: null,
    // select_elem: null,
    select_def_liv_1: null,
    select_def_liv_2: null,
    select_def_liv_3: null,
    select_def_liv_4: null,
    lista_edif_filtrata: [],
    lista_elem_filtrata: []
  },
  galleria: {
    caricamento: false,
    elementi: [],
    immagini: [],
  },
  caricamento: {
    file: null,
    anteprima_img: null,
    id_img: '',
  },
  dati_elemento: {
    id: '',
    autore: '',
    datazione: '',
    dimensioni: '',
    annotazioni: '',
  }
});

const methods_anagrafica = {
  reset_state_anagrafica() {
    this.reset_state_caricamento();
    this.reset_state_dati_elemento();
  },
  reset_state_selezione() {
    state_anagrafica.selezione = {
      select_loc: null,
      select_edif: null,
      // select_classe: null,
      // select_elem: null,
      select_def_liv_1: null,
      select_def_liv_2: null,
      select_def_liv_3: null,
      select_def_liv_4: null,
      lista_edif_filtrata: [],
      lista_elem_filtrata: []
    };
  },
  reset_state_caricamento() {
    state_anagrafica.caricamento = {
      file: null,
      anteprima_img: null,
      id_img: '',
    };
  },
  reset_state_dati_elemento() {
    state_anagrafica.dati_elemento = {
      id: '',
      autore: '',
      datazione: '',
      dimensioni: '',
      annotazioni: '',
    };
  },
  reset_state_galleria() {
    state_anagrafica.galleria.immagini.forEach(img => URL.revokeObjectURL(img.object));
    state_anagrafica.galleria = {
      caricamento: false,
      elementi: [],
      immagini: [],
    };
  },
}

export default {
  state_anagrafica,
  methods_anagrafica,
};

<template>
<Card>
  <Details summary="PIANIFICAZIONE" :open="false" class="loading-wrapper">
    <LoadingScreen :caricamento="caricamento" />
    <button @click="programmaControlli" class="bottone-main10ance bottone-prog">Salva</button>
      <br />
    <div class="main-container">
      <label for="select-località-prog">Località</label>
      <select v-model="selectLocalità" id="select-località-prog">
        <option value=""></option>
        <option v-for="loc in store.statePlanner.listaSigleLoc" :key="loc.sigla" :value="loc.sigla">{{loc.nome}}</option>
      </select>
      <br />
      <br />
      <div><b>Edificio</b></div>
      <div id="div-edificio-prog">
        <div v-for="s in listaSigleEdificiFiltrata" :key="s.edificio" class="checkbox-edifici">
          <input v-model="listaSigleEdificiSelezionati" :id="`check-edif-prog-${s.edificio}`" :value="s.edificio" type="checkbox">
          <label :for="`check-edif-prog-${s.edificio}`">{{s.edif_nome_menu}}</label>
        </div>
      </div>
      <br />
      <label for="select-cl-ogg">Classe oggetti</label>
      <select v-model="selectClOgg" id="select-cl-ogg">
        <option value=""></option>
        <option v-for="cl in store.statePlanner.listaClOgg" :key="cl.unnest" :value="cl.unnest">{{cl.unnest}}</option>
      </select>
      <br />
      <br />
      <table v-if="selectClOgg" class="tabella-prog-controlli">
        <caption class="caption-prog-controlli"><b>Pianificazione attività cicliche</b></caption>
        <tr>
          <th><b>Frase di rischio</b></th>
          <th><b>Controllo</b></th>
          <th><b>Manutenzione ordinaria</b></th>
          <th><b>Frequenza (mesi)</b></th>
          <th><b>Inizio ciclo</b></th>
        </tr>
        <tr v-for="(fr, ind) in listaFrasiDiRischioFiltrate" :key="fr.id_fr_risc">
          <td :class="fr.fr_risc ? 'tooltip-prog' : null">
            <div class="tab-div">{{fr.fr_risc ? fr.fr_risc : ''}}</div>
            <span v-if="fr.fr_risc" class="tooltip-prog-text">{{fr.fr_risc}}</span>
          </td>
          <td :class="fr.controllo ? 'tooltip-prog' : null">
            <div class="tab-div">{{fr.controllo ? fr.controllo : ''}}</div>
            <span v-if="fr.controllo" class="tooltip-prog-text">{{fr.controllo}}</span>
          </td>
          <td :class="fr.mn_reg ? 'tooltip-prog' : null">
            <div class="tab-div">{{fr.mn_reg ? fr.mn_reg : ''}}</div>
            <span v-if="fr.mn_reg" class="tooltip-prog-text">{{fr.mn_reg}}</span>
          </td>
          <td>
            <input v-model="datiFrasiDiRischioFiltrate[ind].freq_c" type="number" min="1" placeholder="Controllo">
            <input v-if="fr.mn_reg" v-model="datiFrasiDiRischioFiltrate[ind].freq_mr" type="number" min="1" placeholder="Manutenzione">
          </td>
          <td>
            <input v-model="datiFrasiDiRischioFiltrate[ind].data_c" type="date">
            <input v-if="fr.mn_reg" v-model="datiFrasiDiRischioFiltrate[ind].data_mr" type="date">
          </td>
        </tr>
      </table>
      <br>
    </div>
  </Details>
</Card>
</template>

<script>
import {reactive, onMounted, toRefs, watch, inject, computed} from 'vue';
import {getEntitàDaClOgg, getElementiDaEntità, creaAttProgControllo} from '../js/richieste';
import {dataInteger, dataCorta} from '../js/shared';
import Details from './elementi/Details.vue';
import LoadingScreen from './elementi/LoadingScreen.vue';
import Card from './elementi/Card.vue';

export default {
  name: 'TabDashboardPianificazione',
  components: {
    Details,
    LoadingScreen,
    Card,
  },
  setup(props, {emit}) {
    const store = inject('store');
    const state = reactive({
      caricamento: false,
      selectLocalità: '',
      selectClOgg: '',
      // listaSigleLoc: [],
      // listaSigleEdifici: [],
      listaSigleEdificiFiltrata: [],
      listaSigleEdificiSelezionati: [],
      // listaClOgg: [],
      // listaFrasiDiRischio: [],
      listaFrasiDiRischioFiltrate: [],
      datiFrasiDiRischioFiltrate: [],
    });

    const nomeLocalità = computed(() => {
      if (state.selectLocalità) return store.statePlanner.listaSigleLoc.filter(loc => loc.sigla === state.selectLocalità)[0].nome;
      return '';
    });

    watch(() => state.selectLocalità, newVal => {
      const listaSigleEdificiFiltrata = store.statePlanner.listaSigleEdifici.filter(s => s.località === newVal);
      state.listaSigleEdificiFiltrata = listaSigleEdificiFiltrata;
      state.listaSigleEdificiSelezionati = [];
    });

    watch(() => state.selectClOgg, newVal => {
      const listaFrasiDiRischioFiltrate = store.statePlanner.listaFrasiDiRischio.filter(fr => fr.cl_ogg_fr === newVal);
      state.listaFrasiDiRischioFiltrate = listaFrasiDiRischioFiltrate;
      const listaIdFrRiscFiltrati = listaFrasiDiRischioFiltrate.map(fr => ({id_fr_risc: fr.id_fr_risc, freq: null, data: null, man_reg: !!fr.mn_reg}));
      state.datiFrasiDiRischioFiltrate = listaIdFrRiscFiltrati;
    });

    onMounted(async () => {
      // state.caricamento = true;
      // const listaSigleLoc = await prendiSigleLocalità();
      // const listaSigleEdifici = await prendiSigleEdifici();
      // const listaClOgg = await leggiEnum('cl_ogg_fr');
      // const listaFrasiDiRischio = await prendiFrasiDiRischio();
      // state.listaSigleLoc = listaSigleLoc;
      // state.listaSigleEdifici = listaSigleEdifici;
      // state.listaClOgg = listaClOgg;
      // state.listaFrasiDiRischio = listaFrasiDiRischio;
      // state.caricamento = false;
    });

    async function programmaControlli() {
      if (controllaSelezioni() && controllaCampiCompilati()) {
        state.caricamento = true;
        try {
          const dati = await raccogliDati();
          if (!dati) return;
          const res = await creaAttProgControllo(dati);
          if (res.success) {
            store.methods.setAlert('Programmazione andata a buon fine');
            emit('pianificazioneAggiornata');
          }
          else {
            store.methods.setAlert('ATTENZIONE: Si è verificato un errore durante la registrazione dei dati');
          }
        }
        catch(e) {
          store.methods.setAlert(e);
        }
        finally {
          state.caricamento = false;
        }
      }
      else {
        store.methods.setAlert('ATTENZIONE: Informazioni non sufficienti');
      }
    }

    function controllaSelezioni() {
      return state.selectLocalità && state.selectClOgg && !!state.listaSigleEdificiSelezionati.length;
    }

    function controllaCampiCompilati() {
      return state.datiFrasiDiRischioFiltrate && !!state.datiFrasiDiRischioFiltrate.length && state.datiFrasiDiRischioFiltrate.every(dato => dato.freq_c && dato.data_c && (dato.man_reg ? dato.freq_mr && dato.data_mr : true));
    }

    async function raccogliDati() {
      const datiProgrammazione = state.datiFrasiDiRischioFiltrate;
      const listaEdifici = state.listaSigleEdificiSelezionati;
      const località = state.selectLocalità;
      const listaEntità = await getEntitàDaClOgg(state.selectClOgg);
      if (!listaEntità.length) throw new Error('ERRORE: Nessuna entità corrispondente alla classe corrente.');
      const listaIdM10a = await compilaIdM10a(listaEdifici, listaEntità, località);
      if (listaIdM10a.some(id => !id.elementi.length)) {
        const continuare = await store.methods.setConfirm('ATTENZIONE: Uno o più edifici non hanno entità corrispondenti per la classe corrente. Sarà generato un identificativo generico.\nContinuare?');
        if (!continuare) return;
        else {
          listaIdM10a.forEach(id => {
            const loc = località;
            const ed = id.edificio;
            listaEntità.forEach(ent => {
              const id_m10a_generico = `${loc}|${ed}|${ent}|*`;
              id.elementi.push(id_m10a_generico);
            });
          });
        }
      }
      const listaAttività = [];
      datiProgrammazione.forEach(dato => {
        listaIdM10a.forEach(id => {
          const oggAtt = {};
          oggAtt['cl_ogg'] = state.selectClOgg;
          oggAtt['rid_fr_risc'] = dato.id_fr_risc;
          oggAtt['man_reg'] = dato.man_reg;
          oggAtt['freq_c'] = dato.freq_c;
          oggAtt['data_prog_c'] = dato.data_c;
          oggAtt['edificio'] = id.edificio;
          oggAtt['elementi'] = id.elementi;
          oggAtt['loc_estesa'] = nomeLocalità.value;
          listaAttività.push(oggAtt);
          if (dato.freq_mr) {
            const oggAttMr = {};
            oggAttMr['cl_ogg'] = state.selectClOgg;
            oggAttMr['rid_fr_risc'] = dato.id_fr_risc;
            oggAttMr['man_reg'] = dato.man_reg;
            oggAttMr['freq_mr'] = dato.freq_mr;
            oggAttMr['data_prog_mr'] = dato.data_mr;
            oggAttMr['edificio'] = id.edificio;
            oggAttMr['elementi'] = id.elementi;
            oggAttMr['loc_estesa'] = nomeLocalità.value;
            listaAttività.push(oggAttMr);
          }
        });
      });
      const metadati = creaMetadati();
      listaAttività.forEach((att, ind) => {
        att['id_att_prog'] = metadati.idUnivoco + ind;
        att['id_group'] = metadati.id_group;
        att['data_ins'] = metadati.data_ins;
      });
      return listaAttività;
    }

    async function compilaIdM10a(edifici, entità, sm) {
      const listaElementi = [];
      for (const ed of edifici) {
        const idOgg = {};
        idOgg.edificio = ed;
        idOgg.elementi = [];
        for (const en of entità) {
          if (en === 'grata') {
            const numeri = ed.split('-');
            for (const n of numeri) {
              const elementi = await getElementiDaEntità(sm, n, en);
              idOgg.elementi.push(...elementi);
            }
          }
          else {
            const elementi = await getElementiDaEntità(sm, ed, en);
            idOgg.elementi.push(...elementi);
          }
        }
        listaElementi.push(idOgg);
      }
      return listaElementi;
    }

    function creaMetadati() {
      const idUnivoco = dataInteger();
      const data_ins = dataCorta();
      const id_group = `${state.selectClOgg.split(' ')[0]}_${idUnivoco}`;
      return {id_group, idUnivoco, data_ins}
    }

    return {
      store,
      ...toRefs(state),
      programmaControlli,
    }
  }
}
</script>

<style scoped>
select {
  margin-left: 1rem;
}
input[type=checkbox] {
  margin-right: .4rem;
}
td, th {
  border: 1px solid #dddddd;
  padding: 8px;
}
tr:nth-child(even) {
  background-color: var(--verdeMain10anceTrasparenza2);
}
tr:nth-child(odd) {
  background-color: var(--verdeMain10anceTrasparenza3);
}
.main-container {
  margin-top: 10px;
}
.bottone-prog {
  /* background-color: var(--bluInterreg);
  color: white;
  border: none;
  margin-left: 10px; */
  float: right;
}
.bottone-prog:hover {
  /* background-color: var(--grigioScuro); */
  background-color: var(--verdeMain10anceTrasparenza);
}
.tabella-prog-controlli {
  table-layout: fixed;
  width: 100%;
  word-wrap: normal;
}
.tabella-prog-controlli th, .tabella-prog-controlli td {
  width: 90%;
  max-width: 50px;
  word-break: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tabella-prog-controlli .tab-div {
  z-index: 10;
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tabella-prog-controlli input {
  width: 90%
}
.tooltip-prog {
  position: relative;
}
.tooltip-prog-text {
  visibility: hidden;
  position: absolute;
  z-index: 100;
  border: 1px;
  background-color: var(--blackOlive);
  border-style: solid;
  border-width: 1px;
  border-color: var(--verdeMain10ance);
  border-radius: 3px;
  padding: 3px;
  color: var(--grigio);
  top: 20px;
  left: 20px;
  width: fit-content;
  min-width: 150%;
}
.tooltip-prog:hover span.tooltip-prog-text {
  visibility: visible;
}
.tooltip-prog:hover {
  overflow: visible;
}
.checkbox-edifici {
  flex: 0 0 25%;
}
#div-edificio-prog {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.caption-prog-controlli {
  color: unset;
  text-align: center;
  background-color: var(--verdeMain10anceTrasparenza);
}
.vincola-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
.vincola {
  margin: 3px 0;
  display: inline;
}
p.vincola {
  margin-left: 5px;
}
</style>

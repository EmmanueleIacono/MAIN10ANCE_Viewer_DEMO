<template>
<div>
  <div class="scheda-anagrafica">
    <LoadingScreen :caricamento="loadingDati" />

    <!-- Titolo / Bottoni -->
    <div class="div-titolo-bottoni">
      <div class="float-dx div-bottoni">
        <BtnBIM @click="salvaScheda" icona="glyphicon-floppy-disk" nome="salvaScAnagLOD4" title="Salva" colore="blu"/>
        <BtnBIM @click="resetState" icona="glyphicon-erase" nome="annullaDBLOD4" title="Cancella tutti i campi" colore="blu"/>
        <BtnBIM @click="chiudiScheda" icona="glyphicon-remove" nome="chiudiScAnagLOD4" title="Annulla" colore="blu"/>
      </div>
      <h4 v-if="qualeScheda === 'manufatto'"><b>SCHEDA ANAGRAFICA MANUFATTO</b></h4>
      <h4 v-else-if="qualeScheda === 'dettaglio'"><b>SCHEDA ANAGRAFICA DETTAGLIO</b></h4>
      <h4 v-else-if="qualeScheda === 'statua'"><b>SCHEDA ANAGRAFICA STATUARIA</b></h4>
      <h4 v-else-if="qualeScheda === 'coperture'"><b>SCHEDA ANAGRAFICA COPERTURA</b></h4>
      <h4 v-else><b>SCHEDA ANAGRAFICA</b></h4>
    </div>

    <!-- Info Operatore -->
    <table class="form-table">
      <tbody>
      <tr>
        <th><label>Operatore</label></th>
        <td><p class="user-field">{{ store.state.userSettings.user_id }}</p></td>
      </tr>
      </tbody>
    </table>

    <!-- Campi Manufatto -->
    <div v-if="qualeScheda === 'manufatto'">
      <SchemaForm
        :fields="anagraficaSimpleFields"
        :model="stateModuloAnagrafica"
        @update-field="setAnagraficaSimpleField"
      />
    </div>

    <!-- Campi Dettaglio -->
    <div v-else-if="qualeScheda === 'dettaglio'">
      <SchemaForm
        :fields="anagraficaSimpleFields"
        :model="stateModuloAnagrafica"
        @update-field="setAnagraficaSimpleField"
      />
    </div>

    <!-- Campi Statua -->
    <div v-else-if="qualeScheda === 'statua'">
      <table class="form-table">
        <tbody>
        <tr>
          <th><label><b>Soggetto</b></label></th>
          <td><p class="user-field">{{ stateModuloAnagraficaStatua.nome_statua }}</p></td>
        </tr>
        <tr>
          <th><label><b>Codice</b></label></th>
          <td><p class="user-field">{{ stateModuloAnagraficaStatua.codice_statua }}</p></td>
        </tr>
        <tr>
          <th>
            <label><b style="color: darkred;">Presenza di codici non univoci nell'archivio storico/cartaceo</b></label>
            <p style="font-size: smaller; font-weight: normal;"><i>
              Indicare (se presente) il codice, seguito dalla breve indicazione del/dei documenti e data
              <br />
              Es.
              <br />
              ... fino al ...
            </i></p>
          </th>
          <td><textarea v-model="stateModuloAnagraficaStatua.codici_altro" style="height: 20px;"></textarea></td>
        </tr>
        <tr>
          <th><label><b>Dimensioni</b></label></th>
          <td><input v-model="stateModuloAnagraficaStatua.dimensioni"></td>
        </tr>
        <tr>
          <th><label><b>Descrizione statua</b></label></th>
          <td><textarea v-model="stateModuloAnagraficaStatua.descrizione_statua" style="height: 20px;"></textarea></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        
        <tr class="section-title-row">
          <td colspan="2"><b>ANCORAGGI</b></td>
        </tr>
        
        <tr>
          <th><label><b>A parete</b></label></th>
          <td><input type="checkbox" v-model="stateModuloAnagraficaStatua.elementi_di_ancoraggio_a_parete"></td>
        </tr>
        <tr v-if="stateModuloAnagraficaStatua.elementi_di_ancoraggio_a_parete">
          <th><label><i>Materiale</i></label></th>
          <td><select v-model="stateModuloAnagraficaStatua.materiale_ancoraggio_parete" class="float-dx">
            <option value=""></option>
            <option v-for="mat in datiEnum.materiale_ancoraggio_parete" :key="mat" :value="mat">{{ mat }}</option>
          </select></td>
        </tr>
        <tr v-if="stateModuloAnagraficaStatua.elementi_di_ancoraggio_a_parete">
          <th><label><i>Annotazioni</i></label></th>
          <td><textarea v-model="stateModuloAnagraficaStatua.ancoraggio_parete_annotazioni" style="height: 20px;"></textarea></td>
        </tr>

        <tr>
          <th><label><b>A pavimento</b></label></th>
          <td><input type="checkbox" v-model="stateModuloAnagraficaStatua.elementi_di_ancoraggio_a_pavimento"></td>
        </tr>
        <tr v-if="stateModuloAnagraficaStatua.elementi_di_ancoraggio_a_pavimento">
          <th><label><i>Materiale</i></label></th>
          <td><select v-model="stateModuloAnagraficaStatua.materiale_ancoraggio_pavimento" class="float-dx">
            <option value=""></option>
            <option v-for="mat in datiEnum.materiale_ancoraggio_pavimento" :key="mat" :value="mat">{{ mat }}</option>
          </select></td>
        </tr>
        <tr v-if="stateModuloAnagraficaStatua.elementi_di_ancoraggio_a_pavimento">
          <th><label><i>Annotazioni</i></label></th>
          <td><textarea v-model="stateModuloAnagraficaStatua.ancoraggio_pavimento_annotazioni" style="height: 20px;"></textarea></td>
        </tr>

        <tr>
          <th><label><b>A soffitto</b></label></th>
          <td><input type="checkbox" v-model="stateModuloAnagraficaStatua.elementi_di_ancoraggio_a_soffitto"></td>
        </tr>
        <tr v-if="stateModuloAnagraficaStatua.elementi_di_ancoraggio_a_soffitto">
          <th><label><i>Materiale</i></label></th>
          <td><select v-model="stateModuloAnagraficaStatua.materiale_ancoraggio_soffitto" class="float-dx">
            <option value=""></option>
            <option v-for="mat in datiEnum.materiale_ancoraggio_soffitto" :key="mat" :value="mat">{{ mat }}</option>
          </select></td>
        </tr>
        <tr v-if="stateModuloAnagraficaStatua.elementi_di_ancoraggio_a_soffitto">
          <th><label><i>Annotazioni</i></label></th>
          <td><textarea v-model="stateModuloAnagraficaStatua.ancoraggio_soffitto_annotazioni" style="height: 20px;"></textarea></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr>
          <th><label><b>Tecnica di esecuzione</b></label></th>
          <td><input v-model="stateModuloAnagraficaStatua.tecnica_esecuzione"></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr class="section-title-row">
          <td colspan="2"><b>MATERIALI</b></td>
        </tr>
        <tr>
          <th><label><b>Statua</b></label></th>
          <td><select v-model="stateModuloAnagraficaStatua.materiale_statua" class="float-dx">
            <option value=""></option>
            <option v-for="mat in datiEnum.materiale_statua" :key="mat" :value="mat">{{ mat }}</option>
          </select></td>
        </tr>
        <tr>
          <th><label><b>Annotazioni</b></label></th>
          <td><textarea v-model="stateModuloAnagraficaStatua.materiale_annotazioni" style="height: 20px;"></textarea></td>
        </tr>
        <tr>
          <th><label><b>Armatura</b></label></th>
          <td>
            <div v-for="mat in datiEnum.materiale_armatura" :key="mat">
              <input :id="`el-acc-cbx-${mat}`" :value="mat" v-model="stateModuloAnagraficaStatua.materiali_armatura" type="checkbox">
              <label :for="`el-acc-cbx-${mat}`">{{ mat }}</label>
            </div>
          </td>
        </tr>
        <tr>
          <th><label><b>Supporto</b></label></th>
          <td><select v-model="stateModuloAnagraficaStatua.materiale_supporto" class="float-dx">
            <option value=""></option>
            <option v-for="mat in datiEnum.materiale_supporto" :key="mat" :value="mat">{{ mat }}</option>
          </select></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr>
          <th><label><b>Strato di preparazione</b></label></th>
          <td><input v-model="stateModuloAnagraficaStatua.strato_di_preparazione"></td>
        </tr>
        <tr>
          <th><label><b>Pellicola pittorica</b></label></th>
          <td v-if="stateModuloAnagraficaStatua.materiale_supporto === 'legno'">
            <select v-model="stateModuloAnagraficaStatua.pellicola_pittorica_tecnica_e_mat.su_legno">
              <option value=""></option>
              <option v-for="mat in datiEnum.pellicola_pittorica_tecnica_e_mat.su_legno" :key="mat" :value="mat">{{ mat }}</option>
            </select>
          </td>
          <td v-else-if="stateModuloAnagraficaStatua.materiale_supporto === 'gesso'">
            <select v-model="stateModuloAnagraficaStatua.pellicola_pittorica_tecnica_e_mat.su_gesso">
              <option value=""></option>
              <option v-for="mat in datiEnum.pellicola_pittorica_tecnica_e_mat.su_gesso" :key="mat" :value="mat">{{ mat }}</option>
            </select>
          </td>
          <td v-else-if="stateModuloAnagraficaStatua.materiale_supporto === 'terracotta'">
            <select v-model="stateModuloAnagraficaStatua.pellicola_pittorica_tecnica_e_mat.su_terracotta">
              <option value=""></option>
              <option v-for="mat in datiEnum.pellicola_pittorica_tecnica_e_mat.su_terracotta" :key="mat" :value="mat">{{ mat }}</option>
            </select>
          </td>
          <td v-else>
            <textarea v-model="stateModuloAnagraficaStatua.pellicola_pittorica_tecnica_e_mat.altro" style="height: 20px;"></textarea>
          </td>
        </tr>
        <tr>
          <th><label><b>Lamina metallica</b></label></th>
          <td><input type="checkbox" v-model="stateModuloAnagraficaStatua.lamina_metallica"></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr class="section-title-row">
          <td colspan="2">
            <b>ELEMENTI ACCESSORI / MONILI</b>
            <br />
            <p style="font-size: smaller; font-weight: normal;"><i>
              Per inserire annotazioni riferite a ciascun elemento accessorio e/o monile indicare il nome dell'elemento come compare nell'elenco, in lettere maiuscole, indicando tra parentesi tonde eventuale oggetto specifico, seguito da ":" e dalla annotazione in lettera minuscola (vedi esempio).
              <br />
              <br />
              NOME ELEMENTO (elemento specifico): annotazioni
              <br />
              Es.
              <br />
              STRUMENTI MUSICALI (piffero): bastoncini in legno…
              <br />
              CAPIGLIATURE/BARBE (barba): paglia
            </i></p>
          </td>
        </tr>
        <tr>
          <th><label><b>Elementi accessori / monili</b></label></th>
          <td>
            <div v-for="mat in datiEnum.elementi_accessori_monili" :key="mat">
              <input :id="`el-acc-cbx-${mat}`" :value="mat" v-model="stateModuloAnagraficaStatua.elementi_accessori_monili" type="checkbox">
              <label :for="`el-acc-cbx-${mat}`">{{ mat }}</label>
            </div>
          </td>
        </tr>
        <tr v-if="stateModuloAnagraficaStatua.elementi_accessori_monili.length > 0" class="section-title-row">
          <td colspan="2"><b><i>Materiali</i></b></td>
        </tr>
        <tr v-for="(el, idx) in stateModuloAnagraficaStatua.elementi_accessori_monili" :key="el">
          <th><label><i>{{ el }}</i></label></th>
          <td>
            <select v-model="stateModuloAnagraficaStatua.materiale_elementi_accessori_monili[idx]" class="float-dx">
              <option v-for="mat in datiEnum.materiale_elementi_accessori_monili" :key="mat" :value="mat">{{ mat }}</option>
            </select>
          </td>
        </tr>
        <tr class="spacer-row" aria-hidden="true">
          <td colspan="2"></td>
        </tr>
        <tr>
          <th><label><i>Annotazioni</i></label></th>
          <td><textarea v-model="stateModuloAnagraficaStatua.elementi_accessori_monili_annotazioni" style="height: 20px;"></textarea></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr class="section-title-row">
          <td colspan="2"><b>DOCUMENTAZIONE GENERALE</b></td>
        </tr>
        <tr>
          <th><label><b>Epoca</b></label></th>
          <td><input v-model="stateModuloAnagraficaStatua.epoca"></td>
        </tr>
        <tr>
          <th><label><b>Fonti</b></label></th>
          <td><input v-model="stateModuloAnagraficaStatua.fonti"></td>
        </tr>
        <tr>
          <th><label><b>Autore</b></label></th>
          <td><input v-model="stateModuloAnagraficaStatua.autore"></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr>
          <th>
            <label><b>Accessibilità</b></label>
            <p style="font-size: smaller; font-weight: normal;"><i>I beni si considerano accessibili se ad altezza uomo o raggiungibili con l'ausilio di piccoli trabattelli o scale</i></p>
          </th>
          <td><input type="checkbox" v-model="stateModuloAnagraficaStatua.accessibilità"></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr>
          <th><label><b>Note</b></label></th>
          <td><textarea v-model="stateModuloAnagraficaStatua.note" style="height: 20px;"></textarea></td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Campi Coperture -->
    <div v-else-if="qualeScheda === 'coperture'">
      <table class="form-table">
        <tbody>
        <tr>
          <th><label><b>Descrizione copertura in rapporto con l'edificio</b></label></th>
          <td><select v-model="stateModuloAnagraficaCoperture.descrizione_copertura_rapporti" class="float-dx">
            <option value=""></option>
            <option v-for="rapp in datiEnum.descrizione_copertura_rapporti" :key="rapp" :value="rapp">{{ rapp }}</option>
          </select></td>
        </tr>
        <tr>
          <th><label><b>Annotazioni</b></label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.descrizione_copertura_rapporti_annotazioni" style="height: 20px;"></textarea></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr>
          <th>
            <label><b>Estensione complessiva (mq)</b></label>
            <p style="font-size: smaller; font-weight: normal;"><i>Indicare l'estensione complessiva della superficie della copertura</i></p>
          </th>
          <td><input type="number" v-model="stateModuloAnagraficaCoperture.estensione_compl"></td>
        </tr>
        <tr>
          <th><label><b>L'estensione indicata è:</b></label></th>
          <td><select v-model="stateModuloAnagraficaCoperture.estensione_compl_comment" class="float-dx">
            <option value=""></option>
            <option v-for="est in datiEnum.estensione_compl_comment" :key="est" :value="est">{{ est }}</option>
          </select></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr>
          <th>
            <label><b>Descrizione generale della copertura</b></label>
            <p style="font-size: smaller; font-weight: normal;"><i>Descrivere in sintesi i caratteri salienti della copertura, con riferimento ai caratteri morfologici, all'eventuale articolazione in falde, alla presenza di sistemi composti</i></p>
          </th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.descrizione_copertura_gen" style="height: 20px;"></textarea></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr>
          <th>
            <label><b>Cronologia</b></label>
            <p style="font-size: smaller; font-weight: normal;"><i>Cenni sintetici a eventuali stratificazioni e/o trasformazioni del sistema di copertura, che ne abbiano per esempio modificato la concezione / lo schema strutturale</i></p>
          </th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.cronologia_cop" style="height: 20px;"></textarea></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr class="section-title-row">
          <td colspan="2"><b>MANTO</b></td>
        </tr>
        <tr>
          <th><label><b>Tipo di manto</b></label></th>
          <td><select v-model="stateModuloAnagraficaCoperture.tipo_manto" class="float-dx">
            <option value=""></option>
            <option v-for="mnt in datiEnum.tipo_manto" :key="mnt" :value="mnt">{{ mnt }}</option>
          </select></td>
        </tr>
        <tr>
          <th><label><b>Annotazioni</b></label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.tipo_manto_annotazioni" style="height: 20px;"></textarea></td>
        </tr>
        <tr v-if="stateModuloAnagraficaCoperture.tipo_manto" class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr v-if="stateModuloAnagraficaCoperture.tipo_manto == 'Lastre di pietra'">
          <th><label><i>Materiale</i></label></th>
          <td><select v-model="stateModuloAnagraficaCoperture.materiale_manto_pietra" class="float-dx">
            <option value=""></option>
            <option v-for="mat in datiEnum.materiale_manto_pietra" :key="mat" :value="mat">{{ mat }}</option>
          </select></td>
        </tr>
        <tr v-if="stateModuloAnagraficaCoperture.tipo_manto == 'Elementi di cotto/laterizio'">
          <th><label><i>Materiale</i></label></th>
          <td><select v-model="stateModuloAnagraficaCoperture.materiale_manto_later" class="float-dx">
            <option value=""></option>
            <option v-for="mat in datiEnum.materiale_manto_later" :key="mat" :value="mat">{{ mat }}</option>
          </select></td>
        </tr>
        <tr v-if="stateModuloAnagraficaCoperture.tipo_manto">
          <th><label><i>Annotazioni</i></label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.materiale_manto_annotazioni" style="height: 20px;"></textarea></td>
        </tr>
        <tr v-if="stateModuloAnagraficaCoperture.tipo_manto" class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr v-if="stateModuloAnagraficaCoperture.tipo_manto == 'Lastre di pietra'">
          <th><label><i>Tipo di elementi</i></label></th>
          <td><select v-model="stateModuloAnagraficaCoperture.tipo_elementi_manto_pietra" class="float-dx">
            <option value=""></option>
            <option v-for="tp in datiEnum.tipo_elementi_manto_pietra" :key="tp" :value="tp">{{ tp }}</option>
          </select></td>
        </tr>
        <tr v-if="stateModuloAnagraficaCoperture.tipo_manto == 'Elementi di cotto/laterizio'">
          <th><label><i>Tipo di elementi</i></label></th>
          <td><select v-model="stateModuloAnagraficaCoperture.tipo_elementi_manto_later" class="float-dx">
            <option value=""></option>
            <option v-for="tp in datiEnum.tipo_elementi_manto_later" :key="tp" :value="tp">{{ tp }}</option>
          </select></td>
        </tr>
        <tr v-if="stateModuloAnagraficaCoperture.tipo_manto">
          <th><label><i>Annotazioni</i></label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.tipo_elementi_manto_annotazioni" style="height: 20px;"></textarea></td>
        </tr>
        <tr v-if="stateModuloAnagraficaCoperture.tipo_manto" class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr v-if="stateModuloAnagraficaCoperture.tipo_manto == 'Lastre di pietra'">
          <th><label><i>Tecnica di esecuzione / sistema di posa</i></label></th>
          <td><select v-model="stateModuloAnagraficaCoperture.tecnica_esec_posa_manto_pietra" class="float-dx">
            <option value=""></option>
            <option v-for="tp in datiEnum.tecnica_esec_posa_manto_pietra" :key="tp" :value="tp">{{ tp }}</option>
          </select></td>
        </tr>
        <tr v-if="stateModuloAnagraficaCoperture.tipo_manto == 'Elementi di cotto/laterizio'">
          <th><label><i>Tecnica di esecuzione / sistema di posa</i></label></th>
          <td><select v-model="stateModuloAnagraficaCoperture.tecnica_esec_posa_manto_later" class="float-dx">
            <option value=""></option>
            <option v-for="tp in datiEnum.tecnica_esec_posa_manto_later" :key="tp" :value="tp">{{ tp }}</option>
          </select></td>
        </tr>
        <tr v-if="stateModuloAnagraficaCoperture.tipo_manto">
          <th><label><i>Annotazioni</i></label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.tecnica_esec_posa_manto_annotazioni" style="height: 20px;"></textarea></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr class="section-title-row">
          <td colspan="2"><b>ELEMENTI CONNOTANTI</b></td>
        </tr>
        <tr>
          <th><label>Colmo</label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.colmo_sist_descrizione" style="height: 20px;"></textarea></td>
        </tr>
        <tr>
          <th>
            <label><i>Terminologie locali / denominazione</i></label>
            <p style="font-size: smaller; font-weight: normal;"><i>Note per la compilazione: compilare nel caso di specifiche denominazioni locali in uso per indicare il tipo di lavorazione/posa che si è consolidato in modi risolutivi ricorrenti e concorrenti a caratterizzare l'immagine dei manufatti</i></p>
          </th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.colmo_sist_gloss" style="height: 20px;"></textarea></td>
        </tr>
        <tr>
          <th><label><i>Descrizione / annotazioni</i></label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.colmo_sist_annotazioni" style="height: 20px;"></textarea></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr>
          <th><label>Displuvi</label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.displuvi_sist_descrizione" style="height: 20px;"></textarea></td>
        </tr>
        <tr>
          <th>
            <label><i>Terminologie locali / denominazione</i></label>
            <p style="font-size: smaller; font-weight: normal;"><i>Note per la compilazione: compilare nel caso di specifiche denominazioni locali in uso per indicare il tipo di lavorazione/posa che si è consolidato in modi risolutivi ricorrenti e concorrenti a caratterizzare l'immagine dei manufatti</i></p>
          </th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.displuvi_sist_gloss" style="height: 20px;"></textarea></td>
        </tr>
        <tr>
          <th><label><i>Descrizione / annotazioni</i></label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.displuvi_sist_annotazioni" style="height: 20px;"></textarea></td>
        </tr>
        
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr>
          <th><label>Impluvi</label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.impluvi_sist_descrizione" style="height: 20px;"></textarea></td>
        </tr>
        <tr>
          <th><label><i>Terminologie locali / denominazione</i></label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.impluvi_sist_gloss" style="height: 20px;"></textarea></td>
        </tr>
        <tr>
          <th><label><i>Descrizione / annotazioni</i></label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.impluvi_sist_annotazioni" style="height: 20px;"></textarea></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr>
          <th><label>Corsi di gronda</label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.gronda_sist_descrizione" style="height: 20px;"></textarea></td>
        </tr>
        <tr>
          <th>
            <label><i>Terminologie locali / denominazione</i></label>
            <p style="font-size: smaller; font-weight: normal;"><i>Note per la compilazione: compilare nel caso di specifiche denominazioni locali in uso per indicare il tipo di lavorazione/posa che si è consolidato in modi risolutivi ricorrenti e concorrenti a caratterizzare l'immagine dei manufatti</i></p>
          </th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.gronda_sist_gloss" style="height: 20px;"></textarea></td>
        </tr>
        <tr>
          <th><label><i>Descrizione / annotazioni</i></label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.gronda_sist_annotazioni" style="height: 20px;"></textarea></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr>
          <th><label><b>Elementi e/o strati funzionali accessori</b></label></th>
          <td>
            <div v-for="strat in datiEnum.el_strati_funz_acc" :key="strat">
              <input :id="`el-funz-strat-cbx-${strat}`" :value="strat" v-model="stateModuloAnagraficaCoperture.el_strati_funz_acc" type="checkbox">
              <label :for="`el-funz-strat-cbx-${strat}`">{{ strat }}</label>
            </div>
          </td>
        </tr>
        <tr>
          <th><label for="el-aggiunto-cbx"><b>Elemento aggiunto</b></label></th>
          <td><input type="checkbox" id="el-aggiunto-cbx" v-model="stateModuloAnagraficaCoperture.el_strati_funz_acc_aggiunto"></td>
        </tr>
        <tr>
          <th>
            <label><i>Terminologie locali / denominazione</i></label>
            <p style="font-size: smaller; font-weight: normal;"><i>Note per la compilazione: compilare nel caso di specifiche denominazioni locali in uso per indicare il tipo di lavorazione/posa che si è consolidato in modi risolutivi ricorrenti e concorrenti a caratterizzare l'immagine dei manufatti</i></p>
          </th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.el_strati_funz_acc_gloss" style="height: 20px;"></textarea></td>
        </tr>
        <tr>
          <th><label><i>Descrizione / annotazioni</i></label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.el_strati_funz_acc_annotazioni" style="height: 20px;"></textarea></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr class="section-title-row">
          <td colspan="2"><b>ORDITURA LIGNEA</b></td>
        </tr>
        <tr>
          <th><label><b>Materiale</b></label></th>
          <td><select v-model="stateModuloAnagraficaCoperture.materiale_cop_str" class="float-dx">
            <option value=""></option>
            <option v-for="mat in datiEnum.materiale_cop_str" :key="mat" :value="mat">{{ mat }}</option>
          </select></td>
        </tr>
        <tr>
          <th><label><i>Annotazioni</i></label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.materiale_cop_strutt_annotazioni" style="height: 20px;"></textarea></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr>
          <th><label>Stuttura portante (grossa orditura)</label></th>
          <!-- <td><textarea v-model="stateModuloAnagraficaCoperture.grossa_orditura_el" style="height: 20px;"></textarea></td> -->
          <td>
            <div v-for="el in datiEnum.grossa_orditura_el" :key="el.id">
              <input :id="`grossa-orditura-el-cbx-${el.id}`" :value="el.sigla" v-model="stateModuloAnagraficaCoperture.grossa_orditura_el" type="checkbox">
              <label :for="`grossa-orditura-el-cbx-${el.id}`">{{ el.nome }}</label>
            </div>
          </td>
        </tr>
        <tr>
          <th><label><i>Annotazioni</i></label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.grossa_orditura_annotazioni" style="height: 20px;"></textarea></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr>
          <th><label>Stuttura secondaria (media orditura)</label></th>
          <!-- <td><textarea v-model="stateModuloAnagraficaCoperture.media_orditura_el" style="height: 20px;"></textarea></td> -->
          <td>
            <div v-for="el in datiEnum.media_orditura_el" :key="el.id">
              <input :id="`media-orditura-el-cbx-${el.id}`" :value="el.sigla" v-model="stateModuloAnagraficaCoperture.media_orditura_el" type="checkbox">
              <label :for="`media-orditura-el-cbx-${el.id}`">{{ el.nome }}</label>
            </div>
          </td>
        </tr>
        <tr>
          <th><label><i>Annotazioni</i></label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.media_orditura_annotazioni" style="height: 20px;"></textarea></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr>
          <th><label>Piccola orditura di supporto al manto</label></th>
          <!-- <td><textarea v-model="stateModuloAnagraficaCoperture.piccola_orditura_el" style="height: 20px;"></textarea></td> -->
          <td>
            <div v-for="el in datiEnum.piccola_orditura_el" :key="el.id">
              <input :id="`piccola-orditura-el-cbx-${el.id}`" :value="el.sigla" v-model="stateModuloAnagraficaCoperture.piccola_orditura_el" type="checkbox">
              <label :for="`piccola-orditura-el-cbx-${el.id}`">{{ el.nome }}</label>
            </div>
          </td>
        </tr>
        <tr>
          <th><label><i>Annotazioni</i></label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.piccola_orditura_annotazioni" style="height: 20px;"></textarea></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr>
          <th><label>Elementi specifici delle giunzioni</label></th>
          <!-- <td><textarea v-model="stateModuloAnagraficaCoperture.el_giunzioni" style="height: 20px;"></textarea></td> -->
          <td>
            <div v-for="el in datiEnum.el_giunzioni" :key="el.id">
              <input :id="`el-giunzioni-cbx-${el.id}`" :value="el.sigla" v-model="stateModuloAnagraficaCoperture.el_giunzioni" type="checkbox">
              <label :for="`el-giunzioni-cbx-${el.id}`">{{ el.nome }}</label>
            </div>
          </td>
        </tr>
        <tr>
          <th><label><i>Annotazioni</i></label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.el_giunzioni_annotazioni" style="height: 20px;"></textarea></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr class="section-title-row">
          <td colspan="2"><b>DOCUMENTAZIONE GENERALE</b></td>
        </tr>
        <tr>
          <th><label><b>Epoca</b></label></th>
          <td><input v-model="stateModuloAnagraficaCoperture.epoca"></td>
        </tr>
        <tr>
          <th><label><b>Fonti</b></label></th>
          <td><input v-model="stateModuloAnagraficaCoperture.fonti"></td>
        </tr>
        <tr>
          <th><label><b>Autore</b></label></th>
          <td><input v-model="stateModuloAnagraficaCoperture.autore"></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr>
          <th>
            <label for="coperture-access-cbx"><b>Accessibilità</b></label>
            <p style="font-size: smaller; font-weight: normal;"><i>I beni si considerano accessibili se ad altezza uomo o raggiungibili con l'ausilio di piccoli trabattelli o scale</i></p>
          </th>
          <td><input type="checkbox" id="coperture-access-cbx" v-model="stateModuloAnagraficaCoperture.accessibilità"></td>
        </tr>
        <tr>
          <th><label><i>Annotazioni</i></label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.accessibilità_annotazioni" style="height: 20px;"></textarea></td>
        </tr>
        <tr>
          <th>
            <label for="coperture-ispez-cbx"><b>Ispezionabilità</b></label>
            <p style="font-size: smaller; font-weight: normal;"><i>Ispezionabilità del sottotetto</i></p>
          </th>
          <td><input type="checkbox" id="coperture-ispez-cbx" v-model="stateModuloAnagraficaCoperture.ispezionabilità_sottotetto"></td>
        </tr>
        <tr>
          <th><label><i>Annotazioni</i></label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.ispezionabilità_sottotetto_annotazioni" style="height: 20px;"></textarea></td>
        </tr>
        <tr class="divider-row">
          <td colspan="2"><hr /></td>
        </tr>
        <tr>
          <th><label><b>Note</b></label></th>
          <td><textarea v-model="stateModuloAnagraficaCoperture.note" style="height: 20px;"></textarea></td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Campi Default -->
    <div v-else>
      <SchemaForm
        :fields="anagraficaSimpleFields"
        :model="stateModuloAnagrafica"
        @update-field="setAnagraficaSimpleField"
      />
    </div>

    <!-- DOCUMENTI -->
    <!-- (capire switch tra file input e risultato query scheda esistente) -->
    <div class="div-docs">
      <table class="form-table">
        <tbody>
        <tr>
          <th><label><b>Documenti</b></label></th>
          <td>
            <div v-if="stateDocumenti.docs?.length > 0">
              <p><b>Documenti esistenti:</b></p>
              <p v-for="doc in stateDocumenti.docs" :key="doc">{{ doc.split("/").pop() }}</p>
            </div>
            <div class="div-doc-vfor" v-for="(file_item, index) in files" :key="index">
              <label class="label-doc"><b>Documento {{ index+1 }}</b></label>
              <input :ref="el => fileInputs[index] = el" type="file" accept="*/*" @change="gestisciFileUpload($event, index)" style="display: none;">
              <button v-if="files.length > 1" class="x" type="button" @click="rimuoviFile(index)">x</button>
              <button class="scegli-file-btn" @click="scegliFile(index)">Scegli file</button>
              <span v-if="file_item.name">{{ file_item.name }}</span>
            </div>
            <button type="button" class="x" @click="aggiungiFile">+</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</div>
</template>

<script setup>
import { inject, computed, ref, onMounted, reactive, watch } from 'vue';
import {dataCorta, dataInteger, trattaStringArray, filtraOpzioniLivelli} from '../js/shared';
import {compilaScheda, leggiEnumServizio, leggiVistaDB} from '../js/richieste';
import {ANAGRAFICA_DEFAULT_FIELDS, ANAGRAFICA_DETTAGLIO_FIELDS, ANAGRAFICA_MANUFATTO_FIELDS, isSchemaEmpty, resetSchemaState} from '../js/formSchemas';
import BtnBIM from './elementi/BottoneBIMExplorer.vue';
import LoadingScreen from './elementi/LoadingScreen.vue';
import SchemaForm from './elementi/SchemaForm.vue';

defineExpose({
  chiudiScheda,
  resetState,
});

const store = inject('store');
const store_globale = inject('store_globale');
const state_globale = store_globale.state_globale;
const stateAnagrafica = inject('stateAnagrafica');
const stateGalleria = inject('stateGalleria');
const stateModuloAnagrafica = inject('stateModuloAnagrafica');
const stateModuloAnagraficaStatua = inject('stateModuloAnagraficaStatua');
const stateModuloAnagraficaCoperture = inject('stateModuloAnagraficaCoperture');
const stateDocumenti = inject('stateDocumenti');
const stateArtifact = inject('stateArtifact');
const loadingDati = ref(false);
const datiEnum = reactive({
  // statua
  materiale_statua: [],
  materiale_armatura: [],
  materiale_supporto: [],
  elementi_accessori_monili: [],
  materiale_elementi_accessori_monili: [],
  materiale_ancoraggio_parete: [],
  materiale_ancoraggio_pavimento: [],
  materiale_ancoraggio_soffitto: [],
  pellicola_pittorica_tecnica_e_mat: {},
  // copertura
  descrizione_copertura_rapporti: [],
  estensione_compl_comment: [],
  tipo_manto: [],
  materiale_manto_pietra: [],
  materiale_manto_later: [],
  tipo_elementi_manto_pietra: [],
  tipo_elementi_manto_later: [],
  tecnica_esec_posa_manto_pietra: [],
  tecnica_esec_posa_manto_later: [],
  el_strati_funz_acc: [],
  materiale_cop_str: [],
  grossa_orditura_el: [],
  media_orditura_el: [],
  piccola_orditura_el: [],
  el_giunzioni: [],
});

const files = reactive([
  {file: null, name: ""}
]);

const fileInputs = reactive([null]); // refs per <input type="file">

watch(() => stateModuloAnagraficaStatua.materiale_supporto, () => {
  Object.keys(stateModuloAnagraficaStatua.pellicola_pittorica_tecnica_e_mat).forEach(k => {
    stateModuloAnagraficaStatua.pellicola_pittorica_tecnica_e_mat[k] = null;
  });
});

watch(() => stateModuloAnagraficaStatua.elementi_accessori_monili, () => {
  stateModuloAnagraficaStatua.materiale_elementi_accessori_monili = [];
}, {
  deep: true
});

const schedaVuota = computed(() => isSchemaEmpty(anagraficaSimpleFields.value, stateModuloAnagrafica));

const schedaVuotaStatua = computed(() => {
  return !(
    stateModuloAnagraficaStatua.descrizione_statua || stateModuloAnagraficaStatua.codici_altro
    || stateModuloAnagraficaStatua.tecnica_esecuzione || stateModuloAnagraficaStatua.dimensioni
    || stateModuloAnagraficaStatua.materiale_statua || stateModuloAnagraficaStatua.materiale_annotazioni
    || stateModuloAnagraficaStatua.materiali_armatura || stateModuloAnagraficaStatua.materiale_supporto
    || stateModuloAnagraficaStatua.lamina_metallica
    || stateModuloAnagraficaStatua.pellicola_pittorica_tecnica_e_mat || stateModuloAnagraficaStatua.strato_di_preparazione
    || stateModuloAnagraficaStatua.elementi_accessori_monili || stateModuloAnagraficaStatua.materiale_elementi_accessori_monili
    || stateModuloAnagraficaStatua.elementi_accessori_monili_annotazioni
    || stateModuloAnagraficaStatua.elementi_di_ancoraggio_a_parete || stateModuloAnagraficaStatua.materiale_ancoraggio_parete
    || stateModuloAnagraficaStatua.ancoraggio_parete_annotazioni
    || stateModuloAnagraficaStatua.elementi_di_ancoraggio_a_pavimento || stateModuloAnagraficaStatua.materiale_ancoraggio_pavimento
    || stateModuloAnagraficaStatua.ancoraggio_pavimento_annotazioni
    || stateModuloAnagraficaStatua.epoca || stateModuloAnagraficaStatua.fonti
    || stateModuloAnagraficaStatua.definizione || stateModuloAnagraficaStatua.autore
    || stateModuloAnagraficaStatua.accessibilità || stateModuloAnagraficaStatua.note
  );
});

const schedaVuotaCoperture = computed(() => {
  return !(
    stateModuloAnagraficaCoperture.descrizione_copertura_rapporti || stateModuloAnagraficaCoperture.descrizione_copertura_rapporti_annotazioni
    || stateModuloAnagraficaCoperture.estensione_compl || stateModuloAnagraficaCoperture.estensione_compl_comment
    || stateModuloAnagraficaCoperture.descrizione_copertura_gen || stateModuloAnagraficaCoperture.cronologia_cop
    || stateModuloAnagraficaCoperture.tipo_manto || stateModuloAnagraficaCoperture.tipo_manto_annotazioni
    || stateModuloAnagraficaCoperture.materiale_manto_pietra || stateModuloAnagraficaCoperture.materiale_manto_later
    || stateModuloAnagraficaCoperture.materiale_manto_annotazioni
    || stateModuloAnagraficaCoperture.tipo_elementi_manto_pietra || stateModuloAnagraficaCoperture.tipo_elementi_manto_later
    || stateModuloAnagraficaCoperture.tipo_elementi_manto_annotazioni
    || stateModuloAnagraficaCoperture.tecnica_esec_posa_manto_pietra || stateModuloAnagraficaCoperture.tecnica_esec_posa_manto_later
    || stateModuloAnagraficaCoperture.tecnica_esec_posa_manto_annotazioni
    || stateModuloAnagraficaCoperture.colmo_sist_descrizione || stateModuloAnagraficaCoperture.colmo_sist_gloss
    || stateModuloAnagraficaCoperture.colmo_sist_annotazioni
    || stateModuloAnagraficaCoperture.displuvi_sist_descrizione || stateModuloAnagraficaCoperture.displuvi_sist_gloss
    || stateModuloAnagraficaCoperture.displuvi_sist_annotazioni
    || stateModuloAnagraficaCoperture.gronda_sist_descrizione || stateModuloAnagraficaCoperture.gronda_sist_gloss
    || stateModuloAnagraficaCoperture.gronda_sist_annotazioni
    || stateModuloAnagraficaCoperture.el_strati_funz_acc || stateModuloAnagraficaCoperture.el_strati_funz_acc_gloss
    || stateModuloAnagraficaCoperture.el_strati_funz_acc_annotazioni || stateModuloAnagraficaCoperture.el_strati_funz_acc_aggiunto
    || stateModuloAnagraficaCoperture.materiale_cop_str || stateModuloAnagraficaCoperture.materiale_cop_strutt_annotazioni
    || stateModuloAnagraficaCoperture.grossa_orditura_el || stateModuloAnagraficaCoperture.grossa_orditura_annotazioni
    || stateModuloAnagraficaCoperture.media_orditura_el || stateModuloAnagraficaCoperture.media_orditura_annotazioni
    || stateModuloAnagraficaCoperture.piccola_orditura_el || stateModuloAnagraficaCoperture.piccola_orditura_annotazioni
    || stateModuloAnagraficaCoperture.el_giunzioni || stateModuloAnagraficaCoperture.el_giunzioni_annotazioni
    || stateModuloAnagraficaCoperture.epoca || stateModuloAnagraficaCoperture.fonti || stateModuloAnagraficaCoperture.autore
    || stateModuloAnagraficaCoperture.accessibilità || stateModuloAnagraficaCoperture.accessibilità_annotazioni
    || stateModuloAnagraficaCoperture.ispezionabilità_sottotetto || stateModuloAnagraficaCoperture.ispezionabilità_sottotetto_annotazioni
    || stateModuloAnagraficaCoperture.note
  );
});

const qualeScheda = computed(() => {
  let scheda;
  switch (stateArtifact.selectElemento) {
    case 'manufatto':
      scheda = 'manufatto';
      break;

    case 'dettaglio':
      scheda = 'dettaglio';
      break;

    case 'statua':
      scheda = 'statua';
      break;

    case 'elementi':
      scheda = 'coperture';
      break;

    default:
      scheda = 'altro';
      break;
  }
  return scheda;
});

const isSchedaAnagraficaSemplice = computed(() => ['manufatto', 'dettaglio', 'altro'].includes(qualeScheda.value));

const anagraficaSimpleFields = computed(() => {
  switch (qualeScheda.value) {
    case 'manufatto':
      return ANAGRAFICA_MANUFATTO_FIELDS;
    case 'dettaglio':
      return ANAGRAFICA_DETTAGLIO_FIELDS;
    default:
      return ANAGRAFICA_DEFAULT_FIELDS;
  }
});

onMounted(async () => {
  loadingDati.value = true;
  // statua
  const lsMatStat = await leggiEnumServizio('stat_mat'); // materiale statua
  const lsMatArm = await leggiEnumServizio('stat_arm_mat'); // materiale armatura
  const lsMatSupp = await leggiEnumServizio('stat_supp_mat'); // materiale supporto
  const lsElAccMonl = await leggiEnumServizio('stat_el_acc_monil'); // elementi accessori monili
  const lsMatElAccMonl = await leggiEnumServizio('stat_el_acc_monil_mat'); // materiale elementi accessori monili
  const lsMatAncPar = await leggiEnumServizio('stat_anc_par_mat'); // materiale ancoraggio parete
  const lsMatAncPav = await leggiEnumServizio('stat_anc_pav_mat'); // materiale ancoraggio pavimento
  const lsMatAncSoff = await leggiEnumServizio('stat_anc_sof_mat');
  const lsMatPellStat = await leggiVistaDB('vw_stat_pell_pitt_valori', true); // type composito pellicola pittorica statua
  // copertura
  const lsDescCopRap = await leggiEnumServizio('cop_rapporti'); // descrizione copertura rapporti
  const lsEstCopComm = await leggiEnumServizio('cop_estens_comment'); // commento estensione copertura
  const lsTipoManto = await leggiEnumServizio('cop_manto_tipo'); // tipo manto
  const lsMatMantoPietra = await leggiEnumServizio('cop_manto_mat_pietra'); // materiale manto pietra
  const lsMatMantoLater = await leggiEnumServizio('cop_manto_mat_later'); // materiale manto laterizio
  const lsTipoElMantoPietra = await leggiEnumServizio('cop_manto_pietra_el'); // tipo elementi manto pietra
  const lsTipoElMantoLater = await leggiEnumServizio('cop_manto_later_el'); // tipo elementi manto laterizio
  const lsTecnEsecMantoPietra = await leggiEnumServizio('cop_manto_pietra_tecnica'); // tecnica esecuzione manto pietra
  const lsTecnEsecMantoLater = await leggiEnumServizio('cop_manto_later_tecnica'); // tecnica esecuzione manto laterizio
  const lsStratiFunzAcc = await leggiEnumServizio('cop_strati_funz_acc'); // strati funzionali accessori
  const lsMatCopStr = await leggiEnumServizio('cop_str_legno_mat'); // materiale struttura copertura

  // statua
  datiEnum.materiale_statua = lsMatStat.map(type => type.unnest);
  datiEnum.materiale_armatura = lsMatArm.map(type => type.unnest);
  datiEnum.materiale_supporto = lsMatSupp.map(type => type.unnest);
  datiEnum.elementi_accessori_monili = lsElAccMonl.map(type => type.unnest);
  datiEnum.materiale_elementi_accessori_monili = lsMatElAccMonl.map(type => type.unnest);
  datiEnum.materiale_ancoraggio_parete = lsMatAncPar.map(type => type.unnest);
  datiEnum.materiale_ancoraggio_pavimento = lsMatAncPav.map(type => type.unnest);
  if (lsMatAncSoff) {
    datiEnum.materiale_ancoraggio_soffitto = lsMatAncSoff.map(type => type.unnest);
  }
  lsMatPellStat.forEach(type => {
    // array string -> array object
    if (type.valori
      && typeof type.valori === 'string'
      && type.valori.startsWith('{')
      && type.valori.endsWith('}')
    ) {
      type.valori = trattaStringArray(type.valori);
    }
    // array di oggetti -> oggetto con array
    datiEnum.pellicola_pittorica_tecnica_e_mat[type.tecnica] = type.valori;
  });
  // copertura
  datiEnum.descrizione_copertura_rapporti = lsDescCopRap.map(type => type.unnest);
  datiEnum.estensione_compl_comment = lsEstCopComm.map(type => type.unnest);
  datiEnum.tipo_manto = lsTipoManto.map(type => type.unnest);
  datiEnum.materiale_manto_pietra = lsMatMantoPietra.map(type => type.unnest);
  datiEnum.materiale_manto_later = lsMatMantoLater.map(type => type.unnest);
  datiEnum.tipo_elementi_manto_pietra = lsTipoElMantoPietra.map(type => type.unnest);
  datiEnum.tipo_elementi_manto_later = lsTipoElMantoLater.map(type => type.unnest);
  datiEnum.tecnica_esec_posa_manto_pietra = lsTecnEsecMantoPietra.map(type => type.unnest);
  datiEnum.tecnica_esec_posa_manto_later = lsTecnEsecMantoLater.map(type => type.unnest);
  datiEnum.el_strati_funz_acc = lsStratiFunzAcc.map(type => type.unnest);
  datiEnum.materiale_cop_str = lsMatCopStr.map(type => type.unnest);
  const liv2str = filtraOpzioniLivelli(state_globale.gerarchia_classi_elementi, "strutture", "livello_2");
  const liv2cop = filtraOpzioniLivelli(state_globale.gerarchia_classi_elementi, "coperture", "livello_2");
  const liv3str_incl = filtraOpzioniLivelli(liv2str, "str_inclinate", "livello_3");
  const liv3mant = filtraOpzioniLivelli(liv2cop, "manto", "livello_3");
  const liv4grossa_ord = filtraOpzioniLivelli(liv3str_incl, "grossa_orditura", "livello_4");
  const liv4media_ord = filtraOpzioniLivelli(liv3str_incl, "media_orditura", "livello_4");
  const liv4piccola_ord = filtraOpzioniLivelli(liv3mant, "piccola_ordit", "livello_4");
  const liv4el_giunz = filtraOpzioniLivelli(liv3str_incl, "giunzioni", "livello_4");
  datiEnum.grossa_orditura_el = liv4grossa_ord;
  datiEnum.media_orditura_el = liv4media_ord;
  datiEnum.piccola_orditura_el = liv4piccola_ord;
  datiEnum.el_giunzioni = liv4el_giunz;

  console.log("da datiEnum:\n", datiEnum);
  loadingDati.value = false;
});

async function salvaScheda() {
  console.log('salva scheda');
  if (stateGalleria.idImgSelezionate) {
    if (
      isSchedaAnagraficaSemplice.value && schedaVuota.value
      || qualeScheda.value == 'statua' && schedaVuotaStatua.value
      || qualeScheda.value == 'coperture' && schedaVuotaCoperture.value
    ) {
      store.methods.setAlert('Non è possibile salvare una scheda vuota');
      return;
    }
    impostaMetadati();
    let jsonReq;
    let qualeState;
    if (isSchedaAnagraficaSemplice.value) qualeState = stateModuloAnagrafica;
    else if (qualeScheda.value === 'statua') qualeState = stateModuloAnagraficaStatua;
    else if (qualeScheda.value === 'coperture') qualeState = stateModuloAnagraficaCoperture;

    if (files && files.length > 0) {
      files.forEach(fl => {
        if (fl.file) {
          qualeState.docs.push(`${qualeState.id_anagr}/${fl.name}`);
        }
      });
    }

    jsonReq = impostaOggetti(Object.entries(qualeState), stateGalleria.idImgSelezionate);

    const fd = new FormData();
    // append FILES a fd
    files.forEach((fileItem, idx) => {
      if (fileItem.file) {
        fd.append(`file_${idx}`, fileItem.file, fileItem.name);
      }
    });
    // append JSONREQ a fd
    fd.append('dati', JSON.stringify(jsonReq));

    const resp = await compilaScheda(fd);
    if (resp.success) {
      store.methods.setAlert('Operazione andata a buon fine');
      chiudiScheda();
    }
    else {
      store.methods.setAlert('Operazione non riuscita');
    }
  }
  else {
    store.methods.setAlert('Nessun ID associato alla scheda. Selezionare un elemento e riprovare.');
    chiudiScheda();
  }
}

function chiudiScheda() {
  stateAnagrafica.moduloAnagraficaVisibile = false;
  resetState();
}

function resetState() { // QUESTA MAGARI SI PUÒ SPOSTARE SU TABCOLLECTION
  switch (qualeScheda.value) {
    case 'statua':
      stateModuloAnagraficaStatua.nome_statua = '';
      stateModuloAnagraficaStatua.codice_statua = '';
      stateModuloAnagraficaStatua.codici_altro = '';
      stateModuloAnagraficaStatua.descrizione_statua = '';
      stateModuloAnagraficaStatua.tecnica_esecuzione = '';
      stateModuloAnagraficaStatua.dimensioni = '';
      stateModuloAnagraficaStatua.materiale_statua = '', // enum
      stateModuloAnagraficaStatua.materiale_annotazioni = '';
      stateModuloAnagraficaStatua.materiali_armatura = []; // enum[]
      stateModuloAnagraficaStatua.materiale_supporto = ''; // enum
      stateModuloAnagraficaStatua.lamina_metallica = false; // bool
      stateModuloAnagraficaStatua.pellicola_pittorica_tecnica_e_mat = {
        su_legno: '',
        su_gesso: '',
        su_terracotta: '',
        altro: '',
      };
      stateModuloAnagraficaStatua.strato_di_preparazione = '';
      stateModuloAnagraficaStatua.elementi_accessori_monili = []; // enum[]
      stateModuloAnagraficaStatua.materiale_elementi_accessori_monili = []; // enum[]
      stateModuloAnagraficaStatua.elementi_accessori_monili_annotazioni = '';
      stateModuloAnagraficaStatua.elementi_di_ancoraggio_a_parete = false; // bool
      stateModuloAnagraficaStatua.materiale_ancoraggio_parete = ''; // enum
      stateModuloAnagraficaStatua.ancoraggio_parete_annotazioni = '';
      stateModuloAnagraficaStatua.elementi_di_ancoraggio_a_pavimento = false; // bool
      stateModuloAnagraficaStatua.materiale_ancoraggio_pavimento = ''; // enum
      stateModuloAnagraficaStatua.ancoraggio_pavimento_annotazioni = '';
      stateModuloAnagraficaStatua.elementi_di_ancoraggio_a_soffitto = false;
      stateModuloAnagraficaStatua.materiale_ancoraggio_soffitto = '';
      stateModuloAnagraficaStatua.ancoraggio_soffitto_annotazioni = '';
      stateModuloAnagraficaStatua.epoca = '';
      stateModuloAnagraficaStatua.fonti = '';
      stateModuloAnagraficaStatua.autore = '';
      stateModuloAnagraficaStatua.accessibilità = false; // bool
      stateModuloAnagraficaStatua.note = '';
      stateModuloAnagraficaStatua.id_anagr = null;
      stateModuloAnagraficaStatua.data_registrazione = null;
      stateModuloAnagraficaStatua.data_ultima_mod = null;
      stateModuloAnagraficaStatua.autore_scheda = null;
      stateModuloAnagraficaStatua.autore_ultima_mod = null;
      break;

    case 'coperture':
      stateModuloAnagraficaCoperture.codice = '';
      stateModuloAnagraficaCoperture.descrizione_copertura_rapporti = ''; // enum
      stateModuloAnagraficaCoperture.descrizione_copertura_rapporti_annotazioni = '';
      stateModuloAnagraficaCoperture.estensione_compl = null; // double
      stateModuloAnagraficaCoperture.estensione_compl_comment = ''; // enum
      stateModuloAnagraficaCoperture.descrizione_copertura_gen = '';
      stateModuloAnagraficaCoperture.cronologia_cop = '';
      stateModuloAnagraficaCoperture.tipo_manto = ''; // enum
      stateModuloAnagraficaCoperture.tipo_manto_annotazioni = '';
      stateModuloAnagraficaCoperture.materiale_manto_pietra = ''; // enum
      stateModuloAnagraficaCoperture.materiale_manto_later = ''; // enum
      stateModuloAnagraficaCoperture.materiale_manto_annotazioni = '';
      stateModuloAnagraficaCoperture.tipo_elementi_manto_pietra = ''; // enum
      stateModuloAnagraficaCoperture.tipo_elementi_manto_later = ''; // enum
      stateModuloAnagraficaCoperture.tipo_elementi_manto_annotazioni = '';
      stateModuloAnagraficaCoperture.tecnica_esec_posa_manto_pietra = ''; // enum
      stateModuloAnagraficaCoperture.tecnica_esec_posa_manto_later = ''; // enum
      stateModuloAnagraficaCoperture.tecnica_esec_posa_manto_annotazioni = '';
      stateModuloAnagraficaCoperture.colmo_sist_descrizione = '';
      stateModuloAnagraficaCoperture.colmo_sist_gloss = '';
      stateModuloAnagraficaCoperture.colmo_sist_annotazioni = '';
      stateModuloAnagraficaCoperture.displuvi_sist_descrizione = '';
      stateModuloAnagraficaCoperture.displuvi_sist_gloss = '';
      stateModuloAnagraficaCoperture.displuvi_sist_annotazioni = '';
      stateModuloAnagraficaCoperture.impluvi_sist_descrizione = '';
      stateModuloAnagraficaCoperture.impluvi_sist_gloss = '';
      stateModuloAnagraficaCoperture.impluvi_sist_annotazioni = '';
      stateModuloAnagraficaCoperture.gronda_sist_descrizione = '';
      stateModuloAnagraficaCoperture.gronda_sist_gloss = '';
      stateModuloAnagraficaCoperture.gronda_sist_annotazioni = '';
      stateModuloAnagraficaCoperture.el_strati_funz_acc = []; // enum[]
      stateModuloAnagraficaCoperture.el_strati_funz_acc_gloss = '';
      stateModuloAnagraficaCoperture.el_strati_funz_acc_annotazioni = '';
      stateModuloAnagraficaCoperture.el_strati_funz_acc_aggiunto = false; // bool
      stateModuloAnagraficaCoperture.materiale_cop_str = ''; // enum
      stateModuloAnagraficaCoperture.materiale_cop_strutt_annotazioni = '';
      stateModuloAnagraficaCoperture.grossa_orditura_el = []; // liv4_strutt[]
      stateModuloAnagraficaCoperture.grossa_orditura_annotazioni = '';
      stateModuloAnagraficaCoperture.media_orditura_el = []; // liv4_strutt[]
      stateModuloAnagraficaCoperture.media_orditura_annotazioni = '';
      stateModuloAnagraficaCoperture.piccola_orditura_el = []; // liv4_cop[]
      stateModuloAnagraficaCoperture.piccola_orditura_annotazioni = '';
      stateModuloAnagraficaCoperture.el_giunzioni = []; // liv4_strutt[]
      stateModuloAnagraficaCoperture.el_giunzioni_annotazioni = '';
      stateModuloAnagraficaCoperture.epoca = '';
      stateModuloAnagraficaCoperture.fonti = '';
      stateModuloAnagraficaCoperture.autore = '';
      stateModuloAnagraficaCoperture.accessibilità = false; // bool
      stateModuloAnagraficaCoperture.accessibilità_annotazioni = '';
      stateModuloAnagraficaCoperture.ispezionabilità_sottotetto = false; // bool
      stateModuloAnagraficaCoperture.ispezionabilità_sottotetto_annotazioni = '';
      stateModuloAnagraficaCoperture.note = '';
      stateModuloAnagraficaCoperture.id_anagr = null;
      stateModuloAnagraficaCoperture.data_registrazione = null;
      stateModuloAnagraficaCoperture.data_ultima_mod = null;
      stateModuloAnagraficaCoperture.autore_scheda = null;
      stateModuloAnagraficaCoperture.autore_ultima_mod = null;
      break;

    case 'manufatto':
    case 'dettaglio':
    case 'altro':
      [ANAGRAFICA_MANUFATTO_FIELDS, ANAGRAFICA_DETTAGLIO_FIELDS, ANAGRAFICA_DEFAULT_FIELDS]
        .forEach(schema => resetSchemaState(schema, stateModuloAnagrafica));
      stateModuloAnagrafica.docs = [];
      stateModuloAnagrafica.id_anagr = null;
      stateModuloAnagrafica.data_registrazione = null;
      stateModuloAnagrafica.data_ultima_mod = null;
      stateModuloAnagrafica.autore_scheda = null;
      stateModuloAnagrafica.autore_ultima_mod = null;
      break;

    default:
      break;
  }

  // reset state documenti
  stateDocumenti.docs = [];
  // reset lista file
  files.splice(0, files.length, {file: null, name: ""});
  fileInputs.splice(0, fileInputs.length, null);
}

function impostaMetadati() {
  let modulo;
  switch (qualeScheda.value) {
    case 'statua':
      modulo = stateModuloAnagraficaStatua;
      break;

    case 'coperture':
      modulo = stateModuloAnagraficaCoperture;
      break;

    case 'manufatto':
    case 'dettaglio':
    case 'altro':
      modulo = stateModuloAnagrafica;
      break;

    default:
      return;
  }

  modulo.id_anagr = dataInteger();
  modulo.data_registrazione = dataCorta();
  modulo.data_ultima_mod = dataCorta();
  modulo.autore_scheda = store.state.userSettings.user_id;
  modulo.autore_ultima_mod = store.state.userSettings.user_id;
}

function impostaOggetti(stateArray, idMain10ance) {
  const listaOgg = [];
  idMain10ance.forEach((id, ind) => {
    const ogg = {
      tabella: nomeTabellaAnagrafica(stateArtifact.selectElemento),
      colonne: [],
      valori: [],
    };
    stateArray.forEach(stateVal => {
      console.log(stateVal);
      if (stateVal[1]) {
        ogg.colonne.push(stateVal[0]);
        ogg.valori.push(stateVal[1]);
      }
    });
    ogg.valori[ogg.colonne.indexOf('id_anagr')] += ind; // incrementa id per assicurare unicità in caso di più oggetti insieme
    ogg.colonne.push('id_main10ance');
    ogg.valori.push(id);
    listaOgg.push(ogg);
  });

  return listaOgg;
}

function nomeTabellaAnagrafica(entitàSelez) {
  let nomeTabella;
  switch (entitàSelez) {
    case 'manufatto':
      nomeTabella = 'anagrafica_manufatto';
      break;

    case 'dettaglio':
      nomeTabella = 'anagrafica_dettaglio';
      break;

    case 'statua':
      nomeTabella = 'scheda_anagrafica_statua';
      break;

    case 'elementi':
      nomeTabella = 'scheda_anagrafica_copertura';
      break;

    default:
      nomeTabella = 'scheda_anagrafica';
      break;
  }
  console.log(nomeTabella);
  return nomeTabella;
}

function scegliFile(ind) {
  fileInputs[ind]?.click(); // per aprire selettore file nascosto
}

function gestisciFileUpload(evt, ind) {
  const file = evt.target.files[0];

  if (file) {
    files[ind].file = file;
    files[ind].name = file.name;
  } else {
    files[ind].file = null;
    files[ind].name = "";
  }
}

function aggiungiFile() {
  files.push({file: null, name: ""});
}

function rimuoviFile(ind) {
  files.splice(ind, 1);
  fileInputs.splice(ind, 1);
}

function setAnagraficaSimpleField(key, value) {
  stateModuloAnagrafica[key] = value;
}
</script>

<style scoped>
textarea {
  resize: vertical;
}

input, textarea {
  float: right;
  line-height: 100%;
  padding: 1px;
  border: 0;
}

select, textarea, input:not([type=checkbox]) {
  width: 100%;
}

.scheda-anagrafica {
  background-color: var(--bluInterregTrasparenza);
  font-size: 13px;
  padding: 30px 14px;
}
.float-dx {
  float: right;
}
.user-field {
  line-height: 100%;
  padding: 0px;
  text-align: right;
}

.form-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px; /* aggiunge spazio fra righe, se voluto */
}

.form-table .section-title-row td {
  padding: 5px 0;
  text-align: center;
  vertical-align: middle;
}

.form-table .divider-row hr {
  border: none;
  border-top: 1px solid #808080;
  padding: 5px 0;
  width: 60%;
  margin: 0 auto;
}

.form-table .spacer-row td {
  height: 8px;
  padding: 0;
}

.form-table th {
  text-align: left;
  width: 50%;
  vertical-align: top;
  padding-right: 10px;
  background-color: unset;
}

.form-table td {
  width: 50%;
  vertical-align: top;
}

.div-titolo-bottoni {
  position: relative;
}
.div-bottoni {
  position: absolute;
  bottom: -1rem;
  right: 0;
}
.div-docs {
  margin: 5px 0;
}
.div-doc-vfor {
  margin: 20px 0;
}
.label-doc {
  margin-right: 20px;
}
.scegli-file-btn {
  margin-right: 5px;
}
button.x {
  width: 25px;
  height: 25px;
  margin: 5px;
  font-weight: bold;
  font-size: large;
  border: none;
  align-content: center;
  justify-content: center;
  color: #fff;
  background-color: var(--bluInterreg);
  float: right;
}
button.x:hover {
  background-color: var(--bluInterregTrasparenza);
}
</style>

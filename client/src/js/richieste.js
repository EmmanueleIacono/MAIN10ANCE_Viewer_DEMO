export async function prendiLOD(lod) {
    const risultato = await fetch('/t/DB_Servizio/LOD/TabelleLOD', {method: "GET", headers: {"content-type": "application/json", "lod": lod}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

export async function getTabelleGIS() {
    const tabelleGIS = await fetch("/t/DB_Servizio/LOD/TabelleGIS", {method: "GET", headers: {"content-type": "application/json"} });
    const resp_tabelleGIS = await tabelleGIS.json();
    return resp_tabelleGIS;
}

export async function leggiDBMarkerLoc() {
    try {
        const risultato = await fetch(`/t/DB_Servizio/MarkerLoc`, {method: "GET", headers: {"content-type": "application/json"}});
        const sacriMontiJson = await risultato.json();
        return sacriMontiJson;
    }
    catch(e) {
        console.log('Errore nella lettura dei marker delle località');
        console.log(e);
    }
}

export async function leggiDBMarkerEdif() {
    try {
        const risultato = await fetch(`/t/DB_Servizio/MarkerEdif`, {method: "GET", headers: {"content-type": "application/json"}});
        const cappelleJson = await risultato.json();
        return cappelleJson;
    }
    catch(e) {
        console.log('Errore nella lettura dei marker degli edifici');
        console.log(e);
    }
}

export async function leggiDBMarkerLocPdiff() {
    try {
        const risultato = await fetch(`/t/DB_Servizio/MarkerLocPdiff`, {method: "GET", headers: {"content-type": "application/json"}});
        const LocMatJson = await risultato.json();
        return LocMatJson;
    }
    catch(e) {
        console.log('Errore nella lettura dei marker delle località materiali');
        console.log(e);
    }
}

export async function getGIS(tabella, geometria, colonneUtili) {
    const oggettiGIS = await fetch("/t/Main10ance_DB/GIS", {method: "GET", headers: {"content-type": "application/json", "tabella": tabella, "geometria": geometria, "colonneUtili": colonneUtili} });
    const resp_oggettiGIS = await oggettiGIS.json();
    return resp_oggettiGIS;
}

export async function getObjects(bucketId = '#') {
    const objectsRaw = await fetch(`/api/forge/oss/buckets?id=${bucketId}`);
    const objects = await objectsRaw.json();
    return objects;
}

export async function prendiSchedeAnagrafica() {
    const risultato = await fetch('/o/Main10ance_DB/tabellaDB/schede-anagrafica', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

export async function prendiSchedeControllo() {
    const risultato = await fetch('/o/Main10ance_DB/tabellaDB/schede-controllo-2', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

export async function prendiSchedeManReg() {
    const risultato = await fetch('/o/Main10ance_DB/tabellaDB/schede-manutenzione-regolare', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

export async function prendiSchedeManCorr() {
    const risultato = await fetch('/o/Main10ance_DB/tabellaDB/schede-manutenzione-correttiva', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

export async function prendiSchedeManStr() {
    // const risultato = await fetch('', {method: "GET", headers: {"content-type": "application/json"}});
    // const risTradotto = await risultato.json();
    // return risTradotto;
    return [];
}

export async function prendiSchedeRestauro() {
    const risultato = await fetch('/o/Main10ance_DB/tabellaDB/schede-restauro', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

/////           ATTENZIONE: QUESTA UGUALE A FUNZIONE "leggiDBMarkerLoc" ------> DA RISOLVERE
export async function prendiSigleLocalità() {
    const risultato = await fetch('/t/DB_Servizio/MarkerLoc', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

export async function leggiEnum(nomeEnum) {
    try {
        const risultato = await fetch('/o/Main10ance_DB/tabellaDB/enum', {method: "GET", headers: {"content-type": "application/json", "nomeEnum": nomeEnum} });
        const listaEnum = await risultato.json();
        return listaEnum;
    }
    catch(e) {
        console.log('Errore nella lettura delle Enumeration');
        console.log(e);
    }
}

///// LATO SERVER LA FUNZIONE RELATIVA E' COMMENTATA ///////
// export async function recuperaDatiControlliProg() {
//     const risultato = await fetch('/o/Main10ance_DB/controlli-programmati', {method: "GET", headers: {"content-type": "application/json"}});
//     const risTradotto = await risultato.json();
//     return risTradotto;
// }

export async function compilaScheda(jsonReq) {
    try {
        const resp = await fetch(`/o/Main10ance_DB/schede/nuova`, {method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify(jsonReq) });
        const respData = await resp.json();
        return respData;
    }
    catch(e) {
        console.log(e);
    }
}

export async function prendiLOD3e4() {
    const risultato = await fetch('/o/DB_Servizio/LOD/3e4', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

export async function leggiGlossDegradi() {
    try {
        const risultato = await fetch('/o/Main10ance_DB/tabellaDB/glossario/degradi', {method: "GET", headers: {"content-type": "application/json"} });
        const listaGloss = await risultato.json();
        return listaGloss;
    }
    catch(e) {
        console.log('Errore nella lettura del glossario');
        console.log(e);
    }
}

export async function prendiSigleEdifici() {
    const risultato = await fetch('/g/DB_Servizio/sigle-edifici', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

export async function prendiFrasiDiRischio() {
    const risultato = await fetch('/g/Main10ance_DB/frasi-rischio', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

export async function getEntitàDaClOgg(cl_ogg) {
    try {
        const res = await fetch("/g/DB_Servizio/entita-oggetti", {method: "GET", headers: {"content-type": "application/json", "cl_ogg": cl_ogg} });
        const resJson = await res.json();
        const entità = resJson.map(r => (r.entità_db_m10a));
        return entità;
    }
    catch(e) {
        console.log('Errore nella richiesta al server');
        console.log(e);
    }
}

export async function getElementiDaEntità(sm, edificio, entità) {
    const id = `${sm}|${edificio}|${entità}|`;
    try {
        const res = await fetch("/g/Main10ance_DB/lista-identificativi", {method: "GET", headers: {"content-type": "application/json", "entita": entità, "id_parziale": id} });
        const resJson = await res.json();
        const elementi = resJson.map(r => (r.id_main10ance));
        return elementi;
    }
    catch(e) {
        console.log('Errore nella richiesta al server');
        console.log(e);
    }
}

export async function creaAttProgControllo(listaAtt) {
    const res = await fetch('/g/Main10ance_DB/pianificazione/rischi', {method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify(listaAtt)});
    const resJson = await res.json();
    return resJson;
}

export async function leggiAttivitàProg() {
    const res = await fetch('/o/Main10ance_DB/attivita-programmate');
    const resJson = await res.json();
    return resJson;
}

export async function leggiAttProgPerIntegrazione(bool) {
    const res = await fetch('/g/Main10ance_DB/integrazione/attivita-per-integrazione', {method: "GET", headers: {"content-type": "application/json", "bool": JSON.stringify(bool)} });
    const resJson = await res.json();
    return resJson;
}

export async function integraAttività(jsonAtt) {
    const res = await fetch('/g/Main10ance_DB/integrazione/integrazione-attivita', {method: "PATCH", headers: {"content-type": "application/json"}, body: JSON.stringify(jsonAtt)});
    const resJson = await res.json();
    return resJson;
}

export async function prendiUrn(jsonReq) {
    const risultato = await fetch('/o/DB_Servizio/LOD/UrnEdifici', {method: "GET", headers: {"content-type": "application/json", "sm": jsonReq.sm, "capp": jsonReq.capp}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

export async function prendiUrnLocalità(jsonReq) {
    const risultato = await fetch('/o/DB_Servizio/LOD/UrnLoc', {method: "GET", headers: {"content-type": "application/json", "loc": jsonReq.loc}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

export async function registraAttivitàEseguita(jsonAtt) {
    const res = await fetch('/o/Main10ance_DB/esecuzione/nuova-attivita', {method: "PATCH", headers: {"content-type": "application/json"}, body: JSON.stringify(jsonAtt)});
    const resJson = await res.json();
    return resJson;
}

export async function prendiFrequenzaAttProg(jsonAtt) {
    const res = await fetch('/o/Main10ance_DB/esecuzione/frequenza', {method: "GET", headers: {"content-type": "application/json", "id": jsonAtt.id, "tabella": jsonAtt.tabella}});
    const resJson = await res.json();
    return resJson;
}

export async function prendiSchedeStoricoControllo() {
    const risultato = await fetch('/o/Main10ance_DB/tabellaDB/schede-storico-controllo');
    const risTradotto = await risultato.json();
    return risTradotto;
}

export async function prendiSchedeStoricoManReg() {
    const risultato = await fetch('/o/Main10ance_DB/tabellaDB/schede-storico-manutenzione-regolare');
    const risTradotto = await risultato.json();
    return risTradotto;
}

export async function prendiSchedeStoricoManCorr() {
    const risultato = await fetch('/o/Main10ance_DB/tabellaDB/schede-storico-manutenzione-correttiva');
    const risTradotto = await risultato.json();
    return risTradotto;
}

export async function getListaImmagini(percorso) {
    const res = await fetch('/t/storage/img-list', {method: "GET", headers: {"content-type": "application/json", "path": percorso}});
    const resJson = await res.json();
    return resJson;
}

export async function downloadImmagini(percorsoFile) {
    const res = await fetch('/t/storage/img-download', {method: "GET", headers: {"percorso": JSON.stringify(percorsoFile)}});
    const resType = res.headers.get('content-type');
    if (resType && resType.indexOf("application/json") !== -1) {
        const resJson = await res.json();
        return resJson;
    }
    const resBlob = await res.blob();
    return resBlob;
}

export async function getInfoImmagine(percorsoFile, tabella) {
    const res = await fetch('/t/Main10ance_DB/LOD4/info', {method: "GET", headers: {"percorso": JSON.stringify(percorsoFile), "tabella": JSON.stringify(tabella)}});
    const resJson = await res.json();
    return resJson;
}

export async function creaRecordLOD4(datiBody) {
    const res = await fetch('/g/Main10ance_DB/LOD4/nuovo', {method: "POST", body: datiBody});
    const resJson = await res.json();
    return resJson;
}

export async function eliminaRecordLOD4(jsonReq) {
    const res = await fetch('/g/Main10ance_DB/LOD4/elimina', {method: "DELETE", headers: {"content-type": "application/json"}, body: JSON.stringify(jsonReq)});
    const resJson = await res.json();
    return resJson;
}

export async function getDatiElementiEdiliziDashboard() {
    const lod3 = await prendiLOD(3);
    const listaLod3 = lod3.map(tab => tab.tabella);
    const listaAlias = lod3.map(tab => tab.alias);
    const risultato = await fetch('/g/Main10ance_DB/dashboard/conteggio-elementi', {method: "GET", headers: {"content-type": "application/json", tabelle: JSON.stringify(listaLod3), alias: JSON.stringify(listaAlias)}});
    const risTradotto = await risultato.json();
    const BIMresult = risTradotto.map(element => (element.count));
    const BIMlegend = risTradotto.map(element => (element.nome_tabella));
    return [BIMresult, BIMlegend];
}

export async function getDatiElementiGISDashboard() {
    const listaGIS = await getTabelleGIS();
    const listaTabelle = listaGIS.map(tab => tab.tabella);
    const listaAlias = listaGIS.map(tab => tab.alias);
    const risultato = await fetch('/g/Main10ance_DB/dashboard/conteggio-elementi', {method: "GET", headers: {"content-type": "application/json", tabelle: JSON.stringify(listaTabelle), alias: JSON.stringify(listaAlias)}});
    const risTradotto = await risultato.json();
    const list = risTradotto.filter(element => (parseInt(element.count)));
    const GISresult = list.map(element => (element.count));
    const GISlegend = list.map(element => (element.nome_tabella));
    return [GISresult, GISlegend];
}

export async function getInfoGestioneUtenti() {
    const utentiRaw = await fetch("/a/utenti", {method: "GET", headers: {"content-type": "application/json"} });
    const utenti = await utentiRaw.json();
    return utenti;
}

export async function getRuoliEnum() {
    const ruoliRaw = await fetch("/a/ruoli", {method: "GET", headers: {"content-type": "application/json"} });
    const ruoli = await ruoliRaw.json();
    return ruoli;
}

export async function updateRuoloUtente(infoJson) {
    let ris;
    try {
        const risultatoRaw = await fetch("/a/ruoli/nuovo-ruolo", {method: "PATCH", headers: {"content-type": "application/json"}, body: JSON.stringify(infoJson) });
        const risultato = await risultatoRaw.json();
        ris = risultato.success;
    }
    catch(e) {
        console.log("Errore nell'aggiornamento dei ruoli");
        console.log(e);
        ris = false;
    }
    finally {
        return ris;
    }
}

export async function conteggioRuoli() {
    const risultato = await fetch('/g/Main10ance_DB/dashboard/conteggio-ruoli', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    const dataUtenti = risTradotto.map(element => (element.count));
    const legendUtenti = risTradotto.map(element => (element.ruolo));
    return [dataUtenti, legendUtenti];
}

export async function conteggioModelli() {
    const località = await fetch('/g/DB_Servizio/lista-localita', {method: "GET", headers: {"content-type": "application/json"}});
    const localitàJson = await località.json();
    const listaNomi = localitàJson.map(tab => tab.nome);
    const listaSigle = localitàJson.map(tab => tab.sigla);
    const risultato = await fetch('/g/Main10ance_DB/dashboard/conteggio-modelli', {method: "GET", headers: {"content-type": "application/json", nomi: JSON.stringify(listaNomi), sigle: JSON.stringify(listaSigle)}});
    const risTradotto = await risultato.json();
    const modelli= risTradotto.map(element => (element.count));
    const nomi = risTradotto.map(element => (element.nome_tabella));
    return [modelli, nomi];
}

async function leggiNumeroOggettiBIM() {
    const tabelleBIM = await fetch("/g/DB_Servizio/LOD/TabelleBIM", {method: "GET", headers: {"content-type": "application/json"}});
    const tabelleBIMjson = await tabelleBIM.json();
    const listaTabelle = tabelleBIMjson.map(tab => tab.tabella);
    const risultato = await fetch('/g/Main10ance_DB/dashboard/numero-oggetti', {method: "GET", headers: {"content-type": "application/json", tabelle: JSON.stringify(listaTabelle)}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function leggiNumeroOggettiGIS() {
    const tabelleGISjson = await getTabelleGIS();
    const listaTabelle = tabelleGISjson.map(tab => tab.tabella);
    const risultato = await fetch('/g/Main10ance_DB/dashboard/numero-oggetti', {method: "GET", headers: {"content-type": "application/json", tabelle: JSON.stringify(listaTabelle)}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

export async function conteggioOggetti() {
    const datiBIM = await leggiNumeroOggettiBIM();
    const datiGIS = await leggiNumeroOggettiGIS();
    const oggettiBIM = datiBIM.sum;
    const oggettiGIS = datiGIS.sum;
    return [oggettiBIM, oggettiGIS];
}

export async function creaNuovoLocPdiff(jsonReq) {
    let ris;
    try {
        const risultatoRaw = await fetch("/g/DB_Servizio/loc-pdiff/nuovo", {method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify(jsonReq) });
        const risultato = await risultatoRaw.json();
        ris = risultato.success;
    }
    catch(e) {
        console.log("Errore nell'aggiunta di un nuovo punto");
        console.log(e);
        ris = false;
    }
    finally {
        return ris;
    }
}

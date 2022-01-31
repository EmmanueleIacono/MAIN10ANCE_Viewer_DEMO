export async function prendiLOD(lod) {
    const risultato = await fetch('/o/DB_Servizio/LOD/TabelleLOD', {method: "GET", headers: {"content-type": "application/json", "lod": lod}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

export async function getTabelleGIS() {
    const tabelleGIS = await fetch("/t/DB_Servizio/LOD/TabelleGIS", {method: "GET", headers: {"content-type": "application/json"} });
    const resp_tabelleGIS = await tabelleGIS.json();
    return resp_tabelleGIS;
}

export async function leggiDBMarkerSM() {
    try {
        const risultato = await fetch(`/t/DB_Servizio/MarkerSM`, {method: "GET", headers: {"content-type": "application/json"}});
        const sacriMontiJson = await risultato.json();
        return sacriMontiJson;
    }
    catch(e) {
        console.log('Errore nella lettura dei marker dei Sacri Monti');
        console.log(e);
    }
}

export async function leggiDBMarkerCapp() {
    try {
        const risultato = await fetch(`/t/DB_Servizio/MarkerCapp`, {method: "GET", headers: {"content-type": "application/json"}});
        const cappelleJson = await risultato.json();
        return cappelleJson;
    }
    catch(e) {
        console.log('Errore nella lettura dei marker delle cappelle');
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

export async function prendiSigleSacriMonti() {
    const risultato = await fetch('/t/DB_Servizio/MarkerSM', {method: "GET", headers: {"content-type": "application/json"}});
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

export async function recuperaDatiControlliProg() {
    const risultato = await fetch('/o/Main10ance_DB/controlli-programmati', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

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

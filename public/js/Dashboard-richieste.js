"use strict";

async function conteggioRuoli() {
    const risultato = await fetch('/g/Main10ance_DB/dashboard/conteggio-ruoli', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}


async function widgetChart1() {
    const result = await conteggioRuoli();
    const dataUtenti = result.map(element => (element.count))
    const legendUtenti = result.map(element => (element.ruolo))
    return [dataUtenti, legendUtenti];
}


async function SMmodel() {
    const risultato = await fetch('/g/Main10ance_DB/dashboard/SMmodel', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function widgetChart2() {
    const result = await SMmodel();
    const modelli= result.map(element => (element.count))
    const nomi = result.map(element => (element.nome_tabella))
    return [modelli, nomi];
}

async function leggiNumeroOggettiBIM() {
    const tabelleBIM = await fetch("/g/DB_Servizio/LOD/TabelleBIM", {method: "GET", headers: {"content-type": "application/json"} });
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

async function widgetChart3() {
    const datiBIM = await leggiNumeroOggettiBIM();
    const datiGIS = await leggiNumeroOggettiGIS();
    const oggettiBIM = datiBIM.sum;
    const oggettiGIS = datiGIS.sum;
    return [oggettiBIM, oggettiGIS];
}

async function BIMobject() {
    const lod3 = await prendiLOD(3);
    const listaLod3 = lod3.map(tab => tab.tabella);
    const listaAlias = lod3.map(tab => tab.alias);
    const risultato = await fetch('/g/Main10ance_DB/dashboard/conteggio-elementi', {method: "GET", headers: {"content-type": "application/json", tabelle: JSON.stringify(listaLod3), alias: JSON.stringify(listaAlias)}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function pieChart1() {
    const result = await BIMobject();
    const BIMresult = result.map(element => (element.count));
    const BIMlegend = result.map(element => (element.nome_tabella));
    return [BIMresult, BIMlegend];
}


async function GISobject() {
    const listaGIS = await getTabelleGIS();
    const listaTabelle = listaGIS.map(tab => tab.tabella);
    const listaAlias = listaGIS.map(tab => tab.alias);
    const risultato = await fetch('/g/Main10ance_DB/dashboard/conteggio-elementi', {method: "GET", headers: {"content-type": "application/json", tabelle: JSON.stringify(listaTabelle), alias: JSON.stringify(listaAlias)}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function pieChart2() {
    const result = await GISobject();
    const list = result.filter(element => (parseInt(element.count)));
    const GISresult = list.map(element => (element.count));
    const GISlegend = list.map(element => (element.nome_tabella));
    return [GISresult, GISlegend];
}

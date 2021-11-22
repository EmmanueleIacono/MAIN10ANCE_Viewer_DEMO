"use strict";

async function conteggioRuoli() {
    const risultato = await fetch('/g/conteggio-ruoli', {method: "GET", headers: {"content-type": "application/json"}});
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
    const risultato = await fetch('/g/SMmodel', {method: "GET", headers: {"content-type": "application/json"}});
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
    const risultato = await fetch('/g/Main10ance_DB/tabellaDB/dashboard/oggettiBIM', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function leggiNumeroOggettiGIS() {
    const risultato = await fetch('/g/Main10ance_DB/tabellaDB/dashboard/oggettiGIS', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function widgetChart3() {
    const datiBIM = await leggiNumeroOggettiBIM();
    const datiGIS = await leggiNumeroOggettiGIS();
    const oggettiBIM = datiBIM.sum;
    const oggettiGIS = datiGIS.sum;
    return [oggettiBIM, oggettiGIS]
}

async function BIMobject() {
    const risultato = await fetch('/g/Main10ance_DB/tabellaDB/dashboard/BIMobject', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function pieChart1() {
    const result = await BIMobject();
    const BIMresult = result.map(element => (element.count))
    const BIMlegend = result.map(element => (element.nome_tabella))
    return [BIMresult, BIMlegend];
}


async function GISobject() {
    const risultato = await fetch('/g/Main10ance_DB/tabellaDB/dashboard/GISobject', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function pieChart2() {
    const result = await GISobject();
    const list = []
    result.forEach(element => {
        if (parseInt(element.count)) {
            list.push(element)
        }
    });
    const GISresult = list.map(element => (element.count))
    const GISlegend = list.map(element => (element.nome_tabella))
    return [GISresult, GISlegend];
}

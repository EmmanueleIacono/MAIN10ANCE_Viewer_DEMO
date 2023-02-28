"use strict";

import L from 'leaflet';
import proj4 from 'proj4';
import 'proj4leaflet';

import {getModel} from './BIM';
import store from '../store/index';

export let mappaGlb;
export let newLocMatMarker;

// CREAZIONE MAPPA
export function creaMappa(divId, posizioneIniziale) {
    const mappaGIS = L.map(divId).setView(posizioneIniziale, 8);
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, { attribution, "detectRetina": false, "maxNativeZoom": 20, "maxZoom": 19, "minZoom": 0, "noWrap": false, "opacity": 1, "subdomains": "abc", "tms": false});
    tiles.addTo(mappaGIS);
    // mappaGIS.on('click', addLocMat);
    if (!mappaGlb) {mappaGlb = mappaGIS};
    return mappaGIS;
}

// SET VIEW SPECIFICA SU MAPPA
export function setVistaMappa(mappa, posizione, zoom) {
    mappa.setView(posizione, zoom);
}

// AGGIUNTA LIVELLO A MAPPA
export function aggiungiLayer(livello, mappa) {
    mappa.addLayer(livello);
}

// AGGIUNTA LIVELLO A MAPPA
export function rimuoviLayer(livello, mappa) {
    mappa.removeLayer(livello);
}

// CREAZIONE NUOVO LIVELLO GIS
export function creaLivelloGIS(livello) {
    proj4.defs("EPSG:32632","+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");

    const livelloTabella = L.layerGroup();
    const geojsonMarkerOptions = {
        radius: 8,
        color: livello.colore,
        fillColor: livello.colore,
        fillOpacity: 0.8,
    }
    function stileGeoJSON(feature) {
        return {
            color: livello.colore,
        }
    }
    function stileGeoPointToLayer(feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
    function creaGeometria(geo) {
        const geoRaw = JSON.parse(geo.geom);
        const geoGeoJSON = L.Proj.geoJson(geoRaw, {style: stileGeoJSON, pointToLayer: stileGeoPointToLayer}).addTo(livelloTabella);
        geoGeoJSON.bindPopup(`<b>${geo.info}</b>`);
    }

    for (const gisGeom of livello.gis) {
        creaGeometria(gisGeom);
    }

    return livelloTabella;
}

export const iconaSM = L.icon({
    iconUrl: require('/src/assets/img/logo_b.png'),
    shadowUrl: require('/src/assets/img/ombre_icone_v4.png'),
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    shadowSize: [36, 36],
    shadowAnchor: [18, 15]
});

export const iconaCappelle = L.icon({
    iconUrl: require('/src/assets/img/icona_capp_blue_small.png'),
    shadowUrl: require('/src/assets/img/ombre_icone_v4.png'),
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    shadowSize: [36, 36],
    shadowAnchor: [18, 15]
});

const iconaLocMat = L.icon({
    iconUrl: require('/src/assets/img/icona_cubo_v1.png'),
    shadowUrl: require('/src/assets/img/ombre_icone_v4.png'),
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    shadowSize: [36, 36],
    shadowAnchor: [18, 15]
});

export function creaMarker(edif, icona) {
    const marker = L.marker(edif.coord, {icon: icona}).bindPopup();

    const contenitorePopup = document.createElement('div');
    const descrizione = edif.descrizione ? `<br>${edif.descrizione}` : '';
    contenitorePopup.innerHTML = `<b>${edif.nome}</b>${descrizione}<br>`;
    const selettore = document.createElement('button');
    selettore.id = `selettore_${edif.sigla}`;
    selettore.innerText = 'MODELLO';
    contenitorePopup.appendChild(selettore);
    selettore.addEventListener('click', () => {
        getModel(edif.urn);
        mappaGlb.closePopup();
    });
    
    marker.on('popupopen', () => {
        marker._popup.setContent(contenitorePopup);
    });

    return marker;
}

export function creaMarkerLocMat(locMat) {
    const marker = L.marker(locMat.coord, {icon: iconaLocMat}).bindPopup();

    const contenitorePopup = document.createElement('div');
    // const descrizione = locMat.descrizione ? `<br>${locMat.descrizione}` : '';
    // contenitorePopup.innerHTML = `<b>${locMat.nome}</b>${descrizione}<br>`;
    contenitorePopup.innerHTML = `<b>${locMat.nome}</b><br>`;
    const selettore = document.createElement('button');
    selettore.id = `selettore_${locMat.sigla}`;
    selettore.innerText = 'DETTAGLI';
    contenitorePopup.appendChild(selettore);
    selettore.addEventListener('click', () => {
        // apri artifact viewer
        store.methods.setTabAttivo('Tab5');
        mappaGlb.closePopup();
    });
    
    marker.on('popupopen', () => {
        marker._popup.setContent(contenitorePopup);
    });

    return marker;
}

// AGGIUNTA NUOVO PUNTO PER LOCALITÀ MATERIALI
export function addLocMat(ev) {
    // check se attiva una qualche "modalità modifica"
    if (!store.stateGIS.editMode) return;
    const {lat, lng} = ev.latlng;
    console.log(lat, lng);
    // se con click, marker esiste già, sostituire
    rimuoviMarkerTemporaneo();
    newLocMatMarker = new L.marker({lat, lng}, {icon: iconaLocMat}).addTo(mappaGlb);
    // salvare marker da qualche parte
    return newLocMatMarker;
}

export function rimuoviMarkerTemporaneo() {
    if (newLocMatMarker) mappaGlb.removeLayer(newLocMatMarker);
}

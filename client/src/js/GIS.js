"use strict";

import L from 'leaflet';
import proj4 from 'proj4';
import 'proj4leaflet';

// CREAZIONE MAPPA
export function creaMappa(divId, posizioneIniziale) {
    const mappaGIS = L.map(divId).setView(posizioneIniziale, 8);
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, { attribution, "detectRetina": false, "maxNativeZoom": 20, "maxZoom": 19, "minZoom": 0, "noWrap": false, "opacity": 1, "subdomains": "abc", "tms": false});
    tiles.addTo(mappaGIS);
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
        if (geoRaw.type === "Point") {
            const geoGeoJSON = L.Proj.geoJson(geoRaw, {pointToLayer: stileGeoPointToLayer}).addTo(livelloTabella);
            geoGeoJSON.bindPopup(`<b>${geo.info}</b>`);
        }
        else {
        const geoGeoJSON = L.Proj.geoJson(geoRaw, {style: stileGeoJSON}).addTo(livelloTabella);
        geoGeoJSON.bindPopup(`<b>${geo.info}</b>`);
        }
    }

    for (const gisGeom of livello.gis) {
      creaGeometria(gisGeom);
    }

    return livelloTabella;
}

// CREAZIONE NUOVO LIVELLO GIS E AGGIUNTA A MAPPA
export function creaLivelloGISeAggiungiLayer(livello, mappa) {
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
        if (geoRaw.type === "Point") {
            const geoGeoJSON = L.Proj.geoJson(geoRaw, {pointToLayer: stileGeoPointToLayer}).addTo(livelloTabella);
            geoGeoJSON.bindPopup(`<b>${geo.info}</b>`);
        }
        else {
        const geoGeoJSON = L.Proj.geoJson(geoRaw, {style: stileGeoJSON}).addTo(livelloTabella);
        geoGeoJSON.bindPopup(`<b>${geo.info}</b>`);
        }
    }

    for (const gisGeom of livello.gis) {
      creaGeometria(gisGeom);
    }

    mappa.addLayer(livelloTabella);

    // return livelloTabella;
}

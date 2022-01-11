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
    const featureColl = {
        type: "FeatureCollection",
        features: [],
    };
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
    function bindPopupOnEach(feature, layer) {
        if (feature.properties && feature.properties.info) {
            layer.bindPopup(`<b>${feature.properties.info}</b>`);
        }
    }
    function creaGeometria(geo) {
        const geoRaw = JSON.parse(geo.geom);
        const geoGeoJSON = L.Proj.geoJson(geoRaw, {style: stileGeoJSON, pointToLayer: stileGeoPointToLayer}).addTo(livelloTabella);
        geoGeoJSON.bindPopup(`<b>${geo.info}</b>`);
    }
    function aggiungiFeatureColl(featureCollection) {
        L.Proj.geoJson(featureCollection, {style: stileGeoJSON, pointToLayer: stileGeoPointToLayer, onEachFeature: bindPopupOnEach}).addTo(livelloTabella);
    }

    for (const gisGeom of livello.gis) {
        // creaGeometria(gisGeom);
        const feature = {
            type: "Feature",
            properties: {
                info: gisGeom.info,
            },
            geometry: JSON.parse(gisGeom.geom),
        }
        featureColl.features.push(feature);
    }

    aggiungiFeatureColl(featureColl);
    console.log(livelloTabella);

    return livelloTabella;
}

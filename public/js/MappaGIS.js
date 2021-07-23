// COORDINATE UTILI
const posOrigine = [45.61422, 8.410177];

const mappaGIS = L.map('mappa').setView(posOrigine, 8); // nel setView sono specificati: ([latitudine, longitudine], zoom)
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution, "detectRetina": false, "maxNativeZoom": 20, "maxZoom": 19, "minZoom": 0, "noWrap": false, "opacity": 1, "subdomains": "abc", "tms": false});
tiles.addTo(mappaGIS);

// utili
setInterval(() => {
    mappaGIS.invalidateSize(); // questa riga mi serve per evitare quadrati grigi sulla mappa
    // questa parte serve per regolare la visualizzazione dei layer
    const zoomComune = 17;
    if (mappaGIS.getZoom() < zoomComune) {
        mappaGIS.addLayer(gruppoMarkerSacriMonti);
        mappaGIS.removeLayer(gruppoMarkerCappelle);
    }
    else if (mappaGIS.getZoom() > zoomComune) {
        mappaGIS.addLayer(gruppoMarkerCappelle);
        mappaGIS.removeLayer(gruppoMarkerSacriMonti);
    }
    else { /* cioè quando mappaGIS.getZoom() === zoomComune */
        mappaGIS.addLayer(gruppoMarkerSacriMonti);
        mappaGIS.addLayer(gruppoMarkerCappelle);
        }
}, 100);

// gruppi layer per marker sacri monti e marker cappelle
let gruppoMarkerCappelle = L.layerGroup();
let gruppoMarkerSacriMonti = L.layerGroup();

// reset vista totale default mappa
const bottoneRefresh = document.getElementById('refreshGIS');
bottoneRefresh.addEventListener("click", () => {
    mappaGIS.setView(posOrigine, 8)
});

// classe per bottoni di navigazione SM
class BottoneNavigazioneSM {
    constructor(nome, sigla, posizione) {
        this.nome = nome,
        this.sigla = sigla,
        this.posizione = posizione

        const bottoneNav = document.createElement('button');
        bottoneNav.setAttribute('id', `scegli${sigla}`);
        bottoneNav.innerHTML = `Sacro Monte di ${nome}`;

        const contenitoreBottoniNav = document.getElementById('contenitore-selettori');
        contenitoreBottoniNav.appendChild(bottoneNav);

        bottoneNav.addEventListener('click', () => {
            mappaGIS.setView(posizione, 17);
        });
    }
}

class MarkerSacroMonte {
    constructor(coordinate, nome, sigla, urn) {
        this.coordinate = coordinate;
        this.nome = nome;
        this.sigla = sigla;
        this.urn = urn;

        const iconaSacriMonti = L.icon({
            iconUrl: '../img/logo_b.png',
            shadowUrl: '../img/ombre_icone_v4.png',
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            shadowSize: [36, 36],
            shadowAnchor: [18, 15]
        });

        this.element = L.marker(coordinate, {icon: iconaSacriMonti}).bindPopup();

        const contenitorePopup = document.createElement('div');
        contenitorePopup.innerHTML = `<b>Sacro Monte di ${nome}</b><br>`;
        const selettoreSM = document.createElement('button');
        selettoreSM.setAttribute('id', `selettore_${sigla}`);
        selettoreSM.innerHTML = 'APRI';
        contenitorePopup.appendChild(selettoreSM);
        selettoreSM.addEventListener('click', () => {
            getModel(urn);
            mappaGIS.closePopup();
        });
        
        this.element.on('popupopen', () => {
            this.element._popup.setContent(contenitorePopup);
        });

        this.element.addTo(gruppoMarkerSacriMonti);
    }
}

class MarkerCappella {
    constructor(coordinate, nome, sigla, descrizione, urn) {
        this.coordinate = coordinate;
        this.nome = nome;
        this.sigla = sigla;
        this.descrizione = descrizione;
        this.urn = urn;

        const iconaCappelle = L.icon({
            iconUrl: '../img/icona_capp_blue_small.png',
            shadowUrl: '../img/ombre_icone_v4.png',
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            shadowSize: [36, 36],
            shadowAnchor: [18, 15]
        });

        this.element = L.marker(coordinate, {icon: iconaCappelle}).bindPopup();

        const contenitorePopup = document.createElement('div');
        contenitorePopup.innerHTML = `<b>${nome}</b><br>${descrizione}<br>`;
        const selettoreCapp = document.createElement('button');
        selettoreCapp.setAttribute('id', `selettore_${sigla}`);
        selettoreCapp.innerHTML = 'APRI';
        contenitorePopup.appendChild(selettoreCapp);
        selettoreCapp.addEventListener('click', () => {
            getModel(urn);
            mappaGIS.closePopup();
        });
        
        this.element.on('popupopen', () => {
            this.element._popup.setContent(contenitorePopup);
        });

        this.element.addTo(gruppoMarkerCappelle);
    }
}

// questa funzione è molto carina ma va riarrangiata per ottenere l'URN da un'altra richiesta, non va bene hardcoded dentro oggetti... oppure sì?
function getModel(urn) {
    if ((urn !== null) && (urn !== '')) {
        document.getElementById('apriTabBIM').click();
        launchViewer(urn);
    }
    else {
        alert('Nessun modello presente per questo elemento');
    }
}

// fare in modo che i geojson siano presi dal database main10ance
// const geoJSON_tester = {
//     "type": "FeatureCollection",
//     "features": [
//         {
//         "type": "Feature",
//         "properties": {},
//         "geometry": {
//             "type": "Polygon",
//             "coordinates": [
//             [
//                 [
//                 8.254728913307188,
//                 45.81896009407471
//                 ],
//                 [
//                 8.254761099815369,
//                 45.81838434481882
//                 ],
//                 [
//                 8.255758881568909,
//                 45.81814880931642
//                 ],
//                 [
//                 8.256434798240662,
//                 45.818758208649754
//                 ],
//                 [
//                 8.256000280380249,
//                 45.819247966470186
//                 ],
//                 [
//                 8.254728913307188,
//                 45.81896009407471
//                 ]
//             ]
//             ]
//         }
//         }
//     ]
// }

// function invertiLista(listaCoordinate) {
//     listaInvertita = [];
//     listaCoordinate.forEach((coord) => {
//         coordInvertite = [];
//         coordInvertite[0] = coord[1];
//         coordInvertite[1] = coord[0];
//         listaInvertita.push(coordInvertite);
//     });
//     return listaInvertita;
// }

async function leggiDBMarkerSM() {
    try {
        const risultato = await fetch(`/DB_Servizio/MarkerSM`, {method: "GET", headers: {"content-type": "application/json"}});
        const sacriMontiJson = await risultato.json();
        sacriMontiJson.forEach((smjson) => {
            new MarkerSacroMonte(smjson.coord, smjson.nome, smjson.sigla, smjson.urn);
            new BottoneNavigazioneSM(smjson.nome, smjson.sigla, smjson.coord);
        });
    }
    catch(e) {
        console.log('Errore nella lettura dei marker dei Sacri Monti');
        console.log(e);
    }
}

async function leggiDBMarkerCapp() {
    try {
        const risultato = await fetch(`/DB_Servizio/MarkerCapp`, {method: "GET", headers: {"content-type": "application/json"}});
        const cappelleJson = await risultato.json();
        cappelleJson.forEach((cappjson) => {
            new MarkerCappella(cappjson.coord, cappjson.nome, cappjson.sigla, cappjson.descrizione, cappjson.urn);
        });
    }
    catch(e) {
        console.log('Errore nella lettura dei marker delle cappelle');
        console.log(e);
    }
}

leggiDBMarkerSM();
leggiDBMarkerCapp();

// const testPoligono = L.geoJSON(geoJSON_tester);
// testPoligono.bindPopup('<b>CIAO!</b>');

// const spegniGeoJSON = document.getElementById('spegniGeoJSON');
// let visibilitàGeoJSON = false;
// spegniGeoJSON.addEventListener("click", () => {
//     if (visibilitàGeoJSON) {
//         mappaGIS.removeLayer(testPoligono);
//     }
//     else {
//         mappaGIS.addLayer(testPoligono);
//     }
//     visibilitàGeoJSON = !visibilitàGeoJSON;
// });

const tabellePopolateGIS = [
    {tabella: "accesso_civico_toponimo_stradale", alias: "Accesso civico - Toponimo stradale", geometria: "geom_pun", colonneUtili: ["tp_str_nom", "acc_pc_ty", "civico_num"]},
    {tabella: "area_di_circolazione_veicolare", alias: "Area di circolazione veicolare", geometria: "geom_pol", colonneUtili: ["ac_vei_zon"]},
    {tabella: "area_verde", alias: "Area verde", geometria: "geom_pol", colonneUtili: ["ar_vrd_pa", "ar_vrd_ty"]},
    {tabella: "bosco", alias: "Bosco", geometria: "geom_pol", colonneUtili: ["bosco_gov", "bosco_ty"]},
    {tabella: "coltura_agricola", alias: "Coltura agricola", geometria: "geom_pol", colonneUtili: ["cl_agr_ty"]},
    {tabella: "corso_d_acqua", alias: "Corso d\'acqua", geometria: "geom_pol", colonneUtili: ["cda_nom", "cda_ty"]},
    {tabella: "curve_di_livello", alias: "Curve di livello", geometria: "geom_lin", colonneUtili: ["cv_liv_dt", "cv_liv_ty"]},
    {tabella: "edificio", alias: "Edificio", geometria: "geom_pol", colonneUtili: ["edifc_stat", "edifc_ty", "edifc_uso"]},
    {tabella: "edificio_minore", alias: "Edificio minore", geometria: "geom_pol", colonneUtili: ["edi_min_st", "edi_min_ty"]},
    {tabella: "elemento_di_copertura", alias: "Elemento di copertura", geometria: "geom_pol", colonneUtili: ["ele_cp_ty"]},
    {tabella: "località_significativa", alias: "Località significativa", geometria: "geom_pun", colonneUtili: ["loc_sg_top", "loc_sg_ty", "loc_sg_sgn"]},
    {tabella: "nodo_rete_elettrica", alias: "Nodo rete elettrica", geometria: "geom_pun", colonneUtili: ["nd_ele_ty"]},
    {tabella: "specchio_d_acqua", alias: "Specchio d\'acqua", geometria: "geom_pol", colonneUtili: ["sp_acq_nom", "sp_acq_ty"]},
    {tabella: "strade_sentieri_e_altri_percorsi_interni", alias: "Strade, sentieri e altri percorsi interni", geometria: "geom_pol", colonneUtili: ["ar_vms_ty", "ar_vms_fon"]},
    {tabella: "tratto_rete_elettrica", alias: "Tratto rete elettrica", geometria: "geom_lin", colonneUtili: ["tr_ele_ty"]},
    {tabella: "unità_volumetrica", alias: "Unità volumetrica", geometria: "geom_pol", colonneUtili: ["un_vol_av"]},
]

proj4.defs("EPSG:32632","+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");

async function getGeoJSON() {
    let oggetto_geoJSON_DB = await fetch("/Main10ance_DB/GIS_prova", {method: "GET", headers: {"content-type": "application/json"} });
    let resp_oggettoGeoJSON = await oggetto_geoJSON_DB.json();
    resp_oggettoGeoJSON.forEach(gj => {
        // console.log(gj);
        const gjJSON = JSON.parse(gj.st_asgeojson);
        // console.log(gjJSON);
        // const gjGEO = new L.Proj.GeoJSON(gjJSON).addTo(mappaGIS);
        const gjGEO = L.Proj.geoJson(gjJSON, {style: stileGeoJSON}).addTo(mappaGIS);
        // const gjGEO = L.Proj.geoJson(gjJSON).addTo(mappaGIS);
        // gjGEO.bindPopup(`<b>${gj.loc_sg_top}</b>`);
        gjGEO.bindPopup(`<b>${gj.bosco_ty}</b>`);
        // gjGEO.openPopup();
    });
}

function stileGeoJSON(polGeoJSON) {
    return {
        color: '#6164c9',
        // weight: 3,
        // opacity: 1,
        // stroke: false,
        // fillOpacity: 1,
    }
}

// getGeoJSON();

async function getGIS(tabella, alias, geometria, colonneUtili) {
    let oggettiGIS = await fetch("/Main10ance_DB/GIS", {method: "GET", headers: {"content-type": "application/json", "tabella": tabella, "alias": alias, "geometria": geometria, "colonneUtili": colonneUtili} });
    let resp_oggettiGIS = await oggettiGIS.json();
    return resp_oggettiGIS;
    // console.log(resp_oggettiGIS);
}

tabellePopolateGIS.forEach(async tbl => {
    // console.log(tbl.tabella, tbl.alias, tbl.geometria, tbl.colonneUtili.join(", "));
    const tabellaGIS = await getGIS(tbl.tabella, tbl.alias, tbl.geometria, tbl.colonneUtili.join(", "));
    // console.log(tabellaGIS);
    tabellaGIS.forEach(geo => {
        const geoRaw = JSON.parse(geo.geom);
        const geoGeoJSON = L.Proj.geoJson(geoRaw).addTo(mappaGIS);
        geoGeoJSON.bindPopup(`<b>${geo.info}</b>`);
    });
    // console.log(`SELECT ST_AsGeoJSON(${tbl.geometria}) AS "geom", ${tbl.colonneUtili.join(", ")} FROM main10ance_sacrimonti.${tbl.tabella} AS "${tbl.alias}";`);
});

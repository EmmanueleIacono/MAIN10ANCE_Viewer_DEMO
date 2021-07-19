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
const geoJSON_tester = {
    "type": "FeatureCollection",
    "features": [
        {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Polygon",
            "coordinates": [
            [
                [
                8.254728913307188,
                45.81896009407471
                ],
                [
                8.254761099815369,
                45.81838434481882
                ],
                [
                8.255758881568909,
                45.81814880931642
                ],
                [
                8.256434798240662,
                45.818758208649754
                ],
                [
                8.256000280380249,
                45.819247966470186
                ],
                [
                8.254728913307188,
                45.81896009407471
                ]
            ]
            ]
        }
        }
    ]
}

function invertiLista(listaCoordinate) {
    listaInvertita = [];
    listaCoordinate.forEach((coord) => {
        coordInvertite = [];
        coordInvertite[0] = coord[1];
        coordInvertite[1] = coord[0];
        listaInvertita.push(coordInvertite);
    });
    return listaInvertita;
}

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

const testPoligono = L.geoJSON(geoJSON_tester);
testPoligono.bindPopup('<b>CIAO!</b>');

const spegniGeoJSON = document.getElementById('spegniGeoJSON');
let visibilitàGeoJSON = false;
spegniGeoJSON.addEventListener("click", () => {
    if (visibilitàGeoJSON) {
        mappaGIS.removeLayer(testPoligono);
    }
    else {
        mappaGIS.addLayer(testPoligono);
    }
    visibilitàGeoJSON = !visibilitàGeoJSON;
});

proj4.defs("urn:ogc:def:crs:EPSG::32632", proj4.defs('EPSG:32632'));
// {"type":"Polygon","crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG::32632"}},"coordinates":[[[445914,5076749],[445901,5076737],[445895,5076730],[445893,5076726],[445888,5076714],[445881,5076704],[445872,5076692],[445865,5076686],[445859,5076683],[445853,5076681],[445836,5076680],[445826,5076678],[445815,5076675],[445779,5076654],[445775,5076649],[445768,5076640],[445747,5076606],[445743.391207582,5076614.11978294],[445747.348,5076618.45],[445759.635,5076632.51],[445773.632,5076650.1557],[445778.087,5076655.772],[445783.62,5076662.0541],[445784.498,5076663.051],[445785.239,5076663.736],[445786.442,5076664.343],[445817.932,5076679.428],[445844.503,5076688.675],[445849.295,5076689.92],[445855.432,5076691.814],[445857.0993,5076692.4834],[445861.716,5076694.337],[445863.176,5076695.763],[445863.586,5076697.875],[445863.221,5076699.514],[445861.996,5076701.646],[445858.567,5076704.572],[445858.5253,5076704.5893],[445855.217,5076705.958],[445852.145,5076706.476],[445848.684,5076706.709],[445844.059,5076706.091],[445818.853,5076697.927],[445797.343,5076693.464],[445783.62,5076691.1208],[445777.1364,5076690.0137],[445759.938,5076687.077],[445754.531,5076685.505],[445738.1377,5076681.8089],[445712.374,5076676],[445703.023,5076674.475],[445698.796,5076674.91],[445696.41,5076676.574],[445696.334,5076678.21],[445696.347811924,5076679.33912477],[445723,5076690],[445759,5076712],[445761.24980965,5076714.571211029],[445771.906,5076721.8753],[445773.258,5076722.802],[445783.62,5076730.9723],[445797.54,5076741.948],[445802.112,5076746.223],[445805.73,5076751.086],[445807.223,5076755.109],[445807.649,5076758.663],[445807.423,5076764.126],[445806.325,5076766.319],[445805.818331104,5076766.83922974],[445817,5076772],[445846,5076774],[445877,5076774],[445906,5076760],[445914,5076749]],[[445887.30148884,5076729.005770294],[445893.720941118,5076735.506547229],[445889.391171256,5076739.847201657],[445882.968658181,5076733.10833126],[445887.30148884,5076729.005770294]]]}
const geojsonPROVAEPSG = {"type":"Polygon","crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG::32632"}},"coordinates":[[[445914,5076749],[445901,5076737],[445895,5076730],[445893,5076726],[445888,5076714],[445881,5076704],[445872,5076692],[445865,5076686],[445859,5076683],[445853,5076681],[445836,5076680],[445826,5076678],[445815,5076675],[445779,5076654],[445775,5076649],[445768,5076640],[445747,5076606],[445743.391207582,5076614.11978294],[445747.348,5076618.45],[445759.635,5076632.51],[445773.632,5076650.1557],[445778.087,5076655.772],[445783.62,5076662.0541],[445784.498,5076663.051],[445785.239,5076663.736],[445786.442,5076664.343],[445817.932,5076679.428],[445844.503,5076688.675],[445849.295,5076689.92],[445855.432,5076691.814],[445857.0993,5076692.4834],[445861.716,5076694.337],[445863.176,5076695.763],[445863.586,5076697.875],[445863.221,5076699.514],[445861.996,5076701.646],[445858.567,5076704.572],[445858.5253,5076704.5893],[445855.217,5076705.958],[445852.145,5076706.476],[445848.684,5076706.709],[445844.059,5076706.091],[445818.853,5076697.927],[445797.343,5076693.464],[445783.62,5076691.1208],[445777.1364,5076690.0137],[445759.938,5076687.077],[445754.531,5076685.505],[445738.1377,5076681.8089],[445712.374,5076676],[445703.023,5076674.475],[445698.796,5076674.91],[445696.41,5076676.574],[445696.334,5076678.21],[445696.347811924,5076679.33912477],[445723,5076690],[445759,5076712],[445761.24980965,5076714.571211029],[445771.906,5076721.8753],[445773.258,5076722.802],[445783.62,5076730.9723],[445797.54,5076741.948],[445802.112,5076746.223],[445805.73,5076751.086],[445807.223,5076755.109],[445807.649,5076758.663],[445807.423,5076764.126],[445806.325,5076766.319],[445805.818331104,5076766.83922974],[445817,5076772],[445846,5076774],[445877,5076774],[445906,5076760],[445914,5076749]],[[445887.30148884,5076729.005770294],[445893.720941118,5076735.506547229],[445889.391171256,5076739.847201657],[445882.968658181,5076733.10833126],[445887.30148884,5076729.005770294]]]};
const boh = new L.Proj.GeoJSON(geojsonPROVAEPSG).addTo(mappaGIS);
// L.Proj.GeoJSON(geojsonPROVAEPSG).addTo(mappaGIS);

// async function getGeoJSON() {
//     let oggetto_geoJSON_DB = await fetch("/Main10ance_DB/GIS_prova", {method: "GET", headers: {"content-type": "application/json"} });
//     let resp_oggettoGeoJSON = await oggetto_geoJSON_DB.json();
//     const geoJSON_test_DB = L.geoJSON(resp_oggettoGeoJSON).addTo(mappaGIS);
//     geoJSON_test_DB.bindPopup('<b>SONO QUI!</b>');
//     geoJSON_test_DB.openPopup();
// }

// getGeoJSON();

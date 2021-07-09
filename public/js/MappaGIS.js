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

// MARKER SACRI MONTI

const oggettiSacriMonti = { /*QUESTI OGGETTI DOVRANNO PROVENIRE DAL DATABASE */
    sacriMonti:
        [
            {coord: [45.81852, 8.255573], nome: 'Varallo', sigla: 'SMV', urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFpbjEwYW5jZV9wZ18wOS0wNi0yMS9TTVZfVW5pdCVDMyVBMFZvbHVtZXRyaWNoZV8lN0IzRCU3RC5ydnQ='},
            {coord: [45.96224, 8.615456], nome: 'Ghiffa', sigla: 'SMG', urn: ''},
            {coord: [45.79683, 8.410177], nome: 'Orta', sigla: 'SMOT', urn: ''},
            {coord: [45.09435, 8.275465], nome: 'Crea', sigla: 'SMC', urn: ''},
            {coord: [45.62364, 7.982626], nome: 'Oropa', sigla: 'SMOP', urn: ''},
            {coord: [45.97477, 9.177286], nome: 'Ossuccio', sigla: 'SMOS', urn: ''},
            {coord: [45.85137, 8.796597], nome: 'Varese', sigla: 'SMVS', urn: ''},
            {coord: [46.10645, 8.288634], nome: 'Domodossola', sigla: 'SMD', urn: ''},
            {coord: [45.36900, 7.633821], nome: 'Belmonte', sigla: 'SMB', urn: ''},
            {coord: [46.17530, 8.793431], nome: 'Orselina', sigla: 'SMOR', urn: ''},
            {coord: [46.12088, 8.706110], nome: 'Brissago', sigla: 'SMBR', urn: ''},
        ]
};

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

oggettiSacriMonti.sacriMonti.forEach((sm) => {
    new MarkerSacroMonte(sm.coord, sm.nome, sm.sigla, sm.urn);
    new BottoneNavigazioneSM(sm.nome, sm.sigla, sm.coord);
});

// MARKER CAPPELLE

const oggettiCappelle = { /* ANCHE QUESTI OGGETTI DOVRANNO PROVENIRE DAL DATABASE */
    cappelle:
        [
            {coord: [45.81861, 8.256836], nome: 'Cappella 5', sigla: 'Capp5', descrizione: "L'adorazione dei Magi", urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFpbjEwYW5jZV9wZ18wOS0wNi0yMS9TTVZfQ2FwcF81LTlfdjIwMjAucnZ0'},
            {coord: [45.81851, 8.256810], nome: 'Cappella 6', sigla: 'Capp6', descrizione: "La Natività", urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFpbjEwYW5jZV9wZ18wOS0wNi0yMS9TTVZfQ2FwcF81LTlfdjIwMjAucnZ0'},
            {coord: [45.81854, 8.256743], nome: 'Cappella 7', sigla: 'Capp7', descrizione: "Adorazione dei pastori", urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFpbjEwYW5jZV9wZ18wOS0wNi0yMS9TTVZfQ2FwcF81LTlfdjIwMjAucnZ0'},
            {coord: [45.81845, 8.256847], nome: 'Cappella 8', sigla: 'Capp8', descrizione: "La presentazione al tempio", urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFpbjEwYW5jZV9wZ18wOS0wNi0yMS9TTVZfQ2FwcF81LTlfdjIwMjAucnZ0'},
            {coord: [45.81847, 8.256729], nome: 'Cappella 9', sigla: 'Capp9', descrizione: "Il secondo sogno di S. Giuseppe", urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFpbjEwYW5jZV9wZ18wOS0wNi0yMS9TTVZfQ2FwcF81LTlfdjIwMjAucnZ0'},
            {coord: [45.81856, 8.255797], nome: 'Cappella 20', sigla: 'Capp20', descrizione: "L'Ultima Cena", urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFpbjEwYW5jZV9wZ18wOS0wNi0yMS9TTVZfQ2FwcF8yMC0yM192MjAyMC5ydnQ='},
            {coord: [45.81861, 8.255662], nome: 'Cappella 21', sigla: 'Capp21', descrizione: "Gesù nell'Orto degli Ulivi", urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFpbjEwYW5jZV9wZ18wOS0wNi0yMS9TTVZfQ2FwcF8yMC0yM192MjAyMC5ydnQ='},
            {coord: [45.81865, 8.255523], nome: 'Cappella 22', sigla: 'Capp22', descrizione: "Gesù sveglia gli Apostoli", urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFpbjEwYW5jZV9wZ18wOS0wNi0yMS9TTVZfQ2FwcF8yMC0yM192MjAyMC5ydnQ='},
            {coord: [45.81876, 8.255385], nome: 'Cappella 23', sigla: 'Capp23', descrizione: "La cattura di Gesù", urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFpbjEwYW5jZV9wZ18wOS0wNi0yMS9TTVZfQ2FwcF8yMC0yM192MjAyMC5ydnQ='},
            {coord: [45.81883, 8.255247], nome: 'Cappella 27', sigla: 'Capp27', descrizione: "Gesù al tribunale di Pilato", urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFpbjEwYW5jZV9wZ18wOS0wNi0yMS9TTVZfQ2FwcF8yNy0zNV92MjAyMC5ydnQ='},
            {coord: [45.81883, 8.255160], nome: 'Cappella 29', sigla: 'Capp29', descrizione: "Gesù al tribunale di Pilato", urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFpbjEwYW5jZV9wZ18wOS0wNi0yMS9TTVZfQ2FwcF8yNy0zNV92MjAyMC5ydnQ='},
            {coord: [45.81883, 8.255077], nome: 'Cappella 30', sigla: 'Capp30', descrizione: "La flagellazione", urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFpbjEwYW5jZV9wZ18wOS0wNi0yMS9TTVZfQ2FwcF8yNy0zNV92MjAyMC5ydnQ='},
            {coord: [45.81874, 8.255077], nome: 'Cappella 31', sigla: 'Capp31', descrizione: "La coronazione di spine", urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFpbjEwYW5jZV9wZ18wOS0wNi0yMS9TTVZfQ2FwcF8yNy0zNV92MjAyMC5ydnQ='},
            {coord: [45.81868, 8.255079], nome: 'Cappella 32', sigla: 'Capp32', descrizione: "Gesù sale le scale del pretorio", urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFpbjEwYW5jZV9wZ18wOS0wNi0yMS9TTVZfQ2FwcF8yNy0zNV92MjAyMC5ydnQ='},
            {coord: [45.81875, 8.255335], nome: 'Cappella 33', sigla: 'Capp33', descrizione: "Ecce Homo", urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFpbjEwYW5jZV9wZ18wOS0wNi0yMS9TTVZfQ2FwcF8yNy0zNV92MjAyMC5ydnQ='},
            {coord: [45.81873, 8.255269], nome: 'Cappella 34', sigla: 'Capp34', descrizione: "Pilato si lava le mani", urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFpbjEwYW5jZV9wZ18wOS0wNi0yMS9TTVZfQ2FwcF8yNy0zNV92MjAyMC5ydnQ='},
            {coord: [45.81873, 8.255180], nome: 'Cappella 35', sigla: 'Capp35', descrizione: "Gesù condannato alla morte di croce", urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFpbjEwYW5jZV9wZ18wOS0wNi0yMS9TTVZfQ2FwcF8yNy0zNV92MjAyMC5ydnQ='},
            {coord: [45.81826, 8.255305], nome: 'Cappella 36', sigla: 'Capp36', descrizione: "La salita al Calvario", urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFpbjEwYW5jZV9wZ18wOS0wNi0yMS9TTVZfQ2FwcF8zNl92MjAyMC5ydnQ='},
        ]
};

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

oggettiCappelle.cappelle.forEach((c) => {
    const markerCappella = new MarkerCappella(c.coord, c.nome, c.sigla, c.descrizione, c.urn);
});

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


// async function getGeoJSON() {
//     let oggetto_geoJSON_DB = await fetch("http://localhost:3000/Main10ance_DB/GIS_prova", {method: "GET", headers: {"content-type": "application/json"} });
//     let resp_oggettoGeoJSON = await oggetto_geoJSON_DB.json();
//     const geoJSON_test_DB = L.geoJSON(resp_oggettoGeoJSON).addTo(mappaGIS);
//     geoJSON_test_DB.bindPopup('<b>SONO QUI!</b>');
//     geoJSON_test_DB.openPopup();
// }

// getGeoJSON();

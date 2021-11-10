// COORDINATE UTILI
const posOrigine = [45.61422, 8.410177];

const mappaGIS = L.map('mappa').setView(posOrigine, 8); // nel setView sono specificati: ([latitudine, longitudine], zoom)
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution, "detectRetina": false, "maxNativeZoom": 20, "maxZoom": 19, "minZoom": 0, "noWrap": false, "opacity": 1, "subdomains": "abc", "tms": false});
tiles.addTo(mappaGIS);

leggiDBMarkerSM();
leggiDBMarkerCapp();

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
const LivelloGIS = L.layerGroup();

// reset vista totale default mappa
const bottoneRefresh = document.getElementById('refreshGIS');
bottoneRefresh.addEventListener("click", () => {
    mappaGIS.setView(posOrigine, 8)
});

// prima interrogazione livelli GIS
const livelliGISdetails = document.getElementById('contenitore-livelli-details');
const livelliGISdiv = document.getElementById('contenitore-livelli-div-interno');
const livelliGISloading = document.getElementById('contenitore-livelli-loading');
livelliGISdetails.addEventListener('click', async () => {
    if (livelliGISdiv.innerHTML === '') {
        console.log('inizio');
        const tabelleGIS = await getTabelleGIS();
        leggiDBGIS(tabelleGIS).then(() => {
            livelliGISloading.style.display = 'none';
            livelliGISdiv.style.display = 'block';
            console.log('fine');
        });
    }
});

// classi per bottoni di navigazione e altro
class BottoneNavigazioneSM {
    constructor(nome, sigla, posizione) {
        this.nome = nome,
        this.sigla = sigla,
        this.posizione = posizione

        const bottoneNav = document.createElement('button');
        bottoneNav.setAttribute('id', `scegli${this.sigla}`);
        bottoneNav.setAttribute('class', 'selettoreSM-dropdown');
        bottoneNav.innerHTML = `Sacro Monte di ${this.nome}`;

        const contenitoreBottoniNav = document.getElementById('contenitore-selettori-2');
        contenitoreBottoniNav.appendChild(bottoneNav);
        contenitoreBottoniNav.appendChild(document.createElement('br'));

        bottoneNav.addEventListener('click', () => {
            mappaGIS.setView(this.posizione, 17);
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

        this.element = L.marker(this.coordinate, {icon: iconaSacriMonti}).bindPopup();

        const contenitorePopup = document.createElement('div');
        contenitorePopup.innerHTML = `<b>Sacro Monte di ${this.nome}</b><br>`;
        const selettoreSM = document.createElement('button');
        selettoreSM.setAttribute('id', `selettore_${this.sigla}`);
        selettoreSM.innerHTML = 'MODELLO';
        contenitorePopup.appendChild(selettoreSM);
        selettoreSM.addEventListener('click', () => {
            getModel(this.urn);
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

        this.element = L.marker(this.coordinate, {icon: iconaCappelle}).bindPopup();

        const contenitorePopup = document.createElement('div');
        contenitorePopup.innerHTML = `<b>${this.nome}</b><br>${this.descrizione}<br>`;
        const selettoreCapp = document.createElement('button');
        selettoreCapp.setAttribute('id', `selettore_${this.sigla}`);
        selettoreCapp.innerHTML = 'MODELLO';
        contenitorePopup.appendChild(selettoreCapp);
        selettoreCapp.addEventListener('click', () => {
            getModel(this.urn);
            mappaGIS.closePopup();
        });
        
        this.element.on('popupopen', () => {
            this.element._popup.setContent(contenitorePopup);
        });

        this.element.addTo(gruppoMarkerCappelle);
    }
}

class LayerGIS {
    constructor(tabella, alias, geometria, colonne) {
        this.tabella = tabella;
        this.alias = alias;
        this.geometria = geometria;
        this.colonne = colonne;
    }
    
    async inizializza() {
        const livelloTabella = L.layerGroup();
        const coloreRandom = `#${(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6)}`;

        const geojsonMarkerOptions = {
            radius: 8,
            color: coloreRandom,
            fillColor: coloreRandom,
            fillOpacity: 0.8,
        };
        
        function stileGeoJSON(feature) {
            return {
                color: coloreRandom,
            }
        }
        
        function stileGeoPointToLayer(feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
        
        const creaCheckbox = () => {
            // console.log('crea check');
            const contenitoreSpegniLiv = document.createElement('div');
            const spegniLivelloCheck = document.createElement('input');
            spegniLivelloCheck.setAttribute('id', `spegni-${this.tabella}`);
            spegniLivelloCheck.setAttribute('type', 'checkbox');
            const labelCheck = document.createElement('label');
            labelCheck.setAttribute('for', `spegni-${this.tabella}`);
            labelCheck.textContent = `${this.alias}`;
            contenitoreSpegniLiv.appendChild(spegniLivelloCheck);
            contenitoreSpegniLiv.appendChild(labelCheck);
            const contenitoreLivelli = document.getElementById('contenitore-livelli-div-interno');
            contenitoreLivelli.appendChild(contenitoreSpegniLiv);
            let visibilitàLivello = false;
            spegniLivelloCheck.addEventListener("click", () => {
                if (!spegniLivelloCheck.checked) {
                    mappaGIS.removeLayer(livelloTabella);
                }
                else {
                    mappaGIS.addLayer(livelloTabella);
                }
                visibilitàLivello = !visibilitàLivello;
            });
    
            spegniLivelloCheck.style.accentColor = coloreRandom;
            spegniLivelloCheck.style.marginRight = '10px';
        }

        const creaGeometria = (geo) => {
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

        // const creaGeometrie = async (listaGeo) => {
        //     listaGeo.forEach(geo => {
        //         creaGeometria(geo);
        //     });
        // }
        console.log(this.alias);
        const gis = await getGIS(this.tabella, this.alias, this.geometria, this.colonne.join(", "));
        const gisLun = gis.length;
        console.log(gisLun);

        gis.forEach(geo => {
            creaGeometria(geo);
        });
        // creaGeometrie(gis).then(() => {creaCheckbox();});

        creaCheckbox();
    }
}

// questa funzione è molto carina ma si potrebbe riarrangiare per ottenere l'URN da un'altra richiesta anziché da DB...
function getModel(urn) {
    if ((urn !== null) && (urn !== '')) {
        document.getElementById('apriTabBIM').click();
        if (urn !== urnModelloCorrente) {
            launchViewer(urn);
            urnModelloCorrente = urn;
        }
    }
    else {
        alert('Nessun modello presente per questo elemento');
    }
}

async function leggiDBMarkerSM() {
    try {
        const risultato = await fetch(`/t/DB_Servizio/MarkerSM`, {method: "GET", headers: {"content-type": "application/json"}});
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
        const risultato = await fetch(`/t/DB_Servizio/MarkerCapp`, {method: "GET", headers: {"content-type": "application/json"}});
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

proj4.defs("EPSG:32632","+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");

async function getGIS(tabella, alias, geometria, colonneUtili) {
    const oggettiGIS = await fetch("/t/Main10ance_DB/GIS", {method: "GET", headers: {"content-type": "application/json", "tabella": tabella, "alias": alias, "geometria": geometria, "colonneUtili": colonneUtili} });
    const resp_oggettiGIS = await oggettiGIS.json();
    return resp_oggettiGIS;
}

async function leggiDBGIS(tabGIS) {
    try {
        tabGIS.forEach(async tbl => {
            if (tbl.colonneUtili) {
                console.log(tbl.alias);
                await new LayerGIS(tbl.tabella, tbl.alias, tbl.geometria, tbl.colonneUtili).inizializza();
            }
        });
    }
    catch(e) {
        console.log('Errore nella lettura dei dati GIS');
        console.log(e);
    }
}

async function getTabelleGIS() {
    const tabelleGIS = await fetch("/t/DB_Servizio/LOD/TabelleGIS", {method: "GET", headers: {"content-type": "application/json"} });
    const resp_tabelleGIS = await tabelleGIS.json();
    return resp_tabelleGIS;
}

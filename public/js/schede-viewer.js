const tabContenitoreSchede = document.getElementById('tabSchede');
const divContenitoreSchede = document.getElementById('contenitore-schede');

divContenitoreSchede.innerHTML = '';

// const tabellaSchede = creaStrutturaSchede();
// azioniPreliminari();

compilaTabelleControllo();

// function azioniPreliminari() {
//     const titoloTabella = document.createElement('h4');
//     titoloTabella.setAttribute('id', 'tabella-titolo');
//     titoloTabella.innerHTML = '<b>SCHEDE</b>';

//     tabContenitoreSchede.appendChild(titoloTabella);
//     // tabContenitoreSchede.appendChild(document.createElement('br'));
// }

function creaStrutturaSchede() {
    const tabellaSchede = document.createElement('table');
    // tabellaSchede.setAttribute('id', 'tabella-schede');
    tabellaSchede.className = 'schede tabella-schede';
    const captionSchede = document.createElement('caption');
    // captionSchede.setAttribute('id', 'caption-schede');
    captionSchede.className = 'schede caption-schede';
    // captionSchede.innerHTML = ``;

    tabellaSchede.appendChild(captionSchede);

    divContenitoreSchede.appendChild(tabellaSchede);

    return [tabellaSchede, captionSchede];
}

async function compilaTabelleControllo() {
    divContenitoreSchede.innerHTML = '';

    const listaSchedeControlloComplete = await prendiSchedeControllo();
    listaSchedeControlloComplete.forEach(scheda => {
        console.log(scheda);
        const [tabellaSchede, captionSchede] = creaStrutturaSchede();
        captionSchede.innerHTML = `<b>SCHEDA N. ${scheda["Codice scheda controllo"]}</b>`;
        for (const [chiave, valore] of Object.entries(scheda)) {
            const trScheda = document.createElement('tr');
            trScheda.className = 'schede tr-schede';
            const tdChiave = document.createElement('td');
            tdChiave.innerHTML = `<b>${chiave}</b>`;
            tdChiave.style.width = '400px';
            tdChiave.className = 'schede td-schede';
            const tdValore = document.createElement('td');
            tdValore.innerHTML = `${valore}`;
            tdValore.className = 'schede td-schede';
            trScheda.appendChild(tdChiave);
            trScheda.appendChild(tdValore);
            tabellaSchede.appendChild(trScheda);
        }
        tabellaSchede.appendChild(document.createElement('br'));
    });
    return;
}

async function prendiSchedeControllo() {
    const risultato = await fetch('/Main10ance_DB/tabellaDB/schede-controllo-2', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

function filtraSchedeConID() {
    compilaTabelleControllo();
    const insiemeTabelle = document.querySelectorAll('.tabella-schede');
    insiemeTabelle.forEach(tab => {
        console.log(tab);
    });
}

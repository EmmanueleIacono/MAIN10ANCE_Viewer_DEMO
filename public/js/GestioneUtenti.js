const bottoneTabUtenti = document.getElementById('apriTabUtenti');
const contenitoreGestioneUtenti = document.getElementById('contenitore-gestione-utenti');
const utenteCorrente = document.getElementById('liUsernameNavbar').innerText;

bottoneTabUtenti.addEventListener('click', popolaGestioneUtenti);

async function popolaGestioneUtenti() {
    contenitoreGestioneUtenti.innerHTML = '';
    const infoUtenti = await getInfoGestioneUtenti();
    const infoRuoli = await getRuoliEnum();
    const tabellaUtenti = document.createElement('table');
    creaHeadersTabellaUtenti(tabellaUtenti);
    infoUtenti.forEach((utente, ind) => {
        const trUtente = creaModuloGestioneUtenti(utente, ind, infoRuoli);
        tabellaUtenti.appendChild(trUtente);
    });
    contenitoreGestioneUtenti.appendChild(tabellaUtenti);
}

function creaHeadersTabellaUtenti(tabella) {
    const intestazioni = ['Utenti', 'E-mail', 'Ruolo'];
    const tr = document.createElement('tr');
    tabella.appendChild(tr);
    intestazioni.forEach(int => {
        const th = document.createElement('th');
        th.innerText = int;
        tr.appendChild(th);
    });
}

function creaModuloGestioneUtenti(user, id, ruoli) {
    const contenitoreUser = document.createElement('tr');
    const tdUser = document.createElement('td');
    const tdEmail = document.createElement('td');
    const tdRuolo = document.createElement('td');
    const selectRuolo = document.createElement('select');
    const bottoneAggiornaRuolo = document.createElement('button');
    tdRuolo.setAttribute('id', `${id}-${user.ruolo}`);
    ruoli.forEach(r => {
        const optionRuolo = document.createElement('option');
        optionRuolo.setAttribute('value', r);
        optionRuolo.innerText = r;
        selectRuolo.appendChild(optionRuolo);
    });
    tdRuolo.appendChild(selectRuolo);
    tdRuolo.appendChild(bottoneAggiornaRuolo);
    tdUser.innerText = user.user;
    tdEmail.innerText = user.email;
    selectRuolo.value = user.ruolo;
    if (user.user === utenteCorrente) {
        selectRuolo.disabled = true;
        bottoneAggiornaRuolo.disabled = true;
    }
    bottoneAggiornaRuolo.innerText = 'MODIFICA';
    bottoneAggiornaRuolo.style.float = 'right';
    bottoneAggiornaRuolo.addEventListener('click', () => {
        const ruoloOld = tdRuolo.id.split('-')[1];
        if (ruoloOld !== selectRuolo.value) {
            nuovoRuoloUtente(tdUser.innerText, selectRuolo.value);
        }
    });
    contenitoreUser.appendChild(tdUser);
    contenitoreUser.appendChild(tdEmail);
    contenitoreUser.appendChild(tdRuolo);
    return contenitoreUser;
}

async function getInfoGestioneUtenti() {
    const utentiRaw = await fetch("/a/utenti", {method: "GET", headers: {"content-type": "application/json"} });
    const utenti = await utentiRaw.json();
    return utenti;
}

async function getRuoliEnum() {
    const ruoliRaw = await fetch("/a/ruoli", {method: "GET", headers: {"content-type": "application/json"} });
    const ruoli = await ruoliRaw.json();
    return ruoli;
}

async function nuovoRuoloUtente(user, ruolo) {
    const userJson = {
        user,
        ruolo
    }
    const res = await updateRuoloUtente(userJson);
    if (res) {
        popolaGestioneUtenti();
    }
    else {
        alert('Operazione fallita');
        popolaGestioneUtenti();
    }
}

async function updateRuoloUtente(infoJson) {
    let ris;
    try {
        const risultatoRaw = await fetch("/a/ruoli/nuovo-ruolo", {method: "PATCH", headers: {"content-type": "application/json"}, body: JSON.stringify(infoJson) });
        const risultato = await risultatoRaw.json();
        ris = risultato.success;
    }
    catch(e) {
        console.log("Errore nell'aggiornamento dei ruoli");
        console.log(e);
        ris = false;
    }
    finally {
        return ris;
    }
}

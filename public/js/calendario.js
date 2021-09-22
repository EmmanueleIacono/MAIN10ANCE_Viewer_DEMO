const apriTabDB = document.getElementById('apriTabDatabase');
const apriTabSchede = document.getElementById('apriTabSchede');

const calendarEl = document.getElementById('calendar');
const calendar = new FullCalendar.Calendar(calendarEl, {
    timeZone: 'local',
    locale: 'it',
    initialView: 'dayGridMonth',
    eventMouseEnter: (info) => {
        info.el.style.cursor = 'pointer';
        info.el.title = info.event.title;
    },
    eventClick: (info) => {
        if (info.event.title.startsWith('Controllo')) {
            // alert(`Fenomeno: ${info.event.extendedProps.fenomeno} \nControllo: ${info.event.extendedProps.attività} \nElementi controllati: ${(info.event.extendedProps.elementi).join(', ')}`);
            const aprireScheda = confirm(`Visualizzare scheda? \nFenomeno: ${info.event.extendedProps.fenomeno} \nControllo: ${info.event.extendedProps.attività} \nElementi controllati: ${(info.event.extendedProps.elementi).join(', ')}`);
            if (aprireScheda) {
                apriTabSchede.click();
                checkGenerale.checked = false;
                filtraSchedeDaID(info.event.id);
            }
            // apriTabSchede.click();
            // filtraSchedeDaID(info.event.id);
        }
        else if (info.event.title.startsWith('Manutenzione')) {
            const aprireScheda = confirm(`Visualizzare scheda? \nFenomeno: ${info.event.extendedProps.fenomeno} \nAttività: ${info.event.extendedProps.attività} \nElementi interessati: ${(info.event.extendedProps.elementi).join(', ')}`);
            if (aprireScheda) {
                apriTabSchede.click();
                if (checkGenerale.checked) {checkGenerale.click();}
                filtraSchedeDaID(info.event.id);
            }
            // apriTabSchede.click();
            // filtraSchedeDaID(info.event.id);
        }
        else {
            alert(info.event.title);
        }
        // console.log(info);
    },
});

apriTabDB.addEventListener('click', () => {
    renderizzaCalendario();
    creaEventiControllo();
    creaEventiManReg();
    creaEventiManCorr();
});

function renderizzaCalendario() {
    calendar.render();
    const listaEventi = calendar.getEvents();
    listaEventi.forEach(evt => {
        evt.remove();
    });
}

const eventoTest = {
    id: 'qwerty',
    title: 'Modulo formativo Main10ance',
    start: '2021-09-23',
    defaultAllDay: true,
};

const eventoTest2 = {
    id: 'qwertypoi',
    title: 'Gianvito presenta',
    start: '2021-10-05',
    defaultAllDay: true,
};

const eventoTest3 = {
    id: 'hgjghj',
    title: 'Francesca presenta',
    start: '2021-10-05',
    defaultAllDay: true,
};

const eventoTest4 = {
    id: 'bnmnbm',
    title: 'Emmanuele presenta',
    start: '2021-10-05',
    defaultAllDay: true,
};

calendar.addEvent(eventoTest);
calendar.addEvent(eventoTest2);
calendar.addEvent(eventoTest3);
calendar.addEvent(eventoTest4);

async function creaEventiControllo() {
    const listaEventi = await prendiEventiControllo();
    listaEventi.forEach(ev => {
        let listaOpere = [];
        ev.id_main10ance.forEach(id => {
            const opera = id.split('|')[2];
            if (!(listaOpere.includes(opera))) {
                listaOpere.push(opera);
            }
        });
        const eventoControllo = {
            id: ev.id_dad,
            title: `Controllo ${listaOpere.join(', ')}`,
            start: ev.data_con,
            defaultAllDay: true,
            extendedProps: {
                fenomeno: ev.rid_gloss,
                elementi: ev.id_main10ance,
                attività: ev.controllo,
            },
            backgroundColor: '#a8c956',
            borderColor: '#a8c956',
            textColor: '#f8f8ff',
        };
        calendar.addEvent(eventoControllo);
    });
}

async function creaEventiManReg() {
    const listaEventi = await prendiEventiManReg();
    listaEventi.forEach(ev => {
        let listaOpere = [];
        ev.id_main10ance.forEach(id => {
            const opera = id.split('|')[2];
            if (!(listaOpere.includes(opera))) {
                listaOpere.push(opera);
            }
        });
        const eventoManReg = {
            id: ev.id_mn_reg,
            title: `Manutenzione regolare ${listaOpere.join(', ')}`,
            start: ev.data_ese,
            defaultAllDay: true,
            extendedProps: {
                fenomeno: ev.rid_gloss,
                elementi: ev.id_main10ance,
                controllo: ev.id_contr,
                attività: ev.azione,
            },
            backgroundColor: '#5f87c2',
            borderColor: '#5f87c2',
            textColor: '#f8f8ff',
        };
        calendar.addEvent(eventoManReg);
    });
}

async function creaEventiManCorr() {
    const listaEventi = await prendiEventiManCorr();
    listaEventi.forEach(ev => {
        let listaOpere = [];
        ev.id_main10ance.forEach(id => {
            const opera = id.split('|')[2];
            if (!(listaOpere.includes(opera))) {
                listaOpere.push(opera);
            }
        });
        const eventoManCorr = {
            id: ev.id_mn_gu,
            title: `Manutenzione correttiva ${listaOpere.join(', ')}`,
            start: ev.data_ese,
            defaultAllDay: true,
            extendedProps: {
                fenomeno: ev.rid_gloss,
                elementi: ev.id_main10ance,
                controllo: ev.id_contr,
                attività: ev.azione,
            },
            backgroundColor: '#1a4f9c',
            borderColor: '#1a4f9c',
            textColor: '#f8f8ff',
        };
        calendar.addEvent(eventoManCorr);
    });
}

async function prendiEventiControllo() {
    const risultato = await fetch('/Main10ance_DB/tabellaDB/schede-controllo', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function prendiEventiManReg() {
    const risultato = await fetch('/Main10ance_DB/tabellaDB/eventi-manutenzione-regolare', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function prendiEventiManCorr() {
    const risultato = await fetch('/Main10ance_DB/tabellaDB/eventi-manutenzione-correttiva', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

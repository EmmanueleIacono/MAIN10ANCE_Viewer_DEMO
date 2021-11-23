"use strict";

const apriTabDashboard = document.getElementById('apriTabDashboard');
const apriTabSchede = document.getElementById('apriTabSchede');

const calendarEl = document.getElementById('calendar');
const calendar = new FullCalendar.Calendar(calendarEl, {
    timeZone: 'local',
    locale: 'it',
    initialView: 'dayGridMonth',
    headerToolbar: {
        left: 'dayGridMonth,timeGridWeek',
        center: 'title',
        right: 'prevYear,prev,next,nextYear'
    },
    eventMouseEnter: (info) => {
        info.el.style.cursor = 'pointer';
        info.el.title = info.event.title;
    },
    eventClick: (info) => {
        if (info.event.title.startsWith('Controllo')) {
            const aprireScheda = confirm(`Visualizzare scheda? \n \nFenomeno: ${info.event.extendedProps.fenomeno} \nControllo: ${info.event.extendedProps.attività} \nElementi controllati: ${(info.event.extendedProps.elementi).join(', ')}`);
            if (aprireScheda) {
                if (checkGenerale.checked) {checkGenerale.click();}
                filtraSchedeDaID(info.event.id);
            }
        }
        else if (info.event.title.startsWith('Manutenzione')) {
            const aprireScheda = confirm(`Visualizzare scheda? \n \nFenomeno: ${info.event.extendedProps.fenomeno} \nAttività: ${info.event.extendedProps.attività} \nElementi interessati: ${(info.event.extendedProps.elementi).join(', ')}`);
            if (aprireScheda) {
                if (checkGenerale.checked) {checkGenerale.click();}
                filtraSchedeDaID(info.event.id);
            }
        }
        else if (info.event.title.startsWith('Programmata')) {
            const aprireScheda = confirm(`Visualizzare scheda controllo collegata? \n \nIntervento PROGRAMMATO: \n \nFenomeno: ${info.event.extendedProps.fenomeno} \nIntervento: ${info.event.extendedProps.attività} \nElementi interessati: ${(info.event.extendedProps.elementi).join(', ')}`);
            if (aprireScheda) {
                const idSchedaCollegata = info.event.id.split('-')[1];
                filtraSchedeDaID(idSchedaCollegata);
            }
        }
        else {
            alert(info.event.title);
        }
    },
});

const calendarEl2 = document.getElementById('calendar2');
const calendar2 = new FullCalendar.Calendar(calendarEl2, {
    timeZone: 'local',
    locale: 'it',
    initialView: 'dayGridMonth',
    headerToolbar: {
        left: 'dayGridMonth,timeGridWeek',
        center: 'title',
        right: 'prevYear,prev,next,nextYear'
    },

    eventMouseEnter: (info) => {
        info.el.style.cursor = 'pointer';
        info.el.title = info.event.title;
    },
    eventClick: (info) => {
        alert('bisogna fare qualcosa qui');
    },
});

apriTabSchede.addEventListener('click', () => {popolaCalendario(calendar);});
apriTabDashboard.addEventListener('click', () => {
    popolaCalendario(calendar2);
});

function renderizzaCalendario(cal) {
    cal.render();
    const listaEventi = cal.getEvents();
    listaEventi.forEach(evt => {
        evt.remove();
    });
}

async function popolaCalendario(cal) {
    renderizzaCalendario(cal);
    const eventiC = await creaEventiControllo(cal);
    const eventiMR = await creaEventiManReg(cal);
    const eventiMC = await creaEventiManCorr(cal);
    creaEventiProgrammati(cal, eventiC, eventiMR, eventiMC);
    ripulisciEventiProgrammatiMR(cal);
    // ripulisciEventiProgrammatiMC();
}

async function creaEventiControllo(cal) {
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
        cal.addEvent(eventoControllo);
    });
    return listaEventi;
}

async function creaEventiManReg(cal) {
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
            title: `Manutenzione ordinaria ${listaOpere.join(', ')}`,
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
        cal.addEvent(eventoManReg);
    });
    return listaEventi;
}

async function creaEventiManCorr(cal) {
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
        cal.addEvent(eventoManCorr);
    });
    return listaEventi;
}

function creaEventiProgrammati(cal, listaControlli, listaManReg, listaManCorr) {
    const mesiUrgenze = {
        "uc 0 - a lungo termine": '36',
        "uc 1 - termine intermedio": '12',
        "uc 2 - breve termine": '6',
        "uc 3 - urgente e immediato": '1'
    };
    // console.log(listaControlli);
    // console.log(listaManReg);
    // console.log(listaManCorr);
    // let listaIdContrManReg = [];
    // listaManReg.forEach(mr => {
    //     listaIdContrManReg.push(mr.id_contr);
    // });
    const listaIdContrManReg = listaManReg.map(mr => mr.id_contr);
    // let listaIdContrManCorr = [];
    // listaManCorr.forEach(mc => {
    //     listaIdContrManCorr.push(mc.id_contr);
    // });
    const listaIdContrManCorr = listaManCorr.map(mc => mc.id_contr);
    listaControlli.forEach(con => {
        const idC = con.id_dad;
        const dataC = con.data_con;
        if (con.mn_reg) {
            const mesiFuturi = con.frequenza;
            const quanteRipetizioni = 10;
            // if (!(listaIdContrManReg.includes(idC))) {
                for (let n=1; n<=quanteRipetizioni; n++) {
                    const eventoProgrammato = {
                        id: `P${n}-${idC}`,
                        title: `Programmata manutenzione ordinaria`,
                        start: aggiungiMesi(dataC, (parseInt(mesiFuturi)*n)),
                        defaultAllDay: true,
                        extendedProps: {
                            fenomeno: con.rid_gloss,
                            elementi: con.id_main10ance,
                            attività: con.mn_reg,
                        },
                        backgroundColor: '#c74646',
                        borderColor: '#c74646',
                        textColor: '#f8f8ff',
                    };
                    cal.addEvent(eventoProgrammato);
                }
            // }
        }
        else if (con.mn_nec) {
            const mesiFuturi = mesiUrgenze[con.liv_urg];
            if (!(listaIdContrManCorr.includes(idC))) {
                const eventoProgrammato = {
                    id: `P-${idC}`,
                    title: `Programmata manutenzione correttiva`,
                    start: aggiungiMesi(dataC, mesiFuturi),
                    defaultAllDay: true,
                    extendedProps: {
                        fenomeno: con.rid_gloss,
                        elementi: con.id_main10ance,
                        attività: con.mn_nec,
                    },
                    backgroundColor: '#c74646',
                    borderColor: '#c74646',
                    textColor: '#f8f8ff',
                };
                cal.addEvent(eventoProgrammato);
            }
        }
    });
}

function ripulisciEventiProgrammatiMR(cal) {
    const listaEventiCal = cal.getEvents();
    listaEventiCal.forEach(evt => {
        if (evt.title === 'Programmata manutenzione ordinaria') {
            const controlloRif = evt.id.split('-')[1];
            const dataProgrammata = evt.start;
            listaEventiCal.forEach(e => {
                if ((e.extendedProps.controllo) && (e.extendedProps.controllo === controlloRif)) {
                    const dataManutenzione = e.start;
                    const manAvvenuta = confrontaMesi(dataProgrammata, dataManutenzione);
                    if (manAvvenuta) {
                        evt.remove();
                    }
                }
            });
        }
    });
}

function ripulisciEventiProgrammatiMC() {
    return;
}

function confrontaDate(data1, data2) {
    const msData1 = Date.parse(data1);
    const msData2 = Date.parse(data2);
    if (msData1<=msData2) {
        return true; // data1 viene prima di data2
    }
    else {
        return false; // data2 viene prima di data1
    }
}

function confrontaMesi(dataProgrammata, dataManutenzione) {
    const meseDataProg = Date.parse(new Date(dataProgrammata.getFullYear(), dataProgrammata.getMonth(), 1));
    const meseDataMan = Date.parse(new Date(dataManutenzione.getFullYear(), dataManutenzione.getMonth(), 1));
    if (meseDataProg<=meseDataMan) { // controllo il mese, non la data esatta
        return true; // MANUTENZIONE EFFETTUATA, TOGLIERE EVENTO PROGRAMMATO
    }
    else {
        return false; // MANUTENZIONE NON EFFETTUATA, MANTENERE EVENTO PROGRAMMATO
    }
}

function aggiungiMesi(data, mesi) {
    const dataDiPartenza = new Date(Date.parse(data));
    const mesiDaAggiungere = parseInt(mesi);
    const dataFuturaFull = new Date(dataDiPartenza.setMonth(dataDiPartenza.getMonth()+mesiDaAggiungere));
    const dataFutura = dataFuturaFull.toISOString().split('T')[0];
    return dataFutura;
}

async function prendiEventiControllo() {
    const risultato = await fetch('/o/Main10ance_DB/tabellaDB/schede-controllo', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function prendiEventiManReg() {
    const risultato = await fetch('/o/Main10ance_DB/tabellaDB/eventi-manutenzione-regolare', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

async function prendiEventiManCorr() {
    const risultato = await fetch('/o/Main10ance_DB/tabellaDB/eventi-manutenzione-correttiva', {method: "GET", headers: {"content-type": "application/json"}});
    const risTradotto = await risultato.json();
    return risTradotto;
}

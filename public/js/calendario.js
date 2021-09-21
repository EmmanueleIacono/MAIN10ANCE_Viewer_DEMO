const apriTabDB = document.getElementById('apriTabDatabase');

const calendarEl = document.getElementById('calendar');
const calendar = new FullCalendar.Calendar(calendarEl, {
    timeZone: 'local',
    locale: 'it',
    initialView: 'dayGridMonth'
});

// document.addEventListener('DOMContentLoaded', () => {
//     const calendarEl = document.getElementById('calendar');
//     const calendar = new FullCalendar.Calendar(calendarEl, {
//         initialView: 'dayGridMonth'
//     });
//     calendar.render();
// });

apriTabDB.addEventListener('click', renderizzaCalendario);

function renderizzaCalendario() {
    calendar.render();
}

const eventoTest = {
    id: 'qwerty',
    title: 'Modulo formativo Main10ance',
    start: '2021-09-23'
};

const eventoTest2 = {
    id: 'qwertypoi',
    title: 'Gianvito presenta',
    start: '2021-10-05'
};

// calendar.addEvent(eventoTest);
// calendar.addEvent(eventoTest2);

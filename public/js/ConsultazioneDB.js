const contenitoreDB = document.getElementById('tabDatabase');

const listaLOD5 = ['controllo_stato_di_conservazione_livello_di_urgenza', 'danno_alterazione_degrado', 'frase_di_rischio', 'glossario', 'manutenzione_correttiva_o_a_guasto', 'manutenzione_regolare', 'restauri'];
const listaLOD4 = ['arredo', 'dipinto_murale', 'pavimento_decorativo', 'quadro',  'statua'];
const listaLOD3 = ['apparato_decorativo', 'catena', 'finestra', 'grata', 'muro', 'pavimento', 'pilastro', 'porta', 'scala', 'tetto', 'trave', 'volta'];

const listaComplessiSMV = ['1', '2-3-4', '5-6-7-8-9', '10', '11', '12', '13', '14', '15', '16-24', '17', '18', '19', '20-21-22-23', '25-26', '27-29-30-31-32-33-34-35', '28', '36', '37-38-39', '40-41-42-43-44', '45'];

const selectSM = document.getElementById('selectSM');

const selezioneCapp = document.getElementById('selectCappella');
for (let n = 1; n <= 45; n++) {
    const opzioneCapp = document.createElement('option');
    opzioneCapp.setAttribute('value', `${n}`);
    opzioneCapp.innerHTML = `Cappella ${n}`;
    selezioneCapp.appendChild(opzioneCapp);
}

// const selezioneEdf = document.getElementById('selectEdificio');
// listaComplessiSMV.forEach(edf => {
//     const opzioneEdf = document.createElement('option');
//     opzioneEdf.setAttribute('value', `${edf}`);
//     opzioneEdf.innerHTML = `${edf}`;
//     selezioneEdf.appendChild(opzioneEdf);
// });

const contenitoreRisultatiDB = document.getElementById('risultatiDB');

async function prendiTabelle() {
    try {
        const risultato = await fetch("/Main10ance_DB/tabelle", {method: "GET", headers: {"content-type": "application/json"} });
        const tabelle = await risultato.json();
        // console.log(tabelle);
        tabelle.forEach(t => {
            if (listaLOD5.includes(t.table_name)) {
                const opzioneLOD5 = document.createElement('option');
                opzioneLOD5.setAttribute('value', t.table_name);
                opzioneLOD5.innerHTML = `${t.table_name}`;
                document.getElementById('selectLOD5').appendChild(opzioneLOD5);
            }
            else if (listaLOD4.includes(t.table_name)) {
                const opzioneLOD4 = document.createElement('option');
                opzioneLOD4.setAttribute('value', t.table_name);
                opzioneLOD4.innerHTML = `${t.table_name}`;
                document.getElementById('selectLOD4').appendChild(opzioneLOD4);
            }
            else if (listaLOD3.includes(t.table_name)) {
                const opzioneLOD3 = document.createElement('option');
                opzioneLOD3.setAttribute('value', t.table_name);
                opzioneLOD3.innerHTML = `${t.table_name}`;
                document.getElementById('selectLOD3').appendChild(opzioneLOD3);
            }
            else {
                console.log(t.table_name);
                // console.log('vabbe');
            }
        });
    }
    catch(e) {
        console.log('Errore nella richiesta al server');
        console.log(e);
    }
}

async function prendiSacriMonti() {
    try {
        const risultato = await fetch(`/DB_Servizio/MarkerSM`, {method: "GET", headers: {"content-type": "application/json"}});
        const sacriMontiJson = await risultato.json();

        sacriMontiJson.forEach((smjson) => {
            // console.log('nome: '+smjson.nome);
            // console.log('sigla: '+smjson.sigla);
            const opzioneSM = document.createElement('option');
            opzioneSM.setAttribute('value', smjson.sigla);
            opzioneSM.setAttribute('id', `${smjson.sigla}-${smjson.n_cappelle}`);
            opzioneSM.innerHTML = smjson.nome;
            selectSM.appendChild(opzioneSM);
        });
    }
    catch(e) {
        console.log('Errore nella richiesta al server');
        console.log(e);
    }
}

prendiTabelle();
prendiSacriMonti();


/*
SELECT * FROM information_schema.tables;
SELECT * FROM information_schema.tables WHERE table_schema = "main10ance_sacrimonti";
SELECT * FROM information_schema.tables WHERE table_schema = 'main10ance_sacrimonti';
SELECT * FROM information_schema.foreign_tables;
SELECT * FROM information_schema.referential_constraints;
SELECT * FROM information_schema.table_constraints;
SELECT * FROM information_schema.table_privileges;
SELECT * FROM information_schema.constraint_table_usage;
SELECT * FROM information_schema.constraint_column_usage;
SELECT * FROM information_schema.check_constraints;




select tablename as mytable from pg_tables where schemaname ='main10ance_sacrimonti' --> QUESTO FA SELEZIONARE UNA PER UNA TUTTE LE TABELLE
*/
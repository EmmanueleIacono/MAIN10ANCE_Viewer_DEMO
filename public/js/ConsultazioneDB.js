const contenitoreDB = document.getElementById('tabDatabase');

const listaLOD5 = ['controllo_stato_di_conservazione_livello_di_urgenza', 'danno_alterazione_degrado', 'frase_di_rischio', 'glossario', 'manutenzione_correttiva_o_a_guasto', 'manutenzione_regolare', 'restauri'];
const listaLOD4 = ['arredo', 'dipinto_murale', 'pavimento_decorativo', 'quadro',  'statua'];
const listaLOD3 = ['apparato_decorativo', 'catena', 'finestra', 'grata', 'muro', 'pavimento', 'pilastro', 'porta', 'scala', 'tetto', 'trave', 'volta'];

const listaComplessiSMV = ['1', '2-3-4', '5-6-7-8-9', '10', '11', '12', '13', '14', '15', '16-24', '17', '18', '19', '20-21-22-23', '25-26', '27-29-30-31-32-33-34-35', '28', '36', '37-38-39', '40-41-42-43-44', '45'];

const selezioneCapp = document.getElementById('selectCappella');
for (let n = 1; n <= 45; n++) {
    const opzioneCapp = document.createElement('option');
    opzioneCapp.setAttribute('value', `${n}`);
    opzioneCapp.innerHTML = `Cappella ${n}`;
    selezioneCapp.appendChild(opzioneCapp);
}

const selezioneEdf = document.getElementById('selectEdificio');
listaComplessiSMV.forEach(edf => {
    const opzioneEdf = document.createElement('option');
    opzioneEdf.setAttribute('value', `${edf}`);
    opzioneEdf.innerHTML = `${edf}`;
    selezioneEdf.appendChild(opzioneEdf);
});

async function prendiTabelle() {
    try {
        // contenitoreDB.innerHTML = "";
        // const formLOD = document.createElement('form');
        // formLOD.setAttribute('id', `formLOD`);
        // contenitoreDB.appendChild(formLOD);

        // LOD 3
        // const nomeTendinaLOD3 = 'tendinaLOD3'
        // const labelTendinaLOD3 = document.createElement('label');
        // labelTendinaLOD3.setAttribute('for', `${nomeTendinaLOD3}`);
        // labelTendinaLOD3.innerHTML = 'LOD 3: ';
        // const tendinaLOD3 = document.createElement('select');
        // tendinaLOD3.setAttribute('id', `${nomeTendinaLOD3}`);
        // tendinaLOD3.setAttribute('name', `${nomeTendinaLOD3}`);
        // contenitoreDB.appendChild(formLOD);
        // formLOD.appendChild(labelTendinaLOD3);
        // formLOD.appendChild(tendinaLOD3);

        // const segnapostoLOD3 = document.createElement('div');
        // const titoloSegnapostoLOD3 = document.createElement('h4');
        // titoloSegnapostoLOD3.innerHTML = 'Elementi';
        // segnapostoLOD3.appendChild(titoloSegnapostoLOD3);
        // formLOD.appendChild(segnapostoLOD3);
        // LOD 4
        // const nomeTendinaLOD4 = 'tendinaLOD4'
        // const labelTendinaLOD4 = document.createElement('label');
        // labelTendinaLOD4.setAttribute('for', `${nomeTendinaLOD4}`);
        // labelTendinaLOD4.innerHTML = 'LOD 4: ';
        // const tendinaLOD4 = document.createElement('select');
        // tendinaLOD4.setAttribute('id', `${nomeTendinaLOD4}`);
        // tendinaLOD4.setAttribute('name', `${nomeTendinaLOD4}`);
        // // contenitoreDB.appendChild(formLOD);
        // formLOD.appendChild(labelTendinaLOD4);
        // formLOD.appendChild(tendinaLOD4);

        // const segnapostoLOD4 = document.createElement('div');
        // const titoloSegnapostoLOD4 = document.createElement('h4');
        // titoloSegnapostoLOD4.innerHTML = 'Arredo';
        // segnapostoLOD4.appendChild(titoloSegnapostoLOD4);
        // formLOD.appendChild(segnapostoLOD4);
        // LOD 5
        // const nomeTendinaLOD5 = 'tendinaLOD5'
        // const labelTendinaLOD5 = document.createElement('label');
        // labelTendinaLOD5.setAttribute('for', `${nomeTendinaLOD5}`);
        // labelTendinaLOD5.innerHTML = 'LOD 5: ';
        // const tendinaLOD5 = document.createElement('select');
        // tendinaLOD5.setAttribute('id', `${nomeTendinaLOD5}`);
        // tendinaLOD5.setAttribute('name', `${nomeTendinaLOD5}`);
        // // contenitoreDB.appendChild(formLOD);
        // formLOD.appendChild(labelTendinaLOD5);
        // formLOD.appendChild(tendinaLOD5);

        const risultato = await fetch("/Main10ance_DB/tabelle", {method: "GET", headers: {"content-type": "application/json"} });
        const tabelle = await risultato.json();
        // console.log(tabelle);
        tabelle.forEach(t => {
            if (!((t.table_name).startsWith('nm'))) {
                // const tastoTabella = document.createElement('button');
                // tastoTabella.setAttribute('id', `${t.table_name}`);
                // tastoTabella.innerHTML = `${t.table_name}`;
                // contenitoreDB.appendChild(tastoTabella);
                if (listaLOD5.includes(t.table_name)) {
                    const opzioneLOD5 = document.createElement('option');
                    opzioneLOD5.setAttribute('value', t.table_name);
                    opzioneLOD5.innerHTML = `${t.table_name}`;
                    // tendinaLOD5.appendChild(opzioneLOD5);
                    document.getElementById('selectLOD5').appendChild(opzioneLOD5);
                }
                else if (listaLOD4.includes(t.table_name)) {
                    const opzioneLOD4 = document.createElement('option');
                    opzioneLOD4.setAttribute('value', t.table_name);
                    opzioneLOD4.innerHTML = `${t.table_name}`;
                    // tendinaLOD4.appendChild(opzioneLOD4);
                    document.getElementById('selectLOD4').appendChild(opzioneLOD4);
                }
                // else if (listaLOD4.includes(t.table_name)) {
                //     const inputLOD4 = document.createElement('input');
                //     inputLOD4.setAttribute('type', 'checkbox');
                //     inputLOD4.setAttribute('id', t.table_name);
                //     inputLOD4.setAttribute('name', t.table_name);
                //     inputLOD4.setAttribute('value', t.table_name);
                //     const labelInputLOD4 = document.createElement('label');
                //     labelInputLOD4.setAttribute('for', t.table_name);
                //     labelInputLOD4.innerHTML = `${t.table_name}`;
                //     segnapostoLOD4.appendChild(inputLOD4);
                //     segnapostoLOD4.appendChild(labelInputLOD4);
                //     segnapostoLOD4.appendChild(document.createElement('br'));
                // }
                else if (listaLOD3.includes(t.table_name)) {
                    const opzioneLOD3 = document.createElement('option');
                    opzioneLOD3.setAttribute('value', t.table_name);
                    opzioneLOD3.innerHTML = `${t.table_name}`;
                    // tendinaLOD3.appendChild(opzioneLOD3);
                    document.getElementById('selectLOD3').appendChild(opzioneLOD3);
                }
                // else if (listaLOD3.includes(t.table_name)) {
                //     const inputLOD3 = document.createElement('input');
                //     inputLOD3.setAttribute('type', 'checkbox');
                //     inputLOD3.setAttribute('id', t.table_name);
                //     inputLOD3.setAttribute('name', t.table_name);
                //     inputLOD3.setAttribute('value', t.table_name);
                //     const labelInputLOD3 = document.createElement('label');
                //     labelInputLOD3.setAttribute('for', t.table_name);
                //     labelInputLOD3.innerHTML = `${t.table_name}`;
                //     segnapostoLOD3.appendChild(inputLOD3);
                //     segnapostoLOD3.appendChild(labelInputLOD3);
                //     segnapostoLOD3.appendChild(document.createElement('br'));
                // }
                else {
                    // console.log(t.table_name);
                    console.log('vabbe');
                }
            }
        });
    }
    catch(e) {
        console.log('Errore nella richiesta al server');
        console.log(e);
    }
}

prendiTabelle();


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




select tablename as mytable from  pg_tables where schemaname  ='main10ance_sacrimonti' --> QUESTO FA SELEZIONARE UNA PER UNA TUTTE LE TABELLE
*/
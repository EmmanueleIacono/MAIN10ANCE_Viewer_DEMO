const { Client, Pool } = require('pg');

const clientM10a = new Client({
    connectionString: process.env.MAIN10ANCE_DB,
});
const poolM10a = new Pool({
    connectionString: process.env.MAIN10ANCE_DB,
});

//////////          AVVIO SERVER          //////////

start();

poolM10a.on('error', (err) => {
    console.error('Errore inaspettato del client PG', err);
    process.exit(-1);
})

console.log('Connessione pool al database Main10ance riuscita');

async function start() {
    await connect(clientM10a, 'Main10ance');
}

async function connect(client, nomeDb) {
    try {
        await client.connect();
        console.log(`Connessione al database ${nomeDb} riuscita`);
    }
    catch(e) {
        console.error(`Connessione al database ${nomeDb} fallita: ${e}`);
    }
}

module.exports = {clientM10a, poolM10a}

const { Client } = require('pg');

const clientM10a = new Client({
    connectionString: process.env.MAIN10ANCE_DB,
});

//////////          AVVIO SERVER          //////////

start();

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

module.exports = {clientM10a}

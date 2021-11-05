const { Client } = require('pg');

const clientM10a = new Client({
    connectionString: process.env.MAIN10ANCE_DB_URL,
    ssl: { rejectUnauthorized: false }
});

const clientServ = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

//////////          AVVIO SERVER          //////////

start();

async function start() {
    await connect(clientM10a, 'Connessione al database Main10ance');
    await connect(clientServ, 'Connessione al database di servizio');
}

async function connect(client, msg) {
    try {
        await client.connect();
        console.log(`${msg} riuscita`);
    }
    catch(e) {
        console.error(`${msg} fallita: ${e}`);
    }
}

module.exports = {clientM10a, clientServ}

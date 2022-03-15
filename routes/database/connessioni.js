const { Client } = require('pg');

const clientM10a = new Client({
    connectionString: process.env.MAIN10ANCE_DB,
    // ssl: { rejectUnauthorized: false }
});

// const clientServ = new Client({
//     connectionString: process.env.DATABASE_URL,
//     ssl: { rejectUnauthorized: false }
// });

//////////          AVVIO SERVER          //////////

start();

async function start() {
    await connect(clientM10a, 'Main10ance');
    // await connect(clientServ, 'di servizio');
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

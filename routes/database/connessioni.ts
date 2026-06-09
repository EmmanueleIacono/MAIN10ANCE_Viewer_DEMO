import {Pool, type PoolClient} from 'pg';

const poolM10a = new Pool({
  connectionString: process.env.MAIN10ANCE_DB,
});

//////////          AVVIO SERVER          //////////

poolM10a.on('error', (err: Error) => {
  console.error('Errore inaspettato del client PG', err);
  process.exit(-1);
});

start();

async function start() {
  try {
    await poolM10a.query('SELECT 1;');
    console.log('Connessione pool al database Main10ance riuscita');
  }
  catch(e) {
    console.error(`Connessione pool al database Main10ance fallita: ${e}`);
  }
}

async function withTransaction<T>(work: (client: PoolClient) => Promise<T>) {
  const client = await poolM10a.connect();
  try {
    await client.query('BEGIN;');
    const result = await work(client);
    await client.query('COMMIT;');
    return result;
  }
  catch(e) {
    try {
      await client.query('ROLLBACK;');
    }
    catch(rollbackErr) {
      console.error('Errore durante ROLLBACK:', rollbackErr);
    }
    throw e;
  }
  finally {
    client.release();
  }
}

module.exports = {poolM10a, withTransaction};

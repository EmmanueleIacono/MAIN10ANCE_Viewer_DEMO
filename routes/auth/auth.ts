import express, {type Request, type Response, type NextFunction} from 'express';
import bcrypt from 'bcrypt';
import type {Pool} from 'pg';
import type {SignupLoginBody, ValidSignupLoginBody, UserRow, RoleSettingsRow, AmbitoSettingsRow} from '../../types/auth';

const {utility_schema} = require('../database/schemi');
const router = express.Router();
router.use(express.json());

const {poolM10a} = require('../database/connessioni') as {poolM10a: Pool};
const {authCookieOptions} = require('../security/cookies');
const {createRateLimiter} = require('../security/rateLimit');
const {qualifiedName} = require('../security/sql');

const authLimiter = createRateLimiter({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || `${15 * 60 * 1000}`, 10),
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '20', 10),
  keyPrefix: 'auth',
});

router.post('/signup', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  if (validazioneUsers(req.body)) {
    const datiUtente = await getUtenteByNome(req.body.username);
    // se non trovo nessun nome utente, ricevo "undefined"
    // se ricevo "undefined", il nuovo nome utente è disponibile
    if (!datiUtente) {
      const hash = await bcrypt.hash(req.body.pw, 10);
      const user = {
        username: req.body.username,
        email: req.body.email,
        pw: hash
      };
      const successo = await insertNuovoUtente(user);
      if (successo) {
        res.json({
          message: 'Registrazione completata'
        });
      }
      else {
        res.status(500).send({message: 'Registrazione fallita, riprovare'});
      }
    }
    else {
      res.status(401).send({message: 'ATTENZIONE: Il nome utente è già in uso'});
    }
  }
  else {
    res.status(400).send({message: 'Dati utente non validi'});
  }
});

router.post('/login', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  if (validazioneUsers(req.body)) {
    // controlla se utente è presente in db
    const datiUtente = await getUtenteByNome(req.body.username);
    // se l'utente non è registrato, ricevo "undefined"
    // se ricevo un nome utente valido, l'account esiste
    if (datiUtente) {
      // confronta con pw in db -> comp è bool
      const comp = await bcrypt.compare(req.body.pw, datiUtente.pw);
      if (comp) {
        const roleSettings = await getSettingsByRuolo(datiUtente.role);
        const ambitoSettings = await getSettingsByAmbito(datiUtente.ambito);
        const cookieOptions = authCookieOptions();
        res.cookie('user_id', datiUtente.username, cookieOptions);
        res.cookie('role', datiUtente.role, cookieOptions);
        res.cookie('ambito', datiUtente.ambito, cookieOptions);
        res.json({
          message: 'Login completato',
          id: datiUtente.username,
          bim_vw_sets: roleSettings.bim_vw_sets,
          usr_vw: roleSettings.usr_vw,
          buckets: ambitoSettings.buckets,
          ambito: ambitoSettings.ambito, // nuovi settings 29/05/2024
          ambito_schema: ambitoSettings.schema, // nuovi settings 29/05/2024
          ambito_full_name: ambitoSettings.ambito_full_name, // nuovi settings 29/05/2024
        });
      }
      else {
        res.status(401).send({message: 'ATTENZIONE: Nome utente o password non validi'});
      }
    }
    else {
      res.status(401).send({message: 'ATTENZIONE: Nome utente o password non validi'});
    }
  }
  else {
    res.status(400).send({message: 'Dati utente non validi'});
  }
});

router.get('/logout', (req: Request, res: Response) => {
  const cookieOptions = authCookieOptions();
  res.clearCookie('user_id', cookieOptions);
  res.clearCookie('role', cookieOptions);
  res.clearCookie('ambito', cookieOptions);
  res.json({
    message: 'Logout avvenuto con successo'
  });
});

router.get('/session', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {user_id, role, ambito} = req.signedCookies;
    if (!user_id || !role || !ambito) {
      return res.status(401).send({message: 'Sessione non attiva'});
    }

    const roleSettings = await getSettingsByRuolo(role);
    const ambitoSettings = await getSettingsByAmbito(ambito);
    if (!roleSettings || !ambitoSettings) {
      return res.status(401).send({message: 'Sessione non valida'});
    }

    res.json({
      message: 'Sessione attiva',
      id: user_id,
      bim_vw_sets: roleSettings.bim_vw_sets,
      usr_vw: roleSettings.usr_vw,
      buckets: ambitoSettings.buckets,
      ambito: ambitoSettings.ambito,
      ambito_schema: ambitoSettings.schema,
      ambito_full_name: ambitoSettings.ambito_full_name,
    });
  }
  catch(e) {
    next(e);
  }
});

// validazione TRUE se nome e pw sono corrette
// validazione FALSE se campo nome è vuoto o mancante
// validazione FALSE se campo pw è vuoto o incorretto
function validazioneUsers(user: SignupLoginBody): user is ValidSignupLoginBody {
  const validUsername = typeof user.username == 'string' && user.username.trim() != '';
  const validPassword = typeof user.pw == 'string' && user.pw.trim() != '' && user.pw.trim().length >= 6;
  return validUsername && validPassword;
}

//////////          QUERY          //////////

async function getUtenteByNome(nome: string): Promise<UserRow | undefined> {
  try {
    const results = await poolM10a.query<UserRow>(`SELECT "user" AS username, pw, ruolo AS role, ambito FROM ${qualifiedName(utility_schema, 'utenti')} WHERE "user" = ($1);`, [nome]);
    return results.rows[0];
  }
  catch(e) {
    return undefined;
  }
}

async function insertNuovoUtente(user: ValidSignupLoginBody & {pw: string}) {
  try {
    await poolM10a.query(`INSERT INTO ${qualifiedName(utility_schema, 'utenti')} ("user", pw, ruolo, email) VALUES (($1), ($2), 'turista', ($3));`, [user.username, user.pw, user.email]);
    return true;
  }
  catch(e) {
    console.log(e);
    return false;
  }
}

async function getSettingsByRuolo(ruolo: string): Promise<RoleSettingsRow | undefined> {
  try {
    const results = await poolM10a.query<RoleSettingsRow>(`SELECT bim_vw_sets, elementi_visibili AS usr_vw FROM ${qualifiedName(utility_schema, 'ruoli')} WHERE ruolo = ($1);`, [ruolo]);
    return results.rows[0];
  }
  catch(e) {
    return undefined;
  }
}

async function getSettingsByAmbito(ambito: string): Promise<AmbitoSettingsRow | undefined> {
  try {
    const results = await poolM10a.query<AmbitoSettingsRow>(`SELECT ambito, ambito_full_name, buckets, "schema", storage FROM ${qualifiedName(utility_schema, 'ambiti')} WHERE ambito = ($1);`, [ambito]);
    return results.rows[0];
  }
  catch(e) {
    return undefined;
  }
}

module.exports = router;

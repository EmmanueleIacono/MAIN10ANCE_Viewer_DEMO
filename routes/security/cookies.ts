import type {CookieOptions} from 'express';

const ONE_DAY_MS = 1000 * 60 * 60 * 24;
const SESSION_MAX_AGE_MS = parseInt(process.env.SESSION_MAX_AGE_MS || `${ONE_DAY_MS * 7}`, 10);

function authCookieOptions(): CookieOptions {
  const secure = process.env.NODE_ENV === 'production' && !process.env.DEV_PLACEHOLDER;
  return {
    httpOnly: true,
    secure,
    signed: true,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_MS,
  };
}

module.exports = { authCookieOptions };

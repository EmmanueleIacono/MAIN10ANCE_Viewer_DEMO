type HttpError = Error & {statusCode?: number};

const IDENTIFIER_RE = /^[\p{L}_][\p{L}\p{N}_]*$/u;

function badRequest(message: string): HttpError {
  const err: HttpError = new Error(message);
  err.statusCode = 400;
  return err;
}

function assertIdentifier(value: unknown, label = 'identificatore') {
  if (typeof value !== 'string' || !IDENTIFIER_RE.test(value)) {
    throw badRequest(`${label} non valido`);
  }
  return value;
}

function quoteIdentifier(value: unknown, label?: string) {
  const identifier = assertIdentifier(value, label);
  return `"${identifier.replace(/"/g, '""')}"`;
}

function qualifiedName(schema: unknown, identifier: unknown, label = 'tabella') {
  return `${quoteIdentifier(schema, 'schema')}.${quoteIdentifier(identifier, label)}`;
}

function assertOneOf<T>(value: T, allowedValues: T[], label = 'valore') {
  if (!allowedValues.includes(value)) {
    throw badRequest(`${label} non consentito`);
  }
  return value;
}

function parseJsonArray(value: unknown, label = 'array') {
  let parsed;
  try {
    parsed = typeof value === 'string' ? JSON.parse(value) : value;
  } catch (e) {
    throw badRequest(`${label} JSON non valido`);
  }
  if (!Array.isArray(parsed)) {
    throw badRequest(`${label} deve essere una lista`);
  }
  return parsed;
}

function parseCsvIdentifiers(value: unknown, label = 'identificatori') {
  if (typeof value !== 'string') {
    throw badRequest(`${label} non valido`);
  }
  return value
    .split(',')
    .map(item => item.trim().replace(/^"|"$/g, ''))
    .filter(Boolean)
    .map(item => quoteIdentifier(item, label));
}

module.exports = {
  assertIdentifier,
  quoteIdentifier,
  qualifiedName,
  assertOneOf,
  parseJsonArray,
  parseCsvIdentifiers,
};

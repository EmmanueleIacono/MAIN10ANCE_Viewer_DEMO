const IDENTIFIER_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;

function assertIdentifier(value, label = 'identificatore') {
    if (typeof value !== 'string' || !IDENTIFIER_RE.test(value)) {
        const err = new Error(`${label} non valido`);
        err.statusCode = 400;
        throw err;
    }
    return value;
}

function quoteIdentifier(value, label) {
    assertIdentifier(value, label);
    return `"${value.replace(/"/g, '""')}"`;
}

function qualifiedName(schema, identifier, label = 'tabella') {
    return `${quoteIdentifier(schema, 'schema')}.${quoteIdentifier(identifier, label)}`;
}

function assertOneOf(value, allowedValues, label = 'valore') {
    if (!allowedValues.includes(value)) {
        const err = new Error(`${label} non consentito`);
        err.statusCode = 400;
        throw err;
    }
    return value;
}

function parseJsonArray(value, label = 'array') {
    let parsed;
    try {
        parsed = typeof value === 'string' ? JSON.parse(value) : value;
    } catch (e) {
        const err = new Error(`${label} JSON non valido`);
        err.statusCode = 400;
        throw err;
    }
    if (!Array.isArray(parsed)) {
        const err = new Error(`${label} deve essere una lista`);
        err.statusCode = 400;
        throw err;
    }
    return parsed;
}

function parseCsvIdentifiers(value, label = 'identificatori') {
    if (typeof value !== 'string') {
        const err = new Error(`${label} non valido`);
        err.statusCode = 400;
        throw err;
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

export const FIELD_TYPES = Object.freeze({
    TEXT: 'text',
    TEXTAREA: 'textarea',
    NUMBER: 'number',
    CHECKBOX: 'checkbox',
    SELECT: 'select',
    CHECKBOX_GROUP: 'checkboxGroup',
    STATIC: 'static',
    SECTION: 'section',
    DIVIDER: 'divider',
});

export const SEGNALAZIONE_FIELDS = Object.freeze([
    {type: FIELD_TYPES.SECTION, label: 'Condizioni ambientali'},
    {key: 'meteo', label: 'METEO'},
    {key: 'temperatura', label: 'TEMPERATURA'},
    {key: 'condizioni_sett_precedente', label: 'SETTIMANA PRECEDENTE'},
    {type: FIELD_TYPES.DIVIDER},
    {key: 'descrizione', label: 'DESCRIZIONE', type: FIELD_TYPES.TEXTAREA, style: {height: '20px'}},
    {key: 'intervento_urgenza', label: 'INTERVENTO URGENTE', type: FIELD_TYPES.TEXTAREA, style: {height: '20px'}},
]);

export const ANAGRAFICA_MANUFATTO_FIELDS = Object.freeze([
    {key: 'definizione', label: 'DEFINIZIONE'},
    {key: 'epoca', label: 'EPOCA'},
    {key: 'autore', label: 'AUTORE'},
    {key: 'descrizione', label: 'DESCRIZIONE'},
    {key: 'materiale', label: 'MATERIALE/I'},
    {key: 'tecniche', label: 'TECNICHE'},
    {key: 'documenti', label: 'DOCUMENTI'},
    {key: 'iter_autorizzativo', label: 'ITER AUTORIZZATIVO'},
]);

export const ANAGRAFICA_DETTAGLIO_FIELDS = Object.freeze([
    {key: 'definizione', label: 'DEFINIZIONE'},
    {key: 'descrizione', label: 'DESCRIZIONE'},
    {key: 'materiale', label: 'MATERIALE/I'},
    {key: 'tecniche', label: 'TECNICHE'},
    {key: 'epoca', label: 'EPOCA'},
    {key: 'documenti', label: 'DOCUMENTI'},
    {key: 'autore', label: 'AUTORE'},
    {key: 'data', label: 'DATA'},
]);

export const ANAGRAFICA_DEFAULT_FIELDS = Object.freeze([
    {key: 'descrizione_sistema', label: 'DESCRIZIONE SISTEMA', type: FIELD_TYPES.TEXTAREA, style: {height: '20px'}},
    {key: 'descrizione_subsistema', label: 'DESCRIZIONE SUBSISTEMA', type: FIELD_TYPES.TEXTAREA, style: {height: '20px'}},
    {key: 'tecnica_costruttiva', label: 'TECNICA COSTRUTTIVA'},
    {key: 'dimensioni', label: 'DIMENSIONI'},
    {key: 'materiale', label: 'MATERIALE/I'},
    {key: 'epoca', label: 'EPOCA'},
    {key: 'ispezionabilità', label: 'ISPEZIONABILITÀ'},
    {key: 'fonti', label: 'FONTI'},
]);

export function isSchemaEmpty(schema, model) {
    return schema
        .filter(field => field.key)
        .every(field => {
            const value = model[field.key];
            if (Array.isArray(value)) return value.length === 0;
            return value === null || value === undefined || value === '' || value === false;
        });
}

export function resetSchemaState(schema, model) {
    schema
        .filter(field => field.key)
        .forEach(field => {
            if (field.defaultValue !== undefined) {
                model[field.key] = typeof field.defaultValue === 'function' ? field.defaultValue() : field.defaultValue;
            }
            else if (field.type === FIELD_TYPES.CHECKBOX) {
                model[field.key] = false;
            }
            else if (field.type === FIELD_TYPES.CHECKBOX_GROUP) {
                model[field.key] = [];
            }
            else if (field.type === FIELD_TYPES.NUMBER) {
                model[field.key] = null;
            }
            else {
                model[field.key] = '';
            }
        });
}

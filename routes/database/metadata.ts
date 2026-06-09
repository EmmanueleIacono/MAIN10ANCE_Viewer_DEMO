type ImageEntityMetadata = {
  idColumn: string;
  bucket: string;
  schema: string;
};

const ACTIVITY_TABLES = Object.freeze({
  CONTR: 'scheda_controllo',
  MAN_REG: 'scheda_manutenzione_regolare',
  MAN_COR: 'scheda_manutenzione_correttiva',
  MAN_STR: 'scheda_manutenzione_straordinaria',
  REST: 'scheda_restauro',
  DIAGN: 'danno_alterazione_degrado'
});

const ACTIVITY_TABLE_LIST = Object.freeze(Object.values(ACTIVITY_TABLES));

const DATA_FORM_TABLES = Object.freeze({
  ANAGRAFICA: 'scheda_anagrafica',
  ANAGRAFICA_STATUA: 'scheda_anagrafica_statua',
  ANAGRAFICA_COPERTURA: 'scheda_anagrafica_copertura'
});

const SERVICE_FORM_TABLES = Object.freeze({
  ANAGRAFICA_MANUFATTO: 'anagrafica_manufatto',
  ANAGRAFICA_DETTAGLIO: 'anagrafica_dettaglio',
  SEGNALAZIONE: 'segnalazione'
});

const DATA_FORM_TABLE_LIST = Object.freeze([
  ...Object.values(DATA_FORM_TABLES),
  ...ACTIVITY_TABLE_LIST
]);

const SERVICE_FORM_TABLE_LIST = Object.freeze(Object.values(SERVICE_FORM_TABLES));

const FORM_TABLE_LIST = Object.freeze([
  ...DATA_FORM_TABLE_LIST,
  ...SERVICE_FORM_TABLE_LIST
]);

const IMAGE_ENTITIES: Record<string, ImageEntityMetadata> = Object.freeze({
  arredo: {idColumn: 'id_arr', bucket: 'elementi', schema: 'data'},
  dipinto_murale: {idColumn: 'id_dipmur', bucket: 'elementi', schema: 'data'},
  pavimento_decorativo: {idColumn: 'id_pd', bucket: 'elementi', schema: 'data'},
  quadro: {idColumn: 'id_quadro', bucket: 'elementi', schema: 'data'},
  statua: {idColumn: 'id_statua', bucket: 'elementi', schema: 'data'},
  manufatto: {idColumn: 'id_man', bucket: 'generale', schema: 'utility'},
  dettaglio: {idColumn: 'id_dett', bucket: 'generale', schema: 'utility'},
  elementi: {idColumn: 'id', bucket: 'elementi', schema: 'data'}
});

function getImageEntity(entity: string) {
  const metadata = IMAGE_ENTITIES[entity];
  if (!metadata) throw new Error('Entità non consentita');
  return metadata;
}

module.exports = {
  ACTIVITY_TABLES,
  ACTIVITY_TABLE_LIST,
  DATA_FORM_TABLES,
  DATA_FORM_TABLE_LIST,
  SERVICE_FORM_TABLES,
  SERVICE_FORM_TABLE_LIST,
  FORM_TABLE_LIST,
  IMAGE_ENTITIES,
  getImageEntity
};

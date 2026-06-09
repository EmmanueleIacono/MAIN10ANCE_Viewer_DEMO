export type UploadedDocumentRelation = {
    localita?: string;
    edificio?: string;
    classe?: string;
    elemento?: string;
    annotazioni?: string;
};

export type UploadedDocumentMetadata = {
    cartella_tipo?: string;
    tipo_doc?: string;
    id_doc: string;
    data_doc?: string;
    autore_doc?: string;
    descrizione?: string;
    annotazioni?: string;
    temi?: string[];
    sist_composto?: string;
    relazioni?: UploadedDocumentRelation[];
};

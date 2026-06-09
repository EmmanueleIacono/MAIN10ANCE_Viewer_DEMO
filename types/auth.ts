export type SignupLoginBody = {
    username?: unknown;
    email?: unknown;
    pw?: unknown;
};

export type ValidSignupLoginBody = {
    username: string;
    email?: string;
    pw: string;
};

export type UserRow = {
    username: string;
    pw: string;
    role: string;
    ambito: string;
};

export type RoleSettingsRow = {
    bim_vw_sets: string;
    usr_vw: string;
};

export type AmbitoSettingsRow = {
    ambito: string;
    ambito_full_name: string;
    buckets: string;
    schema: string;
    storage?: string;
};

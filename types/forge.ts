import type {AuthClientTwoLeggedV2} from 'forge-apis';
import type {Request} from 'express';

export type ForgeCredentials = {
    access_token: string;
    expires_in: number;
    expires_at?: number;
    token_type?: string;
};

export type ForgeConfig = {
    credentials: {
        client_id?: string;
        client_secret?: string;
        callback_url?: string;
    };
    scopes: {
        internal: string[];
        public: string[];
    };
};

export type ForgeRequest = Request & {
    oauth_token?: ForgeCredentials;
    oauth_client?: AuthClientTwoLeggedV2;
};

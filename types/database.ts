import type {PoolClient, QueryResultRow} from 'pg';

export type TransactionWork<T> = (client: PoolClient) => Promise<T>;

export type DbRow = QueryResultRow;

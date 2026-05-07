export type TransactionType = 'cashIn' | 'cashOut';
export type Asset = 'cash' | 'gcash';

export interface Account {
  id: number;
  phone: string;
  name: string | null;
  pinHash: string;
  pinSalt: string;
  createdAt: string;
}

export interface AccountRow {
  id: number;
  phone: string;
  name: string | null;
  pin_hash: string;
  pin_salt: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  fee: number;
  reference: string | null;
  accountId: number | null;
  thresholdOverride: boolean;
  note: string | null;
  createdAt: string;
}

export interface TransactionRow {
  id: number;
  type: TransactionType;
  amount: number;
  fee: number;
  reference: string | null;
  account_id: number | null;
  threshold_override: number;
  note: string | null;
  created_at: string;
}

export interface BalanceSnapshot {
  cash: number;
  gcash: number;
}

export interface AuditEvent {
  id: number;
  kind: string;
  title: string;
  detail: string | null;
  refTable: string | null;
  refId: number | null;
  accountId: number | null;
  createdAt: string;
}

export interface AuditEventRow {
  id: number;
  kind: string;
  title: string;
  detail: string | null;
  ref_table: string | null;
  ref_id: number | null;
  account_id: number | null;
  created_at: string;
}

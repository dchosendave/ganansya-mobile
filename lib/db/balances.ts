import type { SQLiteDatabase } from 'expo-sqlite';

import type { Asset, BalanceSnapshot } from '@/types/db';

import { getDb } from './client';

const INITIAL_FLOAT = {
  cash: 10000,
  gcash: 10000,
} as const;

export async function seedInitialBalances(): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR IGNORE INTO balances (asset, amount) VALUES (?, ?)`,
    'cash',
    INITIAL_FLOAT.cash,
  );
  await db.runAsync(
    `INSERT OR IGNORE INTO balances (asset, amount) VALUES (?, ?)`,
    'gcash',
    INITIAL_FLOAT.gcash,
  );
}

export async function getBalances(): Promise<BalanceSnapshot> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ asset: Asset; amount: number }>(
    'SELECT asset, amount FROM balances',
  );
  const snapshot: BalanceSnapshot = { cash: 0, gcash: 0 };
  for (const row of rows) {
    snapshot[row.asset] = row.amount;
  }
  return snapshot;
}

export async function applyBalanceDelta(
  db: SQLiteDatabase,
  asset: Asset,
  delta: number,
): Promise<void> {
  await db.runAsync(
    `UPDATE balances
       SET amount = amount + ?, updated_at = datetime('now', 'localtime')
     WHERE asset = ?`,
    delta,
    asset,
  );
}

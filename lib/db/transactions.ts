import type {
  BalanceSnapshot,
  Transaction,
  TransactionRow,
  TransactionType,
} from '@/types/db';

import { applyBalanceDelta, getBalances } from './balances';
import { getDb } from './client';

function rowToTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    type: row.type,
    amount: row.amount,
    fee: row.fee,
    reference: row.reference,
    accountId: row.account_id,
    thresholdOverride: row.threshold_override === 1,
    note: row.note,
    createdAt: row.created_at,
  };
}

interface BalanceImpact {
  cashDelta: number;
  gcashDelta: number;
}

export function computeBalanceImpact(
  type: TransactionType,
  amount: number,
  fee: number,
): BalanceImpact {
  if (type === 'cashIn') {
    return { cashDelta: amount + fee, gcashDelta: -amount };
  }
  return { cashDelta: -amount, gcashDelta: amount + fee };
}

export function projectBalances(
  current: BalanceSnapshot,
  type: TransactionType,
  amount: number,
  fee: number,
): BalanceSnapshot {
  const impact = computeBalanceImpact(type, amount, fee);
  return {
    cash: current.cash + impact.cashDelta,
    gcash: current.gcash + impact.gcashDelta,
  };
}

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  fee: number;
  reference?: string | null;
  accountId: number | null;
  thresholdOverride?: boolean;
  note?: string | null;
}

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<Transaction> {
  if (input.amount <= 0) {
    throw new Error('Amount must be greater than zero');
  }
  if (input.fee < 0) {
    throw new Error('Fee cannot be negative');
  }

  const db = await getDb();
  const before = await getBalances();
  const after = projectBalances(before, input.type, input.amount, input.fee);

  if (after.cash < 0 || after.gcash < 0) {
    throw new Error('Hindi sapat ang balance para sa transaction na ito');
  }

  let inserted: Transaction | null = null;

  await db.withTransactionAsync(async () => {
    const impact = computeBalanceImpact(input.type, input.amount, input.fee);
    await applyBalanceDelta(db, 'cash', impact.cashDelta);
    await applyBalanceDelta(db, 'gcash', impact.gcashDelta);

    const result = await db.runAsync(
      `INSERT INTO transactions
         (type, amount, fee, reference, account_id, threshold_override, note)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      input.type,
      input.amount,
      input.fee,
      input.reference ?? null,
      input.accountId,
      input.thresholdOverride ? 1 : 0,
      input.note ?? null,
    );

    const txId = result.lastInsertRowId;

    const label = input.type === 'cashIn' ? 'Cash In' : 'Cash Out';
    await db.runAsync(
      `INSERT INTO audit_events (kind, title, detail, ref_table, ref_id, account_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      'transaction_logged',
      `${label} logged`,
      `${label} of PHP ${input.amount} with PHP ${input.fee} fee`,
      'transactions',
      txId,
      input.accountId,
    );

    if (input.thresholdOverride) {
      await db.runAsync(
        `INSERT INTO audit_events (kind, title, detail, ref_table, ref_id, account_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        'threshold_override',
        'Threshold override',
        `Operator confirmed ${label} below the float threshold`,
        'transactions',
        txId,
        input.accountId,
      );
    }

    const row = await db.getFirstAsync<TransactionRow>(
      'SELECT * FROM transactions WHERE id = ?',
      txId,
    );
    if (!row) {
      throw new Error('Failed to read transaction after insert');
    }
    inserted = rowToTransaction(row);
  });

  if (!inserted) {
    throw new Error('Transaction commit failed');
  }
  return inserted;
}

export async function listRecentTransactions(limit = 20): Promise<Transaction[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<TransactionRow>(
    'SELECT * FROM transactions ORDER BY id DESC LIMIT ?',
    limit,
  );
  return rows.map(rowToTransaction);
}

export async function kitaToday(): Promise<number> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ total: number | null }>(
    `SELECT COALESCE(SUM(fee), 0) as total
       FROM transactions
      WHERE date(created_at) = date('now', 'localtime')`,
  );
  return row?.total ?? 0;
}

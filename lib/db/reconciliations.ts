import type { Reconciliation, ReconciliationRow } from '@/types/db';

import { getBalances } from './balances';
import { getDb } from './client';

function rowToReconciliation(row: ReconciliationRow): Reconciliation {
  return {
    id: row.id,
    expectedCash: row.expected_cash,
    expectedGcash: row.expected_gcash,
    actualCash: row.actual_cash,
    actualGcash: row.actual_gcash,
    difference: row.difference,
    note: row.note,
    accountId: row.account_id,
    createdAt: row.created_at,
  };
}

export interface CreateReconciliationInput {
  actualCash: number;
  actualGcash: number;
  note?: string | null;
  accountId: number | null;
}

export async function createReconciliation(
  input: CreateReconciliationInput,
): Promise<Reconciliation> {
  if (input.actualCash < 0 || input.actualGcash < 0) {
    throw new Error('Actual amounts cannot be negative');
  }

  const db = await getDb();
  const expected = await getBalances();
  const expectedTotal = expected.cash + expected.gcash;
  const actualTotal = input.actualCash + input.actualGcash;
  const difference = actualTotal - expectedTotal;

  let inserted: Reconciliation | null = null;

  await db.withTransactionAsync(async () => {
    const result = await db.runAsync(
      `INSERT INTO reconciliations
        (expected_cash, expected_gcash, actual_cash, actual_gcash, difference, note, account_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      expected.cash,
      expected.gcash,
      input.actualCash,
      input.actualGcash,
      difference,
      input.note ?? null,
      input.accountId,
    );
    const id = result.lastInsertRowId;

    await db.runAsync(
      `INSERT INTO audit_events (kind, title, detail, ref_table, ref_id, account_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      'reconciliation_completed',
      difference === 0 ? 'Reconciliation balanced' : 'Reconciliation with difference',
      `Difference: PHP ${difference}`,
      'reconciliations',
      id,
      input.accountId,
    );

    const row = await db.getFirstAsync<ReconciliationRow>(
      'SELECT * FROM reconciliations WHERE id = ?',
      id,
    );
    if (!row) {
      throw new Error('Failed to read reconciliation after insert');
    }
    inserted = rowToReconciliation(row);
  });

  if (!inserted) {
    throw new Error('Reconciliation commit failed');
  }
  return inserted;
}

export async function getLastReconciliation(): Promise<Reconciliation | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<ReconciliationRow>(
    'SELECT * FROM reconciliations ORDER BY id DESC LIMIT 1',
  );
  return row ? rowToReconciliation(row) : null;
}

export async function listReconciliations(limit = 30): Promise<Reconciliation[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<ReconciliationRow>(
    'SELECT * FROM reconciliations ORDER BY id DESC LIMIT ?',
    limit,
  );
  return rows.map(rowToReconciliation);
}

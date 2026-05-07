import type { PricingTier, PricingTierRow } from '@/types/db';

import { getDb } from './client';

const DEFAULT_TIERS: ReadonlyArray<{
  label: string;
  minAmount: number;
  maxAmount: number | null;
  fee: number;
  sortOrder: number;
}> = [
  { label: 'PHP 1 - PHP 1,000', minAmount: 1, maxAmount: 1000, fee: 10, sortOrder: 1 },
  { label: 'PHP 1,001 - PHP 5,000', minAmount: 1001, maxAmount: 5000, fee: 20, sortOrder: 2 },
  { label: 'PHP 5,001 - PHP 10,000', minAmount: 5001, maxAmount: 10000, fee: 40, sortOrder: 3 },
];

function rowToTier(row: PricingTierRow): PricingTier {
  return {
    id: row.id,
    label: row.label,
    minAmount: row.min_amount,
    maxAmount: row.max_amount,
    fee: row.fee,
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
  };
}

export async function seedDefaultPricing(): Promise<void> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM pricing_tiers',
  );
  if ((row?.count ?? 0) > 0) return;

  for (const tier of DEFAULT_TIERS) {
    await db.runAsync(
      `INSERT INTO pricing_tiers (label, min_amount, max_amount, fee, sort_order)
       VALUES (?, ?, ?, ?, ?)`,
      tier.label,
      tier.minAmount,
      tier.maxAmount,
      tier.fee,
      tier.sortOrder,
    );
  }
}

export async function listPricingTiers(): Promise<PricingTier[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<PricingTierRow>(
    'SELECT * FROM pricing_tiers ORDER BY sort_order ASC',
  );
  return rows.map(rowToTier);
}

export async function updatePricingTierFee(id: number, fee: number): Promise<void> {
  if (fee < 0) {
    throw new Error('Fee cannot be negative');
  }
  const db = await getDb();
  const result = await db.runAsync(
    `UPDATE pricing_tiers
       SET fee = ?, updated_at = datetime('now', 'localtime')
     WHERE id = ?`,
    fee,
    id,
  );
  if (result.changes === 0) {
    throw new Error('Pricing tier not found');
  }
  await db.runAsync(
    `INSERT INTO audit_events (kind, title, detail, ref_table, ref_id)
     VALUES (?, ?, ?, ?, ?)`,
    'pricing_updated',
    'Pricing updated',
    `Tier fee set to PHP ${fee}`,
    'pricing_tiers',
    id,
  );
}

export function computeFee(tiers: PricingTier[], amount: number): number {
  if (!amount || amount < 1) return 0;
  for (const tier of tiers) {
    const upper = tier.maxAmount ?? Number.POSITIVE_INFINITY;
    if (amount >= tier.minAmount && amount <= upper) {
      return tier.fee;
    }
  }
  return 0;
}

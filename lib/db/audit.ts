import type { AuditEvent, AuditEventRow } from '@/types/db';

import { getDb } from './client';

function rowToEvent(row: AuditEventRow): AuditEvent {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    detail: row.detail,
    refTable: row.ref_table,
    refId: row.ref_id,
    accountId: row.account_id,
    createdAt: row.created_at,
  };
}

export async function listAuditEvents(limit = 50): Promise<AuditEvent[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<AuditEventRow>(
    'SELECT * FROM audit_events ORDER BY id DESC LIMIT ?',
    limit,
  );
  return rows.map(rowToEvent);
}

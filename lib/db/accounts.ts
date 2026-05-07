import { generateSalt, hashPin, verifyPin } from '@/lib/crypto/pin';
import type { Account, AccountRow } from '@/types/db';

import { getDb } from './client';

function rowToAccount(row: AccountRow): Account {
  return {
    id: row.id,
    phone: row.phone,
    name: row.name,
    pinHash: row.pin_hash,
    pinSalt: row.pin_salt,
    createdAt: row.created_at,
  };
}

export async function findAccountByPhone(phone: string): Promise<Account | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<AccountRow>(
    'SELECT * FROM accounts WHERE phone = ? LIMIT 1',
    phone,
  );
  return row ? rowToAccount(row) : null;
}

export async function getActiveAccount(): Promise<Account | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<AccountRow>(
    'SELECT * FROM accounts ORDER BY id ASC LIMIT 1',
  );
  return row ? rowToAccount(row) : null;
}

export async function countAccounts(): Promise<number> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM accounts',
  );
  return row?.count ?? 0;
}

interface CreateAccountInput {
  phone: string;
  pin: string;
  name?: string;
}

export async function createAccount(input: CreateAccountInput): Promise<Account> {
  const db = await getDb();
  const salt = await generateSalt();
  const pinHash = await hashPin(input.pin, salt);

  const result = await db.runAsync(
    'INSERT INTO accounts (phone, name, pin_hash, pin_salt) VALUES (?, ?, ?, ?)',
    input.phone,
    input.name ?? null,
    pinHash,
    salt,
  );

  const row = await db.getFirstAsync<AccountRow>(
    'SELECT * FROM accounts WHERE id = ?',
    result.lastInsertRowId,
  );
  if (!row) {
    throw new Error('Failed to load account after insert');
  }
  return rowToAccount(row);
}

export async function authenticate(phone: string, pin: string): Promise<Account | null> {
  const account = await findAccountByPhone(phone);
  if (!account) return null;
  const ok = await verifyPin(pin, account.pinSalt, account.pinHash);
  return ok ? account : null;
}

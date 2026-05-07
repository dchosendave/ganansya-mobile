import type { SQLiteDatabase } from 'expo-sqlite';

interface Migration {
  version: number;
  name: string;
  up: (db: SQLiteDatabase) => Promise<void>;
}

const migrations: Migration[] = [
  {
    version: 1,
    name: 'create_accounts',
    up: async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS accounts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          phone TEXT NOT NULL UNIQUE,
          name TEXT,
          pin_hash TEXT NOT NULL,
          pin_salt TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
        CREATE INDEX IF NOT EXISTS idx_accounts_phone ON accounts(phone);
      `);
    },
  },
  {
    version: 2,
    name: 'create_ledger',
    up: async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS balances (
          asset TEXT PRIMARY KEY,
          amount INTEGER NOT NULL,
          updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
        );

        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT NOT NULL CHECK (type IN ('cashIn', 'cashOut')),
          amount INTEGER NOT NULL CHECK (amount > 0),
          fee INTEGER NOT NULL CHECK (fee >= 0),
          reference TEXT,
          account_id INTEGER REFERENCES accounts(id),
          threshold_override INTEGER NOT NULL DEFAULT 0,
          note TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
        );
        CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
        CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

        CREATE TABLE IF NOT EXISTS audit_events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          kind TEXT NOT NULL,
          title TEXT NOT NULL,
          detail TEXT,
          ref_table TEXT,
          ref_id INTEGER,
          account_id INTEGER REFERENCES accounts(id),
          created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
        );
        CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_events(created_at);
      `);
    },
  },
  {
    version: 3,
    name: 'create_pricing_tiers',
    up: async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS pricing_tiers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          label TEXT NOT NULL,
          min_amount INTEGER NOT NULL,
          max_amount INTEGER,
          fee INTEGER NOT NULL CHECK (fee >= 0),
          sort_order INTEGER NOT NULL,
          updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
        );
        CREATE INDEX IF NOT EXISTS idx_pricing_tiers_sort ON pricing_tiers(sort_order);
      `);
    },
  },
  {
    version: 4,
    name: 'create_reconciliations',
    up: async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS reconciliations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          expected_cash INTEGER NOT NULL,
          expected_gcash INTEGER NOT NULL,
          actual_cash INTEGER NOT NULL,
          actual_gcash INTEGER NOT NULL,
          difference INTEGER NOT NULL,
          note TEXT,
          account_id INTEGER REFERENCES accounts(id),
          created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
        );
        CREATE INDEX IF NOT EXISTS idx_reconciliations_created_at ON reconciliations(created_at);
      `);
    },
  },
];

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS _migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const applied = await db.getAllAsync<{ version: number }>(
    'SELECT version FROM _migrations ORDER BY version ASC',
  );
  const appliedVersions = new Set(applied.map((r) => r.version));

  for (const migration of migrations) {
    if (appliedVersions.has(migration.version)) continue;

    await db.withTransactionAsync(async () => {
      await migration.up(db);
      await db.runAsync(
        'INSERT INTO _migrations (version, name) VALUES (?, ?)',
        migration.version,
        migration.name,
      );
    });
  }
}

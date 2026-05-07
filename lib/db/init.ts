import { seedInitialBalances } from './balances';
import { getDb } from './client';
import { runMigrations } from './migrations';
import { seedDefaultPricing } from './pricing';
import { seedInitialAccount } from './seed';

let initPromise: Promise<void> | null = null;

export function initDatabase(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      const db = await getDb();
      await runMigrations(db);
      await seedInitialAccount();
      await seedInitialBalances();
      await seedDefaultPricing();
    })();
  }
  return initPromise;
}

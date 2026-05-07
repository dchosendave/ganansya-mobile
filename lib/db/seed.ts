import { countAccounts, createAccount } from './accounts';

const INITIAL_TINDERA = {
  phone: '09150833518',
  pin: '232323',
  name: 'Tindera',
};

export async function seedInitialAccount(): Promise<void> {
  const existing = await countAccounts();
  if (existing > 0) return;
  await createAccount(INITIAL_TINDERA);
}

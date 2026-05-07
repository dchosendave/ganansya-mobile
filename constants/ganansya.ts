export type TransactionType = 'cashIn' | 'cashOut';

export const formatPeso = new Intl.NumberFormat('en-PH', {
  currency: 'PHP',
  maximumFractionDigits: 0,
  style: 'currency',
});

export const floatThreshold = 3000;

export const balances = {
  cashOnHand: 10000,
  gcashBalance: 10000,
  kitaToday: 0,
};

export const pricingTiers = [
  {
    id: 'starter',
    range: 'PHP 1 - PHP 1,000',
    fee: 10,
    note: 'Common small cash in/out requests',
  },
  {
    id: 'middle',
    range: 'PHP 1,001 - PHP 5,000',
    fee: 20,
    note: 'Default fee for medium transactions',
  },
  {
    id: 'large',
    range: 'PHP 5,001 - PHP 10,000',
    fee: 40,
    note: 'Owner can adjust from PHP 30 to PHP 50',
  },
];

export const recentTransactions = [
  {
    id: 'TX-1042',
    time: '8:15 AM',
    type: 'cashIn' as TransactionType,
    amount: 1000,
    fee: 10,
    reference: 'GC-842913',
  },
  {
    id: 'TX-1041',
    time: '7:42 AM',
    type: 'cashOut' as TransactionType,
    amount: 500,
    fee: 10,
    reference: 'GC-842667',
  },
  {
    id: 'TX-1040',
    time: 'Yesterday',
    type: 'cashIn' as TransactionType,
    amount: 2500,
    fee: 20,
    reference: 'GC-841902',
  },
];

export const auditTrail = [
  {
    id: 'AUD-301',
    time: 'Today, 8:16 AM',
    title: 'Transaction logged',
    detail: 'Cash In TX-1042 recorded with PHP 10 fee.',
  },
  {
    id: 'AUD-300',
    time: 'Today, 7:45 AM',
    title: 'Reference corrected',
    detail: 'Operator updated reference for TX-1041 after owner review.',
  },
  {
    id: 'AUD-299',
    time: 'Yesterday, 6:08 PM',
    title: 'End of day checked',
    detail: 'Reconciliation completed with zero difference.',
  },
];

export function getFeeForAmount(amount: number) {
  if (!amount || amount < 1) {
    return 0;
  }

  if (amount <= 1000) {
    return 10;
  }

  if (amount <= 5000) {
    return 20;
  }

  return 40;
}

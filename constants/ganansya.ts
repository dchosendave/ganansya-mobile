export const formatPeso = new Intl.NumberFormat('en-PH', {
  currency: 'PHP',
  maximumFractionDigits: 0,
  style: 'currency',
});

export const floatThreshold = 3000;

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
    note: 'Tindera can adjust from PHP 30 to PHP 50',
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

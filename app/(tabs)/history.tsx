import { Text, View } from 'react-native';

import { AppScreen, EmptyState, Section } from '@/components/app-screen';
import { formatPeso } from '@/constants/ganansya';
import { useAsyncData } from '@/hooks/use-async-data';
import { listRecentTransactions } from '@/lib/db/transactions';
import type { Transaction } from '@/types/db';

function formatTime(iso: string): string {
  const date = new Date(iso.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function HistoryScreen() {
  const { data } = useAsyncData<Transaction[]>(() => listRecentTransactions(50), []);
  const transactions = data ?? [];

  return (
    <AppScreen
      eyebrow="Transaction History"
      title="Lahat ng log"
      description="Time, type, amount, fee, and reference for each transaction.">
      <Section title="Recent">
        {transactions.length === 0 ? (
          <EmptyState
            description="No transactions yet. Once you log Cash In or Cash Out, they appear here."
            icon="receipt-long"
            title="Wala pang log"
          />
        ) : (
          <View className="gap-2.5">
            {transactions.map((transaction) => (
              <View
                key={transaction.id}
                className="gap-2 rounded-lg border border-stone-200 bg-white p-3.5">
                <View className="flex-row items-center justify-between">
                  <Text className="text-base font-black text-stone-900">
                    {transaction.type === 'cashIn' ? 'Cash In' : 'Cash Out'}
                  </Text>
                  <Text className="text-sm font-bold text-stone-500">
                    {formatTime(transaction.createdAt)}
                  </Text>
                </View>
                <Text className="text-[27px] font-black leading-8 text-stone-900">
                  {formatPeso.format(transaction.amount)}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  <Text className="rounded-md bg-stone-100 px-2 py-[5px] text-[13px] font-bold text-stone-600">
                    Fee {formatPeso.format(transaction.fee)}
                  </Text>
                  {transaction.reference ? (
                    <Text className="rounded-md bg-stone-100 px-2 py-[5px] text-[13px] font-bold text-stone-600">
                      Ref {transaction.reference}
                    </Text>
                  ) : null}
                  {transaction.thresholdOverride ? (
                    <Text className="rounded-md bg-red-50 px-2 py-[5px] text-[13px] font-bold text-red-700">
                      Override
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        )}
      </Section>
    </AppScreen>
  );
}

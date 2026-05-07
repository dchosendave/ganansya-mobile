import { StyleSheet, Text, View } from 'react-native';

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
          <View style={styles.list}>
            {transactions.map((transaction) => (
              <View key={transaction.id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemType}>
                    {transaction.type === 'cashIn' ? 'Cash In' : 'Cash Out'}
                  </Text>
                  <Text style={styles.itemTime}>{formatTime(transaction.createdAt)}</Text>
                </View>
                <Text style={styles.itemAmount}>{formatPeso.format(transaction.amount)}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>Fee {formatPeso.format(transaction.fee)}</Text>
                  {transaction.reference ? (
                    <Text style={styles.metaText}>Ref {transaction.reference}</Text>
                  ) : null}
                  {transaction.thresholdOverride ? (
                    <Text style={[styles.metaText, styles.metaWarn]}>Override</Text>
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

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 14,
  },
  itemHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemType: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '900',
  },
  itemTime: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
  },
  itemAmount: {
    color: '#0F172A',
    fontSize: 27,
    fontWeight: '900',
    lineHeight: 32,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaText: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  metaWarn: {
    backgroundColor: '#FEF2F2',
    color: '#B91C1C',
  },
});

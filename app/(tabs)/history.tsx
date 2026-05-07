import { StyleSheet, Text, View } from 'react-native';

import { AppScreen, EmptyState, Section } from '@/components/app-screen';
import { formatPeso, recentTransactions } from '@/constants/ganansya';

export default function HistoryScreen() {
  return (
    <AppScreen
      eyebrow="Transaction History"
      title="Lahat ng log"
      description="Time, type, amount, fee, and reference for each transaction.">
      <Section title="Today">
        <View style={styles.list}>
          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemType}>
                  {transaction.type === 'cashIn' ? 'Cash In' : 'Cash Out'}
                </Text>
                <Text style={styles.itemTime}>{transaction.time}</Text>
              </View>
              <Text style={styles.itemAmount}>{formatPeso.format(transaction.amount)}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>Fee {formatPeso.format(transaction.fee)}</Text>
                <Text style={styles.metaText}>Ref {transaction.reference}</Text>
              </View>
            </View>
          ))}
        </View>
      </Section>

      <EmptyState
        description="Search and filters can be connected once data storage is ready."
        icon="manage-search"
        title="Ready for filters"
      />
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
});

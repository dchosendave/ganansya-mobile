import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const mockBalances = {
  cashOnHand: 10000,
  gcashBalance: 10000,
  kitaToday: 0,
};

const peso = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
});

export default function DashboardScreen() {
  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.eyebrow}>Ganansya</ThemedText>
          <ThemedText type="title" style={styles.title}>
            Kumusta, Tindera
          </ThemedText>
          <ThemedText style={styles.subtitle}>Today&apos;s cash in/out snapshot</ThemedText>
        </View>

        <View style={styles.balanceGrid}>
          <BalanceCard label="Cash on Hand" value={mockBalances.cashOnHand} />
          <BalanceCard label="GCash Balance" value={mockBalances.gcashBalance} />
          <BalanceCard label="Kita Today" value={mockBalances.kitaToday} tone="accent" />
        </View>

        <View style={styles.actions}>
          <Pressable style={[styles.actionButton, styles.cashInButton]}>
            <ThemedText style={styles.actionText}>Cash In</ThemedText>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.cashOutButton]}>
            <ThemedText style={styles.actionText}>Cash Out</ThemedText>
          </Pressable>
        </View>

        <View style={styles.notice}>
          <ThemedText type="defaultSemiBold" style={styles.noticeTitle}>
            Float Status
          </ThemedText>
          <ThemedText style={styles.noticeText}>
            Healthy pa ang cash at GCash balance. Warnings will show here kapag mababa na ang
            balance.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

type BalanceCardProps = {
  label: string;
  value: number;
  tone?: 'default' | 'accent';
};

function BalanceCard({ label, value, tone = 'default' }: BalanceCardProps) {
  return (
    <View style={[styles.balanceCard, tone === 'accent' && styles.accentCard]}>
      <ThemedText style={styles.balanceLabel}>{label}</ThemedText>
      <ThemedText style={styles.balanceValue}>{peso.format(value)}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: 20,
    padding: 20,
    paddingTop: 72,
  },
  header: {
    gap: 6,
  },
  eyebrow: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '700',
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
  },
  subtitle: {
    color: '#64748B',
  },
  balanceGrid: {
    gap: 12,
  },
  balanceCard: {
    gap: 8,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#F8FAFC',
    padding: 18,
  },
  accentCard: {
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
  },
  balanceLabel: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '600',
  },
  balanceValue: {
    color: '#0F172A',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 72,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  cashInButton: {
    backgroundColor: '#2563EB',
  },
  cashOutButton: {
    backgroundColor: '#16A34A',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  notice: {
    gap: 6,
    borderColor: '#FED7AA',
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#FFF7ED',
    padding: 16,
  },
  noticeTitle: {
    color: '#9A3412',
  },
  noticeText: {
    color: '#7C2D12',
  },
});

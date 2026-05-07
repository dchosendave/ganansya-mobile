import { StyleSheet, Text, View } from 'react-native';

import { ActionLink, AppScreen, EmptyState, MetricCard, Section } from '@/components/app-screen';
import { balances, floatThreshold, formatPeso } from '@/constants/ganansya';

export default function DashboardScreen() {
  const cashLow = balances.cashOnHand < floatThreshold;
  const gcashLow = balances.gcashBalance < floatThreshold;

  return (
    <AppScreen
      eyebrow="Dashboard"
      title="Kumusta, Tindera"
      description="Quick view ng cash, GCash, at kita today.">
      <View style={styles.metrics}>
        <MetricCard label="Cash on Hand" value={formatPeso.format(balances.cashOnHand)} />
        <MetricCard label="GCash Balance" value={formatPeso.format(balances.gcashBalance)} />
        <MetricCard
          caption="Transaction fees collected today"
          label="Kita Today"
          tone="income"
          value={formatPeso.format(balances.kitaToday)}
        />
      </View>

      <Section title="Quick Action" description="One tap para magsimula.">
        <View style={styles.quickActions}>
          <ActionLink
            description="Customer gives cash, store sends GCash."
            href="/transaction"
            icon="call-made"
            label="Cash In"
            tone="blue"
          />
          <ActionLink
            description="Customer sends GCash, store gives cash."
            href="/transaction"
            icon="call-received"
            label="Cash Out"
            tone="green"
          />
        </View>
      </Section>

      <Section title="Float Status">
        {cashLow || gcashLow ? (
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Limit transactions muna</Text>
            <Text style={styles.alertText}>
              May balance below {formatPeso.format(floatThreshold)}. Check cash or GCash before
              releasing funds.
            </Text>
          </View>
        ) : (
          <EmptyState
            description="Cash and GCash are above the operating threshold."
            icon="verified"
            title="Healthy ang float"
          />
        )}
      </Section>

      <Section title="Daily Flow">
        <View style={styles.flowList}>
          <FlowItem label="Start of day" text="Check actual cash and GCash balances." />
          <FlowItem label="Every transaction" text="Enter amount, confirm, then log reference." />
          <FlowItem label="End of day" text="Run reconciliation and report differences." />
        </View>
      </Section>
    </AppScreen>
  );
}

type FlowItemProps = {
  label: string;
  text: string;
};

function FlowItem({ label, text }: FlowItemProps) {
  return (
    <View style={styles.flowItem}>
      <Text style={styles.flowLabel}>{label}</Text>
      <Text style={styles.flowText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  metrics: {
    gap: 12,
  },
  quickActions: {
    gap: 12,
  },
  alertBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 14,
  },
  alertTitle: {
    color: '#991B1B',
    fontSize: 16,
    fontWeight: '900',
  },
  alertText: {
    color: '#7F1D1D',
    fontSize: 14,
    lineHeight: 20,
  },
  flowList: {
    gap: 10,
  },
  flowItem: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    gap: 3,
    padding: 14,
  },
  flowLabel: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
  },
  flowText: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
  },
});

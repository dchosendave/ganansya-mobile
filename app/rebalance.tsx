import { StyleSheet, Text, View } from 'react-native';

import { AppScreen, Button, Field, MetricCard, Section } from '@/components/app-screen';
import { balances, formatPeso, floatThreshold } from '@/constants/ganansya';

export default function RebalanceScreen() {
  return (
    <AppScreen
      eyebrow="Rebalance Request"
      title="Request additional float"
      description="For low cash or low GCash situations that need owner action.">
      <View style={styles.summaryGrid}>
        <MetricCard label="Cash on Hand" value={formatPeso.format(balances.cashOnHand)} />
        <MetricCard label="GCash Balance" value={formatPeso.format(balances.gcashBalance)} />
        <MetricCard
          caption="Limit affected transaction type below this balance"
          label="Threshold"
          tone="warning"
          value={formatPeso.format(floatThreshold)}
        />
      </View>

      <Section title="Request Details">
        <Field keyboardType="numeric" label="Needed Amount" placeholder="Halimbawa: 3000" />
        <Field label="Needed Type" placeholder="GCash or Cash" />
        <Field label="Reason" placeholder="Low GCash after cash in requests" />
      </Section>

      <Section title="Owner Response">
        <View style={styles.responseBox}>
          <Text style={styles.responseTitle}>Pending owner approval</Text>
          <Text style={styles.responseText}>
            Owner can approve remotely, send funds, then mark equivalent cash for later remittance.
          </Text>
        </View>
      </Section>

      <Button icon="send" label="Send Request" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  summaryGrid: {
    gap: 12,
  },
  responseBox: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 14,
  },
  responseTitle: {
    color: '#9A3412',
    fontSize: 16,
    fontWeight: '900',
  },
  responseText: {
    color: '#7C2D12',
    fontSize: 14,
    lineHeight: 20,
  },
});

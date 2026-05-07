import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen, Button, Field, MetricCard, Section } from '@/components/app-screen';
import { balances, formatPeso } from '@/constants/ganansya';

export default function ReconcileScreen() {
  const [actualCash, setActualCash] = useState('');
  const [actualGcash, setActualGcash] = useState('');

  const expectedTotal = balances.cashOnHand + balances.gcashBalance;
  const actualTotal = Number(actualCash || 0) + Number(actualGcash || 0);
  const difference = useMemo(() => actualTotal - expectedTotal, [actualTotal, expectedTotal]);

  return (
    <AppScreen
      eyebrow="Daily Reconciliation"
      title="End of day check"
      description="Compare actual cash and GCash against the system balance.">
      <View style={styles.summaryGrid}>
        <MetricCard label="Expected Total" value={formatPeso.format(expectedTotal)} />
        <MetricCard
          label="Difference"
          tone={difference === 0 ? 'income' : 'warning'}
          value={formatPeso.format(difference)}
        />
      </View>

      <Section title="Actual Balances">
        <Field
          keyboardType="numeric"
          label="Actual Cash"
          onChangeText={setActualCash}
          placeholder="Cash count"
          value={actualCash}
        />
        <Field
          keyboardType="numeric"
          label="Actual GCash"
          onChangeText={setActualGcash}
          placeholder="GCash balance"
          value={actualGcash}
        />
      </Section>

      <Section title="Output">
        <View style={styles.outputBox}>
          <Text style={styles.outputLabel}>Actual Total</Text>
          <Text style={styles.outputValue}>{formatPeso.format(actualTotal)}</Text>
          <Text style={styles.outputNote}>
            A non-zero difference should be reviewed before closing the day.
          </Text>
        </View>
      </Section>

      <Button icon="fact-check" label="Save Reconciliation" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  summaryGrid: {
    gap: 12,
  },
  outputBox: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    gap: 5,
    padding: 16,
  },
  outputLabel: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '800',
  },
  outputValue: {
    color: '#0F172A',
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 36,
  },
  outputNote: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
  },
});

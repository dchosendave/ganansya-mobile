import { useCallback, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { AppScreen, Button, Field, MetricCard, Section } from '@/components/app-screen';
import { formatPeso } from '@/constants/ganansya';
import { useAsyncData } from '@/hooks/use-async-data';
import { useAuth } from '@/lib/auth/context';
import { getBalances } from '@/lib/db/balances';
import {
  createReconciliation,
  getLastReconciliation,
} from '@/lib/db/reconciliations';
import type { BalanceSnapshot, Reconciliation } from '@/types/db';

interface ReconcileData {
  balances: BalanceSnapshot;
  last: Reconciliation | null;
}

async function loadReconcile(): Promise<ReconcileData> {
  const [balances, last] = await Promise.all([getBalances(), getLastReconciliation()]);
  return { balances, last };
}

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

export default function ReconcileScreen() {
  const { account } = useAuth();
  const { data, reload } = useAsyncData<ReconcileData>(loadReconcile);
  const [actualCash, setActualCash] = useState('');
  const [actualGcash, setActualGcash] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const expectedCash = data?.balances.cash ?? 0;
  const expectedGcash = data?.balances.gcash ?? 0;
  const expectedTotal = expectedCash + expectedGcash;
  const parsedCash = Math.floor(Number(actualCash || 0));
  const parsedGcash = Math.floor(Number(actualGcash || 0));
  const actualTotal = parsedCash + parsedGcash;
  const difference = useMemo(() => actualTotal - expectedTotal, [actualTotal, expectedTotal]);

  const handleSave = useCallback(async () => {
    if (!actualCash.trim() || !actualGcash.trim()) {
      Alert.alert('Kulang', 'Lagyan ng aktwal na cash at GCash count.');
      return;
    }
    if (parsedCash < 0 || parsedGcash < 0) {
      Alert.alert('Invalid', 'Hindi pwede ang negative.');
      return;
    }
    setSubmitting(true);
    try {
      await createReconciliation({
        actualCash: parsedCash,
        actualGcash: parsedGcash,
        accountId: account?.id ?? null,
      });
      setActualCash('');
      setActualGcash('');
      reload();
      Alert.alert(
        'Naitala na',
        difference === 0
          ? 'Reconciliation balanced. Walang difference.'
          : `Recorded with difference of ${formatPeso.format(difference)}.`,
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Save failed';
      Alert.alert('May error', message);
    } finally {
      setSubmitting(false);
    }
  }, [account?.id, actualCash, actualGcash, difference, parsedCash, parsedGcash, reload]);

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

      <Button
        icon="fact-check"
        label={submitting ? 'Saving...' : 'Save Reconciliation'}
        onPress={submitting ? undefined : handleSave}
      />

      {data?.last ? (
        <Section title="Last Reconciliation">
          <View style={styles.lastBox}>
            <Text style={styles.lastTime}>{formatTime(data.last.createdAt)}</Text>
            <View style={styles.lastRow}>
              <Text style={styles.lastLabel}>Expected</Text>
              <Text style={styles.lastValue}>
                {formatPeso.format(data.last.expectedCash + data.last.expectedGcash)}
              </Text>
            </View>
            <View style={styles.lastRow}>
              <Text style={styles.lastLabel}>Actual</Text>
              <Text style={styles.lastValue}>
                {formatPeso.format(data.last.actualCash + data.last.actualGcash)}
              </Text>
            </View>
            <View style={styles.lastRow}>
              <Text style={styles.lastLabel}>Difference</Text>
              <Text
                style={[
                  styles.lastValue,
                  data.last.difference === 0 ? styles.diffOk : styles.diffWarn,
                ]}>
                {formatPeso.format(data.last.difference)}
              </Text>
            </View>
          </View>
        </Section>
      ) : null}
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
  lastBox: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    padding: 14,
  },
  lastTime: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  lastRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lastLabel: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
  lastValue: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '900',
  },
  diffOk: {
    color: '#16A34A',
  },
  diffWarn: {
    color: '#B45309',
  },
});

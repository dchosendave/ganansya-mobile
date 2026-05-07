import { useCallback, useMemo, useState } from 'react';
import { Alert, Text, View } from 'react-native';

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
      <View className="gap-3">
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
        <View className="gap-1 rounded-lg border border-stone-200 bg-white p-4">
          <Text className="text-sm font-extrabold text-stone-600">Actual Total</Text>
          <Text className="text-3xl font-black leading-9 text-stone-900">
            {formatPeso.format(actualTotal)}
          </Text>
          <Text className="text-sm leading-5 text-stone-500">
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
          <View className="gap-1.5 rounded-lg border border-stone-200 bg-white p-3.5">
            <Text className="mb-1 text-[13px] font-extrabold text-stone-500">
              {formatTime(data.last.createdAt)}
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-bold text-stone-600">Expected</Text>
              <Text className="text-base font-black text-stone-900">
                {formatPeso.format(data.last.expectedCash + data.last.expectedGcash)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-bold text-stone-600">Actual</Text>
              <Text className="text-base font-black text-stone-900">
                {formatPeso.format(data.last.actualCash + data.last.actualGcash)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-bold text-stone-600">Difference</Text>
              <Text
                className={`text-base font-black ${data.last.difference === 0 ? 'text-emerald-600' : 'text-amber-700'}`}>
                {formatPeso.format(data.last.difference)}
              </Text>
            </View>
          </View>
        </Section>
      ) : null}
    </AppScreen>
  );
}

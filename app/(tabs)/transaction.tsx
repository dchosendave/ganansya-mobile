import { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen, Button, Field, MetricCard, Section } from '@/components/app-screen';
import { floatThreshold, formatPeso } from '@/constants/ganansya';
import { useAsyncData } from '@/hooks/use-async-data';
import { useAuth } from '@/lib/auth/context';
import { getBalances } from '@/lib/db/balances';
import { computeFee, listPricingTiers } from '@/lib/db/pricing';
import { createTransaction, projectBalances } from '@/lib/db/transactions';
import type { BalanceSnapshot, PricingTier, TransactionType } from '@/types/db';

export default function TransactionScreen() {
  const { account } = useAuth();
  const balanceQuery = useAsyncData<BalanceSnapshot>(getBalances);
  const tiersQuery = useAsyncData<PricingTier[]>(listPricingTiers, []);

  const [transactionType, setTransactionType] = useState<TransactionType>('cashIn');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const parsedAmount = Math.floor(Number(amount.replace(/,/g, '')) || 0);
  const tiers = useMemo<PricingTier[]>(() => tiersQuery.data ?? [], [tiersQuery.data]);
  const fee = useMemo(() => computeFee(tiers, parsedAmount), [tiers, parsedAmount]);
  const total = parsedAmount + fee;

  const balances = balanceQuery.data;
  const projected = balances
    ? projectBalances(balances, transactionType, parsedAmount, fee)
    : null;

  const wouldCrossThreshold =
    !!projected &&
    parsedAmount > 0 &&
    (transactionType === 'cashIn'
      ? projected.gcash < floatThreshold
      : projected.cash < floatThreshold);

  const wouldGoNegative =
    !!projected && (projected.cash < 0 || projected.gcash < 0);

  const resetForm = useCallback(() => {
    setAmount('');
    setReference('');
  }, []);

  const commit = useCallback(
    async (override: boolean) => {
      setSubmitting(true);
      try {
        await createTransaction({
          type: transactionType,
          amount: parsedAmount,
          fee,
          reference: reference.trim() || null,
          accountId: account?.id ?? null,
          thresholdOverride: override,
        });
        resetForm();
        balanceQuery.reload();
        Alert.alert('Naitala na', `${transactionType === 'cashIn' ? 'Cash In' : 'Cash Out'} successfully logged.`);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Hindi naitala';
        Alert.alert('May error', message);
      } finally {
        setSubmitting(false);
      }
    },
    [account?.id, balanceQuery, fee, parsedAmount, reference, resetForm, transactionType],
  );

  const handleConfirm = useCallback(() => {
    if (parsedAmount <= 0) {
      Alert.alert('Walang amount', 'Lagyan ng valid na halaga ang Amount field.');
      return;
    }
    if (wouldGoNegative) {
      Alert.alert('Hindi sapat', 'Hindi sapat ang current balance para sa transaction na ito.');
      return;
    }
    if (wouldCrossThreshold) {
      const asset = transactionType === 'cashIn' ? 'GCash' : 'Cash';
      Alert.alert(
        'Below threshold',
        `Mababa na ang ${asset} after this transaction. Continue anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', style: 'destructive', onPress: () => void commit(true) },
        ],
      );
      return;
    }
    void commit(false);
  }, [commit, parsedAmount, transactionType, wouldCrossThreshold, wouldGoNegative]);

  return (
    <AppScreen
      eyebrow="New Transaction"
      title="Piliin ang serbisyo"
      description="Amount and fee are shown before confirming.">
      <View style={styles.typeRow}>
        <TypeButton
          active={transactionType === 'cashIn'}
          label="Cash In"
          onPress={() => setTransactionType('cashIn')}
          tone="blue"
        />
        <TypeButton
          active={transactionType === 'cashOut'}
          label="Cash Out"
          onPress={() => setTransactionType('cashOut')}
          tone="green"
        />
      </View>

      <Section title="Details">
        <Field
          keyboardType="numeric"
          label="Amount"
          onChangeText={setAmount}
          placeholder="Halimbawa: 1000"
          value={amount}
        />
        <Field
          label="Reference Number"
          onChangeText={setReference}
          placeholder="GCash reference"
          value={reference}
        />
      </Section>

      <View style={styles.summaryGrid}>
        <MetricCard label="Bayad (Fee)" tone="income" value={formatPeso.format(fee)} />
        <MetricCard
          caption={transactionType === 'cashIn' ? 'Customer cash plus fee' : 'GCash amount plus fee'}
          label="Total Collect"
          value={formatPeso.format(Number.isFinite(total) ? total : fee)}
        />
      </View>

      {balances ? (
        <Section title="After this transaction">
          <View style={styles.projection}>
            <ProjectionRow
              label="Cash"
              before={balances.cash}
              after={projected?.cash ?? balances.cash}
            />
            <ProjectionRow
              label="GCash"
              before={balances.gcash}
              after={projected?.gcash ?? balances.gcash}
            />
          </View>
        </Section>
      ) : null}

      {wouldCrossThreshold ? (
        <View style={styles.warnBox}>
          <Text style={styles.warnTitle}>Below float threshold</Text>
          <Text style={styles.warnText}>
            {(transactionType === 'cashIn' ? 'GCash' : 'Cash')} will drop below{' '}
            {formatPeso.format(floatThreshold)}. You can still continue, but the override is logged
            in audit trail.
          </Text>
        </View>
      ) : null}

      <Section title="Confirm Rule">
        <View style={styles.ruleBox}>
          <Text style={styles.ruleTitle}>No confirmation, no release</Text>
          <Text style={styles.ruleText}>
            Verify the actual GCash balance before giving cash or sending funds.
          </Text>
        </View>
      </Section>

      <Button
        icon="check-circle"
        label={
          submitting
            ? 'Saving...'
            : transactionType === 'cashIn'
              ? 'Confirm Cash In'
              : 'Confirm Cash Out'
        }
        onPress={submitting ? undefined : handleConfirm}
        variant={transactionType === 'cashIn' ? 'primary' : 'success'}
      />
    </AppScreen>
  );
}

type TypeButtonProps = {
  active: boolean;
  label: string;
  onPress: () => void;
  tone: 'blue' | 'green';
};

function TypeButton({ active, label, onPress, tone }: TypeButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.typeButton,
        active && tone === 'blue' && styles.typeButtonBlue,
        active && tone === 'green' && styles.typeButtonGreen,
      ]}>
      <Text style={[styles.typeText, active && styles.typeTextActive]}>{label}</Text>
    </Pressable>
  );
}

type ProjectionRowProps = {
  label: string;
  before: number;
  after: number;
};

function ProjectionRow({ label, before, after }: ProjectionRowProps) {
  const changed = before !== after;
  return (
    <View style={styles.projectionRow}>
      <Text style={styles.projectionLabel}>{label}</Text>
      <View style={styles.projectionValues}>
        <Text style={styles.projectionBefore}>{formatPeso.format(before)}</Text>
        {changed ? (
          <>
            <Text style={styles.projectionArrow}>›</Text>
            <Text style={[styles.projectionAfter, after < before && styles.projectionDown]}>
              {formatPeso.format(after)}
            </Text>
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  typeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 82,
    padding: 12,
  },
  typeButtonBlue: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  typeButtonGreen: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  typeText: {
    color: '#334155',
    fontSize: 20,
    fontWeight: '900',
  },
  typeTextActive: {
    color: '#FFFFFF',
  },
  summaryGrid: {
    gap: 12,
  },
  projection: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 14,
  },
  projectionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectionLabel: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '800',
  },
  projectionValues: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  projectionBefore: {
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: '700',
  },
  projectionArrow: {
    color: '#94A3B8',
    fontSize: 18,
    fontWeight: '900',
  },
  projectionAfter: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '900',
  },
  projectionDown: {
    color: '#B45309',
  },
  warnBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 14,
  },
  warnTitle: {
    color: '#991B1B',
    fontSize: 16,
    fontWeight: '900',
  },
  warnText: {
    color: '#7F1D1D',
    fontSize: 14,
    lineHeight: 20,
  },
  ruleBox: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 14,
  },
  ruleTitle: {
    color: '#9A3412',
    fontSize: 16,
    fontWeight: '900',
  },
  ruleText: {
    color: '#7C2D12',
    fontSize: 14,
    lineHeight: 20,
  },
});

import { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

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
      <View className="flex-row gap-3">
        <TypeButton
          active={transactionType === 'cashIn'}
          label="Cash In"
          onPress={() => setTransactionType('cashIn')}
          tone="brand"
        />
        <TypeButton
          active={transactionType === 'cashOut'}
          label="Cash Out"
          onPress={() => setTransactionType('cashOut')}
          tone="gold"
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

      <View className="gap-3">
        <MetricCard label="Bayad (Fee)" tone="income" value={formatPeso.format(fee)} />
        <MetricCard
          caption={transactionType === 'cashIn' ? 'Customer cash plus fee' : 'GCash amount plus fee'}
          label="Total Collect"
          value={formatPeso.format(Number.isFinite(total) ? total : fee)}
        />
      </View>

      {balances ? (
        <Section title="After this transaction">
          <View className="gap-2 rounded-lg border border-stone-200 bg-white p-3.5">
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
        <View className="gap-1 rounded-lg border border-red-200 bg-red-50 p-3.5">
          <Text className="text-base font-black text-red-900">Below float threshold</Text>
          <Text className="text-sm leading-5 text-red-900">
            {(transactionType === 'cashIn' ? 'GCash' : 'Cash')} will drop below{' '}
            {formatPeso.format(floatThreshold)}. You can still continue, but the override is logged
            in audit trail.
          </Text>
        </View>
      ) : null}

      <Section title="Confirm Rule">
        <View className="gap-1 rounded-lg border border-amber-200 bg-amber-50 p-3.5">
          <Text className="text-base font-black text-amber-900">No confirmation, no release</Text>
          <Text className="text-sm leading-5 text-amber-900">
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
        variant={transactionType === 'cashIn' ? 'primary' : 'gold'}
      />
    </AppScreen>
  );
}

type TypeButtonProps = {
  active: boolean;
  label: string;
  onPress: () => void;
  tone: 'brand' | 'gold';
};

function TypeButton({ active, label, onPress, tone }: TypeButtonProps) {
  const activeBg = tone === 'brand' ? 'bg-brand border-brand' : 'bg-gold-deep border-gold-deep';
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 items-center justify-center rounded-lg border min-h-[82px] p-3 ${active ? activeBg : 'bg-white border-stone-300'}`}>
      <Text className={`text-xl font-black ${active ? 'text-white' : 'text-stone-700'}`}>
        {label}
      </Text>
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
    <View className="flex-row items-center justify-between">
      <Text className="text-[15px] font-extrabold text-stone-600">{label}</Text>
      <View className="flex-row items-center gap-2">
        <Text className="text-[15px] font-bold text-stone-400">{formatPeso.format(before)}</Text>
        {changed ? (
          <>
            <Text className="text-lg font-black text-stone-400">›</Text>
            <Text
              className={`text-base font-black ${after < before ? 'text-amber-700' : 'text-stone-900'}`}>
              {formatPeso.format(after)}
            </Text>
          </>
        ) : null}
      </View>
    </View>
  );
}

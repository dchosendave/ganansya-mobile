import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen, Button, Field, MetricCard, Section } from '@/components/app-screen';
import { formatPeso, getFeeForAmount, type TransactionType } from '@/constants/ganansya';

export default function TransactionScreen() {
  const [transactionType, setTransactionType] = useState<TransactionType>('cashIn');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');

  const parsedAmount = Number(amount.replace(/,/g, ''));
  const fee = useMemo(() => getFeeForAmount(parsedAmount), [parsedAmount]);
  const total = parsedAmount + fee;

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
        label={transactionType === 'cashIn' ? 'Confirm Cash In' : 'Confirm Cash Out'}
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

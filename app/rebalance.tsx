import { Text, View } from 'react-native';

import { AppScreen, Button, Field, MetricCard, Section } from '@/components/app-screen';
import { floatThreshold, formatPeso } from '@/constants/ganansya';
import { useAsyncData } from '@/hooks/use-async-data';
import { getBalances } from '@/lib/db/balances';
import type { BalanceSnapshot } from '@/types/db';

export default function RebalanceScreen() {
  const { data } = useAsyncData<BalanceSnapshot>(getBalances);
  const cash = data?.cash ?? 0;
  const gcash = data?.gcash ?? 0;

  return (
    <AppScreen
      eyebrow="Rebalance Request"
      title="Request additional float"
      description="For low cash or low GCash situations that need owner action.">
      <View className="gap-3">
        <MetricCard label="Cash on Hand" value={formatPeso.format(cash)} />
        <MetricCard label="GCash Balance" value={formatPeso.format(gcash)} />
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
        <View className="gap-1 rounded-lg border border-amber-200 bg-amber-50 p-3.5">
          <Text className="text-base font-black text-amber-900">Pending owner approval</Text>
          <Text className="text-sm leading-5 text-amber-900">
            Owner can approve remotely, send funds, then mark equivalent cash for later remittance.
          </Text>
        </View>
      </Section>

      <Button icon="send" label="Send Request" />
    </AppScreen>
  );
}

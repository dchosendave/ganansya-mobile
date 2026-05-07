import { Text, View } from 'react-native';

import { ActionLink, AppScreen, EmptyState, MetricCard, Section } from '@/components/app-screen';
import { floatThreshold, formatPeso } from '@/constants/ganansya';
import { useAsyncData } from '@/hooks/use-async-data';
import { getBalances } from '@/lib/db/balances';
import { kitaToday } from '@/lib/db/transactions';
import type { BalanceSnapshot } from '@/types/db';

interface DashboardData {
  balances: BalanceSnapshot;
  kitaToday: number;
}

async function loadDashboard(): Promise<DashboardData> {
  const [balances, kita] = await Promise.all([getBalances(), kitaToday()]);
  return { balances, kitaToday: kita };
}

export default function DashboardScreen() {
  const { data } = useAsyncData<DashboardData>(loadDashboard);

  const cash = data?.balances.cash ?? 0;
  const gcash = data?.balances.gcash ?? 0;
  const kita = data?.kitaToday ?? 0;

  const cashLow = cash < floatThreshold;
  const gcashLow = gcash < floatThreshold;

  return (
    <AppScreen
      eyebrow="Dashboard"
      title="Kumusta, Tindera"
      description="Quick view ng cash, GCash, at kita today.">
      <View className="gap-3">
        <MetricCard label="Cash on Hand" value={formatPeso.format(cash)} />
        <MetricCard label="GCash Balance" value={formatPeso.format(gcash)} />
        <MetricCard
          caption="Transaction fees collected today"
          label="Kita Today"
          tone="income"
          value={formatPeso.format(kita)}
        />
      </View>

      <Section title="Quick Action" description="One tap para magsimula.">
        <View className="gap-3">
          <ActionLink
            description="Customer gives cash, store sends GCash."
            href="/transaction"
            icon="call-made"
            label="Cash In"
            tone="brand"
          />
          <ActionLink
            description="Customer sends GCash, store gives cash."
            href="/transaction"
            icon="call-received"
            label="Cash Out"
            tone="gold"
          />
        </View>
      </Section>

      <Section title="Float Status">
        {cashLow || gcashLow ? (
          <View className="gap-1 rounded-lg border border-red-200 bg-red-50 p-3.5">
            <Text className="text-base font-black text-red-900">Limit transactions muna</Text>
            <Text className="text-sm leading-5 text-red-900">
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
        <View className="gap-2.5">
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
    <View className="gap-[3px] rounded-lg border border-stone-200 bg-white p-3.5">
      <Text className="text-base font-extrabold text-stone-900">{label}</Text>
      <Text className="text-sm leading-5 text-stone-500">{text}</Text>
    </View>
  );
}

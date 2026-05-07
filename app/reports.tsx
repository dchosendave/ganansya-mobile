import { Text, View } from 'react-native';

import { AppScreen, MetricCard, Section } from '@/components/app-screen';
import { formatPeso } from '@/constants/ganansya';
import { useAsyncData } from '@/hooks/use-async-data';
import { kitaToday, listRecentTransactions } from '@/lib/db/transactions';
import type { Transaction } from '@/types/db';

interface ReportData {
  kitaToday: number;
  todayCount: number;
  recent: Transaction[];
}

const TARGET_TRANSACTIONS_PER_DAY = 30;
const MONTHLY_CONSERVATIVE = 8000;
const MONTHLY_TARGET = 15000;

function isToday(iso: string): boolean {
  const date = new Date(iso.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

async function loadReport(): Promise<ReportData> {
  const [kita, recent] = await Promise.all([kitaToday(), listRecentTransactions(100)]);
  const todayCount = recent.filter((t) => isToday(t.createdAt)).length;
  return { kitaToday: kita, todayCount, recent };
}

export default function ReportsScreen() {
  const { data } = useAsyncData<ReportData>(loadReport);
  const kita = data?.kitaToday ?? 0;
  const todayCount = data?.todayCount ?? 0;

  return (
    <AppScreen
      eyebrow="Owner Reports"
      title="Kita at volume"
      description="Daily and monthly snapshots for owner monitoring.">
      <View className="gap-3">
        <MetricCard
          caption={`${todayCount} transaction${todayCount === 1 ? '' : 's'} today`}
          label="Daily Profit"
          tone="income"
          value={formatPeso.format(kita)}
        />
        <MetricCard
          caption="Conservative monthly range from PRD"
          label="Monthly Range"
          value={`${formatPeso.format(MONTHLY_CONSERVATIVE)} - ${formatPeso.format(MONTHLY_TARGET)}`}
        />
      </View>

      <Section title="Transaction Volume">
        <View className="items-center rounded-lg border border-stone-200 bg-white p-[18px]">
          <Text className="text-[42px] font-black leading-[48px] text-stone-900">
            {todayCount}
            <Text className="text-2xl font-black text-stone-400"> / {TARGET_TRANSACTIONS_PER_DAY}</Text>
          </Text>
          <Text className="text-[15px] font-bold text-stone-500">
            transactions today vs daily target
          </Text>
        </View>
      </Section>

      <Section title="Growth Phases">
        <View className="gap-2.5">
          <Phase label="Phase 1" text="Single store validation" />
          <Phase label="Phase 2" text="Increase float" />
          <Phase label="Phase 3" text="Multi-store rollout" />
          <Phase label="Phase 4" text="Platform scaling" />
        </View>
      </Section>
    </AppScreen>
  );
}

type PhaseProps = {
  label: string;
  text: string;
};

function Phase({ label, text }: PhaseProps) {
  return (
    <View className="gap-0.5 rounded-lg border border-stone-200 bg-white p-3.5">
      <Text className="text-[15px] font-black text-brand">{label}</Text>
      <Text className="text-base font-bold text-stone-900">{text}</Text>
    </View>
  );
}

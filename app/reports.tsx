import { StyleSheet, Text, View } from 'react-native';

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
      <View style={styles.metricGrid}>
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
        <View style={styles.volumeBox}>
          <Text style={styles.volumeNumber}>
            {todayCount}
            <Text style={styles.volumeOf}> / {TARGET_TRANSACTIONS_PER_DAY}</Text>
          </Text>
          <Text style={styles.volumeLabel}>transactions today vs daily target</Text>
        </View>
      </Section>

      <Section title="Growth Phases">
        <View style={styles.phaseList}>
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
    <View style={styles.phase}>
      <Text style={styles.phaseLabel}>{label}</Text>
      <Text style={styles.phaseText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  metricGrid: {
    gap: 12,
  },
  volumeBox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    padding: 18,
  },
  volumeNumber: {
    color: '#0F172A',
    fontSize: 42,
    fontWeight: '900',
    lineHeight: 48,
  },
  volumeOf: {
    color: '#94A3B8',
    fontSize: 24,
    fontWeight: '900',
  },
  volumeLabel: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '700',
  },
  phaseList: {
    gap: 10,
  },
  phase: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    gap: 2,
    padding: 14,
  },
  phaseLabel: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '900',
  },
  phaseText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
});

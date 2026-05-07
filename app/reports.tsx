import { StyleSheet, Text, View } from 'react-native';

import { AppScreen, MetricCard, Section } from '@/components/app-screen';
import { formatPeso, recentTransactions } from '@/constants/ganansya';

const dailyProfit = recentTransactions.reduce((total, transaction) => total + transaction.fee, 0);
const monthlyConservative = 8000;
const monthlyTarget = 15000;

export default function ReportsScreen() {
  return (
    <AppScreen
      eyebrow="Owner Reports"
      title="Kita at volume"
      description="Daily and monthly snapshots for owner monitoring.">
      <View style={styles.metricGrid}>
        <MetricCard
          caption={`${recentTransactions.length} sample transactions`}
          label="Daily Profit"
          tone="income"
          value={formatPeso.format(dailyProfit)}
        />
        <MetricCard
          caption="Conservative monthly range from PRD"
          label="Monthly Range"
          value={`${formatPeso.format(monthlyConservative)} - ${formatPeso.format(monthlyTarget)}`}
        />
      </View>

      <Section title="Transaction Volume">
        <View style={styles.volumeBox}>
          <Text style={styles.volumeNumber}>30</Text>
          <Text style={styles.volumeLabel}>target transactions per day</Text>
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

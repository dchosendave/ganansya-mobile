import { StyleSheet, Text, View } from 'react-native';

import { AppScreen, EmptyState, Section } from '@/components/app-screen';
import { auditTrail } from '@/constants/ganansya';

export default function AuditScreen() {
  return (
    <AppScreen
      eyebrow="Audit Trail"
      title="No silent changes"
      description="Track edits, corrections, approvals, and reconciliation events.">
      <Section title="Recent Events">
        <View style={styles.list}>
          {auditTrail.map((event) => (
            <View key={event.id} style={styles.event}>
              <Text style={styles.eventTime}>{event.time}</Text>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDetail}>{event.detail}</Text>
            </View>
          ))}
        </View>
      </Section>

      <EmptyState
        description="Each correction should keep the original value and the updated value once persistence is added."
        icon="policy"
        title="Correction-ready"
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  event: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    gap: 5,
    padding: 14,
  },
  eventTime: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '800',
  },
  eventTitle: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '900',
  },
  eventDetail: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
  },
});

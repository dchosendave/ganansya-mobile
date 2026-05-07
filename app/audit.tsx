import { StyleSheet, Text, View } from 'react-native';

import { AppScreen, EmptyState, Section } from '@/components/app-screen';
import { useAsyncData } from '@/hooks/use-async-data';
import { listAuditEvents } from '@/lib/db/audit';
import type { AuditEvent } from '@/types/db';

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

export default function AuditScreen() {
  const { data } = useAsyncData<AuditEvent[]>(() => listAuditEvents(100), []);
  const events = data ?? [];

  return (
    <AppScreen
      eyebrow="Audit Trail"
      title="No silent changes"
      description="Track edits, corrections, approvals, and reconciliation events.">
      <Section title="Recent Events">
        {events.length === 0 ? (
          <EmptyState
            description="Audit events appear here once transactions, overrides, or corrections are made."
            icon="policy"
            title="Walang event pa"
          />
        ) : (
          <View style={styles.list}>
            {events.map((event) => (
              <View key={event.id} style={styles.event}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTime}>{formatTime(event.createdAt)}</Text>
                  {event.kind === 'threshold_override' ? (
                    <Text style={styles.tagWarn}>Override</Text>
                  ) : null}
                </View>
                <Text style={styles.eventTitle}>{event.title}</Text>
                {event.detail ? <Text style={styles.eventDetail}>{event.detail}</Text> : null}
              </View>
            ))}
          </View>
        )}
      </Section>
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
  eventHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  eventTime: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '800',
  },
  tagWarn: {
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 3,
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

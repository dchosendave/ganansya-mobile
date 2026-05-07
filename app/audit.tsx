import { Text, View } from 'react-native';

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
          <View className="gap-2.5">
            {events.map((event) => (
              <View
                key={event.id}
                className="gap-1.5 rounded-lg border border-stone-200 bg-white p-3.5">
                <View className="flex-row items-center justify-between gap-2">
                  <Text className="text-[13px] font-extrabold text-stone-500">
                    {formatTime(event.createdAt)}
                  </Text>
                  {event.kind === 'threshold_override' ? (
                    <Text className="rounded-md bg-red-50 px-2 py-[3px] text-xs font-black text-red-700">
                      Override
                    </Text>
                  ) : null}
                </View>
                <Text className="text-[17px] font-black text-stone-900">{event.title}</Text>
                {event.detail ? (
                  <Text className="text-sm leading-5 text-stone-600">{event.detail}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </Section>
    </AppScreen>
  );
}

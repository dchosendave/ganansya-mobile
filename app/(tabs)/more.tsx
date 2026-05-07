import { ActionLink, AppScreen, EmptyState, Section } from '@/components/app-screen';

export default function MoreScreen() {
  return (
    <AppScreen
      eyebrow="More"
      title="Owner tools"
      description="Admin and owner screens from the PRD, kept separate from daily operator work.">
      <Section title="Float Management">
        <ActionLink
          description="Ask owner for additional GCash or cash support."
          href="/rebalance"
          icon="sync-alt"
          label="Rebalance Request"
          tone="orange"
        />
      </Section>

      <Section title="Admin">
        <ActionLink
          description="Manage fixed transaction fee tiers."
          href="/admin/pricing"
          icon="price-change"
          label="Pricing Rules"
          tone="blue"
        />
        <ActionLink
          description="Daily and monthly profit snapshots."
          href="/reports"
          icon="bar-chart"
          label="Reports"
          tone="green"
        />
        <ActionLink
          description="View edits, corrections, and operational events."
          href="/audit"
          icon="history"
          label="Audit Trail"
        />
      </Section>

      <EmptyState
        description="Role permissions can decide which items are visible after auth is connected."
        icon="admin-panel-settings"
        title="Role-ready"
      />
    </AppScreen>
  );
}

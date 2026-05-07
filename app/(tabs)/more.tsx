import { Alert } from 'react-native';

import {
  ActionButton,
  ActionLink,
  AppScreen,
  EmptyState,
  Section,
} from '@/components/app-screen';
import { useAuth } from '@/lib/auth/context';

export default function MoreScreen() {
  const { account, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Lalabas ka sa account. Sigurado?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: signOut },
    ]);
  };

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

      <Section
        title="Account"
        description={account ? `Naka-sign in bilang ${account.phone}` : undefined}>
        <ActionButton
          description="Sign out and return to the PIN login screen."
          icon="logout"
          label="Logout"
          onPress={handleLogout}
          tone="red"
        />
      </Section>

      <EmptyState
        description="Role permissions can decide which items are visible after multi-role auth ships."
        icon="admin-panel-settings"
        title="Role-ready"
      />
    </AppScreen>
  );
}

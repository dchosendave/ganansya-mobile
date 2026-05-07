import { StyleSheet, Text, View } from 'react-native';

import { AppScreen, Button, Field, Section } from '@/components/app-screen';
import { formatPeso, pricingTiers } from '@/constants/ganansya';

export default function PricingScreen() {
  return (
    <AppScreen
      eyebrow="Pricing Rules"
      title="Fixed fee tiers"
      description="No negotiation. Fees are computed by amount range.">
      <Section title="Active Tiers">
        <View style={styles.tierList}>
          {pricingTiers.map((tier) => (
            <View key={tier.id} style={styles.tier}>
              <View style={styles.tierHeader}>
                <Text style={styles.tierRange}>{tier.range}</Text>
                <Text style={styles.tierFee}>{formatPeso.format(tier.fee)}</Text>
              </View>
              <Text style={styles.tierNote}>{tier.note}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Edit Tier">
        <Field label="Amount Range" placeholder="PHP 1 - PHP 1,000" />
        <Field keyboardType="numeric" label="Fee" placeholder="10" />
        <Button icon="save" label="Save Pricing Rule" />
      </Section>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  tierList: {
    gap: 10,
  },
  tier: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    padding: 14,
  },
  tierHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  tierRange: {
    color: '#0F172A',
    flex: 1,
    fontSize: 15,
    fontWeight: '900',
  },
  tierFee: {
    color: '#16A34A',
    fontSize: 18,
    fontWeight: '900',
  },
  tierNote: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
  },
});

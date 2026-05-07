import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen, Button, Field, Section } from '@/components/app-screen';
import { formatPeso } from '@/constants/ganansya';
import { useAsyncData } from '@/hooks/use-async-data';
import { listPricingTiers, updatePricingTierFee } from '@/lib/db/pricing';
import type { PricingTier } from '@/types/db';

export default function PricingScreen() {
  const { data, reload } = useAsyncData<PricingTier[]>(listPricingTiers, []);
  const tiers = useMemo<PricingTier[]>(() => data ?? [], [data]);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [feeInput, setFeeInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedId === null && tiers.length > 0) {
      setSelectedId(tiers[0].id);
      setFeeInput(String(tiers[0].fee));
    }
  }, [selectedId, tiers]);

  const selected = tiers.find((t) => t.id === selectedId) ?? null;

  const handleSelect = (tier: PricingTier) => {
    setSelectedId(tier.id);
    setFeeInput(String(tier.fee));
  };

  const handleSave = async () => {
    if (!selected) return;
    const newFee = Math.floor(Number(feeInput));
    if (!Number.isFinite(newFee) || newFee < 0) {
      Alert.alert('Invalid fee', 'Lagyan ng valid na halaga ang fee.');
      return;
    }
    if (newFee === selected.fee) {
      Alert.alert('Walang binago', 'Pareho lang ang fee.');
      return;
    }
    setSaving(true);
    try {
      await updatePricingTierFee(selected.id, newFee);
      reload();
      Alert.alert('Naitala na', `Updated ${selected.label} fee to ${formatPeso.format(newFee)}.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Save failed';
      Alert.alert('May error', message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppScreen
      eyebrow="Pricing Rules"
      title="Fixed fee tiers"
      description="No negotiation. Tindera can adjust fees per tier.">
      <Section title="Active Tiers" description="Tap a tier to edit.">
        <View style={styles.tierList}>
          {tiers.map((tier) => {
            const isSelected = tier.id === selectedId;
            return (
              <Pressable
                key={tier.id}
                onPress={() => handleSelect(tier)}
                style={({ pressed }) => [
                  styles.tier,
                  isSelected && styles.tierSelected,
                  pressed && styles.tierPressed,
                ]}>
                <View style={styles.tierHeader}>
                  <Text style={styles.tierRange}>{tier.label}</Text>
                  <Text style={styles.tierFee}>{formatPeso.format(tier.fee)}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </Section>

      {selected ? (
        <Section title="Edit Fee">
          <View style={styles.editCard}>
            <Text style={styles.editLabel}>Selected tier</Text>
            <Text style={styles.editRange}>{selected.label}</Text>
          </View>
          <Field
            keyboardType="numeric"
            label="Fee (PHP)"
            onChangeText={setFeeInput}
            placeholder="10"
            value={feeInput}
          />
          <Button
            icon="save"
            label={saving ? 'Saving...' : 'Save Pricing Rule'}
            onPress={saving ? undefined : handleSave}
          />
        </Section>
      ) : null}
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
  tierSelected: {
    borderColor: '#2563EB',
    borderWidth: 2,
    backgroundColor: '#EFF6FF',
  },
  tierPressed: {
    opacity: 0.85,
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
  editCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 14,
  },
  editLabel: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '800',
  },
  editRange: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '900',
  },
});

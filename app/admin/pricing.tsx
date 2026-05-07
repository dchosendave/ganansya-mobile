import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

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
        <View className="gap-2.5">
          {tiers.map((tier) => {
            const isSelected = tier.id === selectedId;
            return (
              <Pressable
                key={tier.id}
                onPress={() => handleSelect(tier)}
                className={`gap-1.5 rounded-lg border p-3.5 active:opacity-85 ${
                  isSelected
                    ? 'border-2 border-brand bg-brand-soft'
                    : 'border border-stone-200 bg-white'
                }`}>
                <View className="flex-row items-center justify-between gap-2.5">
                  <Text className="flex-1 text-[15px] font-black text-stone-900">{tier.label}</Text>
                  <Text className="text-lg font-black text-emerald-600">
                    {formatPeso.format(tier.fee)}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </Section>

      {selected ? (
        <Section title="Edit Fee">
          <View className="gap-1 rounded-lg border border-stone-200 bg-stone-100 p-3.5">
            <Text className="text-[13px] font-extrabold text-stone-600">Selected tier</Text>
            <Text className="text-[17px] font-black text-stone-900">{selected.label}</Text>
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

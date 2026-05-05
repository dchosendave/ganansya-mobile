import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function TransactionScreen() {
  return (
    <ThemedView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.eyebrow}>New Transaction</ThemedText>
          <ThemedText type="title" style={styles.title}>
            Piliin ang serbisyo
          </ThemedText>
        </View>

        <View style={styles.typeRow}>
          <Pressable style={[styles.typeButton, styles.cashInButton]}>
            <ThemedText style={styles.typeButtonText}>Cash In</ThemedText>
          </Pressable>
          <Pressable style={[styles.typeButton, styles.cashOutButton]}>
            <ThemedText style={styles.typeButtonText}>Cash Out</ThemedText>
          </Pressable>
        </View>

        <View style={styles.form}>
          <ThemedText type="defaultSemiBold">Amount</ThemedText>
          <TextInput
            keyboardType="numeric"
            placeholder="Halimbawa: 1000"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />

          <ThemedText type="defaultSemiBold">Reference Number</ThemedText>
          <TextInput
            placeholder="GCash reference"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />
        </View>

        <View style={styles.summary}>
          <ThemedText type="defaultSemiBold" style={styles.summaryTitle}>
            Milestone 1 note
          </ThemedText>
          <ThemedText style={styles.summaryText}>
            Static muna ito. Sa next milestone natin ikakabit ang fee calculation, fee deduction
            mode, confirmation, at saved transaction history.
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: 20,
    padding: 20,
    paddingTop: 72,
  },
  header: {
    gap: 6,
  },
  eyebrow: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '700',
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 84,
    borderRadius: 8,
    padding: 16,
  },
  cashInButton: {
    backgroundColor: '#2563EB',
  },
  cashOutButton: {
    backgroundColor: '#16A34A',
  },
  typeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  form: {
    gap: 10,
  },
  input: {
    minHeight: 56,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    borderWidth: 1,
    color: '#0F172A',
    fontSize: 18,
    paddingHorizontal: 16,
  },
  summary: {
    gap: 6,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#EFF6FF',
    padding: 16,
  },
  summaryTitle: {
    color: '#1D4ED8',
  },
  summaryText: {
    color: '#1E3A8A',
  },
});

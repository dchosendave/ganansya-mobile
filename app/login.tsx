import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/lib/auth/context';

const PIN_LENGTH = 6;

type Key =
  | { kind: 'digit'; value: string }
  | { kind: 'back' }
  | { kind: 'clear' };

const keypad: Key[] = [
  { kind: 'digit', value: '1' },
  { kind: 'digit', value: '2' },
  { kind: 'digit', value: '3' },
  { kind: 'digit', value: '4' },
  { kind: 'digit', value: '5' },
  { kind: 'digit', value: '6' },
  { kind: 'digit', value: '7' },
  { kind: 'digit', value: '8' },
  { kind: 'digit', value: '9' },
  { kind: 'back' },
  { kind: 'digit', value: '0' },
  { kind: 'clear' },
];

export default function LoginScreen() {
  const { signIn, signingIn } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (candidate: string) => {
      setError(null);
      const result = await signIn(candidate);
      if (!result.ok) {
        setError(result.reason);
        setPin('');
      }
    },
    [signIn],
  );

  const handleKey = useCallback(
    (key: Key) => {
      if (signingIn) return;

      if (key.kind === 'digit') {
        setPin((current) => {
          if (current.length >= PIN_LENGTH) return current;
          const next = current + key.value;
          if (next.length === PIN_LENGTH) {
            void submit(next);
          }
          return next;
        });
        if (error) setError(null);
        return;
      }

      if (key.kind === 'back') {
        setPin((current) => current.slice(0, -1));
        return;
      }

      setPin('');
    },
    [error, signingIn, submit],
  );

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brand}>Ganansya</Text>
          <Text style={styles.title}>PIN Login</Text>
          <Text style={styles.description}>Simple sign in for the store operator.</Text>
        </View>

        <View style={styles.pinPanel}>
          <Text style={styles.pinLabel}>Enter PIN</Text>
          <View style={styles.pinDots}>
            {Array.from({ length: PIN_LENGTH }).map((_, idx) => (
              <View
                key={idx}
                style={idx < pin.length ? styles.dot : styles.dotMuted}
              />
            ))}
          </View>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : signingIn ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={styles.loadingText}>Checking PIN...</Text>
            </View>
          ) : (
            <Text style={styles.helpText}>{PIN_LENGTH} digits required</Text>
          )}
        </View>

        <View style={styles.keypad}>
          {keypad.map((key, idx) => (
            <Pressable
              key={idx}
              disabled={signingIn}
              onPress={() => handleKey(key)}
              style={({ pressed }) => [
                styles.key,
                pressed && styles.keyPressed,
                signingIn && styles.keyDisabled,
              ]}>
              {key.kind === 'digit' ? (
                <Text style={styles.keyText}>{key.value}</Text>
              ) : key.kind === 'back' ? (
                <MaterialIcons name="backspace" size={22} color="#0F172A" />
              ) : (
                <Text style={styles.keyAction}>Clear</Text>
              )}
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    gap: 22,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    gap: 6,
  },
  brand: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '900',
  },
  title: {
    color: '#0F172A',
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 40,
  },
  description: {
    color: '#64748B',
    fontSize: 16,
  },
  pinPanel: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 24,
  },
  pinLabel: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '800',
  },
  pinDots: {
    flexDirection: 'row',
    gap: 12,
  },
  dot: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    height: 16,
    width: 16,
  },
  dotMuted: {
    backgroundColor: '#CBD5E1',
    borderRadius: 8,
    height: 16,
    width: 16,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    fontWeight: '800',
  },
  helpText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },
  loadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  loadingText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  key: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: '30%',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 58,
  },
  keyPressed: {
    opacity: 0.7,
  },
  keyDisabled: {
    opacity: 0.5,
  },
  keyText: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '800',
  },
  keyAction: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '900',
  },
});

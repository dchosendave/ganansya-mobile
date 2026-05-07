import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

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
        if (pin.length >= PIN_LENGTH) return;
        const next = pin + key.value;
        setPin(next);
        if (error) setError(null);
        if (next.length === PIN_LENGTH) {
          void submit(next);
        }
        return;
      }

      if (key.kind === 'back') {
        setPin((current) => current.slice(0, -1));
        return;
      }

      setPin('');
    },
    [error, pin, signingIn, submit],
  );

  return (
    <View className="flex-1 bg-stone-50">
      <View className="flex-1 justify-center gap-[22px] p-5">
        <View className="gap-1.5">
          <Text className="text-base font-black text-brand">Ganansya</Text>
          <Text className="text-[34px] font-black leading-10 text-stone-900">PIN Login</Text>
          <Text className="text-base text-stone-500">
            Simple sign in for the store operator.
          </Text>
        </View>

        <View className="items-center gap-3.5 rounded-lg border border-stone-200 bg-white p-6">
          <Text className="text-base font-extrabold text-stone-700">Enter PIN</Text>
          <View className="flex-row gap-3">
            {Array.from({ length: PIN_LENGTH }).map((_, idx) => (
              <View
                key={idx}
                className={`h-4 w-4 rounded-lg ${idx < pin.length ? 'bg-brand' : 'bg-stone-300'}`}
              />
            ))}
          </View>
          {error ? (
            <Text className="text-sm font-extrabold text-red-700">{error}</Text>
          ) : signingIn ? (
            <View className="flex-row items-center gap-2">
              <ActivityIndicator size="small" color="#047857" />
              <Text className="text-sm font-bold text-brand">Checking PIN...</Text>
            </View>
          ) : (
            <Text className="text-[13px] font-bold text-stone-500">{PIN_LENGTH} digits required</Text>
          )}
        </View>

        <View className="flex-row flex-wrap gap-2.5">
          {keypad.map((key, idx) => (
            <Pressable
              key={idx}
              disabled={signingIn}
              onPress={() => handleKey(key)}
              className={`flex-grow basis-[30%] items-center justify-center rounded-lg border border-stone-300 bg-white min-h-[58px] active:opacity-70 ${signingIn ? 'opacity-50' : ''}`}>
              {key.kind === 'digit' ? (
                <Text className="text-[22px] font-extrabold text-stone-900">{key.value}</Text>
              ) : key.kind === 'back' ? (
                <MaterialIcons name="backspace" size={22} color="#1C1917" />
              ) : (
                <Text className="text-[15px] font-black text-stone-900">Clear</Text>
              )}
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

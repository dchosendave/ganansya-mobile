import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/lib/auth/context';
import { initDatabase } from '@/lib/db/init';

export const unstable_settings = {
  anchor: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [ready, setReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    initDatabase()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : 'Database init failed';
        setInitError(message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (initError) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-stone-50 p-5">
        <Text className="text-lg font-black text-red-700">Cannot start the app</Text>
        <Text className="text-center text-sm text-red-900">{initError}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-stone-50 p-5">
        <ActivityIndicator size="large" color="#047857" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AuthGate />
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="rebalance" options={{ title: 'Rebalance Request' }} />
          <Stack.Screen name="admin/pricing" options={{ title: 'Pricing Rules' }} />
          <Stack.Screen name="reports" options={{ title: 'Reports' }} />
          <Stack.Screen name="audit" options={{ title: 'Audit Trail' }} />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AuthGate() {
  const { account } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const onLogin = segments[0] === 'login';
    if (!account && !onLogin) {
      router.replace('/login');
    } else if (account && onLogin) {
      router.replace('/');
    }
  }, [account, segments, router]);

  return null;
}

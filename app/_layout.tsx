import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="rebalance" options={{ title: 'Rebalance Request' }} />
        <Stack.Screen name="admin/pricing" options={{ title: 'Pricing Rules' }} />
        <Stack.Screen name="reports" options={{ title: 'Reports' }} />
        <Stack.Screen name="audit" options={{ title: 'Audit Trail' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Back', '0', 'Clear'];

export default function LoginScreen() {
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
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dotMuted} />
            <View style={styles.dotMuted} />
          </View>
        </View>

        <View style={styles.keypad}>
          {digits.map((digit) => (
            <Pressable key={digit} style={styles.key}>
              <Text style={styles.keyText}>{digit}</Text>
            </Pressable>
          ))}
        </View>

        <Link href="/" asChild>
          <Pressable style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>
        </Link>
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
    gap: 16,
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
  keyText: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '800',
  },
  loginButton: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 56,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
});

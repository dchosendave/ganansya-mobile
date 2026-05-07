import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, type Href } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

type AppScreenProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function AppScreen({ eyebrow, title, description, children }: AppScreenProps) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
        {children}
      </ScrollView>
    </View>
  );
}

type SectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function Section({ title, description, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {description ? <Text style={styles.sectionDescription}>{description}</Text> : null}
      </View>
      {children}
    </View>
  );
}

type MetricTone = 'neutral' | 'income' | 'warning' | 'danger';

type MetricCardProps = {
  label: string;
  value: string;
  caption?: string;
  tone?: MetricTone;
};

export function MetricCard({ label, value, caption, tone = 'neutral' }: MetricCardProps) {
  return (
    <View style={[styles.metricCard, metricToneStyles[tone]]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      {caption ? <Text style={styles.metricCaption}>{caption}</Text> : null}
    </View>
  );
}

type ActionTone = 'blue' | 'green' | 'orange' | 'slate' | 'red';

type ActionLinkProps = {
  href: Href;
  icon: MaterialIconName;
  label: string;
  description: string;
  tone?: ActionTone;
};

export function ActionLink({
  href,
  icon,
  label,
  description,
  tone = 'slate',
}: ActionLinkProps) {
  return (
    <Link href={href} asChild>
      <Pressable
        style={({ pressed }) => [
          styles.actionLink,
          actionToneStyles[tone],
          pressed && styles.pressed,
        ]}>
        <View style={styles.actionIconWrap}>
          <MaterialIcons name={icon} size={24} color={actionIconColors[tone]} />
        </View>
        <View style={styles.actionCopy}>
          <Text style={styles.actionLabel}>{label}</Text>
          <Text style={styles.actionDescription}>{description}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#64748B" />
      </Pressable>
    </Link>
  );
}

type ActionButtonProps = {
  onPress: () => void;
  icon: MaterialIconName;
  label: string;
  description: string;
  tone?: ActionTone;
};

export function ActionButton({
  onPress,
  icon,
  label,
  description,
  tone = 'slate',
}: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionLink,
        actionToneStyles[tone],
        pressed && styles.pressed,
      ]}>
      <View style={styles.actionIconWrap}>
        <MaterialIcons name={icon} size={24} color={actionIconColors[tone]} />
      </View>
      <View style={styles.actionCopy}>
        <Text style={styles.actionLabel}>{label}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#64748B" />
    </Pressable>
  );
}

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'success' | 'outline';
  icon?: MaterialIconName;
};

export function Button({ label, onPress, variant = 'primary', icon }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, buttonStyles[variant], pressed && styles.pressed]}>
      {icon ? <MaterialIcons name={icon} size={22} color={variant === 'outline' ? '#0F172A' : '#FFFFFF'} /> : null}
      <Text style={[styles.buttonText, variant === 'outline' && styles.outlineButtonText]}>
        {label}
      </Text>
    </Pressable>
  );
}

type FieldProps = {
  label: string;
  placeholder: string;
  value?: string;
  onChangeText?: (value: string) => void;
  keyboardType?: ComponentProps<typeof TextInput>['keyboardType'];
};

export function Field({ label, placeholder, value, onChangeText, keyboardType }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        style={styles.input}
        value={value}
      />
    </View>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: MaterialIconName;
};

export function EmptyState({ title, description, icon = 'info-outline' }: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <MaterialIcons name={icon} size={26} color="#475569" />
      <View style={styles.emptyCopy}>
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptyDescription}>{description}</Text>
      </View>
    </View>
  );
}

export const tokens = {
  border: '#E2E8F0',
  muted: '#64748B',
  text: '#0F172A',
  surface: '#FFFFFF',
};

const metricToneStyles = StyleSheet.create({
  neutral: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  income: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  warning: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  danger: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
});

const actionToneStyles = StyleSheet.create({
  blue: {
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
  },
  green: {
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
  },
  orange: {
    borderColor: '#FED7AA',
    backgroundColor: '#FFF7ED',
  },
  red: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  slate: {
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
});

const actionIconColors: Record<ActionTone, string> = {
  blue: '#2563EB',
  green: '#16A34A',
  orange: '#EA580C',
  red: '#B91C1C',
  slate: '#475569',
};

const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  success: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  outline: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
  },
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    gap: 20,
    padding: 20,
    paddingBottom: 36,
    paddingTop: 68,
  },
  header: {
    gap: 6,
  },
  eyebrow: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '800',
  },
  title: {
    color: '#0F172A',
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 36,
  },
  description: {
    color: '#64748B',
    fontSize: 16,
    lineHeight: 23,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    gap: 3,
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 19,
    fontWeight: '800',
  },
  sectionDescription: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 21,
  },
  metricCard: {
    gap: 7,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  metricLabel: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
  metricValue: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
  },
  metricCaption: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 19,
  },
  actionLink: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 76,
    padding: 14,
  },
  actionIconWrap: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  actionCopy: {
    flex: 1,
    gap: 2,
  },
  actionLabel: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '800',
  },
  actionDescription: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 19,
  },
  pressed: {
    opacity: 0.72,
  },
  button: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  outlineButtonText: {
    color: '#0F172A',
  },
  field: {
    gap: 7,
  },
  fieldLabel: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    borderWidth: 1,
    color: '#0F172A',
    fontSize: 18,
    minHeight: 56,
    paddingHorizontal: 14,
  },
  emptyState: {
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  emptyCopy: {
    flex: 1,
    gap: 2,
  },
  emptyTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyDescription: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
  },
});

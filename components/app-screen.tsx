import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, type Href } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

type AppScreenProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function AppScreen({ eyebrow, title, description, children }: AppScreenProps) {
  return (
    <View className="flex-1 bg-stone-50">
      <ScrollView
        contentContainerClassName="gap-5 p-5 pt-[68px] pb-9"
        keyboardShouldPersistTaps="handled">
        <View className="gap-1.5">
          <Text className="text-[15px] font-extrabold text-brand">{eyebrow}</Text>
          <Text className="text-3xl font-black leading-9 text-stone-900">{title}</Text>
          {description ? (
            <Text className="text-base leading-6 text-stone-500">{description}</Text>
          ) : null}
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
    <View className="gap-3">
      <View className="gap-0.5">
        <Text className="text-[19px] font-extrabold text-stone-900">{title}</Text>
        {description ? (
          <Text className="text-[15px] leading-[21px] text-stone-500">{description}</Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}

type MetricTone = 'neutral' | 'income' | 'warning' | 'danger';

const metricToneClasses: Record<MetricTone, string> = {
  neutral: 'bg-white border-stone-200',
  income: 'bg-brand-soft border-brand-edge',
  warning: 'bg-amber-50 border-amber-200',
  danger: 'bg-red-50 border-red-200',
};

type MetricCardProps = {
  label: string;
  value: string;
  caption?: string;
  tone?: MetricTone;
};

export function MetricCard({ label, value, caption, tone = 'neutral' }: MetricCardProps) {
  return (
    <View className={`gap-[7px] rounded-lg border p-4 ${metricToneClasses[tone]}`}>
      <Text className="text-sm font-bold text-stone-600">{label}</Text>
      <Text className="text-[28px] font-black leading-[34px] text-stone-900">{value}</Text>
      {caption ? (
        <Text className="text-sm leading-[19px] text-stone-500">{caption}</Text>
      ) : null}
    </View>
  );
}

export type ActionTone = 'brand' | 'gold' | 'ok' | 'danger' | 'plain';

const actionToneClasses: Record<ActionTone, string> = {
  brand: 'bg-brand-soft border-brand-edge',
  gold: 'bg-gold-soft border-gold-edge',
  ok: 'bg-emerald-50 border-emerald-200',
  danger: 'bg-red-50 border-red-200',
  plain: 'bg-white border-stone-200',
};

const actionIconColors: Record<ActionTone, string> = {
  brand: '#047857',
  gold: '#D97706',
  ok: '#10B981',
  danger: '#B91C1C',
  plain: '#57534E',
};

type ActionLinkProps = {
  href: Href;
  icon: MaterialIconName;
  label: string;
  description: string;
  tone?: ActionTone;
};

export function ActionLink({ href, icon, label, description, tone = 'plain' }: ActionLinkProps) {
  return (
    <Link href={href} asChild>
      <Pressable
        className={`flex-row items-center gap-3 rounded-lg border p-3.5 min-h-[76px] active:opacity-70 ${actionToneClasses[tone]}`}>
        <View className="h-11 w-11 items-center justify-center rounded-lg bg-white">
          <MaterialIcons name={icon} size={24} color={actionIconColors[tone]} />
        </View>
        <View className="flex-1 gap-0.5">
          <Text className="text-[17px] font-extrabold text-stone-900">{label}</Text>
          <Text className="text-sm leading-[19px] text-stone-500">{description}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#78716C" />
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
  tone = 'plain',
}: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-3 rounded-lg border p-3.5 min-h-[76px] active:opacity-70 ${actionToneClasses[tone]}`}>
      <View className="h-11 w-11 items-center justify-center rounded-lg bg-white">
        <MaterialIcons name={icon} size={24} color={actionIconColors[tone]} />
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-[17px] font-extrabold text-stone-900">{label}</Text>
        <Text className="text-sm leading-[19px] text-stone-500">{description}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#78716C" />
    </Pressable>
  );
}

export type ButtonVariant = 'primary' | 'gold' | 'outline';

const buttonClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand border-brand',
  gold: 'bg-gold-deep border-gold-deep',
  outline: 'bg-white border-stone-300',
};

const buttonTextClasses: Record<ButtonVariant, string> = {
  primary: 'text-white',
  gold: 'text-white',
  outline: 'text-stone-900',
};

const buttonIconColors: Record<ButtonVariant, string> = {
  primary: '#FFFFFF',
  gold: '#FFFFFF',
  outline: '#1C1917',
};

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: MaterialIconName;
  disabled?: boolean;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
}: ButtonProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      className={`flex-row items-center justify-center gap-2 rounded-lg border min-h-[56px] px-4 active:opacity-80 ${buttonClasses[variant]} ${disabled ? 'opacity-50' : ''}`}>
      {icon ? <MaterialIcons name={icon} size={22} color={buttonIconColors[variant]} /> : null}
      <Text className={`text-[17px] font-extrabold ${buttonTextClasses[variant]}`}>{label}</Text>
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
    <View className="gap-[7px]">
      <Text className="text-[15px] font-extrabold text-stone-900">{label}</Text>
      <TextInput
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A8A29E"
        className="rounded-lg border border-stone-300 bg-white px-3.5 text-lg text-stone-900 min-h-[56px]"
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
    <View className="flex-row items-start gap-3 rounded-lg border border-stone-200 bg-white p-3.5">
      <MaterialIcons name={icon} size={26} color="#57534E" />
      <View className="flex-1 gap-0.5">
        <Text className="text-base font-extrabold text-stone-900">{title}</Text>
        <Text className="text-sm leading-5 text-stone-500">{description}</Text>
      </View>
    </View>
  );
}

import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

type TransactionType = 'cashIn' | 'cashOut';

export default function TransactionScreen() {
  const [transactionType, setTransactionType] = useState<TransactionType>('cashIn');

  return (
    <View className="flex-1 bg-white">
      <View className="gap-5 px-5 pt-[72px]">
        <View className="gap-1.5">
          <Text className="text-[15px] font-bold text-blue-600">New Transaction</Text>
          <Text className="text-3xl font-extrabold leading-9 text-slate-950">
            Piliin ang serbisyo
          </Text>
        </View>

        <View className="flex-row gap-3">
          <TransactionTypeButton
            label="Cash In"
            selected={transactionType === 'cashIn'}
            selectedClassName="bg-blue-600"
            onPress={() => setTransactionType('cashIn')}
          />
          <TransactionTypeButton
            label="Cash Out"
            selected={transactionType === 'cashOut'}
            selectedClassName="bg-emerald-600"
            onPress={() => setTransactionType('cashOut')}
          />
        </View>

        <View className="gap-2.5">
          <Text className="text-base font-semibold text-slate-900">Amount</Text>
          <TextInput
            className="min-h-14 rounded-lg border border-slate-300 bg-white px-4 text-lg text-slate-900"
            keyboardType="numeric"
            placeholder="Halimbawa: 1000"
            placeholderTextColor="#94A3B8"
          />

          <Text className="mt-1 text-base font-semibold text-slate-900">Reference Number</Text>
          <TextInput
            className="min-h-14 rounded-lg border border-slate-300 bg-white px-4 text-lg text-slate-900"
            placeholder="GCash reference"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View className="gap-1.5 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <Text className="text-base font-semibold text-blue-700">NativeWind lesson</Text>
          <Text className="text-base leading-6 text-blue-950">
            This screen now uses className instead of StyleSheet. The selected transaction type is
            managed with useState.
          </Text>
        </View>
      </View>
    </View>
  );
}

type TransactionTypeButtonProps = {
  label: string;
  selected: boolean;
  selectedClassName: string;
  onPress: () => void;
};

function TransactionTypeButton({
  label,
  selected,
  selectedClassName,
  onPress,
}: TransactionTypeButtonProps) {
  return (
    <Pressable
      className={`min-h-[84px] flex-1 items-center justify-center rounded-lg px-4 ${
        selected ? selectedClassName : 'border border-slate-300 bg-white'
      }`}
      onPress={onPress}>
      <Text className={`text-xl font-extrabold ${selected ? 'text-white' : 'text-slate-700'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

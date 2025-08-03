import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TornadoColors } from '@/constants/Colors';

interface DatePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  error?: string;
}

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = 'Select date',
  error,
}: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{
        fontSize: 14,
        fontWeight: '600',
        color: TornadoColors.gray[700],
        marginBottom: 8,
        fontFamily: 'Inter',
      }}>
        {label}
      </Text>
      
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={{
          borderWidth: 2,
          borderColor: error ? TornadoColors.error : TornadoColors.gray[300],
          borderRadius: 12,
          backgroundColor: TornadoColors.white,
          paddingHorizontal: 16,
          paddingVertical: 12,
          minHeight: 48,
          justifyContent: 'center',
        }}
      >
        <Text style={{
          fontSize: 16,
          color: value ? TornadoColors.gray[900] : TornadoColors.gray[500],
          fontFamily: 'Inter',
        }}>
          {value ? formatDate(value) : placeholder}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(new Date().getFullYear() - 100, 0, 1)}
        />
      )}

      {error && (
        <Text style={{
          fontSize: 12,
          color: TornadoColors.error,
          marginTop: 4,
          fontFamily: 'Inter',
        }}>
          {error}
        </Text>
      )}
    </View>
  );
}
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { TornadoColors } from '@/constants/Colors';

interface InterestPickerProps {
  label: string;
  selectedInterests: string[];
  onInterestToggle: (interest: string) => void;
  maxSelections?: number;
  error?: string;
}

const AVAILABLE_INTERESTS = [
  'Music', 'Movies', 'Travel', 'Sports', 'Reading', 'Cooking',
  'Photography', 'Art', 'Gaming', 'Fitness', 'Fashion', 'Technology',
  'Nature', 'Dancing', 'Comedy', 'Yoga', 'Hiking', 'Pets',
  'Coffee', 'Wine', 'Beach', 'Adventure', 'Culture', 'Food',
];

export function InterestPicker({
  label,
  selectedInterests,
  onInterestToggle,
  maxSelections = 6,
  error,
}: InterestPickerProps) {
  const isSelected = (interest: string) => selectedInterests.includes(interest);
  const canSelectMore = selectedInterests.length < maxSelections;

  const handleInterestPress = (interest: string) => {
    if (isSelected(interest) || canSelectMore) {
      onInterestToggle(interest);
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
      
      <Text style={{
        fontSize: 12,
        color: TornadoColors.gray[500],
        marginBottom: 12,
        fontFamily: 'Inter',
      }}>
        Select up to {maxSelections} interests ({selectedInterests.length}/{maxSelections} selected)
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: 300, // Fixed width to enable proper wrapping
        }}>
          {AVAILABLE_INTERESTS.map((interest) => {
            const selected = isSelected(interest);
            const disabled = !selected && !canSelectMore;
            
            return (
              <TouchableOpacity
                key={interest}
                onPress={() => handleInterestPress(interest)}
                disabled={disabled}
                style={{
                  backgroundColor: selected ? TornadoColors.primary : TornadoColors.white,
                  borderWidth: 2,
                  borderColor: selected ? TornadoColors.primary : 
                               disabled ? TornadoColors.gray[200] : TornadoColors.gray[300],
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  margin: 4,
                  opacity: disabled ? 0.5 : 1,
                }}
              >
                <Text style={{
                  color: selected ? TornadoColors.white : 
                         disabled ? TornadoColors.gray[400] : TornadoColors.gray[700],
                  fontSize: 14,
                  fontWeight: '500',
                  fontFamily: 'Inter',
                }}>
                  {interest}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

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
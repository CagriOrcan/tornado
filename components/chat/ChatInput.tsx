import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
  Platform,
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { TornadoColors } from '@/constants/Colors';
import { IcebreakerButton } from './IcebreakerButton';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  isAnonymous?: boolean;
}

export function ChatInput({
  value,
  onChangeText,
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
  maxLength = 500,
  isAnonymous = false,
}: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const focusScale = useSharedValue(1);
  const sendButtonScale = useSharedValue(1);
  const borderAnimation = useSharedValue(0);

  const handleFocus = () => {
    setIsFocused(true);
    borderAnimation.value = withTiming(1, { duration: 200 });
    focusScale.value = withSpring(1.02, { damping: 15 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderAnimation.value = withTiming(0, { duration: 200 });
    focusScale.value = withSpring(1, { damping: 15 });
  };

  const handleSend = () => {
    if (value.trim() && !disabled) {
      sendButtonScale.value = withSpring(0.9, { damping: 15 }, () => {
        sendButtonScale.value = withSpring(1, { damping: 15 });
      });
      onSend();
      Keyboard.dismiss();
    }
  };

  const animatedInputStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      borderAnimation.value,
      [0, 1],
      [TornadoColors.gray[300], TornadoColors.primary]
    );

    return {
      transform: [{ scale: focusScale.value }],
      borderColor,
    };
  });

  const animatedSendStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: sendButtonScale.value }],
    };
  });

  const canSend = value.trim().length > 0 && !disabled;
  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.8;

  const handleIcebreakerSelect = (question: string) => {
    const currentText = value;
    const newText = currentText ? `${currentText} ${question}` : question;
    onChangeText(newText);
  };

  return (
    <View style={{
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: TornadoColors.white,
      borderTopWidth: 1,
      borderTopColor: TornadoColors.gray[200],
    }}>
      {/* Character count indicator */}
      {isFocused && isNearLimit && (
        <Animated.View
          entering={Animated.FadeIn}
          exiting={Animated.FadeOut}
          style={{
            alignItems: 'flex-end',
            marginBottom: 8,
          }}
        >
          <Text style={{
            fontSize: 12,
            color: characterCount > maxLength ? TornadoColors.error : TornadoColors.gray[500],
            fontFamily: 'System',
          }}>
            {characterCount}/{maxLength}
          </Text>
        </Animated.View>
      )}

      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 12,
      }}>
        {/* Icebreaker Button - Only show in anonymous mode */}
        {isAnonymous && (
          <IcebreakerButton
            onSelectQuestion={handleIcebreakerSelect}
            disabled={disabled}
          />
        )}

        {/* Text Input Container */}
        <Animated.View style={[
          animatedInputStyle,
          {
            flex: 1,
            backgroundColor: TornadoColors.gray[50],
            borderRadius: 24,
            borderWidth: 2,
            paddingHorizontal: 16,
            paddingVertical: 12,
            minHeight: 48,
            maxHeight: 120,
          },
        ]}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor={TornadoColors.gray[500]}
            multiline
            textAlignVertical="center"
            maxLength={maxLength}
            editable={!disabled}
            style={{
              fontSize: 16,
              color: TornadoColors.gray[900],
              fontFamily: 'System',
              lineHeight: 20,
              paddingVertical: Platform.OS === 'ios' ? 0 : 4,
            }}
          />
        </Animated.View>

        {/* Send Button */}
        <Animated.View style={animatedSendStyle}>
          <TouchableOpacity
            onPress={handleSend}
            disabled={!canSend}
            activeOpacity={0.8}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: canSend ? 1 : 0.5,
            }}
          >
            {canSend ? (
              <LinearGradient
                colors={[TornadoColors.gradientStart, TornadoColors.gradientEnd]}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: TornadoColors.primary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Text style={{
                  fontSize: 20,
                  color: TornadoColors.white,
                }}>
                  ↑
                </Text>
              </LinearGradient>
            ) : (
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: TornadoColors.gray[300],
              }}>
                <Text style={{
                  fontSize: 20,
                  color: TornadoColors.gray[500],
                }}>
                  ↑
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Anonymous Chat Disclaimer */}
      {isAnonymous && isFocused && (
        <Animated.View
          entering={Animated.FadeIn}
          exiting={Animated.FadeOut}
          style={{
            marginTop: 8,
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: TornadoColors.secondary,
            borderRadius: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{
            fontSize: 12,
            color: TornadoColors.primary,
            textAlign: 'center',
            fontFamily: 'System',
          }}>
            🔒 Anonymous chat • Try icebreaker questions 💭 to start conversations
          </Text>
        </Animated.View>
      )}
    </View>
  );
}
import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'subtitle' | 'caption' | 'button' | 'link' | 'hero';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'caption' ? styles.caption : undefined,
        type === 'button' ? styles.button : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'hero' ? styles.hero : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    fontFamily: 'Inter-SemiBold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: 'Inter-SemiBold',
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter-Medium',
    color: '#FF8C42',
  },
  hero: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
    fontFamily: 'Inter-Bold',
  },
});
import { StyleSheet, Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Typography } from '@/constants/Colors';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'subtitle' | 'caption' | 'button' | 'link' | 'hero' | 'display' | 'body' | 'label';
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
        type === 'display' ? styles.display : undefined,
        type === 'body' ? styles.body : undefined,
        type === 'label' ? styles.label : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    fontFamily: Typography.fontFamily.regular,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    lineHeight: Typography.fontSize['2xl'] * Typography.lineHeight.tight,
    fontFamily: Typography.fontFamily.bold,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    lineHeight: Typography.fontSize.lg * Typography.lineHeight.normal,
    fontFamily: Typography.fontFamily.semiBold,
    letterSpacing: -0.25,
  },
  caption: {
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
    fontFamily: Typography.fontFamily.regular,
  },
  button: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.tight,
    fontFamily: Typography.fontFamily.semiBold,
    letterSpacing: 0.25,
  },
  link: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    fontFamily: Typography.fontFamily.medium,
    color: '#FF8C42',
    textDecorationLine: 'underline',
  },
  hero: {
    fontSize: Typography.fontSize['4xl'],
    lineHeight: Typography.fontSize['4xl'] * Typography.lineHeight.tight,
    fontFamily: Typography.fontFamily.bold,
    letterSpacing: -1,
  },
  display: {
    fontSize: Typography.fontSize['5xl'],
    lineHeight: Typography.fontSize['5xl'] * Typography.lineHeight.tight,
    fontFamily: Typography.fontFamily.bold,
    letterSpacing: -1.5,
  },
  body: {
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    fontFamily: Typography.fontFamily.regular,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.tight,
    fontFamily: Typography.fontFamily.medium,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
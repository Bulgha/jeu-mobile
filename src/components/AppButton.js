import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

const VARIANTS = {
  primary: { bg: colors.primary, fg: '#fff' },
  success: { bg: colors.success, fg: '#06210F' },
  danger: { bg: colors.danger, fg: '#fff' },
  warning: { bg: colors.warning, fg: '#3A2503' },
  neutral: { bg: colors.surfaceAlt, fg: colors.text },
};

export default function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  big = false,
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        big && styles.big,
        { backgroundColor: v.bg },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, big && styles.bigLabel, { color: v.fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: spacing(1.75),
    paddingHorizontal: spacing(3),
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  big: {
    paddingVertical: spacing(2.75),
    borderRadius: radius.lg,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
  },
  bigLabel: {
    fontSize: 22,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.4,
  },
});

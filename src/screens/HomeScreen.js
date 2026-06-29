import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import AppButton from '../components/AppButton';
import { useGame } from '../state/GameContext';
import { colors, spacing } from '../theme';

export default function HomeScreen() {
  const { dispatch } = useGame();
  return (
    <Screen contentStyle={styles.center}>
      <View style={styles.hero}>
        <Text style={styles.emoji}>⏳</Text>
        <Text style={styles.title}>DéfiMots</Text>
        <Text style={styles.subtitle}>Time's Up + Tabou, en équipes</Text>
      </View>

      <View style={styles.rules}>
        <Text style={styles.ruleLine}>① Faites deviner un max de mots en 45 s</Text>
        <Text style={styles.ruleLine}>② Recommencez sans dire les mots interdits</Text>
        <Text style={styles.ruleLine}>③ L'équipe avec le plus de points gagne</Text>
      </View>

      <AppButton
        label="Nouvelle partie"
        big
        onPress={() => dispatch({ type: 'GO_SETUP' })}
        style={{ alignSelf: 'stretch' }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'space-between',
    paddingVertical: spacing(6),
  },
  hero: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 72,
    marginBottom: spacing(1),
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textDim,
    marginTop: spacing(1),
  },
  rules: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing(3),
    gap: spacing(1.5),
  },
  ruleLine: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
});

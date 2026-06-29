import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import AppButton from '../components/AppButton';
import { useGame } from '../state/GameContext';
import { colors, spacing, radius } from '../theme';

export default function RecapScreen() {
  const { state, dispatch } = useGame();

  const ranked = [...state.teams].sort(
    (a, b) => (state.scores[b.id] || 0) - (state.scores[a.id] || 0)
  );

  return (
    <Screen scroll contentStyle={styles.content}>
      <Text style={styles.kicker}>Fin de la phase 1</Text>
      <Text style={styles.h1}>Récapitulatif</Text>

      <View style={styles.board}>
        {ranked.map((team, i) => (
          <View key={team.id} style={[styles.row, { borderLeftColor: team.color }]}>
            <Text style={styles.rank}>{i + 1}</Text>
            <Text style={styles.name}>{team.name}</Text>
            <Text style={styles.score}>{state.scores[team.id] || 0}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.next}>
        Place au Tabou : même chrono, mais interdiction de prononcer les mots tabous !
      </Text>

      <AppButton
        label="Lancer la phase 2 (Tabou)"
        big
        variant="success"
        onPress={() => dispatch({ type: 'START_PHASE2' })}
        style={{ alignSelf: 'stretch' }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { justifyContent: 'center', gap: spacing(2) },
  kicker: {
    color: colors.textDim,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
  h1: { color: colors.text, fontSize: 34, fontWeight: '900', textAlign: 'center' },
  board: { gap: spacing(1.5), marginVertical: spacing(2) },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderLeftWidth: 6,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(2.5),
    gap: spacing(2),
  },
  rank: { color: colors.textDim, fontSize: 22, fontWeight: '900', width: 28 },
  name: { flex: 1, color: colors.text, fontSize: 20, fontWeight: '700' },
  score: { color: colors.gold, fontSize: 26, fontWeight: '900' },
  next: { color: colors.textDim, textAlign: 'center', fontSize: 15, lineHeight: 22, marginBottom: spacing(1) },
});

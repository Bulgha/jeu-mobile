import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import AppButton from '../components/AppButton';
import { useGame } from '../state/GameContext';
import { colors, spacing, radius } from '../theme';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function FinalScreen() {
  const { state, dispatch } = useGame();

  const ranked = [...state.teams].sort(
    (a, b) => (state.scores[b.id] || 0) - (state.scores[a.id] || 0)
  );
  const topScore = state.scores[ranked[0].id] || 0;
  const winners = ranked.filter((t) => (state.scores[t.id] || 0) === topScore);
  const isTie = winners.length > 1;

  return (
    <Screen scroll contentStyle={styles.content}>
      <Text style={styles.trophy}>🏆</Text>
      <Text style={styles.title}>Classement final</Text>
      <Text style={styles.winner}>
        {isTie ? `Égalité : ${winners.map((w) => w.name).join(' & ')} !` : `${winners[0].name} remporte la partie !`}
      </Text>

      <View style={styles.board}>
        {ranked.map((team, i) => {
          const total = state.scores[team.id] || 0;
          const p1 = state.phase1Scores[team.id] || 0;
          const p2 = total - p1;
          return (
            <View
              key={team.id}
              style={[
                styles.row,
                { borderColor: team.color },
                i === 0 && styles.firstRow,
              ]}
            >
              <Text style={styles.medal}>{MEDALS[i] || `${i + 1}.`}</Text>
              <View style={styles.rowMid}>
                <Text style={styles.name}>{team.name}</Text>
                <Text style={styles.breakdown}>
                  Phase 1 : {p1} · Phase 2 : {p2}
                </Text>
              </View>
              <Text style={styles.score}>{total}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <AppButton
          label="Rejouer (mêmes réglages)"
          big
          variant="success"
          onPress={() => dispatch({ type: 'GO_SETUP' })}
          style={{ alignSelf: 'stretch' }}
        />
        <AppButton
          label="Accueil"
          variant="neutral"
          onPress={() => dispatch({ type: 'GO_HOME' })}
          style={{ alignSelf: 'stretch' }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { justifyContent: 'center', gap: spacing(1.5) },
  trophy: { fontSize: 64, textAlign: 'center' },
  title: { color: colors.text, fontSize: 32, fontWeight: '900', textAlign: 'center' },
  winner: { color: colors.gold, fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: spacing(1) },
  board: { gap: spacing(1.5), marginVertical: spacing(2) },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 2,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(2),
    gap: spacing(1.5),
  },
  firstRow: { backgroundColor: colors.surfaceAlt },
  medal: { fontSize: 26, width: 40, textAlign: 'center' },
  rowMid: { flex: 1 },
  name: { color: colors.text, fontSize: 20, fontWeight: '800' },
  breakdown: { color: colors.textDim, fontSize: 13, marginTop: spacing(0.25) },
  score: { color: colors.gold, fontSize: 30, fontWeight: '900' },
  footer: { gap: spacing(1.5), marginTop: spacing(2) },
});

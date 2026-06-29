import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import AppButton from '../components/AppButton';
import { useGame } from '../state/GameContext';
import { colors, spacing, radius } from '../theme';

export default function TurnIntroScreen() {
  const { state, dispatch, currentPlayer, currentTeam } = useGame();
  if (!currentPlayer || !currentTeam) return null;

  const turnNo = state.currentTurnIndex + 1;
  const total = state.turnOrder.length;
  const isPhase2 = state.phase === 2;

  return (
    <Screen contentStyle={styles.center}>
      <Text style={styles.phaseTag}>
        {isPhase2 ? 'Phase 2 · Tabou' : 'Phase 1 · Time’s Up'} · Tour {turnNo}/{total}
      </Text>

      <View style={[styles.card, { borderColor: currentTeam.color }]}>
        <Text style={styles.passLabel}>Passez le téléphone à</Text>
        <Text style={styles.playerName}>{currentPlayer.name}</Text>
        <View style={[styles.teamBadge, { backgroundColor: currentTeam.color }]}>
          <Text style={styles.teamBadgeText}>{currentTeam.name}</Text>
        </View>
      </View>

      <View style={styles.brief}>
        {isPhase2 ? (
          <Text style={styles.briefText}>
            Fais deviner le mot affiché à ton équipe{'\n'}
            <Text style={styles.bold}>sans prononcer les 5 mots interdits</Text>.{'\n'}
            Un mot interdit dit = «&nbsp;Faux&nbsp;» (−1).
          </Text>
        ) : (
          <Text style={styles.briefText}>
            Fais deviner un maximum de mots !{'\n'}
            <Text style={styles.bold}>Juste</Text> +1 · <Text style={styles.bold}>Faux</Text> −1 ·{' '}
            <Text style={styles.bold}>Passe</Text> 0{'\n'}
            (3 passes maximum)
          </Text>
        )}
        <Text style={styles.timerInfo}>⏱ {state.settings.timerSeconds} secondes</Text>
      </View>

      <AppButton
        label="C'est parti !"
        big
        variant="success"
        onPress={() => dispatch({ type: 'BEGIN_TURN' })}
        style={{ alignSelf: 'stretch' }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'space-around', paddingVertical: spacing(4) },
  phaseTag: {
    color: colors.textDim,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 3,
    paddingVertical: spacing(4),
    paddingHorizontal: spacing(3),
    alignItems: 'center',
    gap: spacing(2),
  },
  passLabel: { color: colors.textDim, fontSize: 16 },
  playerName: { color: colors.text, fontSize: 40, fontWeight: '900', textAlign: 'center' },
  teamBadge: { paddingVertical: spacing(0.75), paddingHorizontal: spacing(2.5), borderRadius: radius.pill },
  teamBadgeText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  brief: { alignItems: 'center', gap: spacing(2) },
  briefText: { color: colors.text, fontSize: 18, textAlign: 'center', lineHeight: 26 },
  bold: { fontWeight: '900' },
  timerInfo: { color: colors.gold, fontSize: 18, fontWeight: '800' },
});

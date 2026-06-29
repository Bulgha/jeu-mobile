import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Vibration } from 'react-native';
import Screen from '../components/Screen';
import AppButton from '../components/AppButton';
import { useGame } from '../state/GameContext';
import { colors, spacing, radius } from '../theme';

export default function PlayScreen() {
  const { state, dispatch, currentTeam, currentWord } = useGame();
  const { timerSeconds, passesPerTurn } = state.settings;
  const isPhase2 = state.phase === 2;

  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [finished, setFinished] = useState(false);
  const [passesLeft, setPassesLeft] = useState(passesPerTurn);
  const [stats, setStats] = useState({ juste: 0, faux: 0, passe: 0 });

  // Décompte du chrono.
  useEffect(() => {
    if (finished) return;
    if (timeLeft <= 0) {
      setFinished(true);
      Vibration.vibrate(700);
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, finished]);

  const resolve = (result) => {
    if (finished) return;
    let delta = 0;
    if (result === 'juste') delta = 1;
    else if (result === 'faux') delta = -1;
    else if (result === 'passe') {
      if (passesLeft <= 0) return;
      setPassesLeft((p) => p - 1);
    }
    setStats((s) => ({ ...s, [result]: s[result] + 1 }));
    dispatch({ type: 'RESOLVE_WORD', delta });
  };

  const pointsThisTurn = stats.juste - stats.faux;
  const progress = Math.max(0, timeLeft / timerSeconds);
  const lowTime = timeLeft <= 10;

  if (finished) {
    return <TurnSummary stats={stats} points={pointsThisTurn} team={currentTeam} dispatch={dispatch} />;
  }

  return (
    <Screen contentStyle={styles.play}>
      {/* Barre d'info */}
      <View style={styles.topbar}>
        <View style={[styles.teamPill, { backgroundColor: currentTeam.color }]}>
          <Text style={styles.teamPillText}>{currentTeam.name}</Text>
        </View>
        <Text style={[styles.timer, lowTime && styles.timerLow]}>{timeLeft}s</Text>
        <Text style={styles.passes}>Passes : {passesLeft}</Text>
      </View>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress * 100}%`, backgroundColor: lowTime ? colors.danger : colors.success },
          ]}
        />
      </View>

      {/* Zone du mot */}
      <View style={styles.wordZone}>
        {isPhase2 && currentWord ? (
          <View style={styles.tabooCard}>
            <Text style={styles.tabooWord}>{currentWord.mot}</Text>
            <View style={styles.tabooDivider} />
            <Text style={styles.tabooLabel}>Interdits</Text>
            {currentWord.interdits.map((w) => (
              <Text key={w} style={styles.tabooForbidden}>{w}</Text>
            ))}
          </View>
        ) : (
          <Text style={styles.word}>{currentWord}</Text>
        )}
      </View>

      {/* Boutons de score */}
      <View style={styles.actions}>
        <View style={styles.actionsRow}>
          <AppButton
            label="✗ Faux"
            variant="danger"
            onPress={() => resolve('faux')}
            style={styles.flex}
          />
          <AppButton
            label={`Passe (${passesLeft})`}
            variant="warning"
            disabled={passesLeft <= 0}
            onPress={() => resolve('passe')}
            style={styles.flex}
          />
        </View>
        <AppButton label="✓ Juste" big variant="success" onPress={() => resolve('juste')} />
      </View>
    </Screen>
  );
}

function TurnSummary({ stats, points, team, dispatch }) {
  return (
    <Screen contentStyle={styles.center}>
      <Text style={styles.timeUp}>⏰ Temps écoulé !</Text>
      <View style={[styles.summaryCard, { borderColor: team.color }]}>
        <Text style={styles.summaryTeam}>{team.name}</Text>
        <Text style={styles.summaryPoints}>
          {points >= 0 ? '+' : ''}
          {points} {Math.abs(points) <= 1 ? 'point' : 'points'}
        </Text>
        <View style={styles.summaryRow}>
          <Stat label="Justes" value={stats.juste} color={colors.success} />
          <Stat label="Faux" value={stats.faux} color={colors.danger} />
          <Stat label="Passes" value={stats.passe} color={colors.warning} />
        </View>
      </View>
      <AppButton
        label="Continuer"
        big
        onPress={() => dispatch({ type: 'END_TURN' })}
        style={{ alignSelf: 'stretch' }}
      />
    </Screen>
  );
}

function Stat({ label, value, color }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  play: { justifyContent: 'space-between' },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  teamPill: { paddingVertical: spacing(0.75), paddingHorizontal: spacing(1.75), borderRadius: radius.pill },
  teamPillText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  timer: { color: colors.text, fontSize: 40, fontWeight: '900' },
  timerLow: { color: colors.danger },
  passes: { color: colors.textDim, fontSize: 14, fontWeight: '700' },
  progressTrack: {
    height: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    marginTop: spacing(1.5),
    overflow: 'hidden',
  },
  progressFill: { height: 8, borderRadius: radius.pill },
  wordZone: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  word: { color: colors.text, fontSize: 46, fontWeight: '900', textAlign: 'center' },
  tabooCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing(3),
    paddingHorizontal: spacing(3),
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  tabooWord: { color: colors.text, fontSize: 38, fontWeight: '900', textAlign: 'center' },
  tabooDivider: {
    height: 2,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
    marginVertical: spacing(2),
  },
  tabooLabel: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing(1),
  },
  tabooForbidden: { color: colors.textDim, fontSize: 22, fontWeight: '700', marginVertical: spacing(0.5) },
  actions: { gap: spacing(1.5) },
  actionsRow: { flexDirection: 'row', gap: spacing(1.5) },
  flex: { flex: 1 },
  // Résumé de fin de tour
  center: { justifyContent: 'space-around', paddingVertical: spacing(5) },
  timeUp: { color: colors.text, fontSize: 28, fontWeight: '900', textAlign: 'center' },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 3,
    padding: spacing(3),
    alignItems: 'center',
    gap: spacing(2),
  },
  summaryTeam: { color: colors.text, fontSize: 24, fontWeight: '800' },
  summaryPoints: { color: colors.gold, fontSize: 44, fontWeight: '900' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'stretch' },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 30, fontWeight: '900' },
  statLabel: { color: colors.textDim, fontSize: 13, marginTop: spacing(0.5) },
});

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import AppButton from '../components/AppButton';
import { useGame, TIMER_OPTIONS, MAX_TEAMS } from '../state/GameContext';
import { colors, radius, spacing } from '../theme';

export default function SetupScreen() {
  const { state, dispatch } = useGame();
  const [name, setName] = useState('');

  const addPlayer = () => {
    if (!name.trim()) return;
    dispatch({ type: 'ADD_PLAYER', name });
    setName('');
  };

  const teamOf = (player) => state.teams.find((t) => t.id === player.teamId);
  const playersOfTeam = (teamId) => state.players.filter((p) => p.teamId === teamId);

  // Chaque équipe doit avoir au moins un joueur pour démarrer.
  const everyTeamHasPlayer = state.teams.every((t) => playersOfTeam(t.id).length > 0);
  const canStart = state.players.length >= 2 && everyTeamHasPlayer;

  return (
    <Screen scroll>
      <Text style={styles.h1}>Configuration</Text>

      {/* Nombre d'équipes */}
      <Text style={styles.label}>Nombre d'équipes</Text>
      <View style={styles.stepperRow}>
        <Stepper
          value={state.teams.length}
          min={2}
          max={MAX_TEAMS}
          onChange={(count) => dispatch({ type: 'SET_TEAM_COUNT', count })}
        />
      </View>

      {/* Durée du chrono */}
      <Text style={styles.label}>Durée du tour</Text>
      <View style={styles.segment}>
        {TIMER_OPTIONS.map((sec) => {
          const active = state.settings.timerSeconds === sec;
          return (
            <Pressable
              key={sec}
              onPress={() => dispatch({ type: 'SET_TIMER', seconds: sec })}
              style={[styles.segmentItem, active && styles.segmentItemActive]}
            >
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                {sec} s
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Ajout de joueurs */}
      <Text style={styles.label}>Joueurs ({state.players.length})</Text>
      <View style={styles.addRow}>
        <TextInput
          value={name}
          onChangeText={setName}
          onSubmitEditing={addPlayer}
          placeholder="Nom du joueur"
          placeholderTextColor={colors.textDim}
          style={styles.input}
          returnKeyType="done"
        />
        <AppButton label="Ajouter" onPress={addPlayer} variant="primary" />
      </View>
      <Text style={styles.hint}>
        Astuce : touchez la pastille de couleur d'un joueur pour changer son équipe.
      </Text>

      {/* Liste des joueurs groupés par équipe */}
      {state.teams.map((team) => {
        const members = playersOfTeam(team.id);
        return (
          <View key={team.id} style={[styles.teamCard, { borderColor: team.color }]}>
            <View style={styles.teamHeader}>
              <View style={[styles.dot, { backgroundColor: team.color }]} />
              <TextInput
                value={team.name}
                onChangeText={(txt) =>
                  dispatch({ type: 'RENAME_TEAM', teamId: team.id, name: txt })
                }
                style={styles.teamName}
              />
              <Text style={styles.teamCount}>{members.length} 👤</Text>
            </View>
            {members.length === 0 ? (
              <Text style={styles.emptyTeam}>Aucun joueur — ajoutez-en au moins un.</Text>
            ) : (
              members.map((p) => (
                <View key={p.id} style={styles.playerRow}>
                  <Pressable
                    onPress={() => dispatch({ type: 'CYCLE_PLAYER_TEAM', id: p.id })}
                    style={[styles.playerDot, { backgroundColor: teamOf(p).color }]}
                  />
                  <Text style={styles.playerName}>{p.name}</Text>
                  <Pressable onPress={() => dispatch({ type: 'REMOVE_PLAYER', id: p.id })}>
                    <Text style={styles.remove}>✕</Text>
                  </Pressable>
                </View>
              ))
            )}
          </View>
        );
      })}

      <View style={styles.footer}>
        <AppButton
          label="Commencer la phase 1"
          big
          variant="success"
          disabled={!canStart}
          onPress={() => dispatch({ type: 'START_GAME' })}
        />
        {!canStart && (
          <Text style={styles.warn}>
            Il faut au moins 2 joueurs et chaque équipe doit en avoir au moins un.
          </Text>
        )}
        <Pressable onPress={() => dispatch({ type: 'GO_HOME' })} style={styles.back}>
          <Text style={styles.backText}>← Retour</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

function Stepper({ value, min, max, onChange }) {
  return (
    <View style={styles.stepper}>
      <Pressable
        onPress={() => onChange(value - 1)}
        disabled={value <= min}
        style={[styles.stepBtn, value <= min && styles.stepDisabled]}
      >
        <Text style={styles.stepSign}>−</Text>
      </Pressable>
      <Text style={styles.stepValue}>{value}</Text>
      <Pressable
        onPress={() => onChange(value + 1)}
        disabled={value >= max}
        style={[styles.stepBtn, value >= max && styles.stepDisabled]}
      >
        <Text style={styles.stepSign}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 30, fontWeight: '900', color: colors.text, marginBottom: spacing(2) },
  label: {
    color: colors.textDim,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing(2.5),
    marginBottom: spacing(1),
  },
  stepperRow: { alignItems: 'flex-start' },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    padding: spacing(0.5),
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDisabled: { opacity: 0.35 },
  stepSign: { color: colors.text, fontSize: 24, fontWeight: '800' },
  stepValue: { color: colors.text, fontSize: 22, fontWeight: '800', minWidth: 56, textAlign: 'center' },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing(0.5),
    gap: spacing(0.5),
  },
  segmentItem: {
    flex: 1,
    paddingVertical: spacing(1.5),
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  segmentItemActive: { backgroundColor: colors.primary },
  segmentText: { color: colors.textDim, fontSize: 16, fontWeight: '700' },
  segmentTextActive: { color: '#fff' },
  addRow: { flexDirection: 'row', gap: spacing(1.5), alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.75),
    color: colors.text,
    fontSize: 17,
  },
  hint: { color: colors.textDim, fontSize: 13, marginTop: spacing(1), fontStyle: 'italic' },
  teamCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 2,
    padding: spacing(2),
    marginTop: spacing(2),
  },
  teamHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing(1.5) },
  dot: { width: 16, height: 16, borderRadius: 8 },
  teamName: { flex: 1, color: colors.text, fontSize: 19, fontWeight: '800', padding: 0 },
  teamCount: { color: colors.textDim, fontSize: 14 },
  emptyTeam: { color: colors.textDim, fontStyle: 'italic', marginTop: spacing(1.5) },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1.5),
    marginTop: spacing(1.5),
  },
  playerDot: { width: 22, height: 22, borderRadius: 11 },
  playerName: { flex: 1, color: colors.text, fontSize: 17 },
  remove: { color: colors.textDim, fontSize: 18, paddingHorizontal: spacing(1) },
  footer: { marginTop: spacing(4), gap: spacing(1.5) },
  warn: { color: colors.warning, textAlign: 'center', fontSize: 13 },
  back: { alignItems: 'center', paddingVertical: spacing(1.5) },
  backText: { color: colors.textDim, fontSize: 16 },
});

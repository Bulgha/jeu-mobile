import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { shuffle, makeId } from '../utils/shuffle';
import { WORDS_PHASE1 } from '../data/wordsPhase1';
import { CARDS_PHASE2 } from '../data/wordsPhase2';
import { TEAM_COLORS } from '../theme';

const TIMER_OPTIONS = [30, 45, 60];
const MAX_TEAMS = TEAM_COLORS.length;

function makeTeam(index) {
  return {
    id: makeId('team'),
    name: `Équipe ${index + 1}`,
    color: TEAM_COLORS[index % TEAM_COLORS.length],
  };
}

function freshSetup(timerSeconds) {
  return {
    teams: [makeTeam(0), makeTeam(1)],
    players: [],
    settings: { timerSeconds, passesPerTurn: 3 },
  };
}

const initialState = {
  screen: 'home', // home | setup | turn_intro | play | recap | final
  ...freshSetup(45),
  // Données de partie (remplies au démarrage)
  turnOrder: [], // [playerId] dans l'ordre de jeu, équipes alternées
  currentTurnIndex: 0,
  phase: 1, // 1 = Time's Up, 2 = Tabou
  scores: {}, // teamId -> points cumulés (phases 1 + 2)
  phase1Scores: {}, // snapshot des points à la fin de la phase 1
  deck: [], // pioche mélangée de la phase en cours
  deckIndex: 0,
};

// Construit l'ordre des tours en alternant les équipes (round-robin équitable).
function buildTurnOrder(players, teams) {
  const byTeam = teams.map((t) => players.filter((p) => p.teamId === t.id));
  const maxLen = Math.max(0, ...byTeam.map((g) => g.length));
  const order = [];
  for (let i = 0; i < maxLen; i++) {
    for (const group of byTeam) {
      if (group[i]) order.push(group[i].id);
    }
  }
  return order;
}

// Équipe ayant le moins de joueurs (pour l'auto-répartition).
function smallestTeamId(players, teams) {
  let best = teams[0].id;
  let bestCount = Infinity;
  for (const t of teams) {
    const count = players.filter((p) => p.teamId === t.id).length;
    if (count < bestCount) {
      bestCount = count;
      best = t.id;
    }
  }
  return best;
}

function reducer(state, action) {
  switch (action.type) {
    case 'GO_HOME':
      return { ...initialState, settings: state.settings };

    case 'GO_SETUP':
      return { ...state, ...freshSetup(state.settings.timerSeconds), screen: 'setup' };

    case 'SET_TEAM_COUNT': {
      const count = Math.max(2, Math.min(MAX_TEAMS, action.count));
      let teams = state.teams.slice(0, count);
      while (teams.length < count) teams.push(makeTeam(teams.length));
      const validIds = new Set(teams.map((t) => t.id));
      // Réaffecte les joueurs des équipes supprimées à la première équipe.
      const players = state.players.map((p) =>
        validIds.has(p.teamId) ? p : { ...p, teamId: teams[0].id }
      );
      return { ...state, teams, players };
    }

    case 'RENAME_TEAM':
      return {
        ...state,
        teams: state.teams.map((t) =>
          t.id === action.teamId ? { ...t, name: action.name } : t
        ),
      };

    case 'ADD_PLAYER': {
      const name = action.name.trim();
      if (!name) return state;
      const teamId = smallestTeamId(state.players, state.teams);
      return {
        ...state,
        players: [...state.players, { id: makeId('player'), name, teamId }],
      };
    }

    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.id),
      };

    case 'CYCLE_PLAYER_TEAM': {
      const idx = state.teams.findIndex((t) => {
        const player = state.players.find((p) => p.id === action.id);
        return player && t.id === player.teamId;
      });
      const nextTeam = state.teams[(idx + 1) % state.teams.length];
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.id ? { ...p, teamId: nextTeam.id } : p
        ),
      };
    }

    case 'SET_TIMER':
      return {
        ...state,
        settings: { ...state.settings, timerSeconds: action.seconds },
      };

    case 'START_GAME': {
      const turnOrder = buildTurnOrder(state.players, state.teams);
      const scores = {};
      state.teams.forEach((t) => (scores[t.id] = 0));
      return {
        ...state,
        turnOrder,
        currentTurnIndex: 0,
        phase: 1,
        scores,
        phase1Scores: {},
        deck: shuffle(WORDS_PHASE1),
        deckIndex: 0,
        screen: 'turn_intro',
      };
    }

    case 'BEGIN_TURN':
      return { ...state, screen: 'play' };

    case 'RESOLVE_WORD': {
      // action.delta : +1 (juste), -1 (faux), 0 (passe)
      const player = state.players.find((p) => p.id === state.turnOrder[state.currentTurnIndex]);
      const teamId = player.teamId;
      const scores = { ...state.scores, [teamId]: (state.scores[teamId] || 0) + action.delta };
      const deckIndex = state.deck.length ? (state.deckIndex + 1) % state.deck.length : 0;
      return { ...state, scores, deckIndex };
    }

    case 'END_TURN': {
      const nextIndex = state.currentTurnIndex + 1;
      const finishedPhase = nextIndex >= state.turnOrder.length;
      if (!finishedPhase) {
        return { ...state, currentTurnIndex: nextIndex, screen: 'turn_intro' };
      }
      // Fin de phase
      if (state.phase === 1) {
        return { ...state, screen: 'recap' };
      }
      return { ...state, screen: 'final' };
    }

    case 'START_PHASE2':
      return {
        ...state,
        phase: 2,
        phase1Scores: { ...state.scores },
        deck: shuffle(CARDS_PHASE2),
        deckIndex: 0,
        currentTurnIndex: 0,
        screen: 'turn_intro',
      };

    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const helpers = useMemo(() => {
    const currentPlayer = state.players.find(
      (p) => p.id === state.turnOrder[state.currentTurnIndex]
    );
    const currentTeam = currentPlayer
      ? state.teams.find((t) => t.id === currentPlayer.teamId)
      : null;
    const currentWord = state.deck.length ? state.deck[state.deckIndex] : null;
    return { currentPlayer, currentTeam, currentWord };
  }, [state]);

  const value = useMemo(() => ({ state, dispatch, ...helpers }), [state, helpers]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame doit être utilisé dans un GameProvider');
  return ctx;
}

export { TIMER_OPTIONS, MAX_TEAMS };

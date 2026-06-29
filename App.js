import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GameProvider, useGame } from './src/state/GameContext';
import HomeScreen from './src/screens/HomeScreen';
import SetupScreen from './src/screens/SetupScreen';
import TurnIntroScreen from './src/screens/TurnIntroScreen';
import PlayScreen from './src/screens/PlayScreen';
import RecapScreen from './src/screens/RecapScreen';
import FinalScreen from './src/screens/FinalScreen';

function Router() {
  const { state } = useGame();
  switch (state.screen) {
    case 'setup':
      return <SetupScreen />;
    case 'turn_intro':
      return <TurnIntroScreen />;
    case 'play':
      return <PlayScreen />;
    case 'recap':
      return <RecapScreen />;
    case 'final':
      return <FinalScreen />;
    case 'home':
    default:
      return <HomeScreen />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <StatusBar style="light" />
      <Router />
    </GameProvider>
  );
}

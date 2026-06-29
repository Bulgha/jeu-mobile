import React from 'react';
import { SafeAreaView, View, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing } from '../theme';

// Conteneur d'écran : fond sombre + zone sûre. `scroll` pour les écrans longs.
export default function Screen({ children, scroll = false, contentStyle }) {
  return (
    <SafeAreaView style={styles.safe}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, contentStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flexGrow: 1,
    padding: spacing(3),
  },
});

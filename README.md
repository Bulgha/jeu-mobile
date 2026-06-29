# DéfiMots 🎲⏳

Jeu de société mobile en équipes — un mélange de **Time's Up** (phase 1) et de **Tabou** (phase 2),
à jouer en *pass-and-play* (on se passe un seul téléphone). 100 % hors-ligne, en français.

## Règles

1. **Configuration** — on répartit les joueurs en 2 équipes ou plus.
2. **Phase 1 — Time's Up** : un chrono de 45 s, des mots aléatoires s'enchaînent. Le joueur
   fait deviner, puis note pour chaque mot :
   - **Juste** : +1 point
   - **Faux** : −1 point
   - **Passe** : 0 point (3 passes maximum par tour)
   Chaque joueur joue un tour ; il y a donc autant de tours que de participants. Un récap des
   scores est affiché à la fin de la phase.
3. **Phase 2 — Tabou** : même chrono, mais on doit faire deviner un mot **sans prononcer
   aucun des 5 mots interdits** affichés en dessous. Mêmes boutons de score.
4. **Classement final** : les points des deux phases sont cumulés et le classement est affiché.

Le chrono (30/45/60 s), le nombre d'équipes (2 à 6) et les noms se règlent à l'écran de configuration.

## Lancer l'application

Prérequis : [Node.js](https://nodejs.org) (18+).

```bash
npm install
npm start
```

Puis :

- **Sur votre téléphone** : installez l'app **Expo Go** (App Store / Play Store) et scannez le
  QR code affiché dans le terminal.
- **Sur émulateur** : `npm run android` ou `npm run ios`.
- **Dans le navigateur** (aperçu rapide) : `npm run web`.

## Structure du projet

```
App.js                     Routeur d'écrans (machine à états simple)
src/
  data/
    wordsPhase1.js         Mots de la phase 1 (Time's Up)
    wordsPhase2.js         Cartes de la phase 2 (mot + 5 mots interdits)
  state/
    GameContext.js         État global + reducer (logique de jeu)
  components/
    Screen.js              Conteneur d'écran (fond, zone sûre)
    AppButton.js           Bouton réutilisable
  screens/
    HomeScreen.js          Accueil
    SetupScreen.js         Équipes, joueurs, réglages
    TurnIntroScreen.js     « Passez le téléphone à… »
    PlayScreen.js          Chrono + mot + boutons (phases 1 et 2)
    RecapScreen.js         Récap des scores (fin de phase 1)
    FinalScreen.js         Classement final
  theme.js                 Couleurs et espacements
```

## Personnaliser les mots

Ajoutez vos propres mots dans `src/data/wordsPhase1.js` (liste de chaînes) et vos cartes Tabou
dans `src/data/wordsPhase2.js` (`{ mot, interdits: [5 mots] }`). Aucune autre modification n'est
nécessaire, les pioches sont mélangées automatiquement à chaque partie.

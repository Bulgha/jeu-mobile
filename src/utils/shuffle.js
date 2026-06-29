// Mélange de Fisher-Yates (ne modifie pas le tableau d'origine).
export function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let counter = 0;
// Identifiant simple et unique pour joueurs/équipes pendant la partie.
export function makeId(prefix = 'id') {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter}`;
}

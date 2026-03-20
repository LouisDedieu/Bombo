# Instructions Claude Code - Projet Bombo

## Architecture & Organisation

### Structure des fichiers
- **Ne pas tout mélanger dans un seul fichier TSX** : séparer les composants, les services, et les hooks
- **Déléguer les logiques métier dans des services** (`services/`) : récupération de données, appels API, transformations
- **Les composants React doivent rester focalisés sur l'UI** : pas de logique métier complexe dans les composants

### Services (`services/`)
- `inboxService.ts` : récupération et gestion des jobs d'analyse
- `analysisService.ts` : lancement d'analyses vidéo, streaming SSE
- `tripService.ts` : gestion des voyages
- `cityService.ts` : gestion des villes
- `savedService.ts` : éléments sauvegardés
- `reviewService.ts` / `cityReviewService.ts` : logique de review

### Constantes (`constants/`)
- `colors.ts` : couleurs du design system (synchronisées avec `tailwind.config.js`)

## Styling

### NativeWind (TailwindCSS pour React Native)
- **Utiliser NativeWind au maximum** pour le styling
- Utiliser `className` au lieu de `style` quand possible
- Pour les valeurs dynamiques ou complexes, utiliser `style` en fallback

### Design Tokens (`tailwind.config.js`)
- **Ne jamais hardcoder les couleurs/tailles** : utiliser les tokens définis dans `tailwind.config.js`
- Les tokens sont synchronisés avec `constants/colors.ts` pour les props JS

#### Classes NativeWind disponibles

**Couleurs** (utiliser dans `className`) :
```
bg-bg-primary      → #1a1744 (fond principal)
text-accent        → #5248D4 (violet accent)
text-text-primary  → #FAFAFF (texte principal)
text-text-secondary → rgba(255,255,255,0.65)
text-text-muted    → rgba(255,255,255,0.60)
text-text-subtle   → rgba(255,255,255,0.30)
text-social        → #8C92B5 (liens sociaux)
bg-divider         → rgba(255,255,255,0.20)
text-error / bg-error-bg → erreurs
```

**Tailles de police** :
```
text-hero  → 40px (titres principaux)
text-title → 28px (titres de section)
text-body  → 16px (corps de texte)
text-small → 14px (texte secondaire)
text-tiny  → 12px (footer, légendes)
text-micro → 10px (labels très petits)
```

**Spacing personnalisé** :
```
4.5 → 18px | 15 → 60px | 30 → 120px
```

### Constantes couleurs pour JS (`constants/colors.ts`)
- **Pour les props JS** (ex: `color` des Icons), importer les constantes
- Import : `import { colors } from '@/constants/colors';`
- Usage : `<Icon color={colors.social} />` ou `tintColor={colors.textPrimary}`

**Exemple complet** :
```tsx
import { colors } from '@/constants/colors';

// NativeWind pour le styling
<Text className="text-hero text-accent">Titre</Text>
<Text className="text-body text-text-secondary">Contenu</Text>

// Constantes pour les props JS
<Icon name="home-line" color={colors.textPrimary} />
<RefreshControl tintColor={colors.textPrimary} />
```

## Icônes

### Remix Icon
- **Utiliser la librairie `react-native-remix-icon`** pour toutes les icônes
- Import : `import Icon from 'react-native-remix-icon';`
- **Toujours utiliser les constantes de couleurs** pour le prop `color`
- Usage : `<Icon name="add-line" size={24} color={colors.textPrimary} />`
- Référence des icônes : https://remixicon.com/

## Composants UI

### Composants réutilisables (`components/`)
- `PrimaryButton` : bouton principal avec variantes
- `Input` : champ de saisie avec variantes `light` / `dark`
- `JobCard` : carte d'affichage des jobs d'analyse
- `Pill` : badge/pill pour les statuts
- `SharePromotionCard` : carte de promotion partage

## API

### Client HTTP (`lib/api.ts`)
- `apiFetch<T>(path)` : GET authentifié
- `apiPost<T>(path, body)` : POST authentifié
- `apiPatch<T>(path, body)` : PATCH authentifié
- `apiDelete(path)` : DELETE authentifié

## Navigation

### Expo Router
- Structure basée sur les fichiers dans `app/`
- Tabs dans `app/(tabs)/`
- Utiliser `useRouter()` pour la navigation programmatique

## Conventions

### TypeScript
- Toujours typer les props des composants avec des interfaces
- Exporter les types depuis les services quand pertinent

### Nommage
- Services : `camelCaseService.ts`
- Composants : `PascalCase.tsx`
- Hooks : `useHookName.ts`
- Constantes : `camelCase.ts`

---

## Workflow Agent (Paperclip)

### Début de chaque session
1. Lire ce fichier (`CLAUDE.md`)
2. Lire `docs/STATE_OF_THE_ART.md`
3. Lire `tasks/lessons.md`
4. Écrire le plan dans `tasks/todo.md` avant de coder

### Avant de pusher
- `npx tsc --noEmit` — zéro erreur TypeScript
- `npx eslint [fichiers modifiés]` — zéro warning
- Tester sur iOS simulator si changement UI
- Mettre à jour `docs/STATE_OF_THE_ART.md`
- Cocher les étapes dans `tasks/todo.md`

### Règles critiques
- Ne jamais modifier `app.json`, `eas.json`, ou les configs de build sans validation explicite de Louis
- Ne jamais changer les variables d'environnement `.env`
- Ne jamais toucher à `share-extension/` sans validation — c'est fragile
- Changer le minimum de code nécessaire pour résoudre le problème

### Commit format
```
feat(ONEA-XX): description courte

- détail 1
- détail 2

Co-Authored-By: Paperclip <noreply@paperclip.ing>
```

### Erreurs Passées & Règles Apprises

> Mis à jour par les agents après chaque correction de Louis.
> Format : `- [ONEA-XX] Ce qui était faux → Ce qu'il faut faire`

*(vide pour l'instant)*

---

*Workflow section ajoutée : Mars 2026*

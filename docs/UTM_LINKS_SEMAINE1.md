# UTM Links - Semaine 1 (Lancement Oneday)

## Configuration PostHog

Pour configurer le tracking UTM avec PostHog :

1. Va dans **PostHog → Settings → Project settings**
2. Récupère ton **Project API Key**
3. Dans ton app, ajoute le SDK PostHog avec capture d'événements

### Payload à envoyé à PostHog pour chaque clic lien bio

```typescript
posthog.capture('link_click', {
  utm_source: 'tiktok',        // platforme source
  utm_medium: 'video',         // type de contenu
  utm_campaign: 'week1_launch', // campagne
  utm_content: 'pov_hook',     // contenu spécifique
  timestamp: new Date().toISOString()
});
```

---

## Liens UTM - Semaine 1

### Configuration commune
- **Base URL**: `https://oneday.app/download`
- **utm_campaign**: `week1_launch`

---

### Mercredi (Jour 1 - Lancement)

| # | Contenu | utm_source | utm_medium | utm_content | URL complète |
|---|---------|------------|------------|-------------|--------------|
| 1 | TikTok - POV hook | tiktok | video | pov_launch | `https://oneday.app/download?utm_source=tiktok&utm_medium=video&utm_campaign=week1_launch&utm_content=pov_launch` |
| 2 | IG Reel - Same content | instagram | reel | pov_launch | `https://oneday.app/download?utm_source=instagram&utm_medium=reel&utm_campaign=week1_launch&utm_content=pov_launch` |
| 3 | IG Bio link (permanent) | instagram | bio | default | `https://oneday.app/download?utm_source=instagram&utm_medium=bio&utm_campaign=week1_launch&utm_content=default` |
| 4 | X Thread link | twitter | thread | ways_to_fail | `https://oneday.app/download?utm_source=twitter&utm_medium=thread&utm_campaign=week1_launch&utm_content=ways_to_fail` |

---

### Jeudi (Jour 2 - Tutoriel)

| # | Contenu | utm_source | utm_medium | utm_content | URL complète |
|---|---------|------------|------------|-------------|--------------|
| 5 | TikTok - Share extension tutorial | tiktok | video | share_extension_tutorial | `https://oneday.app/download?utm_source=tiktok&utm_medium=video&utm_campaign=week1_launch&utm_content=share_extension_tutorial` |
| 6 | IG Carousel - Before/After | instagram | carousel | before_after | `https://oneday.app/download?utm_source=instagram&utm_medium=carousel&utm_campaign=week1_launch&utm_content=before_after` |
| 7 | IG Bio update | instagram | bio | tutorial | `https://oneday.app/download?utm_source=instagram&utm_medium=bio&utm_campaign=week1_launch&utm_content=tutorial` |
| 8 | X - Quick tip creators | twitter | tweet | creators_tip | `https://oneday.app/download?utm_source=twitter&utm_medium=tweet&utm_campaign=week1_launch&utm_content=creators_tip` |

---

### Vendredi (Jour 3 - Live Extraction)

| # | Contenu | utm_source | utm_medium | utm_content | URL complète |
|---|---------|------------|------------|-------------|--------------|
| 9 | TikTok - Live Portugal extraction | tiktok | video | live_extraction | `https://oneday.app/download?utm_source=tiktok&utm_medium=video&utm_campaign=week1_launch&utm_content=live_extraction` |
| 10 | IG Reel - Same content | instagram | reel | live_extraction | `https://oneday.app/download?utm_source=instagram&utm_medium=reel&utm_campaign=week1_launch&utm_content=live_extraction` |

---

### Samedi (Jour 4 - Trend + Community)

| # | Contenu | utm_source | utm_medium | utm_content | URL complète |
|---|---------|------------|------------|-------------|--------------|
| 11 | TikTok - Trend participation | tiktok | video | trend_participation | `https://oneday.app/download?utm_source=tiktok&utm_medium=video&utm_campaign=week1_launch&utm_content=trend_participation` |
| 12 | IG Stories - Poll | instagram | story | destination_poll | `https://oneday.app/download?utm_source=instagram&utm_medium=story&utm_campaign=week1_launch&utm_content=destination_poll` |

---

### Dimanche (Jour 5 - Recap)

| # | Contenu | utm_source | utm_medium | utm_content | URL complète |
|---|---------|------------|------------|-------------|--------------|
| 13 | TikTok - Week recap | tiktok | video | week1_recap | `https://oneday.app/download?utm_source=tiktok&utm_medium=video&utm_campaign=week1_launch&utm_content=week1_recap` |
| 14 | IG Carousel - Testimonials | instagram | carousel | testimonials | `https://oneday.app/download?utm_source=instagram&utm_medium=carousel&utm_campaign=week1_launch&utm_content=testimonials` |
| 15 | X - Thread recap | twitter | thread | week1_summary | `https://oneday.app/download?utm_source=twitter&utm_medium=thread&utm_campaign=week1_launch&utm_content=week1_summary` |

---

## URL courtes (Bit.ly / PostHog short)

Pour avoir des liens plus propres dans les bios, utilise PostHog auto-capture ou Bit.ly avec les paramètres UTM.

**Configuration Bit.ly recommandée :**
- Crée un compte Bit.ly Enterprise ou gratuit
- Pour chaque lien ci-dessus, crée un URL courte
- Ajoute les UTM dans la destination (Bit.ly les transmet)

**Exemple avec Bit.ly :**
```
Destination: https://oneday.app/download?utm_source=tiktok&utm_medium=video&utm_campaign=week1_launch&utm_content=pov_launch
→ URL courte: https://bit.ly/oneday-tiktok-1
```

---

## Dashboard PostHog - Métriques à suivre

### Événements à créer dans PostHog

1. **`link_click`** - Chaque clic sur lien bio
2. **`signup_start`** - Début inscription
3. **`signup_complete`** - Inscription complétée
4. **`first_analysis`** - Première analyse complétée

### Funnel à visualiser

```
link_click → signup_start → signup_complete → first_analysis
```

### Requêtes PostHog pour analyser

```sql
-- Clicks par source
SELECT 
  props.utm_source,
  count(*) as clicks
FROM events
WHERE event = 'link_click'
  AND timestamp > '2026-03-23'
GROUP BY props.utm_source;

-- Conversion par contenu
SELECT 
  props.utm_content,
  count(*) as clicks,
  count(distinct distinct_id) as unique_users
FROM events
WHERE event = 'link_click'
GROUP BY props.utm_content;

-- Taux de conversion全局
SELECT 
  countIf(event = 'link_click') as clicks,
  countIf(event = 'signup_complete') as signups,
  countIf(event = 'first_analysis') as activated
FROM events
WHERE timestamp > '2026-03-23';
```

---

## Résumé - Liens courts à utiliser

| Date | Platform | Contenu | Lien court à utiliser |
|------|----------|---------|----------------------|
| Mer | TikTok | POV launch | `oneday.app/tk1` |
| Mer | IG Reel | POV launch | `oneday.app/ig1` |
| Mer | IG Bio | Default | `oneday.app/bio` |
| Jeu | TikTok | Tutorial | `oneday.app/tk2` |
| Jeu | IG Carousel | Before/After | `oneday.app/ig2` |
| Ven | TikTok | Live extraction | `oneday.app/tk3` |
| Sam | TikTok | Trend | `oneday.app/tk4` |
| Dim | TikTok | Recap | `oneday.app/tk5` |

*(Remplace par tes vrai liens courts une fois créés)*

---

*Généré: 2026-03-17*
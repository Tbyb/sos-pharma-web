# Design Instructions — SOS-Pharma Frontend

## Rôle
Tu es le lead designer d'un studio reconnu pour créer des interfaces mémorables et distinctives. Pour SOS-Pharma, toute proposition qui ressemble à un template générique est rejetée. Chaque choix visuel doit être justifié par le contexte médical et pharmaceutique dakarois.

---

## Identité visuelle SOS-Pharma

### Palette de couleurs (utiliser UNIQUEMENT ces valeurs)
```
--vert-profond:   #0A5C36   /* sidebar, éléments d'autorité, titres */
--vert-medical:   #12A05C   /* boutons CTA, éléments actifs, liens */
--vert-menthe:    #E8F5EE   /* fonds de sections, cartes hover */
--bleu-nuit:      #1A3A5C   /* texte principal, données critiques */
--blanc-casse:    #F7FAFC   /* fond général des pages */
--orange-corail:  #FF6B35   /* urgence, badge "disponible", alertes */
--gris-doux:      #6B7280   /* texte secondaire, placeholders */
--gris-bordure:   #E5E7EB   /* bordures, séparateurs */
```

### Typographie (Google Fonts — importer dans index.html)
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```
```
Display/Titres : DM Serif Display     → pages publiques, héros, titres de sections
Body/Interface : Inter                → tout le reste (labels, paragraphes, boutons)
Données/Prix   : JetBrains Mono      → prix en FCFA, quantités, références CIP
```

### Élément signature — "Pouls de disponibilité"
Chaque médicament disponible affiche une petite capsule verte animée (pulsation douce) à côté de son nom. Cela évoque un signal vital médical et indique l'état en temps réel.
```css
@keyframes pulse-medical {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}
.disponible-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #12A05C;
  animation: pulse-medical 2s ease-in-out infinite;
  display: inline-block;
  margin-right: 6px;
}
```

---

## Règles de design à respecter

### Ce qu'il faut faire ✅
- Utiliser DM Serif Display uniquement pour les grands titres (hero, sections publiques)
- Utiliser JetBrains Mono pour TOUS les prix et quantités
- Sidebar Admin → fond #0A5C36 (vert profond), texte blanc
- Sidebar Pharmacien → fond #1A3A5C (bleu nuit), texte blanc
- Header public → fond blanc avec bordure bottom #12A05C (2px)
- Boutons primaires → #12A05C avec hover #0A5C36
- Badges "Disponible" → fond #E8F5EE, texte #0A5C36, avec indicateur pulsant
- Badges "Indisponible" → fond #FEE2E2, texte #991B1B
- Border-radius : 8px pour les cartes, 6px pour les boutons, 4px pour les badges
- Ombres douces : `shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)`

### Ce qu'il faut éviter ❌
- Fond crème (#F4F1EA) avec serif terracotta → cliché AI
- Fond noir avec accent vert acide → cliché AI
- Style journal/newspaper dense → cliché AI
- Dégradés trop flashy
- Trop d'animations → choisir 1 ou 2 maximum par page
- Border-radius > 12px (trop arrondi, perd le sérieux médical)
- Couleurs hors de la palette définie

---

## Composants clés — design prescrit

### Button
```jsx
// Primaire
<button className="bg-[#12A05C] hover:bg-[#0A5C36] text-white font-medium 
  px-5 py-2.5 rounded-[6px] transition-colors duration-200 font-[Inter]">
  Texte action
</button>

// Secondaire
<button className="border border-[#12A05C] text-[#12A05C] hover:bg-[#E8F5EE]
  px-5 py-2.5 rounded-[6px] transition-colors duration-200 font-[Inter]">
  Texte action
</button>

// Danger
<button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white
  px-5 py-2.5 rounded-[6px] transition-colors duration-200">
  Supprimer
</button>
```

### Badge statut médicament
```jsx
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 
  rounded-full text-xs font-medium bg-[#E8F5EE] text-[#0A5C36]">
  <span className="disponible-indicator" />
  Disponible
</span>
```

### Card médicament (pages publiques)
```
- Fond blanc, border 1px #E5E7EB, border-radius 8px
- Hover : border-color #12A05C, shadow légère
- Prix affiché en JetBrains Mono, couleur #1A3A5C
- Nom en Inter 500, 15px
- Badge disponibilité en haut à droite
- Transition hover 200ms
```

### Sidebar Admin
```
- Fond #0A5C36
- Logo blanc en haut (24px de padding)
- Liens : texte blanc/80, hover fond blanc/10
- Lien actif : fond blanc/15, bordure gauche 3px blanche, texte blanc
- Section profil en bas avec séparateur blanc/20
```

### StatCard Dashboard
```
- Fond blanc, border 1px #E5E7EB
- Icône dans un carré arrondi fond #E8F5EE (vert) ou #E3F2FD (bleu)
- Valeur principale : Inter 700, 28px, couleur #1A3A5C
- Label : Inter 400, 13px, couleur #6B7280
- Variation (si applicable) : vert si positif, rouge si négatif
```

### Tableau de données
```
- Header : fond #F7FAFC, texte #6B7280, Inter 600 12px uppercase, letter-spacing 0.05em
- Lignes : fond blanc, hover fond #F7FAFC
- Bordures : 1px #E5E7EB entre les lignes
- Pas de bordures verticales entre colonnes
- Actions en dernière colonne : icônes Lucide, couleur #6B7280, hover #12A05C
```

---

## Pages — directives spécifiques

### AccueilPage (public)
```
Hero :
- Fond : dégradé subtil de #F7FAFC vers #E8F5EE
- Titre principal : DM Serif Display, 52px, couleur #1A3A5C
- Sous-titre : Inter 400, 18px, couleur #6B7280
- Barre de recherche : grande (padding 16px 20px), ombre medium, 
  icône loupe #12A05C à gauche, border-radius 8px
- Bouton rechercher : #12A05C, même hauteur que l'input

Section "Comment ça marche" :
- 4 étapes avec icônes rondes fond #E8F5EE
- Connectées par une ligne pointillée #12A05C
- NE PAS utiliser de numéros 01/02/03 (cliché)
```

### MedicamentsPage (public)
```
- Fond général #F7FAFC
- Grille 3 colonnes desktop, 2 tablette, 1 mobile
- Barre de filtres sticky en haut (fond blanc, shadow bas)
- Skeleton loader avec animation shimmer pendant le chargement
```

### LoginPage
```
- Layout deux colonnes 50/50
- Gauche : fond #0A5C36, logo blanc, tagline en DM Serif Display blanc
  + une citation médicale ou statistique en bas
- Droite : fond blanc, formulaire centré
- Bouton connexion pleine largeur, #12A05C
- Lien "S'inscrire" en texte #12A05C
```

### Dashboard Admin
```
- Fond général #F7FAFC
- Grid de 4 StatCards en haut
- 2 graphiques en dessous : LineChart (pleine largeur) + PieChart
- Couleurs Recharts : utiliser #12A05C, #1A3A5C, #FF6B35, #6B7280
```

---

## Animations autorisées (pas plus)

1. **Pulse disponibilité** → sur les badges médicaments (déjà défini)
2. **Hover cards** → `transform: translateY(-2px)` sur hover des cards médicaments
3. **Skeleton shimmer** → pendant les chargements
4. **Transitions de couleur** → 200ms sur tous les boutons et liens

Toute autre animation doit être justifiée. Moins = mieux pour un contexte médical sérieux.

---

## Micro-copy (textes interface)

- Bouton panier : "Ajouter au panier" (pas "Add to cart")
- Bouton commande : "Valider la commande" (pas "Submit")
- Statut "en_cours" s'affiche : "En attente de confirmation"
- Statut "prete" s'affiche : "Prête à récupérer"
- Prix toujours suivi de " FCFA" (avec espace)
- Erreur générique : "Une erreur est survenue. Veuillez réessayer."
- État vide : "Aucun médicament trouvé pour votre recherche"

---

## Comment utiliser ce fichier avec Claude Code

Au début de chaque session, dis à Claude Code :
"Lis le fichier DESIGN.md à la racine du projet avant de générer du code frontend.
Respecte strictement la palette, la typographie et les règles définies."

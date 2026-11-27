# Roadmap Frontend Web - SOS-Pharma

**Stack** : React 19 + Vite + Tailwind CSS 4 + Axios + React Query + React Router v7
**Interfaces** : Visiteur, Patient, Pharmacien, Administrateur
**Theme** : Medical - Vert `#1B8A4C` + Bleu `#1A6FBF` + Blanc

---

## Phase 1 - Configuration & Structure

### Objectifs
- Structure Atomic Design complete
- Configuration Axios + React Query + Router
- Tailwind theme medical
- AuthContext + PanierContext

### Taches

- [ ] Creer la structure des dossiers (api/, components/atoms|molecules|organisms|templates, pages/, hooks/, contexts/, utils/, router/)
- [ ] `src/api/axiosInstance.js` - instance Axios avec intercepteurs
- [ ] `src/utils/constants.js` - COULEURS, STATUTS_COMMANDE, STATUTS_PHARMACIE, STATUTS_PAIEMENT, ROLES
- [ ] `src/utils/formatters.js` - formatDate, formatMontant, formatStatut
- [ ] `.env` avec VITE_API_URL
- [ ] Configurer Tailwind (theme vert/bleu medical)
- [ ] `src/main.jsx` - QueryClientProvider + BrowserRouter + AuthProvider
- [ ] `src/contexts/AuthContext.jsx`
- [ ] `src/contexts/PanierContext.jsx`
- [ ] `src/index.css` - import Tailwind + font Inter

### Validation
- `npm run dev` demarre sans erreur
- Tailwind classes fonctionnent
- Structure dossiers conforme au spec

---

## Phase 2 - Atoms (Composants de base)

### Objectifs
- Tous les composants atomiques reutilisables
- Design system medical coherent

### Taches

- [ ] `Button.jsx` - variantes: primary (bleu), secondary (vert), danger, ghost, outline + tailles sm/md/lg
- [ ] `Input.jsx` - avec label, etat erreur, icone optionnelle
- [ ] `Label.jsx` - label de formulaire
- [ ] `Badge.jsx` - couleur dynamique selon statut (utilise STATUTS_* de constants)
- [ ] `Alert.jsx` - variantes: success, error, warning, info
- [ ] `Spinner.jsx` - indicateur de chargement
- [ ] `Skeleton.jsx` - placeholder pendant chargement (ligne, card, tableau)
- [ ] `Avatar.jsx` - initiales utilisateur + couleur de fond
- [ ] `Card.jsx` - conteneur avec ombre douce, padding configurable
- [ ] `Modal.jsx` - modal reutilisable avec overlay, titre, footer actions
- [ ] `Pagination.jsx` - navigation pages (currentPage, totalPages, onPageChange)

### Validation
- Chaque atome fonctionne isolement
- Variantes visuellement correctes
- Responsive

---

## Phase 3 - Authentification

### Objectifs
- Login/Register fonctionnels
- Protection des routes par role
- Redirection intelligente selon role

### Taches

- [ ] `src/api/auth.api.js` - login, register, logout, getUser
- [ ] `hooks/useAuth.js` - hook React Query pour auth
- [ ] `molecules/LoginForm.jsx` - formulaire email + mot de passe
- [ ] `molecules/RegisterForm.jsx` - formulaire inscription patient
- [ ] `pages/auth/LoginPage.jsx` - design medical (fond vert clair, card centree)
- [ ] `pages/auth/RegisterPage.jsx` - inscription patient
- [ ] `router/PrivateRoute.jsx` - redirige vers /login si pas de token
- [ ] `router/RoleRoute.jsx` - redirige si mauvais role
- [ ] `router/AppRouter.jsx` - toutes les routes de l'app

### Routes
```
/login                  -> LoginPage (public)
/register               -> RegisterPage (public)
/                       -> HomePage (public - recherche medicaments)
/medicaments/:id        -> MedicamentDetailPage (public)
/comparaison            -> ComparaisonPrixPage (public)
/pharmacies             -> PharmaciesMapPage (public)
/patient/*              -> routes Patient (role: patient)
/pharmacien/*           -> routes Pharmacien (role: pharmacien)
/admin/*                -> routes Admin (role: administrateur)
```

### Redirection post-login
```
administrateur -> /admin/dashboard
pharmacien     -> /pharmacien/catalogue
patient        -> /
```

### Validation
- Login admin -> redirige /admin/dashboard
- Login pharmacien -> redirige /pharmacien/catalogue
- Login patient -> redirige /
- Register patient -> compte cree + login auto
- Token persiste au refresh
- Route protegee sans token -> /login
- Route admin avec token patient -> redirection

---

## Phase 4 - Layouts & Navigation

### Objectifs
- 3 layouts distincts (Public, Admin, Pharmacien)
- Sidebar verte pour Admin/Pharmacien
- Header avec avatar et deconnexion
- Responsive (sidebar collapsible)

### Taches

- [ ] `molecules/Sidebar.jsx` - sidebar verte, liens avec icones, lien actif en surbrillance
- [ ] `molecules/Header.jsx` - breadcrumb + avatar + dropdown deconnexion
- [ ] `molecules/NavLink.jsx` - lien navigation avec icone et etat actif
- [ ] `templates/PublicLayout.jsx` - navbar top + footer pour pages publiques
- [ ] `templates/AdminLayout.jsx` - sidebar + header + content
- [ ] `templates/PharmacienLayout.jsx` - sidebar + header + content

### Navigation Admin
```
Dashboard        (LayoutDashboard)
Medicaments      (Pill)
Pharmacies       (Store)
Livreurs         (Truck)
Commandes        (Package)
Transactions     (CreditCard)
```

### Navigation Pharmacien
```
Mon Catalogue    (Package)
Mes Commandes    (ShoppingCart)
Ma Pharmacie     (Store)
```

### Navigation Publique (navbar top)
```
Accueil | Pharmacies | A propos | Connexion/Mon compte
```

### Design Sidebar
```
Fond: #1B8A4C (vert)
Texte: blanc
Lien actif: fond blanc/15%, bordure gauche blanche 3px
Largeur: 260px (desktop), collapse icones (tablette), hidden (mobile avec burger)
Logo SOS-Pharma en haut
```

### Validation
- Sidebar visible avec bonne navigation selon role
- Lien actif visuellement distinct
- Header affiche nom utilisateur
- Deconnexion fonctionne
- Responsive: sidebar collapse sur tablette, burger menu sur mobile

---

## Phase 5 - Pages Publiques (Visiteur)

### Objectifs
- Recherche de medicaments
- Comparaison des prix entre pharmacies
- Carte des pharmacies
- Accessible sans compte

### Taches

- [ ] `src/api/medicaments.api.js` - recherche, detail, comparaison prix
- [ ] `src/api/pharmacies.api.js` - liste, detail, geolocalisation
- [ ] `hooks/useMedicaments.js` - useSearchMedicaments, useMedicamentDetail, useComparaisonPrix
- [ ] `hooks/usePharmacies.js` - usePharmaciesCertifiees, usePharmacieDetail
- [ ] `molecules/SearchBar.jsx` - recherche avec debounce 300ms + suggestions
- [ ] `molecules/MedicamentCard.jsx` - nom, forme, prix min, CTA "Comparer prix"
- [ ] `molecules/PharmacieCard.jsx` - nom, adresse, distance, nb medicaments
- [ ] `molecules/PrixComparaisonTable.jsx` - tableau pharmacie/prix/dispo/distance
- [ ] `organisms/MedicamentsList.jsx` - grille de MedicamentCards + pagination
- [ ] `organisms/PharmaciesMap.jsx` - carte Leaflet avec marqueurs pharmacies
- [ ] `organisms/Chatbot.jsx` - chatbot IA flottant (bottom-right)
- [ ] `pages/public/HomePage.jsx` - hero + recherche medicaments + resultats
- [ ] `pages/public/MedicamentDetailPage.jsx` - infos medicament + comparaison prix
- [ ] `pages/public/ComparaisonPrixPage.jsx` - recherche + tableau comparatif
- [ ] `pages/public/PharmaciesMapPage.jsx` - carte pleine page + liste laterale

### Design HomePage
```
- Hero: fond vert clair, titre "Trouvez vos medicaments au meilleur prix"
- Barre de recherche prominente au centre
- Resultats en grille de cards
- Section "Pharmacies proches" avec mini-carte
```

### Carte Leaflet
```
- Centre: Dakar (14.6928, -17.4467)
- Marqueurs verts pour pharmacies certifiees
- Popup au clic: nom, adresse, bouton "Voir detail"
- Geolocalisation utilisateur optionnelle
```

### Endpoints
```
GET /api/v1/medicaments/recherche?q=X&page=1
GET /api/v1/medicaments/{id}
GET /api/v1/medicaments/{id}/comparaison-prix
GET /api/v1/pharmacies/certifiees
GET /api/v1/pharmacies/{id}
```

### Validation
- Recherche medicaments avec resultats en temps reel
- Page detail medicament avec prix compares
- Carte affiche pharmacies avec popups
- Navigation sans compte fonctionne
- Responsive sur mobile

---

## Phase 6 - Espace Patient

### Objectifs
- Panier de commande
- Passage de commande + choix mode recuperation
- Paiement mobile (Wave, Orange Money, Free Money, carte)
- Suivi commandes
- Profil patient

### Taches

- [ ] `src/api/commandes.api.js` - creer, lister, detail, annuler
- [ ] `src/api/paiements.api.js` - initier paiement, verifier statut
- [ ] `contexts/PanierContext.jsx` - ajout/retrait medicaments, calcul total, pharmacie source
- [ ] `hooks/useCommandes.js` - useCreateCommande, useMesCommandes, useCommandeDetail
- [ ] `hooks/usePaiement.js` - useInitierPaiement, useVerifierPaiement
- [ ] `molecules/PanierItem.jsx` - medicament + quantite + prix + supprimer
- [ ] `molecules/CommandeItem.jsx` - resume commande + statut + date
- [ ] `organisms/CommandesList.jsx` - liste commandes patient avec filtres
- [ ] `pages/patient/PanierPage.jsx` - contenu panier + resume + bouton commander
- [ ] `pages/patient/CommandePage.jsx` - choix mode (livraison/retrait) + adresse + paiement
- [ ] `pages/patient/MesCommandesPage.jsx` - historique commandes avec statut
- [ ] `pages/patient/ProfilPage.jsx` - infos personnelles + modifier

### Panier (PanierContext)
```
- Stockage localStorage cle "sos_pharma_panier"
- Un panier = une seule pharmacie source
- Si ajout medicament d'une autre pharmacie -> alerte "vider le panier?"
- Quantite modifiable
- Total auto-calcule
```

### Flux commande
```
1. Patient ajoute medicaments au panier (depuis comparaison prix)
2. Va sur /patient/panier -> voit le resume
3. Clique "Commander" -> /patient/commander
4. Choisit mode: "Livraison" ou "Retrait en pharmacie"
5. Si livraison: saisit adresse
6. Initie le paiement
7. Redirection vers page paiement externe
8. Callback -> commande creee avec statut "en_cours"
```

### Endpoints
```
POST   /api/v1/commandes
GET    /api/v1/mes-commandes?page=1
GET    /api/v1/mes-commandes/{id}
POST   /api/v1/paiements/initier
GET    /api/v1/paiements/{ref}/statut
PUT    /api/v1/profil
```

### Validation
- Ajout au panier depuis comparaison prix
- Panier persiste au refresh (localStorage)
- Commande creee apres paiement
- Liste commandes avec bons statuts
- Profil modifiable

---

## Phase 7 - Dashboard Admin

### Objectifs
- KPIs principaux
- Graphiques statistiques
- Vue d'ensemble plateforme

### Taches

- [ ] `src/api/statistiques.api.js` - dashboard, commandes, revenus
- [ ] `hooks/useStatistiques.js` - useDashboard, useStatsCommandes, useStatsRevenus
- [ ] `molecules/StatCard.jsx` - icone + valeur + label + variation %
- [ ] `organisms/DashboardStats.jsx` - grille de StatCards + graphiques
- [ ] `pages/admin/DashboardPage.jsx`

### KPIs
```
| Total Patients | Total Pharmacies | Commandes du jour | Revenus du jour |
```

### Graphiques (Recharts)
```
- Evolution commandes 7 derniers jours (LineChart)
- Repartition par statut commande (PieChart)
- Top 5 pharmacies par commandes (BarChart)
```

### Endpoints
```
GET /api/v1/statistiques/dashboard
GET /api/v1/statistiques/commandes
GET /api/v1/statistiques/revenus
```

### Validation
- KPIs avec vraies donnees
- Graphiques charges sans erreur
- Skeleton pendant chargement
- Responsive

---

## Phase 8 - Referentiel Medicaments (Admin)

### Objectifs
- CRUD medicaments
- Recherche + filtres
- Pagination

### Taches

- [ ] `molecules/MedicamentForm.jsx` - formulaire ajout/modif medicament
- [ ] `molecules/FilterBar.jsx` - filtres actif/inactif + recherche
- [ ] `organisms/MedicamentsList.jsx` (version admin - tableau)
- [ ] `pages/admin/MedicamentsPage.jsx`

### Fonctionnalites
```
- Tableau: Designation | CIP | Prix | Liste | TVA | Statut | Actions
- Bouton "Ajouter" -> modal formulaire
- Recherche par nom ou CIP (debounce 300ms)
- Filtre: actifs / inactifs / tous
- Actions: Modifier | Desactiver/Reactiver
- Pagination 20/page
- Confirmation avant desactivation
```

### Endpoints
```
GET    /api/v1/admin/medicaments?search=X&statut=actif&page=1
POST   /api/v1/medicaments
PUT    /api/v1/medicaments/{id}
PATCH  /api/v1/medicaments/{id}/desactiver
PATCH  /api/v1/medicaments/{id}/reactiver
```

### Validation
- Liste affichee avec pagination
- Recherche fonctionne
- Ajout -> medicament apparait
- Desactivation -> badge "Inactif"
- Toast succes/erreur

---

## Phase 9 - Gestion Pharmacies (Admin)

### Objectifs
- Certification/refus/suspension pharmacies
- Vue detail pharmacie
- Onglets par statut

### Taches

- [ ] `molecules/PharmacieCard.jsx` (version admin - avec actions)
- [ ] `organisms/PharmaciesList.jsx` (version admin)
- [ ] `pages/admin/PharmaciesPage.jsx` - onglets par statut
- [ ] `pages/admin/PharmacieDetailPage.jsx` - infos + catalogue + commandes

### Fonctionnalites
```
- Onglets: "En attente" | "Certifiees" | "Suspendues"
- Card: nom, adresse, licence, statut, actions
- Actions: Certifier | Refuser | Suspendre | Reactiver
- Detail: infos pharmacie + son catalogue + ses commandes
- Modal confirmation avant action
```

### Endpoints
```
GET /api/v1/pharmacies?statut=en_attente&page=1
PUT /api/v1/pharmacies/{id}/accepter
PUT /api/v1/pharmacies/{id}/refuser
PUT /api/v1/pharmacies/{id}/suspendre
PUT /api/v1/pharmacies/{id}/reactiver
GET /api/v1/pharmacies/{id}
GET /api/v1/pharmacies/{id}/catalogue
```

### Validation
- Onglets filtrent correctement
- Certification -> passe dans "Certifiees"
- Detail affiche bonnes infos
- Toast apres chaque action

---

## Phase 10 - Commandes Admin + Livreurs

### Objectifs
- Vue globale commandes (admin)
- Gestion livreurs
- Filtres et detail commande

### Taches

- [ ] `molecules/CommandeDetails.jsx` - detail complet commande
- [ ] `organisms/CommandesList.jsx` (version admin)
- [ ] `pages/admin/CommandesPage.jsx` - tableau + filtres + detail
- [ ] `pages/admin/LivreursPage.jsx` - liste livreurs + missions
- [ ] `hooks/useLivreurs.js`

### Fonctionnalites Commandes
```
- Tableau: N° | Patient | Pharmacie | Montant | Mode | Statut | Date
- Filtres: statut, pharmacie, periode
- Clic -> modal detail (medicaments, paiement, livraison)
- Pagination 15/page
```

### Fonctionnalites Livreurs
```
- Tableau: Nom | Email | Telephone | Missions actives | Statut
- Actions: Voir missions | Suspendre
- Modal historique livraisons
```

### Endpoints
```
GET /api/v1/admin/commandes?statut=X&page=1
GET /api/v1/admin/commandes/{id}
GET /api/v1/livreurs
GET /api/v1/livreurs/{id}/livraisons
```

### Validation
- Listes affichees avec filtres
- Detail commande complet
- Livreurs avec missions visibles

---

## Phase 11 - Espace Pharmacien

### Objectifs
- Gestion catalogue (prix, disponibilite)
- Gestion commandes recues
- Infos pharmacie

### Taches

- [ ] `src/api/commandes.api.js` - ajout endpoints pharmacien
- [ ] `hooks/useCatalogue.js`
- [ ] `organisms/CatalogueTable.jsx` - tableau avec inline edit
- [ ] `pages/pharmacien/CataloguePage.jsx`
- [ ] `pages/pharmacien/CommandesPharmaciePage.jsx`
- [ ] `pages/pharmacien/MaPharmaciePage.jsx`

### Catalogue
```
- Tableau: Medicament | Prix | Quantite | Disponible (toggle) | Actions
- Toggle disponibilite instantane
- Edit prix inline (double-clic ou bouton)
- Ajouter medicament depuis referentiel (modal recherche)
- Retirer du catalogue
- Import CSV
```

### Commandes Pharmacien
```
- Onglets: En attente | Acceptees | En preparation | Pretes | Historique
- Card: N° | Patient | Medicaments | Montant | Mode recuperation
- Actions: Accepter | Refuser | Marquer prete | Assigner livreur
- Badge rouge nouvelles commandes
```

### Endpoints
```
GET    /api/v1/ma-pharmacie/catalogue?page=1
POST   /api/v1/ma-pharmacie/catalogue
PUT    /api/v1/ma-pharmacie/catalogue/{id}/dispoPrix
PATCH  /api/v1/ma-pharmacie/catalogue/{id}/disponibilite
DELETE /api/v1/ma-pharmacie/catalogue/{id}
POST   /api/v1/ma-pharmacie/catalogue/import
GET    /api/v1/commandes?statut=X
PUT    /api/v1/commandes/{id}/accepter
PUT    /api/v1/commandes/{id}/refuser
PUT    /api/v1/commandes/{id}/pret
PUT    /api/v1/commandes/{id}/assigner
GET    /api/v1/ma-pharmacie
PUT    /api/v1/ma-pharmacie
```

### Validation
- Catalogue avec toggle disponibilite
- Edit prix fonctionne
- Ajout medicament depuis referentiel
- Commandes filtrees par onglet
- Accepter/refuser met a jour le statut

---

## Phase 12 - Transactions (Admin)

### Objectifs
- Historique paiements
- Filtres par mode/statut/date

### Taches

- [ ] `organisms/TransactionsList.jsx`
- [ ] `pages/admin/TransactionsPage.jsx`

### Fonctionnalites
```
- Tableau: Reference | Commande | Patient | Montant | Mode | Statut | Date
- Filtres: statut paiement, mode, periode
- Total revenus en haut de page
- Pagination
```

### Endpoints
```
GET /api/v1/admin/paiements?page=1&statut=X
```

### Validation
- Liste transactions affichee
- Filtres fonctionnent
- Total revenus correct

---

## Phase 13 - Chatbot IA

### Objectifs
- Widget chatbot flottant sur les pages publiques
- Aide a la recherche de medicaments
- Reponses contextuelles

### Taches

- [ ] `organisms/Chatbot.jsx` - widget flottant bottom-right
- [ ] Integration dans PublicLayout

### Fonctionnalites
```
- Bouton flottant (icone message) en bas a droite
- Au clic: fenetre chat s'ouvre
- Input message + historique conversation
- Envoi vers endpoint IA backend
- Reponses formatees (markdown basique)
- Fermer/minimiser
```

### Endpoints
```
POST /api/v1/chatbot/message
```

### Validation
- Widget visible sur pages publiques
- Envoi/reception messages
- Historique conversation dans la session

---

## Phase 14 - Optimisations & Polish

### Objectifs
- UX complete (toasts, confirmations, loaders)
- Performance (lazy loading, error boundaries)
- Responsive final

### Taches

- [ ] Installer react-hot-toast
- [ ] Toast sur toutes les actions (succes/erreur)
- [ ] ConfirmDialog avant actions destructives (supprimer, suspendre, refuser)
- [ ] Lazy loading toutes les pages (React.lazy + Suspense)
- [ ] Error Boundary global
- [ ] Responsive complet (mobile, tablette, desktop)
- [ ] Transitions CSS douces
- [ ] Tester Chrome, Firefox, Edge
- [ ] Build production sans erreur

### Validation
- Toasts visibles apres chaque action
- Confirmation avant suppression
- Skeleton/Spinner pendant chargement
- Build `npm run build` sans warning
- Lighthouse score > 85

---

## Resume des Phases

| Phase | Nom | Duree estimee | Priorite |
|-------|-----|---------------|----------|
| 1 | Configuration & Structure | 0.5 jour | Critique |
| 2 | Atoms | 0.5 jour | Critique |
| 3 | Authentification | 1 jour | Critique |
| 4 | Layouts & Navigation | 1 jour | Critique |
| 5 | Pages Publiques (Visiteur) | 2 jours | Critique |
| 6 | Espace Patient | 2 jours | Critique |
| 7 | Dashboard Admin | 1 jour | Haute |
| 8 | Referentiel Medicaments | 1.5 jours | Haute |
| 9 | Gestion Pharmacies | 1.5 jours | Haute |
| 10 | Commandes + Livreurs | 1.5 jours | Haute |
| 11 | Espace Pharmacien | 2 jours | Critique |
| 12 | Transactions | 0.5 jour | Moyenne |
| 13 | Chatbot IA | 1 jour | Moyenne |
| 14 | Optimisations & Polish | 1 jour | Haute |

**Total estime : ~17 jours**

---

## Notes

- Backend Laravel doit tourner sur `http://localhost:8000/api/v1`
- CORS doit autoriser `http://localhost:5173`
- Token Sanctum gere automatiquement par axiosInstance
- Un commit Git par phase completee
- Toujours tester dans le navigateur avant de passer a la phase suivante

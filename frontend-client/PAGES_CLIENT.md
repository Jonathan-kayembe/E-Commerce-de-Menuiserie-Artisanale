# 📋 Pages Disponibles pour le Client

## 🔐 Pages d'Authentification (Publiques)

### 1. **Page de Connexion**
- **Route** : `/login`
- **Fichier** : `src/pages/Login.jsx`
- **Description** : Permet au client de se connecter avec son email et mot de passe
- **Fonctionnalités** :
  - Formulaire de connexion avec validation
  - Lien vers la page d'inscription
  - Redirection vers `/` (accueil) après connexion réussie
  - Gestion des erreurs d'authentification

### 2. **Page d'Inscription**
- **Route** : `/register`
- **Fichier** : `src/pages/Register.jsx`
- **Description** : Permet de créer un nouveau compte client
- **Fonctionnalités** :
  - Formulaire d'inscription (nom complet, email, mot de passe, confirmation)
  - Validation des données
  - Création automatique avec le rôle "client"
  - Lien vers la page de connexion
  - Redirection vers `/` (accueil) après inscription réussie

---

## 🏠 Pages Publiques (Accessibles sans authentification)

### 3. **Page d'Accueil**
- **Route** : `/`
- **Fichier** : `src/pages/Home.jsx`
- **Description** : Page d'accueil du site e-commerce
- **Fonctionnalités** :
  - Section hero avec présentation
  - Produits en vedette
  - Catégories populaires
  - Appels à l'action
  - Design moderne et responsive

### 4. **Liste des Produits**
- **Route** : `/products`
- **Fichier** : `src/pages/Products.jsx`
- **Description** : Catalogue de tous les produits disponibles
- **Fonctionnalités** :
  - Affichage en grille des produits
  - Filtres par catégorie
  - Recherche de produits
  - Tri par prix, popularité, etc.
  - Pagination
  - Liens vers les détails de chaque produit

### 5. **Détail d'un Produit**
- **Route** : `/products/:id`
- **Fichier** : `src/pages/ProductDetail.jsx`
- **Description** : Page de détail d'un produit spécifique
- **Fonctionnalités** :
  - Images du produit (galerie)
  - Description détaillée
  - Prix et disponibilité
  - Options (matériau, couleur, finition)
  - Bouton "Ajouter au panier"
  - Avis et notes des clients
  - Produits similaires

---

## 🔒 Pages Protégées (Nécessitent une authentification)

Toutes les pages ci-dessous sont protégées par le `ProtectedRoute` et nécessitent :
- ✅ Être connecté (rôle "client")

### 6. **Panier d'Achat**
- **Route** : `/cart`
- **Fichier** : `src/pages/Cart.jsx`
- **Description** : Gestion du panier d'achat
- **Fonctionnalités** :
  - Liste des articles dans le panier
  - Modification des quantités
  - Suppression d'articles
  - Calcul du total
  - Réduction/codes promo
  - Bouton pour passer à la commande
  - Sauvegarde dans localStorage

### 7. **Passage de Commande (Checkout)**
- **Route** : `/checkout`
- **Fichier** : `src/pages/Checkout.jsx`
- **Description** : Processus de finalisation de la commande
- **Fonctionnalités** :
  - Récapitulatif de la commande
  - Formulaire d'adresse de livraison
  - Sélection du mode de paiement
  - Validation des informations
  - Confirmation de commande
  - Redirection après paiement

### 8. **Profil Utilisateur**
- **Route** : `/profile`
- **Fichier** : `src/pages/Profile.jsx`
- **Description** : Gestion du profil utilisateur
- **Fonctionnalités** :
  - Affichage des informations personnelles
  - Modification du profil (nom, email)
  - Changement de mot de passe
  - Gestion des adresses de livraison
  - Préférences utilisateur
  - Suppression de compte

### 9. **Mes Commandes**
- **Route** : `/orders`
- **Fichier** : `src/pages/Orders.jsx`
- **Description** : Historique des commandes du client
- **Fonctionnalités** :
  - Liste de toutes les commandes
  - Filtres par statut (en attente, en cours, livrée, annulée)
  - Détails de chaque commande
  - Suivi de livraison
  - Réimpression de facture
  - Annulation de commande (si possible)

### 10. **Page 404 (Non trouvée)**
- **Route** : `*` (toutes les routes non définies)
- **Fichier** : `src/pages/NotFound.jsx`
- **Description** : Page affichée quand une route n'existe pas
- **Fonctionnalités** :
  - Message d'erreur amical
  - Lien pour retourner à l'accueil
  - Suggestions de navigation

---

## 🗺️ Structure de Navigation

```
Client Frontend
│
├── 🔓 Pages Publiques
│   ├── /                    → Accueil
│   ├── /login               → Connexion
│   ├── /register            → Inscription
│   ├── /products            → Liste des produits
│   └── /products/:id        → Détail d'un produit
│
└── 🔒 Pages Protégées (Authentification requise)
    ├── /cart                → Panier d'achat
    ├── /checkout            → Passage de commande
    ├── /profile             → Profil utilisateur
    └── /orders              → Mes commandes
```

---

## 📱 Navigation dans le Header

### Navigation Principale (Toujours visible)
- **Accueil** (`/`) - Lien vers la page d'accueil
- **Produits** (`/products`) - Lien vers le catalogue

### Actions Utilisateur (Non connecté)
- **Connexion** (`/login`) - Lien vers la page de connexion
- **Inscription** (`/register`) - Bouton d'inscription

### Actions Utilisateur (Connecté)
- **Panier** (`/cart`) - Icône avec badge du nombre d'articles
- **Menu Utilisateur** (Dropdown) :
  - **Mon profil** (`/profile`)
  - **Mes commandes** (`/orders`)
  - **Déconnexion**

---

## ✅ Pages Actuellement Implémentées

1. ✅ Home (Accueil)
2. ✅ Login (Connexion)
3. ✅ Register (Inscription)
4. ✅ Products (Liste des produits)
5. ✅ ProductDetail (Détail d'un produit)
6. ✅ Cart (Panier)
7. ✅ Checkout (Passage de commande)
8. ✅ Profile (Profil utilisateur)
9. ✅ Orders (Mes commandes)
10. ✅ NotFound (Page 404)

---

## 🎯 Fonctionnalités Clés

### Panier d'Achat
- ✅ Ajout de produits au panier
- ✅ Modification des quantités
- ✅ Suppression d'articles
- ✅ Calcul automatique du total
- ✅ Persistance dans localStorage
- ✅ Synchronisation avec le backend

### Authentification
- ✅ Connexion avec email/mot de passe
- ✅ Inscription avec validation
- ✅ Gestion du token dans localStorage
- ✅ Protection des routes sensibles
- ✅ Déconnexion

### Navigation
- ✅ Header responsive avec menu mobile
- ✅ Navigation active (surlignage)
- ✅ Badge du panier avec compteur
- ✅ Menu utilisateur déroulant
- ✅ Liens vers toutes les pages principales

---

## 🔗 Liens Utiles

- **URL Base** : `http://localhost:3002`
- **Accueil** : `http://localhost:3002/`
- **Produits** : `http://localhost:3002/products`
- **Connexion** : `http://localhost:3002/login`
- **Inscription** : `http://localhost:3002/register`
- **Panier** : `http://localhost:3002/cart` (nécessite connexion)
- **Profil** : `http://localhost:3002/profile` (nécessite connexion)
- **Commandes** : `http://localhost:3002/orders` (nécessite connexion)

---

## 📝 Notes Importantes

### Protection des Routes
- Les pages `/cart`, `/checkout`, `/profile`, et `/orders` nécessitent une authentification
- Si un utilisateur non connecté tente d'accéder à ces pages, il est redirigé vers `/login`
- Après connexion, redirection automatique vers la page demandée

### Gestion du Panier
- Le panier est géré via le contexte `CartContext`
- Les données sont sauvegardées dans `localStorage`
- Synchronisation avec le backend lors de la connexion

### Token d'Authentification
- Le token est stocké dans `localStorage` avec la clé `token`
- Le token est automatiquement ajouté aux requêtes API via axios interceptors
- Expiration et gestion des erreurs 401 (non autorisé)

### Responsive Design
- Toutes les pages sont responsive
- Menu mobile pour les petits écrans
- Navigation adaptative selon la taille d'écran

---

## 🎨 Design et UX

- **Thème** : Palette de couleurs bois (primary, secondary, accent)
- **Typographie** : Playfair Display (titres), Inter (corps), Montserrat (accents)
- **Animations** : Transitions douces, effets hover, animations de chargement
- **Composants** : Design moderne avec ombres, bordures arrondies, gradients
- **Feedback** : Notifications toast, messages d'erreur, états de chargement

---

## 🚀 Prochaines Améliorations Possibles

1. **Page de Recherche Avancée** - Recherche avec filtres multiples
2. **Page de Comparaison** - Comparer plusieurs produits
3. **Liste de Souhaits** - Sauvegarder des produits favoris
4. **Avis et Notes** - Système complet d'évaluation
5. **Suivi de Livraison** - Suivi en temps réel des commandes
6. **Historique de Navigation** - Voir les produits récemment consultés
7. **Recommandations** - Produits suggérés basés sur l'historique


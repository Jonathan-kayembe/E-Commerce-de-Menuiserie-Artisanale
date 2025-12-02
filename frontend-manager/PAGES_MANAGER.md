# 📋 Pages Disponibles pour le Manager

## 🔐 Pages d'Authentification (Publiques)

### 1. **Page de Connexion**
- **Route** : `/login`
- **Fichier** : `src/pages/Login.jsx`
- **Description** : Permet au manager de se connecter avec son email et mot de passe
- **Fonctionnalités** :
  - Formulaire de connexion avec validation
  - Vérification du rôle manager
  - Lien vers la page d'inscription
  - Redirection vers `/dashboard` après connexion réussie

### 2. **Page d'Inscription**
- **Route** : `/register`
- **Fichier** : `src/pages/Register.jsx`
- **Description** : Permet de créer un nouveau compte manager
- **Fonctionnalités** :
  - Formulaire d'inscription (nom, email, mot de passe, confirmation)
  - Création automatique avec le rôle "manager"
  - Lien vers la page de connexion
  - Redirection vers `/dashboard` après inscription réussie

---

## 🏠 Pages Protégées (Nécessitent une authentification)

Toutes les pages ci-dessous sont protégées par le `ProtectedRoute` et nécessitent :
- ✅ Être connecté
- ✅ Avoir le rôle "manager"

### 3. **Dashboard (Tableau de bord)**
- **Route** : `/dashboard`
- **Fichier** : `src/pages/Dashboard.jsx`
- **Description** : Page d'accueil du manager avec vue d'ensemble
- **Fonctionnalités** :
  - Statistiques générales (ventes, produits, commandes, utilisateurs)
  - Graphiques et indicateurs de performance
  - Vue d'ensemble rapide de l'activité

### 4. **Liste des Produits**
- **Route** : `/products`
- **Fichier** : `src/pages/Products.jsx`
- **Description** : Gestion complète des produits
- **Fonctionnalités** :
  - Liste de tous les produits
  - Recherche et filtres
  - Actions : Voir, Modifier, Supprimer
  - Bouton pour créer un nouveau produit

### 5. **Création de Produit**
- **Route** : `/products/create`
- **Fichier** : `src/pages/ProductCreate.jsx`
- **Description** : Formulaire pour créer un nouveau produit
- **Fonctionnalités** :
  - Formulaire complet (nom, description, prix, stock, catégorie, etc.)
  - Upload d'images
  - Validation des données
  - Redirection vers la liste après création

### 6. **Modification de Produit**
- **Route** : `/products/:id/edit`
- **Fichier** : `src/pages/ProductEdit.jsx`
- **Description** : Formulaire pour modifier un produit existant
- **Fonctionnalités** :
  - Pré-remplissage avec les données actuelles
  - Modification de tous les champs
  - Validation des données
  - Redirection vers la liste après modification

### 7. **Gestion des Catégories**
- **Route** : `/categories`
- **Fichier** : `src/pages/Categories.jsx`
- **Description** : Gestion des catégories de produits
- **Fonctionnalités** :
  - Liste de toutes les catégories
  - Création, modification, suppression
  - Gestion des catégories actives/inactives

### 8. **Liste des Commandes**
- **Route** : `/orders`
- **Fichier** : `src/pages/Orders.jsx`
- **Description** : Vue d'ensemble de toutes les commandes
- **Fonctionnalités** :
  - Liste de toutes les commandes
  - Filtres par statut (en attente, en cours, livrée, annulée)
  - Recherche par client ou numéro de commande
  - Actions : Voir détails, Modifier statut

### 9. **Détail d'une Commande**
- **Route** : `/orders/:id`
- **Fichier** : `src/pages/OrderDetail.jsx`
- **Description** : Détails complets d'une commande
- **Fonctionnalités** :
  - Informations client
  - Liste des articles commandés
  - Statut de la commande
  - Modification du statut
  - Informations de livraison et paiement

### 10. **Gestion des Utilisateurs**
- **Route** : `/users`
- **Fichier** : `src/pages/Users.jsx`
- **Description** : Gestion de tous les utilisateurs (clients et managers)
- **Fonctionnalités** :
  - Liste de tous les utilisateurs
  - Filtres par rôle (client, manager)
  - Recherche par nom ou email
  - Actions : Voir profil, Modifier, Désactiver/Activer

### 11. **Page 404 (Non trouvée)**
- **Route** : `*` (toutes les routes non définies)
- **Fichier** : `src/pages/NotFound.jsx`
- **Description** : Page affichée quand une route n'existe pas
- **Fonctionnalités** :
  - Message d'erreur
  - Lien pour retourner au dashboard

---

## 📊 Pages Mentionnées dans la Sidebar (Non encore créées)

### 12. **Statistiques**
- **Route** : `/stats` (mentionnée dans la sidebar mais pas encore créée)
- **Description** : Page de statistiques avancées
- **Fonctionnalités suggérées** :
  - Graphiques de ventes
  - Analyse des produits les plus vendus
  - Statistiques par période
  - Rapports détaillés

---

## 🗺️ Structure de Navigation

```
Manager Frontend
│
├── 🔓 Pages Publiques
│   ├── /login          → Connexion
│   └── /register       → Inscription
│
└── 🔒 Pages Protégées (ManagerLayout)
    ├── /dashboard              → Tableau de bord
    ├── /products               → Liste des produits
    ├── /products/create        → Créer un produit
    ├── /products/:id/edit      → Modifier un produit
    ├── /categories             → Gestion des catégories
    ├── /orders                 → Liste des commandes
    ├── /orders/:id             → Détail d'une commande
    ├── /users                  → Gestion des utilisateurs
    └── /stats                  → Statistiques (à créer)
```

---

## ✅ Pages Actuellement Implémentées

1. ✅ Login
2. ✅ Register
3. ✅ Dashboard
4. ✅ Products (liste)
5. ✅ ProductCreate
6. ✅ ProductEdit
7. ✅ Categories
8. ✅ Orders (liste)
9. ✅ OrderDetail
10. ✅ Users
11. ✅ NotFound

---

## ⚠️ Pages à Créer

1. ❌ **Statistiques** (`/stats`) - Mentionnée dans la sidebar mais pas encore créée

---

## 🔗 Liens Utiles

- **URL Base** : `http://localhost:3003`
- **Dashboard** : `http://localhost:3003/dashboard`
- **Produits** : `http://localhost:3003/products`
- **Commandes** : `http://localhost:3003/orders`
- **Utilisateurs** : `http://localhost:3003/users`

---

## 📝 Notes

- Toutes les pages protégées nécessitent une authentification avec le rôle "manager"
- La redirection automatique se fait vers `/dashboard` après connexion/inscription
- Le token est stocké dans `localStorage` avec la clé `manager_token`
- La sidebar affiche toutes les pages principales avec navigation active


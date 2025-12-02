# 📦 Guide d'Installation - Frontend Manager React

## Prérequis

- Node.js 18+ et npm
- Backend Laravel en cours d'exécution sur `http://localhost:8000`

## Installation

### 1. Installer les dépendances

```bash
cd frontend-manager
npm install
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine de `frontend-manager/` :

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Menuiserie Artisanale - Manager
VITE_FRONTEND_CLIENT_URL=http://localhost:3002
```

### 3. Démarrer le serveur de développement

```bash
npm run dev
```

Le frontend manager sera accessible sur `http://localhost:3003`

## Structure créée

✅ Configuration Vite + React
✅ Tailwind CSS configuré avec thème admin
✅ Services API (products, categories, orders, users, dashboard)
✅ Contexte Auth avec vérification rôle manager
✅ Layout avec Sidebar et Header
✅ Pages principales (Dashboard, Products, Categories, Orders, Users)
✅ Composants réutilisables (Tables, Forms, Cards)
✅ Routing configuré avec protection
✅ Validation des formulaires (React Hook Form + Yup)

## Fonctionnalités implémentées

- ✅ Authentification manager uniquement
- ✅ Dashboard avec statistiques
- ✅ Gestion complète des produits (CRUD)
- ✅ Gestion des catégories (CRUD)
- ✅ Gestion des commandes (liste, détail, mise à jour statut)
- ✅ Page utilisateurs (structure prête)
- ✅ Design responsive avec Tailwind CSS

## Notes importantes

- Le port par défaut est **3003** (différent du frontend client sur 3002)
- Toutes les routes sont protégées et vérifient le rôle `manager`
- Le token est stocké dans `localStorage` avec la clé `manager_token`
- Les erreurs 401/403 redirigent automatiquement vers `/login`

## Prochaines étapes

Pour compléter le frontend manager selon le prompt, il reste à créer :

1. **Composants Dashboard avancés :**
   - SalesChart (graphiques avec Recharts)
   - TopProducts (liste des meilleurs produits)
   - TopCustomers (meilleurs clients)
   - RecentOrders (commandes récentes)
   - StockAlerts (alertes stock bas)

2. **Fonctionnalités avancées :**
   - Graphiques de statistiques
   - Export de rapports (PDF/Excel)
   - Notifications en temps réel
   - Gestion avancée des utilisateurs
   - Filtres avancés sur les commandes

3. **Améliorations UI :**
   - Modals pour confirmations
   - Pagination complète
   - Tri et filtres avancés
   - Thème sombre/clair (optionnel)


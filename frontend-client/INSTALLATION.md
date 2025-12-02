# 📦 Guide d'Installation - Frontend React

## Prérequis

- Node.js 18+ et npm
- Backend Laravel en cours d'exécution sur `http://localhost:8000`

## Installation

### 1. Installer les dépendances

```bash
cd frontend-client
npm install
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine de `frontend-client/` :

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Menuiserie Artisanale
```

### 3. Démarrer le serveur de développement

```bash
npm run dev
```

Le frontend sera accessible sur `http://localhost:3002`

## Structure créée

✅ Configuration Vite + React
✅ Tailwind CSS configuré
✅ Services API (products, cart, orders, addresses, reviews)
✅ Contextes (Auth, Cart)
✅ Pages principales (Home, Products, ProductDetail, Cart, Login, Register)
✅ Composants communs (Header, Footer, Loading, Button, Input)
✅ Routing configuré
✅ Validation des formulaires (React Hook Form + Yup)

## Prochaines étapes

Pour compléter le frontend selon le prompt, il reste à créer :

1. **Pages supplémentaires :**
   - Checkout
   - Orders / OrderDetail
   - Profile
   - Addresses

2. **Composants supplémentaires :**
   - CartItem
   - CartSummary
   - ProductFilters
   - ReviewForm / ReviewList
   - AddressForm / AddressList

3. **Fonctionnalités :**
   - Authentification complète (backend)
   - Gestion des commandes
   - Système de paiement (simulation)
   - Gestion des adresses
   - Système d'avis complet

## Notes importantes

- L'authentification utilise localStorage pour le token (à adapter selon votre backend)
- Les appels API sont configurés pour se connecter au backend Laravel
- Le design est responsive avec Tailwind CSS
- Les notifications utilisent React Toastify


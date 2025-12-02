# Frontend Client - E-Commerce Menuiserie

Frontend React pour l'e-commerce de menuiserie artisanale.

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build
```

## 📋 Configuration

Créez un fichier `.env` à la racine du projet :

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Menuiserie Artisanale
```

## 🏗️ Structure du Projet

```
frontend-client/
├── src/
│   ├── api/          # Services API
│   ├── components/   # Composants React
│   ├── context/      # Contextes (Auth, Cart)
│   ├── pages/        # Pages principales
│   ├── utils/        # Utilitaires
│   └── styles/       # Styles CSS
```

## 🔌 Connexion Backend

Le frontend se connecte au backend Laravel via l'API REST configurée dans `src/api/axios.js`.

## 📝 Fonctionnalités

- ✅ Authentification (Login/Register)
- ✅ Catalogue produits
- ✅ Détail produit
- ✅ Panier d'achat
- ✅ Design responsive avec Tailwind CSS

## 🎨 Technologies

- React 18
- React Router v6
- Axios
- React Hook Form + Yup
- Tailwind CSS
- React Icons
- React Toastify


# E-Commerce Menuisier

Application e-commerce complète pour une entreprise de menuiserie, développée avec Laravel (backend) et React (frontend).

## 📋 Description

Ce projet est une plateforme e-commerce permettant aux clients de parcourir et commander des produits de menuiserie, et aux managers d'administrer le catalogue, les commandes et les utilisateurs.

## 🏗️ Architecture

Le projet est composé de trois parties principales :

- **Backend** : API REST développée avec Laravel 11
- **Frontend Client** : Interface utilisateur React pour les clients
- **Frontend Manager** : Interface d'administration React pour les managers

## 🚀 Technologies utilisées

### Backend
- Laravel 11
- PHP 8.2+
- MySQL/MariaDB
- PDO pour l'accès à la base de données

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS
- Axios
- React Hook Form
- React Toastify

## 📁 Structure du projet

```
E-Commerce-menuisier/
├── Backend/              # API Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   └── Middleware/
│   │   └── Repositories/
│   ├── database/
│   ├── routes/
│   └── public/
├── frontend-client/      # Application React pour les clients
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── utils/
└── frontend-manager/     # Application React pour les managers
    └── src/
        ├── api/
        ├── components/
        ├── context/
        ├── pages/
        └── utils/
```

## 🔧 Installation

### Prérequis
- PHP 8.2 ou supérieur
- Composer
- Node.js 18+ et npm
- MySQL/MariaDB

### Backend

1. Naviguez vers le dossier Backend :
```bash
cd Backend
```

2. Installez les dépendances PHP :
```bash
composer install
```

3. Copiez le fichier `.env.example` vers `.env` et configurez votre base de données :
```bash
cp .env.example .env
php artisan key:generate
```

4. Configurez votre base de données dans le fichier `.env` :
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=e-commerce_db
DB_USERNAME=root
DB_PASSWORD=
```

5. Importez la base de données :
   - Créez la base de données `e-commerce_db`
   - Exécutez le script SQL : `Backend/database/FIX_DATABASE_COMPLETE.sql`

6. Démarrez le serveur Laravel :
```bash
php artisan serve
```

Le backend sera accessible sur `http://localhost:8000`

### Frontend Client

1. Naviguez vers le dossier frontend-client :
```bash
cd frontend-client
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` avec :
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

4. Démarrez le serveur de développement :
```bash
npm run dev
```

### Frontend Manager

1. Naviguez vers le dossier frontend-manager :
```bash
cd frontend-manager
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` avec :
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

4. Démarrez le serveur de développement :
```bash
npm run dev
```

## 👤 Comptes par défaut

### Manager
- Email : `manager@menuiserie.com`
- Mot de passe : (à définir après la création de la base de données)

Pour créer un compte manager, utilisez la page d'inscription du frontend manager.

## 🔐 Authentification

L'application utilise un système d'authentification basé sur des tokens API stockés dans la base de données. Les tokens sont gérés automatiquement lors de la connexion et de la déconnexion.

## 📝 Fonctionnalités

### Pour les clients
- Parcourir le catalogue de produits
- Ajouter des produits au panier
- Passer des commandes
- Consulter l'historique des commandes
- Gérer son profil

### Pour les managers
- Gérer le catalogue de produits (CRUD)
- Gérer les catégories
- Gérer les commandes
- Gérer les utilisateurs
- Consulter les statistiques

## 📄 Licence

Ce projet est développé dans le cadre d'un projet académique.

## 👨‍💻 Auteur

Développé dans le cadre du cours "Analyse et conception de systèmes" - UA3


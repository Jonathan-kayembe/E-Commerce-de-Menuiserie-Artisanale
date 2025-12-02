# 🛒 E-Commerce Menuisier

> Application e-commerce complète pour une entreprise de menuiserie artisanale, développée avec **Laravel 11** (backend API REST) et **React 18** (frontend moderne).

[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=flat&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat&logo=php&logoColor=white)](https://php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)](https://mysql.com)

## 📋 Description

Plateforme e-commerce complète avec deux interfaces distinctes :
- **Interface Client** : Parcours de catalogue, panier, commandes, gestion de profil
- **Interface Manager** : Administration complète (produits, catégories, commandes, utilisateurs, statistiques)

### ✨ Points forts du projet

- 🔐 **Authentification sécurisée** : Système de tokens API avec expiration
- 🛒 **Gestion de panier** : Synchronisation client/serveur pour utilisateurs authentifiés
- 📦 **Gestion de commandes** : Workflow complet de commande à livraison
- 🖼️ **Upload d'images** : Gestion des images produits avec validation
- 📊 **Dashboard administrateur** : Statistiques et gestion complète
- 🎨 **Interface moderne** : Design responsive avec Tailwind CSS

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

## 📝 Fonctionnalités détaillées

### 👥 Interface Client
- ✅ **Catalogue produits** : Affichage avec filtres par catégorie, recherche
- ✅ **Détails produits** : Galerie d'images, informations complètes
- ✅ **Panier** : Ajout, modification, suppression d'articles
- ✅ **Commande** : Processus de commande complet avec validation
- ✅ **Historique** : Consultation des commandes passées
- ✅ **Profil utilisateur** : Gestion des informations personnelles

### 👨‍💼 Interface Manager
- ✅ **Gestion produits** : CRUD complet avec upload d'images
- ✅ **Gestion catégories** : Création et modification des catégories
- ✅ **Gestion commandes** : Suivi des statuts (préparation, payée, expédiée, livrée)
- ✅ **Gestion utilisateurs** : Liste et gestion des comptes clients/managers
- ✅ **Statistiques** : Tableaux de bord avec métriques clés

## 🏗️ Architecture technique

### Backend (Laravel)
- **Architecture** : API REST avec pattern Repository
- **Authentification** : Tokens API personnalisés (table `api_tokens`)
- **Base de données** : MySQL avec relations et contraintes FK
- **Sécurité** : Middleware d'authentification, validation des requêtes, rate limiting
- **Upload** : Gestion sécurisée des fichiers images

### Frontend (React)
- **State Management** : Context API (AuthContext, CartContext)
- **Routing** : React Router avec routes protégées
- **Formulaires** : React Hook Form avec validation Yup
- **HTTP Client** : Axios avec intercepteurs pour tokens
- **UI** : Tailwind CSS avec composants réutilisables

## 🔒 Sécurité

- ✅ Tokens API avec expiration automatique
- ✅ Validation des données côté serveur
- ✅ Protection CSRF
- ✅ Rate limiting sur les routes sensibles
- ✅ Hashage des mots de passe (bcrypt)
- ✅ Fichiers `.env` exclus du versioning

## 📸 Captures d'écran

> *Ajoutez ici des captures d'écran de votre application pour rendre le README plus attractif*

## 🚀 Déploiement

### Prérequis
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+

### Installation rapide
Voir la section [Installation](#-installation) ci-dessus pour les instructions détaillées.

## 📚 Structure du code

Le projet suit les bonnes pratiques :
- **Backend** : Architecture MVC avec pattern Repository
- **Frontend** : Composants modulaires et réutilisables
- **API** : Endpoints RESTful bien structurés
- **Base de données** : Schéma normalisé avec relations

## 🛠️ Technologies & Outils

| Catégorie | Technologies |
|----------|------------|
| **Backend** | Laravel 11, PHP 8.2+, PDO, MySQL |
| **Frontend** | React 18, Vite, React Router |
| **Styling** | Tailwind CSS |
| **Validation** | React Hook Form, Yup |
| **HTTP** | Axios |
| **Notifications** | React Toastify |
| **Date** | date-fns |

## 📄 Licence

Ce projet est développé dans le cadre d'un projet académique.

## 👨‍💻 Auteur

**Jonathan Kayembe**

Développé dans le cadre du cours "Analyse et conception de systèmes" - UA3

---

⭐ Si ce projet vous a plu, n'hésitez pas à laisser une étoile !


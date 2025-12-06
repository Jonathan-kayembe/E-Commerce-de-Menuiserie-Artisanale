# 🛒 E-Commerce Menuisier

> Application e-commerce complète pour une entreprise de menuiserie artisanale, développée avec **Laravel 11** (backend API REST) et **React 18** (frontend moderne).

[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat-square&logo=php&logoColor=white)](https://php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://mysql.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Academic-blue?style=flat-square)](LICENSE)

---

## 📋 Table des matières

- [Description](#-description)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#️-architecture)
- [Technologies](#-technologies-utilisées)
- [Structure du projet](#-structure-du-projet)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [API Documentation](#-api-documentation)
- [Sécurité](#-sécurité)
- [Développement](#-développement)
- [Auteur](#-auteur)

---

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
- 🌐 **API RESTful** : Architecture API bien structurée et documentée
- 🔒 **Sécurité renforcée** : Rate limiting, validation, protection CSRF

---

## 🏗️ Architecture

Le projet est composé de trois parties principales :

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND CLIENT                      │
│  React 18 + Vite + Tailwind CSS + React Router          │
│  - Catalogue produits                                   │
│  - Panier et commandes                                  │
│  - Profil utilisateur                                  │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/REST
┌──────────────────▼──────────────────────────────────────┐
│              BACKEND API (Laravel 11)                    │
│  - Contrôleurs RESTful                                   │
│  - Pattern Repository                                    │
│  - Middleware d'authentification                         │
│  - Validation et sécurité                                │
└──────────────────┬──────────────────────────────────────┘
                   │ PDO
┌──────────────────▼──────────────────────────────────────┐
│              BASE DE DONNÉES (MySQL)                     │
│  - Tables normalisées                                   │
│  - Relations et contraintes FK                           │
│  - Tokens API                                           │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND MANAGER                       │
│  React 18 + Vite + Tailwind CSS + React Router          │
│  - Gestion produits                                     │
│  - Gestion commandes                                    │
│  - Dashboard statistiques                               │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Technologies utilisées

### Backend

| Technologie | Version | Usage |
|------------|---------|-------|
| **Laravel** | 11.x | Framework PHP pour l'API REST |
| **PHP** | 8.2+ | Langage de programmation |
| **MySQL/MariaDB** | 8.0+ | Base de données relationnelle |
| **PDO** | - | Accès à la base de données |
| **Composer** | Latest | Gestionnaire de dépendances PHP |

### Frontend

| Technologie | Version | Usage |
|------------|---------|-------|
| **React** | 18.2.0 | Bibliothèque UI |
| **Vite** | 5.0.8 | Build tool et dev server |
| **React Router** | 6.20.0 | Routing côté client |
| **Tailwind CSS** | 3.3.6 | Framework CSS utility-first |
| **Axios** | 1.6.2 | Client HTTP |
| **React Hook Form** | 7.48.2 | Gestion de formulaires |
| **Yup** | 1.3.3 | Validation de schémas |
| **React Toastify** | 9.1.3 | Notifications toast |
| **date-fns** | 2.30.0 | Manipulation de dates |
| **React Icons** | 4.12.0 | Bibliothèque d'icônes |

---

## 📁 Structure du projet

```
E-Commerce-menuisier/
│
├── 📂 Backend/                    # API Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/       # 13 contrôleurs RESTful
│   │   │   └── Middleware/        # Authentification API
│   │   ├── Models/                # Modèles Eloquent
│   │   └── Repositories/          # Pattern Repository (20 interfaces/implémentations)
│   ├── database/
│   │   ├── migrations/            # Migrations Laravel
│   │   └── *.sql                  # Scripts SQL de configuration
│   ├── routes/
│   │   └── api.php                # Routes API REST
│   ├── public/
│   │   └── images/products/       # Images produits stockées
│   └── config/                    # Configuration Laravel
│
├── 📂 frontend-client/            # Application React pour les clients
│   ├── src/
│   │   ├── api/                   # Services API (8 fichiers)
│   │   ├── components/            # Composants réutilisables (15 fichiers)
│   │   ├── context/              # Context API (Auth, Cart)
│   │   ├── pages/                 # Pages de l'application (17 fichiers)
│   │   └── utils/                 # Utilitaires (5 fichiers)
│   ├── package.json
│   └── vite.config.js
│
└── 📂 frontend-manager/           # Application React pour les managers
    ├── src/
    │   ├── api/                   # Services API (8 fichiers)
    │   ├── components/            # Composants réutilisables (14 fichiers)
    │   ├── context/               # Context API (Auth)
    │   ├── pages/                 # Pages de l'application (12 fichiers)
    │   └── utils/                 # Utilitaires (4 fichiers)
    ├── package.json
    └── vite.config.js
```

---

## 🔧 Installation

### Prérequis

Assurez-vous d'avoir installé :

- **PHP** 8.2 ou supérieur
- **Composer** (gestionnaire de dépendances PHP)
- **Node.js** 18+ et **npm**
- **MySQL/MariaDB** 8.0+
- **Git** (pour cloner le projet)

### Étape 1 : Cloner le projet

```bash
git clone https://github.com/Jonathan-kayembe/E-Commerce-de-Menuiserie-Artisanale.git
cd E-Commerce-menuisier
```

### Étape 2 : Configuration du Backend

1. **Naviguez vers le dossier Backend** :
```bash
cd Backend
```

2. **Installez les dépendances PHP** :
```bash
composer install
```

3. **Configurez l'environnement** :
```bash
cp .env.example .env
php artisan key:generate
```

4. **Configurez la base de données** dans `.env` :
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=e-commerce_db
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
```

5. **Créez la base de données** :
```sql
CREATE DATABASE e-commerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

6. **Importez le schéma de base de données** :
   - Exécutez le script SQL : `Backend/database/FIX_DATABASE_COMPLETE.sql`
   - Ou utilisez les migrations Laravel : `php artisan migrate`

7. **Démarrez le serveur Laravel** :
```bash
php artisan serve
```

Le backend sera accessible sur `http://localhost:8000`

### Étape 3 : Configuration du Frontend Client

1. **Naviguez vers le dossier frontend-client** :
```bash
cd frontend-client
```

2. **Installez les dépendances** :
```bash
npm install
```

3. **Créez un fichier `.env`** :
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

4. **Démarrez le serveur de développement** :
```bash
npm run dev
```

Le frontend client sera accessible sur `http://localhost:5173` (ou un autre port)

### Étape 4 : Configuration du Frontend Manager

1. **Naviguez vers le dossier frontend-manager** :
```bash
cd frontend-manager
```

2. **Installez les dépendances** :
```bash
npm install
```

3. **Créez un fichier `.env`** :
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

4. **Démarrez le serveur de développement** :
```bash
npm run dev
```

Le frontend manager sera accessible sur `http://localhost:5174` (ou un autre port)

---

## ⚙️ Configuration

### Variables d'environnement Backend

Fichier : `Backend/.env`

```env
APP_NAME="E-Commerce Menuisier"
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_TIMEZONE=UTC
APP_LOCALE=fr
APP_FALLBACK_LOCALE=fr

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=e-commerce_db
DB_USERNAME=root
DB_PASSWORD=

CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
```

### Variables d'environnement Frontend

Fichier : `frontend-client/.env` et `frontend-manager/.env`

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 👤 Comptes par défaut

### Manager

Pour créer un compte manager :

1. Accédez à l'interface manager : `http://localhost:5174`
2. Cliquez sur "S'inscrire" ou "Register"
3. Remplissez le formulaire avec :
   - Email : `manager@menuiserie.com` (ou un autre email)
   - Mot de passe : (votre choix)
   - Le rôle `manager` est automatiquement assigné

### Client

Les clients peuvent s'inscrire via l'interface client à `http://localhost:5173`

---

## 🔐 Authentification

L'application utilise un système d'authentification basé sur des **tokens API** stockés dans la base de données.

### Fonctionnement

1. **Connexion** : L'utilisateur se connecte avec email/mot de passe
2. **Génération de token** : Un token unique est généré et stocké dans `api_tokens`
3. **Utilisation** : Le token est envoyé dans le header `Authorization: Bearer {token}` pour chaque requête
4. **Expiration** : Les tokens peuvent avoir une date d'expiration (optionnel)
5. **Déconnexion** : Le token est supprimé de la base de données

### Exemple d'utilisation

```javascript
// Frontend - Requête authentifiée
axios.get('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

---

## 📝 Fonctionnalités détaillées

### 👥 Interface Client

| Fonctionnalité | Description | Statut |
|---------------|-------------|--------|
| **Catalogue produits** | Affichage avec filtres par catégorie, recherche | ✅ |
| **Détails produits** | Galerie d'images, informations complètes | ✅ |
| **Panier** | Ajout, modification, suppression d'articles | ✅ |
| **Commande** | Processus de commande complet avec validation | ✅ |
| **Historique** | Consultation des commandes passées | ✅ |
| **Profil utilisateur** | Gestion des informations personnelles | ✅ |
| **Authentification** | Inscription, connexion, déconnexion | ✅ |

### 👨‍💼 Interface Manager

| Fonctionnalité | Description | Statut |
|---------------|-------------|--------|
| **Gestion produits** | CRUD complet avec upload d'images | ✅ |
| **Gestion catégories** | Création et modification des catégories | ✅ |
| **Gestion commandes** | Suivi des statuts (préparation, payée, expédiée, livrée) | ✅ |
| **Gestion utilisateurs** | Liste et gestion des comptes clients/managers | ✅ |
| **Statistiques** | Tableaux de bord avec métriques clés | ✅ |
| **Upload d'images** | Gestion sécurisée des images produits | ✅ |

---

## 📡 API Documentation

### Base URL

```
http://localhost:8000/api
```

### Authentification

Toutes les routes protégées nécessitent un header d'authentification :

```
Authorization: Bearer {token}
```

### Endpoints principaux

#### 🔐 Authentification

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `POST` | `/auth/register` | Inscription utilisateur | ❌ |
| `POST` | `/auth/login` | Connexion utilisateur | ❌ |
| `POST` | `/auth/logout` | Déconnexion utilisateur | ✅ |
| `GET` | `/auth/me` | Informations utilisateur connecté | ✅ |

#### 📦 Produits

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `GET` | `/products` | Liste tous les produits | ❌ |
| `GET` | `/products/{id}` | Détails d'un produit | ❌ |
| `POST` | `/products` | Créer un produit | ✅ (Manager) |
| `PUT` | `/products/{id}` | Modifier un produit | ✅ (Manager) |
| `DELETE` | `/products/{id}` | Supprimer un produit | ✅ (Manager) |

#### 🛒 Panier

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `GET` | `/carts/user/{userId}` | Récupérer le panier d'un utilisateur | ✅ |
| `POST` | `/carts` | Créer un panier | ✅ |
| `DELETE` | `/carts/{id}` | Vider le panier | ✅ |
| `GET` | `/cart-items/cart/{cartId}` | Articles du panier | ✅ |
| `POST` | `/cart-items` | Ajouter un article au panier | ✅ |
| `PUT` | `/cart-items/{id}` | Modifier quantité | ✅ |
| `DELETE` | `/cart-items/{id}` | Supprimer un article | ✅ |

#### 📋 Commandes

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `GET` | `/orders` | Liste des commandes | ✅ |
| `GET` | `/orders/{id}` | Détails d'une commande | ✅ |
| `POST` | `/orders` | Créer une commande | ✅ |
| `PUT` | `/orders/{id}` | Modifier une commande | ✅ |
| `DELETE` | `/orders/{id}` | Supprimer une commande | ✅ |
| `GET` | `/orders/user/{userId}` | Commandes d'un utilisateur | ✅ |

#### 🏷️ Catégories

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `GET` | `/categories` | Liste toutes les catégories | ❌ |
| `GET` | `/categories/{id}` | Détails d'une catégorie | ❌ |
| `POST` | `/categories` | Créer une catégorie | ✅ (Manager) |
| `PUT` | `/categories/{id}` | Modifier une catégorie | ✅ (Manager) |
| `DELETE` | `/categories/{id}` | Supprimer une catégorie | ✅ (Manager) |

#### 👤 Utilisateurs

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `GET` | `/users` | Liste des utilisateurs | ✅ (Manager) |
| `GET` | `/users/{id}` | Détails d'un utilisateur | ✅ |
| `PUT` | `/users/{id}` | Modifier un utilisateur | ✅ |
| `DELETE` | `/users/{id}` | Supprimer un utilisateur | ✅ (Manager) |

#### 🖼️ Images

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `POST` | `/images/upload` | Upload une image produit | ✅ (Manager) |
| `DELETE` | `/images/delete` | Supprimer une image | ✅ (Manager) |

### Exemples de requêtes

#### Connexion

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "password": "password123"
  }'
```

#### Récupérer les produits

```bash
curl http://localhost:8000/api/products
```

#### Ajouter au panier (authentifié)

```bash
curl -X POST http://localhost:8000/api/cart-items \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "cart_id": 1,
    "product_id": 5,
    "quantity": 2
  }'
```

---

## 🏗️ Architecture technique

### Backend (Laravel)

- **Architecture** : API REST avec pattern Repository
- **Authentification** : Tokens API personnalisés (table `api_tokens`)
- **Base de données** : MySQL avec relations et contraintes FK
- **Sécurité** : 
  - Middleware d'authentification
  - Validation des requêtes
  - Rate limiting (10 tentatives/min par IP, 5/min par email)
  - Protection CSRF
- **Upload** : Gestion sécurisée des fichiers images dans `public/images/products/`

### Frontend (React)

- **State Management** : Context API (AuthContext, CartContext)
- **Routing** : React Router avec routes protégées
- **Formulaires** : React Hook Form avec validation Yup
- **HTTP Client** : Axios avec intercepteurs pour tokens
- **UI** : Tailwind CSS avec composants réutilisables
- **Build** : Vite pour le développement et la production

### Base de données

- **Schéma** : Normalisé avec relations
- **Tables principales** :
  - `users` : Utilisateurs (clients et managers)
  - `api_tokens` : Tokens d'authentification
  - `products` : Produits
  - `categories` : Catégories
  - `carts` : Paniers
  - `cart_items` : Articles du panier
  - `orders` : Commandes
  - `order_items` : Articles de commande
  - `payments` : Paiements
  - `addresses` : Adresses
  - `reviews` : Avis clients

---

## 🔒 Sécurité

### Mesures implémentées

- ✅ **Tokens API avec expiration automatique**
- ✅ **Validation des données côté serveur** (Laravel Validation)
- ✅ **Protection CSRF** (Laravel)
- ✅ **Rate limiting** sur les routes sensibles :
  - Authentification : 10 tentatives/min par IP
  - Par email : 5 tentatives/min
- ✅ **Hashage des mots de passe** (bcrypt)
- ✅ **Fichiers `.env` exclus du versioning** (`.gitignore`)
- ✅ **Middleware d'authentification** sur toutes les routes protégées
- ✅ **Validation des rôles** (client vs manager)
- ✅ **Sanitization des inputs** (Laravel)

### Bonnes pratiques

- Les mots de passe ne sont jamais stockés en clair
- Les tokens sont uniques et non prédictibles
- Les erreurs ne révèlent pas d'informations sensibles
- Les uploads d'images sont validés (type, taille)

---

## 🛠️ Développement

### Commandes utiles

#### Backend

```bash
# Démarrer le serveur
php artisan serve

# Créer une migration
php artisan make:migration create_table_name

# Exécuter les migrations
php artisan migrate

# Créer un contrôleur
php artisan make:controller NomController

# Vider le cache
php artisan cache:clear
php artisan config:clear
```

#### Frontend

```bash
# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build
npm run preview
```

### Structure des composants

Les composants React suivent une structure modulaire :

```
components/
├── products/
│   ├── ProductCard.jsx
│   ├── ProductGallery.jsx
│   └── ProductList.jsx
├── cart/
│   ├── CartItem.jsx
│   └── CartSummary.jsx
└── common/
    ├── Header.jsx
    ├── Footer.jsx
    └── Loading.jsx
```

---

## 📸 Captures d'écran

> *Ajoutez ici des captures d'écran de votre application pour rendre le README plus attractif*

### Interface Client
- Page d'accueil avec catalogue
- Détails produit
- Panier
- Processus de commande

### Interface Manager
- Dashboard statistiques
- Gestion produits
- Gestion commandes
- Upload d'images

---

## 🚀 Déploiement

### Prérequis de production

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- Serveur web (Apache/Nginx)

### Étapes de déploiement

1. **Cloner le projet** sur le serveur
2. **Installer les dépendances** :
   ```bash
   composer install --optimize-autoloader --no-dev
   npm install
   npm run build
   ```
3. **Configurer l'environnement** :
   - Créer le fichier `.env` avec les variables de production
   - Générer la clé d'application : `php artisan key:generate`
4. **Configurer la base de données** :
   - Créer la base de données
   - Exécuter les migrations : `php artisan migrate --force`
5. **Configurer le serveur web** :
   - Pointer vers `Backend/public`
   - Configurer les URLs des frontends
6. **Optimiser** :
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

---

## 📚 Ressources et documentation

### Documentation officielle

- [Laravel 11 Documentation](https://laravel.com/docs/11.x)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)

### Technologies clés

- **Laravel** : Framework PHP moderne et élégant
- **React** : Bibliothèque JavaScript pour construire des interfaces utilisateur
- **Tailwind CSS** : Framework CSS utility-first
- **Vite** : Build tool rapide pour le développement frontend

---

## 🐛 Dépannage

### Problèmes courants

#### Backend ne démarre pas

- Vérifiez que PHP 8.2+ est installé : `php -v`
- Vérifiez que Composer est installé : `composer --version`
- Vérifiez les permissions sur `storage/` et `bootstrap/cache/`

#### Frontend ne se connecte pas à l'API

- Vérifiez que `VITE_API_BASE_URL` est correctement configuré
- Vérifiez que le backend est démarré sur le bon port
- Vérifiez les CORS dans `Backend/config/cors.php`

#### Erreurs de base de données

- Vérifiez les credentials dans `.env`
- Vérifiez que la base de données existe
- Exécutez les migrations : `php artisan migrate`

#### Images ne s'affichent pas

- Vérifiez que les images sont dans `Backend/public/images/products/`
- Vérifiez les permissions du dossier
- Vérifiez que l'URL de l'image est correcte dans la base de données

---

## 📄 Licence

Ce projet est développé dans le cadre d'un projet académique.

---

## 👨‍💻 Auteur

**Jonathan Kayembe**

- 📧 Email : [Votre email]
- 🔗 GitHub : [@Jonathan-kayembe](https://github.com/Jonathan-kayembe)
- 💼 LinkedIn : [Votre LinkedIn]

Développé dans le cadre du cours **"Analyse et conception de systèmes"** - UA3

---

## 🙏 Remerciements

- Équipe pédagogique du cours "Analyse et conception de systèmes"
- Communauté Laravel et React pour leurs excellentes documentations

---

## ⭐ Contribution

Ce projet est un projet académique. Les contributions sont les bienvenues pour améliorer le code, corriger des bugs ou ajouter des fonctionnalités.

---

<div align="center">

**⭐ Si ce projet vous a plu, n'hésitez pas à laisser une étoile !**

Made with ❤️ by Jonathan Kayembe

</div>

# 📚 Documentation Complète du Backend

## 🏗️ Architecture Générale

### Framework
- **Framework** : Laravel 12.0
- **Langage** : PHP 8.2+
- **Base de données** : MySQL/MariaDB
- **Architecture** : API REST avec pattern Repository

### Structure du Projet

```
Backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/      # 12 contrôleurs
│   │   └── Middleware/       # Authentification API
│   ├── Models/              # Modèles Eloquent
│   └── Repositories/        # Pattern Repository (interfaces + implémentations PDO)
├── config/                   # Configuration Laravel
├── database/
│   ├── E-commerce_db.sql    # Schéma SQL complet
│   └── migrations/           # Migrations Laravel
├── routes/
│   └── api.php              # Toutes les routes API
└── bootstrap/
    └── app.php              # Configuration de l'application
```

---

## 🗄️ Base de Données

### Nom de la Base
- **Nom** : `e-commerce_db`
- **Charset** : `utf8mb4`
- **Collation** : `utf8mb4_unicode_ci`

### Tables (11 tables)

1. **users** - Utilisateurs
   - Champs : `id`, `full_name`, `email`, `password`, `role` (client/manager), `is_active`
   - Rôles : `client`, `manager`

2. **categories** - Catégories de produits
   - Champs : `id`, `name`, `description`, `slug`

3. **products** - Produits
   - Champs : `id`, `name`, `description`, `material`, `color`, `finish`, `price`, `stock`, `category_id`, `image_url`, `slug`, `is_active`
   - Relation : `category_id` → `categories.id`

4. **addresses** - Adresses utilisateurs
   - Champs : `id`, `user_id`, `street`, `city`, `postal_code`, `country`, `phone`, `is_default`
   - Relation : `user_id` → `users.id`

5. **carts** - Paniers
   - Champs : `id`, `user_id`
   - Relation : `user_id` → `users.id`
   - Contrainte : Un panier unique par utilisateur

6. **cart_items** - Articles du panier
   - Champs : `id`, `cart_id`, `product_id`, `quantity`, `customization` (JSON)
   - Relations : `cart_id` → `carts.id`, `product_id` → `products.id`

7. **orders** - Commandes
   - Champs : `id`, `user_id`, `status`, `total_price`, `shipping_address_id`, `billing_address_id`, `tracking_number`, `notes`
   - Statuts : `en préparation`, `payée`, `expédiée`, `livrée`, `annulée`
   - Relations : `user_id` → `users.id`, `shipping_address_id` → `addresses.id`, `billing_address_id` → `addresses.id`

8. **order_items** - Articles de commande
   - Champs : `id`, `order_id`, `product_id`, `quantity`, `unit_price`, `subtotal`, `customization` (JSON)
   - Relations : `order_id` → `orders.id`, `product_id` → `products.id`

9. **payments** - Paiements
   - Champs : `id`, `order_id`, `method`, `amount`, `status`, `transaction_id`
   - Méthodes : `carte_bancaire`, `virement`, `cheque`
   - Statuts : `en attente`, `réussi`, `échoué`, `annulé`
   - Relation : `order_id` → `orders.id` (UNIQUE)

10. **reviews** - Avis clients
    - Champs : `id`, `user_id`, `product_id`, `rating` (1-5), `comment`
    - Relations : `user_id` → `users.id`, `product_id` → `products.id`
    - Contrainte : Un avis unique par utilisateur/produit

11. **api_tokens** - Tokens d'authentification
    - Champs : `id`, `user_id`, `token` (64 caractères), `expires_at`
    - Relation : `user_id` → `users.id`
    - Durée de vie : 24 heures

---

## 🔐 Système d'Authentification

### Méthode
- **Type** : Token-based authentication (Bearer Token)
- **Format** : Token alphanumérique de 64 caractères
- **Durée de vie** : 24 heures
- **Stockage** : Table `api_tokens` dans la base de données

### Routes d'Authentification

#### POST `/api/auth/register`
- **Description** : Inscription d'un nouvel utilisateur
- **Rate limiting** : 5 tentatives par minute
- **Body** :
  ```json
  {
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }
  ```
- **Réponse** :
  ```json
  {
    "success": true,
    "message": "Inscription réussie.",
    "data": {
      "user": {
        "id": 1,
        "full_name": "John Doe",
        "email": "john@example.com",
        "role": "client"
      },
      "token": "abc123..."
    }
  }
  ```

#### POST `/api/auth/login`
- **Description** : Connexion d'un utilisateur
- **Rate limiting** : 5 tentatives par minute par email
- **Sécurité** :
  - Protection contre brute force (délai progressif)
  - Compteur de tentatives par email
  - Vérification du compte actif
  - Vérification du rôle (optionnel)
- **Body** :
  ```json
  {
    "email": "john@example.com",
    "password": "password123",
    "required_role": "manager"  // Optionnel
  }
  ```
- **Réponse** : Même format que `/register`

#### POST `/api/auth/logout`
- **Description** : Déconnexion (supprime le token)
- **Authentification** : Requise (Bearer Token)
- **Réponse** :
  ```json
  {
    "success": true,
    "message": "Déconnexion réussie."
  }
  ```

#### GET `/api/auth/me`
- **Description** : Récupère les informations de l'utilisateur connecté
- **Authentification** : Requise (Bearer Token)
- **Réponse** :
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": 1,
        "full_name": "John Doe",
        "email": "john@example.com",
        "role": "client"
      }
    }
  }
  ```

### Middleware d'Authentification

**Fichier** : `app/Http/Middleware/AuthenticateApi.php`

**Fonctionnalités** :
- Vérifie la présence du token Bearer
- Valide le token dans la base de données
- Vérifie l'expiration du token
- Vérifie que le compte utilisateur est actif
- Vérifie le rôle si spécifié (optionnel)
- Ajoute l'utilisateur à la requête

**Utilisation** :
```php
Route::get('/route', [Controller::class, 'method'])
    ->middleware('auth.api');  // Authentification requise

Route::get('/route', [Controller::class, 'method'])
    ->middleware('auth.api:manager');  // Authentification + rôle manager requis
```

---

## 🛣️ Routes API

### Préfixe
Toutes les routes API ont le préfixe `/api` (configuré dans `bootstrap/app.php`)

### Produits

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/products` | Liste tous les produits | Non |
| POST | `/api/products` | Créer un produit | Non |
| GET | `/api/products/{id}` | Détail d'un produit | Non |
| PUT | `/api/products/{id}` | Modifier un produit | Non |
| DELETE | `/api/products/{id}` | Supprimer un produit | Non |

**Validation (store/update)** :
- `name` : required, min:3, max:200
- `description` : nullable, string
- `material` : nullable, string, max:100
- `color` : nullable, string, max:100
- `finish` : nullable, string, max:100
- `price` : required, numeric, min:0
- `stock` : required, integer, min:0
- `category_id` : required, integer, min:1
- `image_url` : nullable, string, max:255
- `slug` : nullable, string, max:200
- `is_active` : nullable, boolean

### Catégories

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/categories` | Liste toutes les catégories | Non |
| POST | `/api/categories` | Créer une catégorie | Non |
| GET | `/api/categories/{id}` | Détail d'une catégorie | Non |
| PUT | `/api/categories/{id}` | Modifier une catégorie | Non |
| DELETE | `/api/categories/{id}` | Supprimer une catégorie | Non |

### Commandes

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/orders` | Liste toutes les commandes | Non |
| POST | `/api/orders` | Créer une commande | Non |
| GET | `/api/orders/{id}` | Détail d'une commande | Non |
| PUT | `/api/orders/{id}` | Modifier une commande | Non |
| DELETE | `/api/orders/{id}` | Supprimer une commande | Non |
| GET | `/api/orders/user/{userId}` | Commandes d'un utilisateur | Non |

### Articles de Commande

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/order-items/order/{orderId}` | Articles d'une commande | Non |
| POST | `/api/order-items` | Créer un article | Non |
| PUT | `/api/order-items/{id}` | Modifier un article | Non |
| DELETE | `/api/order-items/{id}` | Supprimer un article | Non |

### Paniers

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/carts/user/{userId}` | Panier d'un utilisateur | Non |
| POST | `/api/carts` | Créer un panier | Non |
| DELETE | `/api/carts/{id}` | Supprimer un panier | Non |

### Articles du Panier

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/cart-items/cart/{cartId}` | Articles d'un panier | Non |
| POST | `/api/cart-items` | Ajouter un article | Non |
| PUT | `/api/cart-items/{id}` | Modifier un article | Non |
| DELETE | `/api/cart-items/{id}` | Supprimer un article | Non |

### Adresses

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/addresses/user/{userId}` | Adresses d'un utilisateur | Non |
| POST | `/api/addresses` | Créer une adresse | Non |
| GET | `/api/addresses/{id}` | Détail d'une adresse | Non |
| PUT | `/api/addresses/{id}` | Modifier une adresse | Non |
| DELETE | `/api/addresses/{id}` | Supprimer une adresse | Non |

### Paiements

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/payments/order/{orderId}` | Paiement d'une commande | Non |
| POST | `/api/payments` | Créer un paiement | Non |
| PUT | `/api/payments/{id}` | Modifier un paiement | Non |
| DELETE | `/api/payments/{id}` | Supprimer un paiement | Non |

### Avis

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/reviews/product/{productId}` | Avis d'un produit | Non |
| POST | `/api/reviews` | Créer un avis | Non |
| PUT | `/api/reviews/{id}` | Modifier un avis | Non |
| DELETE | `/api/reviews/{id}` | Supprimer un avis | Non |

### Utilisateurs

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/users` | Liste tous les utilisateurs | Non |
| GET | `/api/users/{id}` | Détail d'un utilisateur | Non |
| PUT | `/api/users/{id}` | Modifier un utilisateur | Non |
| DELETE | `/api/users/{id}` | Supprimer un utilisateur | Non |

---

## 🏛️ Architecture Repository

### Pattern Repository

Le backend utilise le pattern Repository pour séparer la logique métier de l'accès aux données.

**Structure** :
- **Interfaces** : `app/Repositories/I*.php` (contrats)
- **Implémentations** : `app/Repositories/Pdo*.php` (PDO)

### Repositories Disponibles

1. `IUserRepository` / `PdoUserRepository`
2. `IProductRepository` / `PdoProductRepository`
3. `ICategoryRepository` / `PdoCategoryRepository`
4. `IOrderRepository` / `PdoOrderRepository`
5. `IOrderItemRepository` / `PdoOrderItemRepository`
6. `ICartRepository` / `PdoCartRepository`
7. `ICartItemRepository` / `PdoCartItemRepository`
8. `IAddressRepository` / `PdoAddressRepository`
9. `IPaymentRepository` / `PdoPaymentRepository`
10. `IReviewRepository` / `PdoReviewRepository`
11. `IApiTokenRepository` / `PdoApiTokenRepository`

### Injection de Dépendances

Les repositories sont injectés automatiquement dans les contrôleurs via l'injection de dépendances de Laravel :

```php
public function __construct(IProductRepository $repo)
{
    $this->repo = $repo;
}
```

---

## 🎮 Contrôleurs

### Liste des Contrôleurs (12)

1. **AuthController** - Authentification (login, register, logout, me)
2. **ProductController** - Gestion des produits (CRUD)
3. **CategoryController** - Gestion des catégories (CRUD)
4. **OrderController** - Gestion des commandes (CRUD + getByUser)
5. **OrderItemController** - Gestion des articles de commande
6. **CartController** - Gestion des paniers
7. **CartItemController** - Gestion des articles du panier
8. **AddressController** - Gestion des adresses
9. **PaymentController** - Gestion des paiements
10. **ReviewController** - Gestion des avis
11. **UserController** - Gestion des utilisateurs (CRUD)

### Structure d'un Contrôleur

```php
class ProductController extends Controller
{
    private IProductRepository $repo;

    public function __construct(IProductRepository $repo)
    {
        $this->repo = $repo;
    }

    // Méthodes CRUD standard :
    // - index() : Liste
    // - store() : Créer
    // - show($id) : Détail
    // - update($id) : Modifier
    // - destroy($id) : Supprimer
}
```

---

## ⚙️ Configuration

### Fichier `.env` Requis

```env
APP_NAME="E-Commerce Menuiserie"
APP_ENV=local
APP_KEY=base64:...  # Généré avec php artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=e-commerce_db
DB_USERNAME=root
DB_PASSWORD=  # Votre mot de passe MySQL si nécessaire
```

### CORS Configuration

**Fichier** : `config/cors.php`

**Origines autorisées** :
- `http://localhost:3002` (Frontend Client)
- `http://localhost:3003` (Frontend Manager)

**Configuration** :
- `allowed_methods` : `['*']` (toutes les méthodes)
- `allowed_headers` : `['*']` (tous les headers)
- `supports_credentials` : `true`

### Rate Limiting

- **Routes d'authentification** : 5 tentatives par minute
- **Routes API par défaut** : 60 requêtes par minute

---

## 🚀 Démarrage

### 1. Installation des Dépendances

```bash
cd Backend
composer install
```

### 2. Configuration

```bash
# Créer le fichier .env (si pas déjà fait)
cp .env.example .env

# Générer la clé d'application
php artisan key:generate
```

### 3. Base de Données

```bash
# Exécuter le script SQL
# Ouvrir phpMyAdmin et exécuter : database/E-commerce_db.sql
```

### 4. Démarrer le Serveur

```bash
php artisan serve
```

Le backend sera accessible sur `http://localhost:8000`

### 5. Tester l'API

Ouvrir dans le navigateur :
- `http://localhost:8000/api/products` - Liste des produits
- `http://localhost:8000/api/categories` - Liste des catégories

---

## 📦 Dépendances

### Production

- `php` : ^8.2
- `laravel/framework` : ^12.0
- `laravel/tinker` : ^2.10.1

### Développement

- `fakerphp/faker` : ^1.23
- `laravel/pail` : ^1.2.2
- `laravel/pint` : ^1.24
- `laravel/sail` : ^1.41
- `mockery/mockery` : ^1.6
- `nunomaduro/collision` : ^8.6
- `phpunit/phpunit` : ^11.5.3

---

## 🔒 Sécurité

### Mesures Implémentées

1. **Authentification par tokens**
   - Tokens sécurisés (64 caractères alphanumériques)
   - Expiration automatique (24h)
   - Stockage en base de données

2. **Protection contre brute force**
   - Rate limiting sur les routes d'authentification
   - Compteur de tentatives par email
   - Délai progressif entre les tentatives

3. **Validation des données**
   - Validation Laravel sur toutes les entrées
   - Vérification des types et contraintes

4. **Gestion des mots de passe**
   - Hashage avec bcrypt (via Laravel Hash)
   - Vérification sécurisée

5. **CORS configuré**
   - Origines autorisées limitées
   - Support des credentials

6. **Logging**
   - Logs des tentatives de connexion
   - Logs des erreurs

---

## 📝 Format des Réponses API

### Succès

```json
{
  "success": true,
  "message": "Message de succès",
  "data": { ... }
}
```

### Erreur

```json
{
  "success": false,
  "message": "Message d'erreur",
  "errors": { ... }  // Optionnel pour les erreurs de validation
}
```

### Codes HTTP

- `200` : Succès
- `201` : Créé
- `400` : Requête invalide
- `401` : Non authentifié
- `403` : Accès refusé
- `404` : Non trouvé
- `422` : Erreur de validation
- `429` : Trop de requêtes (rate limiting)
- `500` : Erreur serveur

---

## 🧪 Tests

### Tests Disponibles

- **Tests unitaires** : `tests/Unit/`
- **Tests fonctionnels** : `tests/Feature/`

### Exécuter les Tests

```bash
php artisan test
```

---

## 📚 Documentation Supplémentaire

- `DEMARRAGE_BACKEND.md` - Guide de démarrage
- `CONFIGURATION_DATABASE.md` - Configuration de la base de données
- `TEST_API.md` - Guide de test de l'API
- `TEST_ROUTE_REGISTER.md` - Test de la route d'inscription
- `TROUBLESHOOTING_404.md` - Dépannage des erreurs 404
- `SETUP_COMPLET.md` - Configuration complète
- `VERIFICATION_CONNEXION.md` - Vérification de la connexion

---

## 🔧 Commandes Utiles

```bash
# Vider le cache des routes
php artisan route:clear

# Vider le cache de configuration
php artisan config:clear

# Vider le cache général
php artisan cache:clear

# Lister toutes les routes
php artisan route:list

# Lister les routes API
php artisan route:list --path=api

# Ouvrir Tinker (console Laravel)
php artisan tinker

# Vérifier le statut des migrations
php artisan migrate:status
```

---

## 📞 Support

Pour toute question ou problème :
1. Consulter les fichiers de documentation dans `Backend/`
2. Vérifier les logs dans `storage/logs/laravel.log`
3. Tester les routes avec Postman ou curl
4. Vérifier la configuration dans `.env`

---

**Dernière mise à jour** : 2025-01-27


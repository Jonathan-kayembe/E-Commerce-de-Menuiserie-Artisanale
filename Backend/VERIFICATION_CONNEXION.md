# ✅ Vérification de la Connexion Backend-Frontend

## 🔍 Problèmes identifiés et corrigés

### 1. ✅ Routes d'authentification manquantes
**Problème** : Le frontend manager appelait `/auth/login`, `/auth/logout`, `/auth/me` mais ces routes n'existaient pas.

**Solution** :
- ✅ Créé `AuthController` avec les méthodes `login()`, `logout()`, `me()`
- ✅ Ajouté les routes dans `routes/api.php` :
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`

### 2. ✅ Routes utilisateurs manquantes
**Problème** : Le frontend manager appelait `/users` mais cette route n'existait pas.

**Solution** :
- ✅ Créé `UserController` avec les méthodes CRUD
- ✅ Créé `IUserRepository` et `PdoUserRepository`
- ✅ Ajouté les routes dans `routes/api.php` :
  - `GET /api/users`
  - `GET /api/users/{id}`
  - `PUT /api/users/{id}`
  - `DELETE /api/users/{id}`

### 3. ✅ CORS configuré uniquement pour le port 3000
**Problème** : Le frontend manager est sur le port 3003 mais le CORS n'autorisait que le port 3002.

**Solution** :
- ✅ Mis à jour `config/cors.php` pour inclure les deux ports :
  ```php
  'allowed_origins' => ['http://localhost:3002', 'http://localhost:3003']
  ```

### 4. ✅ Système d'authentification par tokens
**Problème** : Pas de système de gestion des tokens d'authentification.

**Solution** :
- ✅ Créé `IApiTokenRepository` et `PdoApiTokenRepository`
- ✅ Créé la table `api_tokens` dans le schéma SQL
- ✅ Implémenté la génération, stockage et validation des tokens
- ✅ Tokens expirent après 24h

## 📋 Routes API disponibles

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Utilisateur connecté

### Produits
- `GET /api/products` - Liste des produits
- `POST /api/products` - Créer un produit
- `GET /api/products/{id}` - Détail d'un produit
- `PUT /api/products/{id}` - Modifier un produit
- `DELETE /api/products/{id}` - Supprimer un produit

### Catégories
- `GET /api/categories` - Liste des catégories
- `POST /api/categories` - Créer une catégorie
- `GET /api/categories/{id}` - Détail d'une catégorie
- `PUT /api/categories/{id}` - Modifier une catégorie
- `DELETE /api/categories/{id}` - Supprimer une catégorie

### Commandes
- `GET /api/orders` - Liste des commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders/{id}` - Détail d'une commande
- `PUT /api/orders/{id}` - Modifier une commande
- `DELETE /api/orders/{id}` - Supprimer une commande
- `GET /api/orders/user/{userId}` - Commandes d'un utilisateur

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/{id}` - Détail d'un utilisateur
- `PUT /api/users/{id}` - Modifier un utilisateur
- `DELETE /api/users/{id}` - Supprimer un utilisateur

### Autres entités
- Panier, Articles de panier, Adresses, Paiements, Avis (routes complètes)

## 🔐 Format de réponse d'authentification

### Login (POST /api/auth/login)
```json
{
  "success": true,
  "message": "Connexion réussie.",
  "data": {
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "email": "john@example.com",
      "role": "manager"
    },
    "token": "abc123..."
  }
}
```

### Me (GET /api/auth/me)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "email": "john@example.com",
      "role": "manager"
    }
  }
}
```

## 📝 Notes importantes

1. **Table api_tokens** : La table doit être créée dans la base de données. Exécuter la migration ou le script SQL.

2. **Structure users** : Le repository gère automatiquement les deux structures possibles :
   - `full_name` (schéma menuiserie_db)
   - `name` (migration Laravel par défaut)

3. **Tokens** : Les tokens expirent après 24h. Pour changer, modifier `AuthController::login()`.

4. **CORS** : Les deux frontends (client:3002, manager:3003) sont autorisés.

## 🚀 Prochaines étapes

1. ✅ Créer la table `api_tokens` dans la base de données
2. ✅ Tester la connexion avec le frontend manager
3. ⚠️ Ajouter les routes dashboard si nécessaire (statistiques)
4. ⚠️ Implémenter les middlewares d'authentification pour protéger les routes

## 🧪 Test de connexion

Pour tester la connexion :

```bash
# 1. Démarrer le backend Laravel
cd Backend
php artisan serve

# 2. Tester l'endpoint de login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@example.com","password":"password"}'

# 3. Utiliser le token retourné pour tester /auth/me
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer VOTRE_TOKEN"
```


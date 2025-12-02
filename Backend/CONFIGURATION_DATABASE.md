# 🔧 Configuration de la Base de Données

## ✅ Configuration requise pour `e-commerce_db`

### 1. Fichier `.env` du Backend

Créez ou modifiez le fichier `Backend/.env` avec ces paramètres :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=e-commerce_db
DB_USERNAME=root
DB_PASSWORD=
```

**⚠️ Important** : 
- Remplacez `DB_PASSWORD` par votre mot de passe MySQL si vous en avez un
- Le nom de la base doit être exactement `e-commerce_db` (avec le tiret)

### 2. Vérifier la connexion

Après avoir configuré le `.env`, testez la connexion :

```bash
cd Backend
php artisan migrate:status
```

Ou testez directement dans Laravel Tinker :

```bash
php artisan tinker
```

Puis :
```php
DB::connection()->getPdo();
// Si ça fonctionne, vous verrez : PDO Object
```

### 3. Vérifier que les données sont accessibles

```bash
php artisan tinker
```

Puis :
```php
use App\Repositories\PdoProductRepository;
$repo = app(PdoProductRepository::class);
$products = $repo->getAll();
dd($products);
```

## 🌐 Configuration des Frontends

### Frontend Client

Le frontend client est déjà configuré pour se connecter à :
- **URL API** : `http://localhost:8000/api`
- **Configuration** : `frontend-client/.env` ou `vite.config.js`

Vérifiez que le fichier `frontend-client/.env` existe et contient :

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Frontend Manager

Le frontend manager est déjà configuré pour se connecter à :
- **URL API** : `http://localhost:8000/api`
- **Configuration** : `frontend-manager/.env` ou `vite.config.js`

Vérifiez que le fichier `frontend-manager/.env` existe et contient :

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 🔍 Vérification des Routes API

Les routes suivantes doivent être accessibles :

### Produits
- `GET /api/products` - Liste tous les produits
- `GET /api/products/{id}` - Détail d'un produit

### Catégories
- `GET /api/categories` - Liste toutes les catégories

### Test dans le navigateur

Ouvrez dans votre navigateur :
- `http://localhost:8000/api/products` - Devrait retourner les produits en JSON
- `http://localhost:8000/api/categories` - Devrait retourner les catégories en JSON

## 🚀 Démarrage

1. **Backend Laravel** :
   ```bash
   cd Backend
   php artisan serve
   ```
   Le backend sera accessible sur `http://localhost:8000`

2. **Frontend Client** :
   ```bash
   cd frontend-client
   npm install  # Si pas encore fait
   npm run dev
   ```
   Le frontend client sera accessible sur `http://localhost:3002`

3. **Frontend Manager** :
   ```bash
   cd frontend-manager
   npm install  # Si pas encore fait
   npm run dev
   ```
   Le frontend manager sera accessible sur `http://localhost:3003`

## ✅ Checklist

- [ ] Base de données `e-commerce_db` créée
- [ ] Tables créées (11 tables)
- [ ] Données d'exemple insérées (2 produits, 3 catégories)
- [ ] Fichier `Backend/.env` configuré avec `DB_DATABASE=e-commerce_db`
- [ ] Backend Laravel démarré sur `http://localhost:8000`
- [ ] Frontend client configuré avec `VITE_API_BASE_URL=http://localhost:8000/api`
- [ ] Frontend manager configuré avec `VITE_API_BASE_URL=http://localhost:8000/api`
- [ ] Test de l'API : `http://localhost:8000/api/products` retourne des données


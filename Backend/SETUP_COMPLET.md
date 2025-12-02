# 🚀 Guide de Configuration Complète

## 📋 Checklist de Configuration

### 1. ✅ Base de données créée

Exécutez le script SQL :
- Ouvrez phpMyAdmin
- Exécutez `Backend/database/E-commerce_db.sql`
- Vérifiez que la base `e-commerce_db` existe avec 11 tables

### 2. ✅ Configuration Backend `.env`

Créez ou modifiez `Backend/.env` :

```env
APP_NAME="E-Commerce Menuiserie"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=e-commerce_db
DB_USERNAME=root
DB_PASSWORD=
```

**⚠️ Important** :
- Si vous avez un mot de passe MySQL, mettez-le dans `DB_PASSWORD`
- Le nom de la base doit être exactement `e-commerce_db`

### 3. ✅ Générer la clé d'application Laravel

```bash
cd Backend
php artisan key:generate
```

### 4. ✅ Démarrer le Backend

```bash
cd Backend
php artisan serve
```

Le backend sera accessible sur `http://localhost:8000`

### 5. ✅ Tester l'API

Ouvrez dans votre navigateur :
- `http://localhost:8000/api/products` - Devrait retourner un JSON avec les produits
- `http://localhost:8000/api/categories` - Devrait retourner un JSON avec les catégories

### 6. ✅ Configuration Frontend Client

Créez `frontend-client/.env` :

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Puis démarrez :
```bash
cd frontend-client
npm install
npm run dev
```

### 7. ✅ Configuration Frontend Manager

Créez `frontend-manager/.env` :

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Puis démarrez :
```bash
cd frontend-manager
npm install
npm run dev
```

## 🔍 Vérification

### Test de l'API Backend

1. Ouvrez `http://localhost:8000/api/products` dans votre navigateur
2. Vous devriez voir un JSON avec 2 produits :
   - "Table en chêne massif"
   - "Chaise design"

### Test Frontend Client

1. Ouvrez `http://localhost:3002`
2. La page d'accueil devrait afficher les produits
3. Cliquez sur "Produits" pour voir la liste complète

### Test Frontend Manager

1. Ouvrez `http://localhost:3003`
2. Connectez-vous avec :
   - Email : `manager@menuiserie.com`
   - Mot de passe : `manager123`
3. Le dashboard devrait afficher les statistiques

## 🐛 Dépannage

### Problème : "Cannot connect to database"

**Solution** :
1. Vérifiez que MySQL/MariaDB est démarré
2. Vérifiez les paramètres dans `Backend/.env`
3. Testez la connexion : `php artisan tinker` puis `DB::connection()->getPdo();`

### Problème : "404 Not Found" sur les routes API

**Solution** :
1. Vérifiez que le backend est démarré : `php artisan serve`
2. Vérifiez que les routes sont bien définies dans `Backend/routes/api.php`
3. Testez directement : `http://localhost:8000/api/products`

### Problème : Frontend n'affiche pas les produits

**Solution** :
1. Ouvrez la console du navigateur (F12)
2. Vérifiez les erreurs dans l'onglet "Console" ou "Network"
3. Vérifiez que `VITE_API_BASE_URL` est bien configuré dans `.env`
4. Redémarrez le serveur de développement : `npm run dev`

### Problème : CORS Error

**Solution** :
1. Vérifiez `Backend/config/cors.php`
2. Assurez-vous que les origines sont autorisées :
   - `http://localhost:3002` (client)
   - `http://localhost:3003` (manager)


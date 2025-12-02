# 🔧 Dépannage - Erreur 404 sur /auth/register

## ✅ Vérifications à effectuer

### 1. Backend démarré ?
```bash
cd Backend
php artisan serve
```
Le backend doit être accessible sur `http://localhost:8000`

### 2. Routes enregistrées ?
```bash
cd Backend
php artisan route:clear  # Vider le cache des routes
php artisan route:list --path=api/auth  # Lister les routes d'authentification
```

Vous devriez voir :
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### 3. Test de la route directement
Ouvrez dans votre navigateur ou avec curl :
```bash
# Test avec curl (Windows PowerShell)
curl -X POST http://localhost:8000/api/auth/register -H "Content-Type: application/json" -d "{\"full_name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"password123\",\"password_confirmation\":\"password123\"}"
```

### 4. Vérifier le fichier .env
Assurez-vous que `Backend/.env` contient :
```env
APP_URL=http://localhost:8000
```

### 5. Vérifier le frontend .env
Assurez-vous que `frontend-client/.env` contient :
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 6. Redémarrer le serveur Laravel
```bash
cd Backend
# Arrêter le serveur (Ctrl+C)
php artisan serve
```

### 7. Vider tous les caches Laravel
```bash
cd Backend
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

## 🐛 Problèmes courants

### Problème : Route non trouvée
**Solution** : Vérifier que `Backend/routes/api.php` contient bien :
```php
Route::post('/auth/register', [AuthController::class, 'register'])
    ->middleware('throttle:5,1')
    ->name('api.auth.register');
```

### Problème : Backend non démarré
**Solution** : Démarrer le serveur Laravel
```bash
cd Backend
php artisan serve
```

### Problème : Cache de routes
**Solution** : Vider le cache
```bash
cd Backend
php artisan route:clear
```

### Problème : URL incorrecte
**Vérifier** : L'URL complète devrait être `http://localhost:8000/api/auth/register`
- Backend : `http://localhost:8000`
- Préfixe API : `/api` (configuré dans `bootstrap/app.php`)
- Route : `/auth/register`

## ✅ Test rapide

1. Ouvrir `http://localhost:8000/api/products` dans le navigateur
   - Si ça fonctionne → Le backend est OK, problème de route
   - Si 404 → Le backend n'est pas démarré ou problème de configuration

2. Tester la route register avec Postman ou curl
   - Si 404 → Route non enregistrée, vider le cache
   - Si autre erreur → Route existe, problème de validation ou autre


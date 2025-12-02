# 🧪 Test de la Route /auth/register

## Test rapide avec curl (Windows PowerShell)

```powershell
# Test de la route register
curl -X POST http://localhost:8000/api/auth/register `
  -H "Content-Type: application/json" `
  -H "Accept: application/json" `
  -d '{\"full_name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\",\"password_confirmation\":\"password123\"}'
```

## Test avec Postman ou navigateur

**URL** : `http://localhost:8000/api/auth/register`
**Method** : `POST`
**Headers** :
- `Content-Type: application/json`
- `Accept: application/json`

**Body** (raw JSON) :
```json
{
  "full_name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

## Réponse attendue (succès)

```json
{
  "success": true,
  "message": "Inscription réussie.",
  "data": {
    "user": {
      "id": 1,
      "full_name": "Test User",
      "email": "test@example.com",
      "role": "client"
    },
    "token": "abc123..."
  }
}
```

## Si vous obtenez 404

1. **Vérifier que le backend est démarré** :
   ```bash
   cd Backend
   php artisan serve
   ```

2. **Vider le cache des routes** :
   ```bash
   cd Backend
   php artisan route:clear
   ```

3. **Vérifier que la route existe** :
   ```bash
   cd Backend
   php artisan route:list | findstr register
   ```

4. **Vérifier l'URL complète** :
   - Backend : `http://localhost:8000`
   - Préfixe API : `/api` (dans bootstrap/app.php)
   - Route : `/auth/register`
   - **URL complète** : `http://localhost:8000/api/auth/register`


# 🧪 Test de l'API Backend

## Tests rapides dans le navigateur

Une fois le backend démarré (`php artisan serve`), testez ces URLs :

### 1. Produits
- `http://localhost:8000/api/products`
- **Résultat attendu** : JSON avec un array de produits (2 produits d'exemple)

### 2. Catégories
- `http://localhost:8000/api/categories`
- **Résultat attendu** : JSON avec un array de catégories (3 catégories d'exemple)

### 3. Produit par ID
- `http://localhost:8000/api/products/1`
- **Résultat attendu** : JSON avec les détails du produit ID 1

## Format de réponse attendu

### GET /api/products
```json
[
  {
    "id": 1,
    "name": "Table en chêne massif",
    "description": "Table artisanale 6 places",
    "material": "chêne",
    "color": "naturel",
    "finish": null,
    "price": "599.99",
    "stock": 10,
    "category_id": 1,
    "image_url": "/images/table-chene.jpg",
    "slug": "table-chene-massif",
    "is_active": true,
    "created_at": "2025-11-18 12:00:00",
    "updated_at": "2025-11-18 12:00:00"
  },
  {
    "id": 2,
    "name": "Chaise design",
    ...
  }
]
```

### GET /api/categories
```json
[
  {
    "id": 1,
    "name": "Tables",
    "description": "Tables en bois massif",
    "slug": "tables",
    "created_at": "2025-11-18 12:00:00",
    "updated_at": "2025-11-18 12:00:00"
  },
  ...
]
```

## 🔍 Vérification dans la console du navigateur

Ouvrez la console (F12) et testez :

```javascript
// Test depuis la console du navigateur
fetch('http://localhost:8000/api/products')
  .then(res => res.json())
  .then(data => console.log('Produits:', data))
  .catch(err => console.error('Erreur:', err));
```

## ✅ Si les tests fonctionnent

Les frontends devraient maintenant afficher les données correctement !


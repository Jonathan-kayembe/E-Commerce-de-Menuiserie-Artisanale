# 📸 Dossier Images Produits

## 📁 Où placer vos images

Placez vos images de produits dans ce dossier : `Backend/public/images/products/`

## 📋 Noms de fichiers recommandés

Pour que les images s'affichent automatiquement, utilisez ces noms :

1. **Table en chêne massif** → `table-chene-live-edge.jpg` (ou .png)
2. **Chaise design** → `chaise-design-jaune.jpg` (ou .png)

## ✅ Étapes

1. **Placez vos images** dans ce dossier avec les noms ci-dessus
2. **Exécutez le script SQL** pour mettre à jour la base de données :
   - Ouvrez phpMyAdmin
   - Sélectionnez la base `e-commerce_db`
   - Exécutez le script : `Backend/database/UPDATE_IMAGES_LOCALES.sql`

## 🔗 URLs des images

Une fois les images placées et la base de données mise à jour, les images seront accessibles via :
- `http://localhost:8000/images/products/table-chene-live-edge.jpg`
- `http://localhost:8000/images/products/chaise-design-jaune.jpg`

## 📝 Formats acceptés

- JPG / JPEG (recommandé)
- PNG
- WebP

## 💡 Astuce

Si vous avez déjà les images avec d'autres noms, vous pouvez :
- Soit les renommer selon les noms recommandés
- Soit mettre à jour le script SQL avec vos noms de fichiers


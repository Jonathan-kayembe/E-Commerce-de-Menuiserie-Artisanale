# Instructions pour ajouter l'image de la "Table en chêne massif"

## Méthode 1 : Image locale (Recommandée)

1. **Sauvegarder l'image** :
   - Téléchargez l'image de la table en chêne avec live edge
   - Renommez-la : `table-chene-live-edge.jpg`
   - Placez-la dans ce dossier : `Backend/public/images/`

2. **Mettre à jour la base de données** :
   - Ouvrez phpMyAdmin
   - Sélectionnez la base `e-commerce_db`
   - Exécutez le script : `Backend/database/UPDATE_TABLE_CHENE_IMAGE.sql`
   - OU exécutez directement cette requête :
   ```sql
   UPDATE products 
   SET image_url = '/images/table-chene-live-edge.jpg'
   WHERE name = 'Table en chêne massif';
   ```

## Méthode 2 : URL externe

Si vous préférez héberger l'image ailleurs (Imgur, Cloudinary, etc.) :

1. Uploadez l'image sur votre service d'hébergement
2. Copiez l'URL de l'image
3. Exécutez cette requête SQL :
   ```sql
   UPDATE products 
   SET image_url = 'https://votre-url.com/image.jpg'
   WHERE name = 'Table en chêne massif';
   ```

## Vérification

Après la mise à jour, vérifiez que l'image s'affiche correctement :
- Frontend client : `http://localhost:3002/products`
- API : `http://localhost:8000/api/products/1`

## Formats d'image acceptés
- JPG / JPEG (recommandé)
- PNG
- WebP

## Taille recommandée
- Largeur : 800px minimum
- Ratio : 4:3 ou 16:9
- Poids : < 500KB pour de meilleures performances


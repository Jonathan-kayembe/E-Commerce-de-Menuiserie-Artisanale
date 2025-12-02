# Dossier Images

Ce dossier contient les images des produits.

## Instructions pour ajouter l'image de la "Table en chêne massif"

1. Placez l'image dans ce dossier avec le nom : `table-chene-live-edge.jpg`
2. Formats acceptés : JPG, PNG, WebP
3. Taille recommandée : 800x600px ou plus
4. Après avoir ajouté l'image, exécutez le script SQL : `Backend/database/UPDATE_TABLE_CHENE_IMAGE.sql`

## Alternative : Utiliser une URL externe

Si vous préférez utiliser une URL externe (ex: Imgur, Cloudinary), mettez à jour directement dans la base de données :

```sql
UPDATE products 
SET image_url = 'https://votre-url-externe.com/image.jpg'
WHERE name = 'Table en chêne massif';
```

